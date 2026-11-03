import { getSettings, publicView } from "../lib/settings.js";

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
  const res = await ctx.next(req);
  const type = res.headers.get("content-type") || "";
  if (!maybeHtml || !type.includes("text/html")) return res;

  const s = await getSettings(ctx.env);
  let head = `<script>window.KT_ADS=${JSON.stringify(publicView(s)).replace(/</g, "\\u003c")}</script>`;
  if (s.ads_enabled && s.adsense_client) {
    const c = esc(s.adsense_client);
    head += `<meta name="google-adsense-account" content="${c}">` +
            `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${c}" crossorigin="anonymous"></script>`;
  }
  const out = new HTMLRewriter().on("head", { element(e) { e.append(head, { html: true }); } }).transform(res);
  const h = new Headers(out.headers);
  h.delete("etag"); h.delete("last-modified");
  h.set("cache-control", "public, max-age=0, must-revalidate");
  return new Response(out.body, { status: out.status, statusText: out.statusText, headers: h });
}
