import { readSession, sameOrigin } from "../../../lib/auth.js";
import { getListing, saveListing, indexRemove, rebuildPublic } from "../../../lib/listings.js";
import { json } from "../../../lib/settings.js";
import { checkOwnedPhotos, deletePhotos } from "../../../lib/photos.js";

// PATCH /api/listings/:id  {sold?:bool, photos?:[id]}  เจ้าของประกาศแจ้งขายแล้ว หรือแก้รูป
export async function onRequestPatch({ request, env, params }) {
  if (!sameOrigin(request)) return json({ ok: false, error: "คำขอไม่ได้มาจากเว็บนี้" }, 403);
  const user = await readSession(request, env);
  if (!user) return json({ ok: false, error: "กรุณาล็อกอินก่อน" }, 401);
  const l = await getListing(env, String(params.id));
  if (!l || l.owner.sub !== user.sub) return json({ ok: false, error: "ไม่พบประกาศนี้" }, 404);
  let b;
  try { b = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, 400); }
  if (Array.isArray(b.photos)) {
    const photos = await checkOwnedPhotos(env, b.photos, user.sub);
    if (typeof photos === "string") return json({ ok: false, error: photos }, 400);
    await deletePhotos(env, (l.photos || []).filter(id => !photos.includes(id)));
    l.photos = photos;
  }
  if (typeof b.sold === "boolean") {
    l.sold = b.sold;
    l.sold_at = l.sold ? new Date().toISOString() : null;
  }
  await saveListing(env, l);
  if (l.status === "approved") await rebuildPublic(env);
  return json({ ok: true, sold: !!l.sold, photos: l.photos || [] });
}

// DELETE /api/listings/:id  เจ้าของประกาศลบประกาศของตัวเอง
export async function onRequestDelete({ request, env, params }) {
  if (!sameOrigin(request)) return json({ ok: false, error: "คำขอไม่ได้มาจากเว็บนี้" }, 403);
  const user = await readSession(request, env);
  if (!user) return json({ ok: false, error: "กรุณาล็อกอินก่อน" }, 401);
  const l = await getListing(env, String(params.id));
  if (!l || l.owner.sub !== user.sub) return json({ ok: false, error: "ไม่พบประกาศนี้" }, 404);
  await env.SETTINGS.delete("listing:" + l.id);
  await indexRemove(env, l);
  await deletePhotos(env, l.photos);
  if (l.status === "approved") await rebuildPublic(env);
  return json({ ok: true });
}
