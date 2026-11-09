// ลิงก์แลกเปลี่ยน (link exchange) ที่ฟุตเตอร์ เก็บใน KV คีย์ footer-links
export const KEY = "footer-links";
export const MAX_LINKS = 40;
export const DEFAULTS = { title: "เว็บไซต์พันธมิตร", scope: "all", links: [] };
let memo = { t: 0, v: null };

const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, "").trim().slice(0, max);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export async function getLinks(env, { fresh = false } = {}) {
  if (!fresh && memo.v && Date.now() - memo.t < 30000) return memo.v;
  let raw = null;
  if (env && env.SETTINGS) { try { raw = await env.SETTINGS.get(KEY, "json"); } catch (e) { raw = null; } }
  memo = { t: Date.now(), v: { ...DEFAULTS, ...(raw || {}) } };
  return memo.v;
}
export function clearLinksCache() { memo = { t: 0, v: null }; }

export function validateLinks(input) {
  if (!input || typeof input !== "object") return "ข้อมูลไม่ถูกต้อง";
  const title = clean(input.title, 60) || DEFAULTS.title;
  const scope = input.scope === "home" ? "home" : "all";
  const list = Array.isArray(input.links) ? input.links : [];
  if (list.length > MAX_LINKS) return `ใส่ลิงก์ได้ไม่เกิน ${MAX_LINKS} ลิงก์`;
  const links = [];
  for (const [i, l] of list.entries()) {
    const name = clean(l && l.name, 60);
    let url = clean(l && l.url, 300);
    if (!name && !url) continue;
    if (!name) return `ลิงก์ที่ ${i + 1}: ใส่ชื่อเว็บ`;
    if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;
    let u;
    try { u = new URL(url); } catch (e) { return `ลิงก์ที่ ${i + 1}: URL ไม่ถูกต้อง`; }
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".")) return `ลิงก์ที่ ${i + 1}: URL ไม่ถูกต้อง`;
    links.push({ name, url: u.href, nofollow: l.nofollow === true, note: clean(l && l.note, 120) });
  }
  return { title, scope, links, updated_at: new Date().toISOString() };
}

/** HTML ของกล่องลิงก์ในฟุตเตอร์ (ว่าง = ไม่แสดง) */
export function linksHTML(cfg, pathname) {
  if (!cfg.links || !cfg.links.length) return "";
  if (cfg.scope === "home" && !(pathname === "/" || pathname === "/index.html")) return "";
  const items = cfg.links.map(l => `<li><a href="${esc(l.url)}" target="_blank" rel="${l.nofollow ? "nofollow noopener" : "noopener"}">${esc(l.name)}</a></li>`).join("");
  return `<h4>${esc(cfg.title)}</h4><ul>${items}</ul>`;
}
