import { readSession, sameOrigin } from "../../lib/auth.js";
import { json } from "../../lib/settings.js";
import { newPhotoId, isJpeg, MAX_FULL, MAX_THUMB, MAX_PER_DAY } from "../../lib/photos.js";

// POST /api/photos  multipart: full (JPEG), thumb (JPEG)  ต้องล็อกอิน  คืน {id}
// รูปถูกย่อและลบข้อมูล EXIF/GPS ในเบราว์เซอร์ก่อนส่งแล้ว
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ ok: false, error: "คำขอไม่ได้มาจากเว็บนี้" }, 403);
  const user = await readSession(request, env);
  if (!user) return json({ ok: false, error: "กรุณาล็อกอินก่อนอัปโหลดรูป" }, 401);
  const len = +(request.headers.get("content-length") || 0);
  if (len > MAX_FULL + MAX_THUMB + 4096) return json({ ok: false, error: "รูปใหญ่เกินไป" }, 413);

  const day = new Date().toISOString().slice(0, 10);
  const ckey = `pcount:${user.sub}:${day}`;
  const count = +((await env.SETTINGS.get(ckey)) || 0);
  if (count >= MAX_PER_DAY) return json({ ok: false, error: `อัปโหลดรูปได้ไม่เกิน ${MAX_PER_DAY} รูปต่อวัน` }, 429);

  let form;
  try { form = await request.formData(); } catch (e) { return json({ ok: false, error: "ข้อมูลรูปไม่ถูกต้อง" }, 400); }
  const full = form.get("full"), thumb = form.get("thumb");
  if (!full || !thumb || typeof full === "string" || typeof thumb === "string") return json({ ok: false, error: "ไม่พบไฟล์รูป" }, 400);
  const fb = await full.arrayBuffer(), tb = await thumb.arrayBuffer();
  if (!isJpeg(fb) || !isJpeg(tb)) return json({ ok: false, error: "รองรับเฉพาะรูป JPEG" }, 415);
  if (fb.byteLength > MAX_FULL || tb.byteLength > MAX_THUMB) return json({ ok: false, error: "รูปใหญ่เกินไป" }, 413);

  const id = newPhotoId();
  const meta = { owner: user.sub, t: Date.now() };
  await env.SETTINGS.put("photo:" + id, fb, { metadata: meta });
  await env.SETTINGS.put("photo:" + id + ":t", tb, { metadata: meta });
  await env.SETTINGS.put(ckey, String(count + 1), { expirationTtl: 2 * 86400 });
  return json({ ok: true, id }, 201, { "cache-control": "no-store" });
}
