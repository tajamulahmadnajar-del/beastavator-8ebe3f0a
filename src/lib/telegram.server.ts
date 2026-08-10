const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

function keys() {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const telegramKey = process.env["TELEGRAM_API_KEY"];
  if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
  if (!telegramKey) throw new Error("TELEGRAM_API_KEY is not configured");
  return { lovableKey, telegramKey };
}

export async function telegramCall<T = unknown>(
  method: string,
  body: Record<string, unknown> = {},
): Promise<T> {
  const { lovableKey, telegramKey } = keys();
  const res = await fetch(`${GATEWAY_URL}/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": telegramKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`Telegram gateway ${method} failed [${res.status}]: ${text}`);
    throw new Error(`Telegram request failed [${res.status}]: ${text}`);
  }

  const json = JSON.parse(text) as { ok: boolean; result?: T; description?: string };
  if (!json.ok) {
    console.error(`Telegram API ${method} returned not-ok: ${text}`);
    throw new Error(`Telegram API error: ${json.description ?? text}`);
  }
  return json.result as T;
}

/** Derives the webhook secret token from the connection key (same value on both sides). */
export async function deriveWebhookSecret(telegramApiKey: string): Promise<string> {
  const data = new TextEncoder().encode(`telegram-webhook:${telegramApiKey}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
