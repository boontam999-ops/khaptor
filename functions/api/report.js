import { json } from "../../lib/settings.js";
import { sameOrigin } from "../../lib/auth.js";
import { getListing } from "../../lib/listings.js";
import { REASONS, getReports, saveReports } from "../../lib/reports.js";

async function hash(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
}

// POST /api/report  {listing_id, reason, detail}  ใครก็แจ้งได้ จำกัด 5 ครั้งต่อวันต่อ IP
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ ok: false, error: "คำขอไม่ได้มาจากเว็บนี้" }, 403);
  if (!env.SETTINGS) return json({ ok: false, error: "ระบบยังไม่พร้อม" }, 503);
  let b;
  try { b = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, 400); }
  const id = String(b.listing_id || "");
  if (!/^[a-z0-9]{6,24}$/.test(id) || !(await getListing(env, id))) return json({ ok: false, error: "ไม่พบประกาศนี้" }, 404);
  if (!REASONS[b.reason]) return json({ ok: false, error: "เลือกเหตุผล" }, 400);
  const ip = await hash((request.headers.get("cf-connecting-ip") || "local") + "kt");
  const rk = `rl:report:${ip}:${new Date().toISOString().slice(0, 10)}`;
  const n = +((await env.SETTINGS.get(rk)) || 0);
  if (n >= 5) return json({ ok: false, error: "แจ้งได้ไม่เกิน 5 ครั้งต่อวัน" }, 429);
  const list = await getReports(env);
  list.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), listing_id: id, reason: b.reason,
    detail: String(b.detail || "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, 500), ip, created_at: new Date().toISOString(), status: "open" });
  await saveReports(env, list);
  await env.SETTINGS.put(rk, String(n + 1), { expirationTtl: 2 * 86400 });
  return json({ ok: true });
}
