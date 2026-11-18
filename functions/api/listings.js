import { readSession, sameOrigin } from "../../lib/auth.js";
import { validateListing, validatePart, newId, saveListing, indexAdd, listMine, getPublic, publishNow, MAX_PER_DAY, PART_MAX_PER_DAY } from "../../lib/listings.js";
import { json } from "../../lib/settings.js";
import { checkOwnedPhotos } from "../../lib/photos.js";
import { touchUser } from "../../lib/users.js";

// GET /api/listings  ประกาศที่อนุมัติแล้ว
export async function onRequestGet({ env }) {
  if (!env.SETTINGS) return json({ ok: true, listings: [] });
  return json({ ok: true, listings: await getPublic(env) }, 200, { "cache-control": "no-store" });
}

// POST /api/listings  ลงประกาศใหม่ (ต้องล็อกอิน Google) ขึ้นเว็บทันที แอดมินซ่อนหรือลบภายหลังได้
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ ok: false, error: "คำขอไม่ได้มาจากเว็บนี้" }, 403);
  const user = await readSession(request, env);
  if (!user) return json({ ok: false, error: "กรุณาล็อกอินด้วย Google ก่อนลงประกาศ" }, 401);
  if ((await touchUser(env, user)).banned) return json({ ok: false, error: "บัญชีนี้ถูกระงับการลงประกาศ" }, 403);
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, 400); }
  const isPart = body.kind === "part";
  const v = isPart ? validatePart(body) : validateListing(body);
  if (typeof v === "string") return json({ ok: false, error: v }, 400);
  const photos = await checkOwnedPhotos(env, body.photos, user.sub);
  if (typeof photos === "string") return json({ ok: false, error: photos }, 400);
  if (isPart && !photos.length) return json({ ok: false, error: "ใส่รูปสินค้าอย่างน้อย 1 รูป" }, 400);
  const recent = (await listMine(env, user.sub)).filter(l => Date.now() - Date.parse(l.created_at) < 864e5 && (l.kind === "part") === isPart);
  const cap = isPart ? PART_MAX_PER_DAY : MAX_PER_DAY;
  if (recent.length >= cap) return json({ ok: false, error: isPart ? `ลงขายอะไหล่ได้ไม่เกิน ${cap} ชิ้นต่อวัน` : `ลงประกาศได้ไม่เกิน ${cap} คันต่อวัน` }, 429);
  const l = { id: newId(), status: "approved", created_at: new Date().toISOString(), owner: user, ...v, photos };
  await saveListing(env, l);
  await indexAdd(env, l);
  await publishNow(env, l);
  const { owner, ...mine } = l;
  return json({ ok: true, listing: mine }, 201, { "cache-control": "no-store" });
}
