import { clearSessionCookie } from "../../../lib/auth.js";
import { json } from "../../../lib/settings.js";

export async function onRequestPost() {
  return json({ ok: true }, 200, { "set-cookie": clearSessionCookie, "cache-control": "no-store" });
}
