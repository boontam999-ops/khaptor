import { checkAuth, json } from "../../../lib/settings.js";
import { listUsers, getUser, saveUser } from "../../../lib/users.js";
import { listAll, saveListing, rebuildPublic } from "../../../lib/listings.js";

// POST /api/admin/users  {action:"list"} | {action:"ban"|"unban", sub, reason?, hide_listings?}
export async function onRequestPost({ request, env }) {
  const denied = await checkAuth(request, env);
  if (denied) return denied;
  if (!env.SETTINGS) return json({ ok: false, error: "ยังไม่ได้ผูก KV" }, 503);
  let b;
  try { b = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, 400); }
  if (b.action === "list") {
    const [users, all] = await Promise.all([listUsers(env, 2000), listAll(env, 2000)]);
    const count = {};
    all.forEach(l => { const s = l.owner && l.owner.sub; if (s) count[s] = (count[s] || 0) + 1; });
    return json({ ok: true, users: users.map(u => ({ ...u, listings: count[u.sub] || 0 })) }, 200, { "cache-control": "no-store" });
  }
  const u = await getUser(env, String(b.sub || ""));
  if (!u) return json({ ok: false, error: "ไม่พบผู้ใช้" }, 404);
  if (b.action === "ban" || b.action === "unban") {
    u.banned = b.action === "ban";
    u.ban_reason = u.banned ? String(b.reason || "").slice(0, 200) : "";
    u.banned_at = u.banned ? new Date().toISOString() : null;
    await saveUser(env, u);
    let hidden = 0;
    if (u.banned && b.hide_listings) {
      for (const l of await listAll(env, 2000)) {
        if (l.owner && l.owner.sub === u.sub && l.status === "approved") { l.status = "rejected"; l.reviewed_at = new Date().toISOString(); await saveListing(env, l); hidden++; }
      }
      if (hidden) await rebuildPublic(env);
    }
    return json({ ok: true, hidden });
  }
  return json({ ok: false, error: "action ไม่รู้จัก" }, 400);
}
