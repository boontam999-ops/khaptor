import { getPublic } from "../lib/listings.js";

// sitemap ของประกาศจากผู้ใช้ (อัปเดตอัตโนมัติ)
export async function onRequestGet({ request, env }) {
  const origin = new URL(request.url).origin;
  const list = env.SETTINGS ? (await getPublic(env)).filter(l => !l.sold) : [];
  const rows = list.map(l => `  <url><loc>${origin}/l/${l.id}</loc><lastmod>${String(l.created_at).slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`,
    { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=600" } });
}
