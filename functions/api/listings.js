import { readSession, sameOrigin } from "../../lib/auth.js";
import { validateListing, newId, saveListing, indexAdd, listMine, getPublic, MAX_PER_DAY } from "../../lib/listings.js";
import { json } from "../../lib/settings.js";

// GET /api/listings  ประกาศที่อนุมัติแล้ว
export async function onRequestGet({ env }) {
  if (!env.SETTINGS) return json({ ok: true, listings: [] });
  return json({ ok: true, listings: await getPublic(env) }, 200, { "cache-control": "public, max-age=30" });
}

// POST /api/listings  ลงประกาศใหม่ (ต้องล็อกอิน Google) สถานะเริ่มต้น = รอตรวจ
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ ok: false, error: "คำขอไม่ได้มาจากเว็บนี้" }, 403);
  const user = await readSession(request, env);
  if (!user) return json({ ok: false, error: "กรุณาล็อกอินด้วย Google ก่อนลงประกาศ" }, 401);
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, 400); }
  const v = validateListing(body);
  if (typeof v === "string") return json({ ok: false, error: v }, 400);
  const recent = (await listMine(env, user.sub)).filter(l => Date.now() - Date.parse(l.created_at) < 864e5);
  if (recent.length >= MAX_PER_DAY) return json({ ok: false, error: `ลงประกาศได้ไม่เกิน ${MAX_PER_DAY} คันต่อวัน` }, 429);
  const l = { id: newId(), status: "pending", created_at: new Date().toISOString(), owner: user, ...v };
  await saveListing(env, l);
  await indexAdd(env, l);
  const { owner, ...mine } = l;
  return json({ ok: true, listing: mine }, 201, { "cache-control": "no-store" });
}
