import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { TELEGRAM_LINK } from "./pixel-config";

export interface JoinLinkInput {
  fbp?: string | null;
  fbc?: string | null;
  externalId?: string | null;
  eventSourceUrl?: string | null;
}

export const createJoinLink = createServerFn({ method: "POST" })
  .inputValidator((data: JoinLinkInput): JoinLinkInput => {
    const clean = (v: unknown) =>
      typeof v === "string" && v.length > 0 && v.length <= 512 ? v : null;
    return {
      fbp: clean(data?.fbp),
      fbc: clean(data?.fbc),
      externalId: clean(data?.externalId),
      eventSourceUrl: clean(data?.eventSourceUrl),
    };
  })
  .handler(async ({ data }) => {
    const fallback = { url: TELEGRAM_LINK, tracked: false };
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { telegramCall } = await import("./telegram.server");

      const { data: settings } = await supabaseAdmin
        .from("tg_settings")
        .select("channel_id")
        .eq("id", "default")
        .maybeSingle();

      const channelId = (settings as { channel_id: number | null } | null)?.channel_id;
      if (!channelId) return fallback;

      const invite = await telegramCall<{ invite_link: string }>("createChatInviteLink", {
        chat_id: channelId,
        name: `web-${Date.now()}`.slice(0, 32),
        expire_date: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        member_limit: 1,
        creates_join_request: false,
      });

      const eventId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      const { error } = await supabaseAdmin.from("join_clicks").insert({
        invite_link: invite.invite_link,
        event_id: eventId,
        fbp: data.fbp ?? null,
        fbc: data.fbc ?? null,
        external_id: data.externalId ?? null,
        client_user_agent: getRequestHeader("user-agent") ?? null,
        client_ip: getRequestIP({ xForwardedFor: true }) ?? null,
        event_source_url: data.eventSourceUrl ?? null,
      });
      if (error) {
        console.error("join_clicks insert failed:", error.message);
        return fallback;
      }

      return { url: invite.invite_link, tracked: true };
    } catch (err) {
      console.error("createJoinLink failed:", err);
      return fallback;
    }
  });
