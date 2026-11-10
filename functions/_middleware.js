import { getSettings, publicView } from "../lib/settings.js";
import { googleClientId } from "../lib/auth.js";
import { getLinks, linksHTML } from "../lib/links.js";
import { getSite, publicSite } from "../lib/site.js";

const DEMO_PATH = /^\/(cars|brand|province)\//;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ใส่ค่าการตั้งโฆษณาและสคริปต์ AdSense ลงในทุกหน้า HTML (ยกเว้นหน้าแอดมิน)
export async function onRequest(ctx) {
  const url = new URL(ctx.request.url);
  const accept = ctx.request.headers.get("accept") || "";
  const maybeHtml = ctx.request.method === "GET" && !url.pathname.startsWith("/admin") && !url.pathname.startsWith("/api/") &&
    (accept.includes("text/html") || url.pathname.endsWith("/") || url.pathname.endsWith(".html") || !url.pathname.includes("."));
  // หน้า HTML: ขอไฟล์เต็มทุกครั้ง (ไม่ใช้ 304) เพื่อให้ค่าโฆษณาล่าสุดถูกใส่เสมอ
  let req = ctx.request;
  if (maybeHtml) {
    req = new Request(ctx.request);
    req.headers.delete("if-none-match");
    req.headers.delete("if-modified-since");
  }
  // รถตัวอย่างถูกปิดในหลังบ้าน: หน้ารถ ยี่ห้อ จังหวัด (ข้อมูลตัวอย่าง) ตอบ 404 และตัดออกจาก sitemap
  if (ctx.request.method === "GET" && (DEMO_PATH.test(url.pathname) || url.pathname === "/sitemap.xml")) {
    const site0 = await getSite(ctx.env);
    if (!site0.show_demo) {
      if (url.pathname === "/sitemap.xml") {
        const r = await ctx.next();
        const xml = (await r.text()).split("\n").filter(line => !/\/(cars|brand|province)\//.test(line)).join("\n");
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=600" } });
      }
      const nf = await ctx.env.ASSETS.fetch(new URL("/404.html", url));
      return new Response(nf.body, { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
    }
  }
  const res = await ctx.next(req);
  const type = res.headers.get("content-type") || "";
  if (!maybeHtml || !type.includes("text/html")) return res;
  const site = await getSite(ctx.env);

  const s = await getSettings(ctx.env);
  const auth = { googleClientId: googleClientId(ctx.env) };
  let head = `<script>window.KT_ADS=${JSON.stringify(publicView(s)).replace(/</g, "\\u003c")};window.KT_AUTH=${JSON.stringify(auth).replace(/</g, "\\u003c")};window.KT_SITE=${JSON.stringify(publicSite(site)).replace(/</g, "\\u003c")}</script>`;
  if (s.ads_enabled && s.adsense_client) {
    const c = esc(s.adsense_client);
    head += `<meta name="google-adsense-account" content="${c}">` +
            `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${c}" crossorigin="anonymous"></script>`;
  }
  const partner = linksHTML(await getLinks(ctx.env), url.pathname);
  let rw = new HTMLRewriter().on("head", { element(e) { e.append(head, { html: true }); } });
  if (partner) rw = rw.on("#kt-links", { element(e) { e.removeAttribute("hidden"); e.setInnerContent(partner, { html: true }); } });
  if (!site.show_demo) rw = rw.on("[data-demo]", { element(e) { e.remove(); } });
  if (site.announcement) {
    const txt = esc(site.announcement);
    const inner = site.announcement_link ? `<a href="${esc(site.announcement_link)}">${txt}</a>` : txt;
    rw = rw.on("header.top", { element(e) { e.after(`<div class="announce" role="note">${inner}</div>`, { html: true }); } });
  }
  if (site.contact_phone) rw = rw.on("[data-site=phone]", { element(e) { e.setInnerContent(site.contact_phone); } });
  if (site.contact_email) rw = rw.on("[data-site=email]", { element(e) { e.setInnerContent(site.contact_email); } });
  const out = rw.transform(res);
  const h = new Headers(out.headers);
  h.delete("etag"); h.delete("last-modified");
  h.set("cache-control", "public, max-age=0, must-revalidate");
  return new Response(out.body, { status: out.status, statusText: out.statusText, headers: h });
}
