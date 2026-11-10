import { checkAuth, json, getSettings } from "../../../lib/settings.js";
import { listAll } from "../../../lib/listings.js";
import { listUsers } from "../../../lib/users.js";
import { getReports } from "../../../lib/reports.js";
import { getLinks } from "../../../lib/links.js";
import { getSite } from "../../../lib/site.js";

// POST /api/admin/stats  ตัวเลขภาพรวมสำหรับหน้าแรกของหลังบ้าน
export async function onRequestPost({ request, env }) {
  const denied = await checkAuth(request, env);
  if (denied) return denied;
  if (!env.SETTINGS) return json({ ok: false, error: "ยังไม่ได้ผูก KV" }, 503);
  const [all, users, reports, links, ads, site] = await Promise.all([listAll(env, 2000), listUsers(env, 2000), getReports(env), getLinks(env, { fresh: true }), getSettings(env, { fresh: true }), getSite(env, { fresh: true })]);
  const bkkDay = d => new Date(Date.parse(d) + 7 * 3600e3).toISOString().slice(0, 10);
  const today = bkkDay(new Date().toISOString());
  const days = [...Array(14)].map((_, i) => bkkDay(new Date(Date.now() - (13 - i) * 864e5).toISOString()));
  const perDay = days.map(d => ({ day: d, n: all.filter(l => bkkDay(l.created_at) === d).length }));
  return json({ ok: true, stats: {
    listings: all.length,
    live: all.filter(l => l.status === "approved" && !l.sold).length,
    sold: all.filter(l => l.sold).length,
    hidden: all.filter(l => l.status === "rejected").length,
    today: all.filter(l => bkkDay(l.created_at) === today).length,
    photos: all.reduce((a, l) => a + (l.photos || []).length, 0),
    users: users.length, banned: users.filter(u => u.banned).length,
    reports_open: reports.filter(r => r.status === "open").length,
    links: (links.links || []).length,
    ads_on: ads.ads_enabled && !!ads.adsense_client, ads_client: !!ads.adsense_client,
    show_demo: site.show_demo,
    per_day: perDay,
    recent: all.slice(0, 6).map(l => ({ id: l.id, title: `${l.year} ${l.brand} ${l.model}`, price: l.price, created_at: l.created_at, status: l.status, sold: !!l.sold })),
  } }, 200, { "cache-control": "no-store" });
}
