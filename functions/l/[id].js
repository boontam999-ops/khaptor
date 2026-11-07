import { getListing } from "../../lib/listings.js";
import { carSVG, COLOR_SLUG } from "../../lib/car-svg.js";

const BODY = { sedan: "เก๋ง", hatch: "แฮทช์แบ็ก", suv: "SUV / PPV", pickup: "กระบะ", van: "รถตู้" };
const BODY_SCHEMA = { sedan: "Sedan", hatch: "Hatchback", suv: "SUV", pickup: "Pickup truck", van: "Van" };
const FUEL_SCHEMA = { "เบนซิน": "Gasoline", "ดีเซล": "Diesel", "ไฮบริด": "Hybrid", "ไฟฟ้า": "Electric" };
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = n => Math.round(n).toLocaleString("en-US");
const monthly = p => { const f = p * 0.85; return (f + f * 0.0349 * 6) / 72 * 1.07; };
const thDate = iso => { const d = new Date(iso); return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`; };

async function notFound(env, request) {
  const r = await env.ASSETS.fetch(new URL("/404.html", request.url));
  return new Response(r.body, { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
}

// GET /l/:id  หน้าประกาศขายรถจากผู้ใช้ (เรนเดอร์ฝั่งเซิร์ฟเวอร์ เพื่อ SEO และภาพตัวอย่างตอนแชร์)
export async function onRequestGet({ request, env, params }) {
  const id = String(params.id || "");
  if (!/^[a-z0-9]{6,24}$/.test(id) || !env.SETTINGS) return notFound(env, request);
  const l = await getListing(env, id);
  if (!l || l.status !== "approved") return notFound(env, request);

  const origin = new URL(request.url).origin;
  const url = `${origin}/l/${id}`;
  const name = `${l.year} ${l.brand} ${l.model}`;
  const code = "KT-U" + id.slice(-6).toUpperCase();
  const title = `${name} ${l.sub || ""} มือสอง ราคา ${fmt(l.price)} บาท${l.sold ? " (ขายแล้ว)" : ""} | ขับต่อ`.replace(/\s+/g, " ");
  const desc = `ขาย ${name} ${l.sub || ""} สี${l.color} ไมล์ ${fmt(l.km)} กม. เกียร์${l.gear} ${l.fuel} ที่${l.prov} ราคา ${fmt(l.price)} บาท เจ้าของขายเอง`.replace(/\s+/g, " ");
  const photos = Array.isArray(l.photos) ? l.photos.filter(p => /^[a-z0-9]{10}$/.test(p)) : [];
  const ogImg = photos.length ? `p/${photos[0]}.jpg` : `og/gen-${l.body}-${COLOR_SLUG[l.color] || "white"}.jpg`;
  const share = `${name} ${l.sub || ""} ราคา ${fmt(l.price)} บาท`.replace(/\s+/g, " ");
  const u = encodeURIComponent(url), t = encodeURIComponent(share);

  const ld = {
    "@context": "https://schema.org", "@type": "Car", name: `${name} ${l.sub || ""}`.trim(), url, image: photos.length ? photos.map(p => `${origin}/p/${p}.jpg`) : `${origin}/${ogImg}`,
    description: desc, brand: { "@type": "Brand", name: l.brand }, model: l.model, vehicleModelDate: String(l.year),
    bodyType: BODY_SCHEMA[l.body], color: l.color, fuelType: FUEL_SCHEMA[l.fuel],
    vehicleTransmission: l.gear === "อัตโนมัติ" ? "AutomaticTransmission" : "ManualTransmission",
    mileageFromOdometer: { "@type": "QuantitativeValue", value: l.km, unitCode: "KMT" }, itemCondition: "https://schema.org/UsedCondition", sku: code,
    offers: { "@type": "Offer", price: l.price, priceCurrency: "THB", url, itemCondition: "https://schema.org/UsedCondition",
      availability: l.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      availableAtOrFrom: { "@type": "Place", address: { "@type": "PostalAddress", addressRegion: l.prov, addressCountry: "TH" } } },
  };
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "หน้าแรก", item: origin + "/" },
    { "@type": "ListItem", position: 2, name: name } ] };
  const jsonld = [ld, crumbs].map(o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("");

  const main = `<main class="wrap carpage">
  <nav class="crumbs" aria-label="เส้นทาง"><ol><li><a href="../index.html">หน้าแรก</a></li><li><a href="../index.html#buy">รถมือสอง</a></li><li aria-current="page">${esc(name)}</li></ol></nav>
  <div class="car-top">
    ${photos.length ? `<div class="car-hero gallery-box"><div class="gallery" data-gallery><div class="g-track">${photos.map((p, i) => `<img src="/p/${p}.jpg" alt="${esc(name)} รูปที่ ${i + 1}"${i ? ' loading="lazy"' : ""}>`).join("")}</div>${photos.length > 1 ? `<button type="button" class="g-nav g-prev" data-g="-1" aria-label="รูปก่อนหน้า">‹</button><button type="button" class="g-nav g-next" data-g="1" aria-label="รูปถัดไป">›</button><span class="g-count">1/${photos.length}</span>` : ""}</div>${photos.length > 1 ? `<div class="g-thumbs">${photos.map((p, i) => `<button type="button"${i ? "" : ' class="on"'} data-gi="${i}" aria-label="ดูรูปที่ ${i + 1}"><img src="/p/${p}-t.jpg" alt=""></button>`).join("")}</div>` : ""}</div>`
      : `<div class="pic car-hero" style="background:hsl(${[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 360} 22% 91%)">${carSVG(l.body, l.color, esc(`ภาพประกอบ ${name} สี${l.color}`))}</div>`}
    <div class="car-info">
      <div class="sub" style="color:var(--muted);font-size:13px">เจ้าของขายเอง · ${esc(l.prov)} · ลงประกาศ ${thDate(l.created_at)}</div>
      <h1>${esc(name)} <span>${esc(l.sub || "")}</span></h1>
      ${l.sold ? '<div><span class="tag sold-tag" style="position:static;display:inline-block">ขายแล้ว</span></div>' : ""}
      <div style="display:flex;align-items:end;justify-content:space-between;gap:10px">
        <div><div class="price" style="font-size:30px${l.sold ? ";text-decoration:line-through;color:var(--muted)" : ""}">฿${fmt(l.price)}</div><div class="monthly">ดาวน์ 15% ผ่อน 72 งวด ประมาณ ฿${fmt(monthly(l.price))}/เดือน</div></div>
        <div class="plate" style="font-size:13px">${code}<small>${esc(l.prov)}</small></div>
      </div>
      <div class="contact">
        ${l.sold ? '<span class="sold-note">รถคันนี้ขายแล้ว</span>' : `<button class="btn btn-amber" type="button" data-call="${esc(code)}" data-price="${l.price}" data-tel="${esc(l.tel)}" data-name="${esc(l.name)}">ดูเบอร์ผู้ขาย</button>`}
        <a class="btn btn-line" href="../index.html#loan">คำนวณค่างวด</a>
      </div>
      <div data-phone></div>
      <div class="share" data-share-url="${esc(url)}" data-share-title="${esc(share)}"><span class="share-label">แชร์</span>
        <button type="button" class="sh sh-native" data-share="native" hidden>แชร์</button>
        <a class="sh sh-line" data-share="line" href="https://social-plugins.line.me/lineit/share?url=${u}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ LINE">LINE</a>
        <a class="sh sh-fb" data-share="facebook" href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ Facebook">Facebook</a>
        <a class="sh sh-x" data-share="x" href="https://twitter.com/intent/tweet?url=${u}&amp;text=${t}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ X">X</a>
        <button type="button" class="sh sh-copy" data-share="copy">คัดลอกลิงก์</button>
      </div>
    </div>
  </div>
  <div class="car-cols">
    <div>
      <h2>สเปกและรายละเอียด</h2>
      <div class="spec-table">
        <div><span>ปีจดทะเบียน</span><b>${l.year}</b></div><div><span>เลขไมล์</span><b>${fmt(l.km)} กม.</b></div>
        <div><span>ประเภท</span><b>${BODY[l.body] || ""}</b></div><div><span>เกียร์</span><b>${esc(l.gear)}</b></div>
        <div><span>เชื้อเพลิง</span><b>${esc(l.fuel)}</b></div><div><span>สี</span><b>${esc(l.color)}</b></div>
        <div><span>ผู้ขาย</span><b>${esc(l.name)}</b></div><div><span>รหัสประกาศ</span><b>${code}</b></div>
      </div>
      ${l.note ? `<div class="prose" style="margin-top:16px"><p style="white-space:pre-line">${esc(l.note)}</p></div>` : ""}
      <div class="prose" style="margin-top:16px"><p>ก่อนโอนเงิน ขอดูเล่มทะเบียนตัวจริงและตัวรถด้วยตัวเองทุกครั้ง ถ้าพบประกาศน่าสงสัย แจ้งทีมงานได้ที่หน้าติดต่อ</p></div>
    </div>
    <aside><div class="ad-slot ad-article" data-ad="article"></div></aside>
  </div>
  <section class="related"><a class="btn btn-line" href="../index.html#buy">ดูรถมือสองทั้งหมด</a></section>
</main>
${jsonld}`;

  const tpl = await (await env.ASSETS.fetch(new URL("/l/_template.html", request.url))).text();
  let html = tpl
    .split("%%TITLE%%").join(esc(title))
    .split("%%DESC%%").join(esc(desc))
    .split("%%OGIMG%%").join(ogImg)
    .split("/l/_template.html").join(`/l/${id}`)
    .replace("%%MAIN%%", () => main);
  if (l.sold) html = html.replace("index, follow, max-image-preview:large", "noindex, follow");
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" } });
}
