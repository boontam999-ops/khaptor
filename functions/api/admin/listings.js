import { checkAuth, json } from "../../../lib/settings.js";
import { listAll, getListing, saveListing, indexRemove, rebuildPublic, validateListing } from "../../../lib/listings.js";
import { deletePhotos } from "../../../lib/photos.js";

// POST /api/admin/listings  {action:"list"} | {action:"approve"|"reject"|"delete", id}  ต้องมี X-Admin-Password
export async function onRequestPost({ request, env }) {
  const denied = await checkAuth(request, env);
  if (denied) return denied;
  if (!env.SETTINGS) return json({ ok: false, error: "ยังไม่ได้ผูก KV" }, 503);
  let b;
  try { b = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, 400); }
  if (b.action === "list") return json({ ok: true, listings: await listAll(env, 300) }, 200, { "cache-control": "no-store" });
  const l = await getListing(env, String(b.id || ""));
  if (!l) return json({ ok: false, error: "ไม่พบประกาศ" }, 404);
  if (b.action === "approve" || b.action === "reject") {
    l.status = b.action === "approve" ? "approved" : "rejected";
    l.reviewed_at = new Date().toISOString();
    await saveListing(env, l);
  } else if (b.action === "delete") {
    await env.SETTINGS.delete("listing:" + l.id);
    await indexRemove(env, l);
    await deletePhotos(env, l.photos);
  } else if (b.action === "update") {
    const v = validateListing({ ...l, ...(b.fields || {}), consent: true });
    if (typeof v === "string") return json({ ok: false, error: v }, 400);
    Object.assign(l, v, { edited_at: new Date().toISOString() });
    await saveListing(env, l);
  } else if (b.action === "sold" || b.action === "unsold") {
    l.sold = b.action === "sold";
    l.sold_at = l.sold ? new Date().toISOString() : null;
    await saveListing(env, l);
  } else if (b.action === "remove_photo") {
    const pid = String(b.photo || "");
    l.photos = (l.photos || []).filter(x => x !== pid);
    await deletePhotos(env, [pid]);
    await saveListing(env, l);
  } else return json({ ok: false, error: "action ไม่รู้จัก" }, 400);
  await rebuildPublic(env);
  return json({ ok: true });
}
