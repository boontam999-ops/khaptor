import { checkAuth, json } from "../../../lib/settings.js";
import { aiStatus } from "../../../lib/ai.js";
// POST /api/admin/ai → สถานะ AI วันนี้
export async function onRequestPost({ request, env }) {
  const denied = await checkAuth(request, env);
  if (denied) return denied;
  return json({ ok: true, data: await aiStatus(env) }, 200, { "cache-control": "no-store" });
}
