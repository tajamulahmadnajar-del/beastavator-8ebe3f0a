import { PIXEL_ID } from "./pixel-config";

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface CapiSubscribeInput {
  eventId: string;
  eventTime: number;
  fbp?: string | null;
  fbc?: string | null;
  externalId?: string | null;
  clientIp?: string | null;
  clientUserAgent?: string | null;
  eventSourceUrl?: string | null;
}

/** Sends a server-side Subscribe conversion to Meta. Returns status + raw body. */
export async function sendSubscribeConversion(
  input: CapiSubscribeInput,
): Promise<{ ok: boolean; status: number; body: string }> {
  const accessToken = process.env["META_CAPI_ACCESS_TOKEN"];
  if (!accessToken) throw new Error("META_CAPI_ACCESS_TOKEN is not configured");

  const userData: Record<string, unknown> = {};
  if (input.fbp) userData["fbp"] = input.fbp;
  if (input.fbc) userData["fbc"] = input.fbc;
  if (input.clientIp) userData["client_ip_address"] = input.clientIp;
  if (input.clientUserAgent) userData["client_user_agent"] = input.clientUserAgent;
  if (input.externalId) userData["external_id"] = await sha256Hex(input.externalId);

  const payload = {
    data: [
      {
        event_name: "Subscribe",
        event_time: input.eventTime,
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl ?? undefined,
        user_data: userData,
        custom_data: {
          content_name: "Telegram Channel Join",
          content_category: "telegram",
          currency: "INR",
          value: 1,
          predicted_ltv: 1,
        },
      },
    ],
  };

  const testCode = process.env["META_CAPI_TEST_EVENT_CODE"];
  const body = testCode ? { ...payload, test_event_code: testCode } : payload;

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const text = await res.text();
  if (!res.ok) console.error(`Meta CAPI failed [${res.status}]: ${text}`);
  return { ok: res.ok, status: res.status, body: text };
}
