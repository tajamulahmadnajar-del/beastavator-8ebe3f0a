import { createFileRoute } from "@tanstack/react-router";

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const JOINED = new Set(["member", "administrator", "creator", "restricted"]);

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const telegramApiKey = process.env["TELEGRAM_API_KEY"];
        if (!telegramApiKey) return new Response("Not configured", { status: 500 });

        const { deriveWebhookSecret } = await import("@/lib/telegram.server");
        const expected = await deriveWebhookSecret(telegramApiKey);
        const actual = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!safeEqual(actual, expected)) return new Response("Unauthorized", { status: 401 });

        const update = (await request.json()) as Record<string, any>;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Bot added/updated as channel admin -> remember the channel automatically.
        const myMember = update["my_chat_member"];
        if (myMember?.chat?.id && myMember?.new_chat_member?.status === "administrator") {
          await supabaseAdmin.from("tg_settings").upsert(
            {
              id: "default",
              channel_id: myMember.chat.id,
              channel_title: myMember.chat.title ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" },
          );
          return Response.json({ ok: true, saved: "channel" });
        }

        const member = update["chat_member"];
        const inviteLink: string | undefined = member?.invite_link?.invite_link;
        const oldStatus: string | undefined = member?.old_chat_member?.status;
        const newStatus: string | undefined = member?.new_chat_member?.status;

        const isRealJoin =
          !!inviteLink && !!newStatus && JOINED.has(newStatus) && !JOINED.has(oldStatus ?? "");
        if (!isRealJoin) return Response.json({ ok: true, ignored: true });

        const { data: click } = await supabaseAdmin
          .from("join_clicks")
          .select("*")
          .eq("invite_link", inviteLink)
          .maybeSingle();

        const row = click as Record<string, any> | null;
        if (!row) return Response.json({ ok: true, ignored: "unknown-link" });
        if (row["joined_at"]) return Response.json({ ok: true, ignored: "duplicate" });

        const { sendSubscribeConversion } = await import("@/lib/meta-capi.server");
        let status = "sent";
        let responseBody = "";
        try {
          const result = await sendSubscribeConversion({
            eventId: row["event_id"],
            eventTime: Math.floor(Date.now() / 1000),
            fbp: row["fbp"],
            fbc: row["fbc"],
            externalId: String(member.new_chat_member?.user?.id ?? row["external_id"] ?? ""),
            clientIp: row["client_ip"],
            clientUserAgent: row["client_user_agent"],
            eventSourceUrl: row["event_source_url"],
          });
          status = result.ok ? "sent" : `failed_${result.status}`;
          responseBody = result.body.slice(0, 1000);
        } catch (err) {
          status = "error";
          responseBody = String(err).slice(0, 1000);
          console.error("CAPI send failed:", err);
        }

        await supabaseAdmin
          .from("join_clicks")
          .update({
            joined_at: new Date().toISOString(),
            telegram_user_id: member.new_chat_member?.user?.id ?? null,
            capi_status: status,
            capi_response: responseBody,
          })
          .eq("id", row["id"]);

        return Response.json({ ok: true, capi: status });
      },
    },
  },
});
