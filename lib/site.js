// ตั้งค่าเว็บจากหลังบ้าน (KV คีย์ site-config)
export const KEY = "site-config";
export const DEFAULTS = { show_demo: true, announcement: "", announcement_link: "", contact_phone: "", contact_email: "", ai_enabled: true, ai_daily_cap: 200, updated_at: null };
let memo = { t: 0, v: null };
const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max);

export async function getSite(env, { fresh = false } = {}) {
  if (!fresh && memo.v && Date.now() - memo.t < 30000) return memo.v;
  let raw = null;
  if (env && env.SETTINGS) { try { raw = await env.SETTINGS.get(KEY, "json"); } catch (e) { raw = null; } }
  memo = { t: Date.now(), v: { ...DEFAULTS, ...(raw || {}) } };
  return memo.v;
}
export function clearSiteCache() { memo = { t: 0, v: null }; }

export function validateSite(b) {
  if (!b || typeof b !== "object") return "ข้อมูลไม่ถูกต้อง";
  let link = clean(b.announcement_link, 300);
  if (link && !/^(https?:\/\/|\/)/i.test(link)) link = "https://" + link;
  const email = clean(b.contact_email, 120);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "อีเมลติดต่อไม่ถูกต้อง";
  return {
    show_demo: b.show_demo !== false,
    announcement: clean(b.announcement, 200),
    announcement_link: link,
    contact_phone: clean(b.contact_phone, 40),
    contact_email: email,
    ai_enabled: b.ai_enabled !== false,
    ai_daily_cap: Math.max(0, Math.min(5000, Math.round(+b.ai_daily_cap || 0))),
    updated_at: new Date().toISOString(),
  };
}
export const publicSite = (s, env) => ({ show_demo: s.show_demo, ai: s.ai_enabled !== false && !!(env && env.AI) });
