import { json } from "../../../lib/settings.js";
import { sameOrigin } from "../../../lib/auth.js";
import { takeQuota, ipLimit, runChat } from "../../../lib/ai.js";

const BODIES = ["sedan", "hatch", "suv", "pickup", "van"];
const FUELS = ["เบนซิน", "ดีเซล", "ไฮบริด", "ไฟฟ้า"];
const GEARS = ["อัตโนมัติ", "ธรรมดา"];
const SORTS = ["new", "pAsc", "pDesc", "yDesc", "kmAsc"];
const clipList = (a, n) => (Array.isArray(a) ? a : []).map(x => String(x).replace(/[\u0000-\u001f<>"]/g, "").slice(0, 40)).filter(Boolean).slice(0, n);
const num = (v, lo, hi) => { const n = Math.round(+v); return Number.isFinite(n) && n >= lo && n <= hi ? n : 0; };
const pick = (list, allowed) => [...new Set((Array.isArray(list) ? list : [list]).filter(x => allowed.includes(x)))];

function validate(o, brands, models, provs) {
  o = o || {};
  const brand = brands.find(b => b.toLowerCase() === String(o.brand || "").toLowerCase()) || "";
  const model = brand ? (models[brand] || []).find(m => m.toLowerCase() === String(o.model || "").toLowerCase()) || "" : "";
  return {
    brand, model,
    body: model ? [] : pick(o.body, BODIES), fuel: pick(o.fuel, FUELS), gear: pick(o.gear, GEARS),
    minPrice: num(o.minPrice, 1000, 50e6), maxPrice: num(o.maxPrice, 1000, 50e6),
    minYear: num(o.minYear, 1980, 2100), maxKm: num(o.maxKm, 1000, 1e6),
    prov: provs.includes(o.prov) ? o.prov : "",
    sort: SORTS.includes(o.sort) ? o.sort : "",
    cert: o.cert === true,
    explain: String(o.explain || "").replace(/[<>]/g, "").slice(0, 160),
  };
}

// POST /api/ai/search {q, brands:[], models:{brand:[...]}, provs:[]} → {ok, filters}
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ ok: false, error: "ไม่อนุญาต" }, 403);
  let b; try { b = await request.json(); } catch (e) { return json({ ok: false }, 400); }
  const q = String(b.q || "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  if (q.length < 2) return json({ ok: false, error: "พิมพ์สิ่งที่อยากได้ก่อน" }, 400);
  const brands = clipList(b.brands, 80), provs = clipList(b.provs, 80);
  const models = {};
  for (const br of brands) models[br] = clipList((b.models || {})[br], 60);

  // แคชคำค้นเดิม 7 วัน ไม่เสียโควตา AI ซ้ำ
  const ck = new Request("https://ai-cache.khaptor.internal/search/v2/" + encodeURIComponent(q.toLowerCase()) + "/" + brands.length);
  const cache = caches.default;
  try { const hit = await cache.match(ck); if (hit) { const o = await hit.json(); return json({ ok: true, filters: validate(o, brands, models, provs), cached: true }); } } catch (e) {}

  if (!(await ipLimit(request, "search", 40))) return json({ ok: false, error: "rate" }, 429);
  if (!(await takeQuota(env))) return json({ ok: false, error: "quota" }, 503);

  const year = new Date().getFullYear();
  const messages = [
    { role: "system", content:
`แปลงคำค้นหารถมือสองภาษาไทยเป็นตัวกรอง ตอบเป็น JSON อย่างเดียว ไม่มีข้อความอื่น
รูปแบบ: {"brand":"","model":"","body":[],"fuel":[],"gear":[],"minPrice":0,"maxPrice":0,"minYear":0,"maxKm":0,"prov":"","sort":"","cert":false,"explain":""}
ค่าที่ใช้ได้:
- brand: หนึ่งในรายการนี้เท่านั้น หรือ "" : ${brands.join(", ")}
- model: ชื่อรุ่นของยี่ห้อนั้นจากรายการ หรือ "" : ${brands.map(x => x + ": " + (models[x] || []).join("/")).join("; ")}
- body: sedan=เก๋ง, hatch=แฮทช์แบ็ก/รถเล็ก, suv=SUV/PPV/รถ 7 ที่นั่ง, pickup=กระบะ, van=รถตู้
- fuel: เบนซิน, ดีเซล, ไฮบริด, ไฟฟ้า   gear: อัตโนมัติ, ธรรมดา
- prov: หนึ่งในรายการนี้ หรือ "" : ${provs.join(", ")}
- sort: new, pAsc(ถูกก่อน), pDesc, yDesc(ใหม่ก่อน), kmAsc(ไมล์น้อยก่อน) หรือ ""
- ราคาเป็นบาท: "6 แสน"=600000, "1.2 ล้าน"=1200000, "5 หมื่น"=50000
- ปีเป็น ค.ศ. ถ้าบอก พ.ศ. ให้ลบ 543 ปีปัจจุบันคือ ${year} ("ไม่เกิน 5 ปี" = minYear ${year - 5})
- cert=true เมื่อขอรถผ่านการตรวจสภาพ
หลักตีความ: รถครอบครัว/7 ที่นั่ง → suv และ van; ประหยัดน้ำมัน → ไฮบริด เบนซิน หรือไฟฟ้า และ body hatch/sedan ถ้าไม่ได้ระบุประเภท; ขนของ/ใช้งาน → pickup; ขับในเมือง → hatch sedan
ใส่เฉพาะสิ่งที่ผู้ใช้สื่อ ไม่แน่ใจให้เว้นว่าง ห้ามใส่ fuel ถ้าผู้ใช้ไม่ได้พูดถึงเชื้อเพลิงหรือความประหยัด ห้ามใส่ gear ถ้าไม่ได้พูดถึงเกียร์ ถ้าระบุรุ่นแล้วไม่ต้องใส่ body
explain: สรุปสั้นภาษาไทยไม่เกิน 1 ประโยคว่ากรองอะไร` },
    { role: "user", content: q },
  ];
  try {
    const t0 = Date.now();
    const { text, model } = await runChat(env, messages, { max_tokens: 300, temperature: 0 });
    const m = text.match(/\{[\s\S]*\}/);
    const o = JSON.parse(m ? m[0] : text);
    const f = validate(o, brands, models, provs);
    try { await cache.put(ck, new Response(JSON.stringify(f), { headers: { "content-type": "application/json", "cache-control": "max-age=604800" } })); } catch (e) {}
    return json({ ok: true, filters: f, model: model.split("/").pop(), ms: Date.now() - t0 });
  } catch (e) {
    return json({ ok: false, error: "ai" }, 502);
  }
}
