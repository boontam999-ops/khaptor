import { getListing, PART_CATS } from "../../lib/listings.js";
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
  if (l.kind === "part") return renderPart(l, { request, env, id, origin, url });
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
      <button type="button" class="report-link" data-report="${id}">แจ้งประกาศไม่เหมาะสม</button>
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
  <a class="parts-link" href="../parts/?brand=${encodeURIComponent(l.brand)}&amp;model=${encodeURIComponent(l.model)}"><b>อะไหล่และของแต่งสำหรับ ${esc(l.brand)} ${esc(l.model)}</b><span>ล้อแม็ก เครื่องเสียง ชุดแต่ง และอะไหล่มือสอง →</span></a>
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

const shareBox = (url, share) => { const u = encodeURIComponent(url), t = encodeURIComponent(share); return `<div class="share" data-share-url="${esc(url)}" data-share-title="${esc(share)}"><span class="share-label">แชร์</span>
        <button type="button" class="sh sh-native" data-share="native" hidden>แชร์</button>
        <a class="sh sh-line" data-share="line" href="https://social-plugins.line.me/lineit/share?url=${u}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ LINE">LINE</a>
        <a class="sh sh-fb" data-share="facebook" href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ Facebook">Facebook</a>
        <a class="sh sh-x" data-share="x" href="https://twitter.com/intent/tweet?url=${u}&amp;text=${t}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ X">X</a>
        <button type="button" class="sh sh-copy" data-share="copy">คัดลอกลิงก์</button>
      </div>`; };
const fits = l => { const y = l.yearFrom && l.yearTo ? `ปี ${l.yearFrom}–${l.yearTo}` : l.yearFrom ? `ปี ${l.yearFrom} ขึ้นไป` : l.yearTo ? `ถึงปี ${l.yearTo}` : ""; return [l.brand === "ทุกยี่ห้อ" ? "ใส่ได้หลายยี่ห้อ" : l.brand, l.model, y].filter(Boolean).join(" "); };

// หน้าประกาศขายอะไหล่
async function renderPart(l, { request, env, id, origin, url }) {
  const code = "KT-P" + id.slice(-6).toUpperCase();
  const cat = PART_CATS[l.cat] || "อะไหล่";
  const fit = fits(l);
  const title = `${l.title} ${l.cond} ราคา ${fmt(l.price)} บาท${l.sold ? " (ขายแล้ว)" : ""} | อะไหล่ ขับต่อ`.replace(/\s+/g, " ");
  const desc = `ขาย ${l.title} สภาพ${l.cond} ${fit ? "ใส่กับ " + fit : ""} ที่${l.prov} ราคา ${fmt(l.price)} บาท หมวด${cat}`.replace(/\s+/g, " ");
  const photos = Array.isArray(l.photos) ? l.photos.filter(p => /^[a-z0-9]{10}$/.test(p)) : [];
  const ogImg = photos.length ? `p/${photos[0]}.jpg` : "og/site.jpg";
  const share = `${l.title} ราคา ${fmt(l.price)} บาท`;
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: l.title, url, sku: code, category: cat, description: desc,
    image: photos.map(p => `${origin}/p/${p}.jpg`),
    ...(l.brand !== "ทุกยี่ห้อ" ? { isAccessoryOrSparePartFor: { "@type": "Car", name: `${l.brand} ${l.model || ""}`.trim(), brand: { "@type": "Brand", name: l.brand } } } : {}),
    offers: { "@type": "Offer", price: l.price, priceCurrency: "THB", url,
      itemCondition: l.cond === "ใหม่" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      availability: l.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      availableAtOrFrom: { "@type": "Place", address: { "@type": "PostalAddress", addressRegion: l.prov, addressCountry: "TH" } } },
  };
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "หน้าแรก", item: origin + "/" },
    { "@type": "ListItem", position: 2, name: "อะไหล่และของแต่ง", item: origin + "/parts/" },
    { "@type": "ListItem", position: 3, name: l.title } ] };
  const jsonld = [ld, crumbs].map(o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("");
  const gallery = photos.length ? `<div class="car-hero gallery-box"><div class="gallery" data-gallery><div class="g-track">${photos.map((p, i) => `<img src="/p/${p}.jpg" alt="${esc(l.title)} รูปที่ ${i + 1}"${i ? ' loading="lazy"' : ""}>`).join("")}</div>${photos.length > 1 ? `<button type="button" class="g-nav g-prev" data-g="-1" aria-label="รูปก่อนหน้า">‹</button><button type="button" class="g-nav g-next" data-g="1" aria-label="รูปถัดไป">›</button><span class="g-count">1/${photos.length}</span>` : ""}</div>${photos.length > 1 ? `<div class="g-thumbs">${photos.map((p, i) => `<button type="button"${i ? "" : ' class="on"'} data-gi="${i}" aria-label="ดูรูปที่ ${i + 1}"><img src="/p/${p}-t.jpg" alt=""></button>`).join("")}</div>` : ""}</div>` : `<div class="pic car-hero part-noimg">ไม่มีรูป</div>`;
  const q = new URLSearchParams({ cat: l.cat, ...(l.brand !== "ทุกยี่ห้อ" ? { brand: l.brand } : {}) });
  const main = `<main class="wrap carpage">
  <nav class="crumbs" aria-label="เส้นทาง"><ol><li><a href="../index.html">หน้าแรก</a></li><li><a href="../parts/">อะไหล่และของแต่ง</a></li><li aria-current="page">${esc(l.title)}</li></ol></nav>
  <div class="car-top">
    ${gallery}
    <div class="car-info">
      <div class="sub" style="color:var(--muted);font-size:13px">${esc(cat)} · ${esc(l.prov)} · ลงประกาศ ${thDate(l.created_at)}</div>
      <h1>${esc(l.title)}</h1>
      <div class="part-tags"><span class="pill">${esc(l.cond)}</span>${fit ? `<span class="pill">ใส่กับ ${esc(fit)}</span>` : ""}${l.sold ? '<span class="tag sold-tag" style="position:static;display:inline-block">ขายแล้ว</span>' : ""}</div>
      <div style="display:flex;align-items:end;justify-content:space-between;gap:10px">
        <div class="price" style="font-size:30px${l.sold ? ";text-decoration:line-through;color:var(--muted)" : ""}">฿${fmt(l.price)}</div>
        <div class="plate" style="font-size:13px">${code}<small>${esc(l.prov)}</small></div>
      </div>
      <div class="contact">
        ${l.sold ? '<span class="sold-note">สินค้านี้ขายแล้ว</span>' : `<button class="btn btn-amber" type="button" data-call="${esc(code)}" data-price="${l.price}" data-tel="${esc(l.tel)}" data-name="${esc(l.name)}">ดูเบอร์ผู้ขาย</button>`}
        <a class="btn btn-line" href="../parts/?${esc(q.toString())}">ดูอะไหล่หมวดนี้</a>
      </div>
      <div data-phone></div>
      ${shareBox(url, share)}
      <button type="button" class="report-link" data-report="${id}">แจ้งประกาศไม่เหมาะสม</button>
    </div>
  </div>
  <div class="car-cols">
    <div>
      <h2>รายละเอียดสินค้า</h2>
      <div class="spec-table">
        <div><span>หมวด</span><b>${esc(cat)}</b></div><div><span>สภาพ</span><b>${esc(l.cond)}</b></div>
        <div><span>ใส่กับรถ</span><b>${esc(fit || "ไม่ระบุ")}</b></div><div><span>จังหวัด</span><b>${esc(l.prov)}</b></div>
        <div><span>ผู้ขาย</span><b>${esc(l.name)}</b></div><div><span>รหัสประกาศ</span><b>${code}</b></div>
      </div>
      ${l.note ? `<div class="prose" style="margin-top:16px"><p style="white-space:pre-line">${esc(l.note)}</p></div>` : ""}
      <div class="prose" style="margin-top:16px"><p>ก่อนจ่ายเงิน ขอดูสินค้าจริงหรือขอวิดีโอให้เห็นสภาพและรหัสอะไหล่ เช็กว่าใส่กับรถของคุณได้ และโอนเงินเข้าบัญชีชื่อเดียวกับผู้ขายเท่านั้น ถ้าสงสัยว่าเป็นของโจรกรรม กดแจ้งประกาศไม่เหมาะสม</p></div>
    </div>
    <aside><div class="ad-slot ad-article" data-ad="article"></div></aside>
  </div>
  <section class="related"><a class="btn btn-line" href="../parts/">ดูอะไหล่และของแต่งทั้งหมด</a></section>
</main>
${jsonld}`;
  const tpl = await (await env.ASSETS.fetch(new URL("/l/_template.html", request.url))).text();
  let html = tpl.split("%%TITLE%%").join(esc(title)).split("%%DESC%%").join(esc(desc)).split("%%OGIMG%%").join(ogImg)
    .split("/l/_template.html").join(`/l/${id}`).replace("%%MAIN%%", () => main);
  if (l.sold) html = html.replace("index, follow, max-image-preview:large", "noindex, follow");
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" } });
}
