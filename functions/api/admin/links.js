import { checkAuth, json } from "../../../lib/settings.js";
import { getLinks, validateLinks, clearLinksCache, KEY } from "../../../lib/links.js";

// POST /api/admin/links  {action:"get"} | {action:"save", data:{title, scope, links:[{name,url,nofollow,note}]}}
export async function onRequestPost({ request, env }) {
  const denied = await checkAuth(request, env);
  if (denied) return denied;
  let b;
  try { b = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, 400); }
  if (b.action === "get") return json({ ok: true, data: await getLinks(env, { fresh: true }) }, 200, { "cache-control": "no-store" });
  if (b.action === "save") {
    if (!env.SETTINGS) return json({ ok: false, error: "ยังไม่ได้ผูก KV" }, 503);
    const v = validateLinks(b.data);
    if (typeof v === "string") return json({ ok: false, error: v }, 400);
    await env.SETTINGS.put(KEY, JSON.stringify(v));
    clearLinksCache();
    return json({ ok: true, data: v }, 200, { "cache-control": "no-store" });
  }
  return json({ ok: false, error: "action ไม่รู้จัก" }, 400);
}
