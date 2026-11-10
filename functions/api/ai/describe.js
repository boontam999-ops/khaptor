import { json } from "../../../lib/settings.js";
import { readSession, sameOrigin } from "../../../lib/auth.js";
import { takeQuota, ipLimit, runChat, scrub } from "../../../lib/ai.js";

const clip = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, n);
const BODY = { sedan: "เก๋ง", hatch: "แฮทช์แบ็ก", suv: "SUV / PPV", pickup: "กระบะ", van: "รถตู้" };

// POST /api/ai/describe  {car:{...}, notes:"..."}  → {ok, text}
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ ok: false, error: "ไม่อนุญาต" }, 403);
  const user = await readSession(request, env);
  if (!user) return json({ ok: false, error: "กรุณาเข้าสู่ระบบด้วย Google ก่อน" }, 401);
  let b; try { b = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, 400); }
  const c = b.car || {};
  const notes = clip(b.notes, 500);
  const car = {
    brand: clip(c.brand, 30), model: clip(c.model, 40), sub: clip(c.sub, 60), year: clip(c.year, 4),
    km: clip(c.km, 9), gear: clip(c.gear, 10), fuel: clip(c.fuel, 10), color: clip(c.color, 20),
    body: BODY[c.body] || "", prov: clip(c.prov, 30),
  };
  if (!car.brand || !car.model) return json({ ok: false, error: "เลือกยี่ห้อและรุ่นก่อน" }, 400);
  if (notes.length < 4) return json({ ok: false, error: "พิมพ์จุดเด่นของรถสั้น ๆ ก่อน เช่น เข้าศูนย์ตลอด ไม่เคยชน" }, 400);
  if (!(await ipLimit(request, "desc", 15))) return json({ ok: false, error: "วันนี้ใช้ตัวช่วยเขียนครบ 15 ครั้งแล้ว ลองใหม่พรุ่งนี้" }, 429);
  if (!(await takeQuota(env))) return json({ ok: false, error: "ตัวช่วยเขียนพักอยู่ หรือใช้ครบโควตาวันนี้แล้ว พิมพ์รายละเอียดเองได้เลย" }, 503);

  const facts = [
    `รถ: ${car.year} ${car.brand} ${car.model} ${car.sub}`.trim(),
    car.body && `ประเภท: ${car.body}`, car.gear && `เกียร์: ${car.gear}`, car.fuel && `เชื้อเพลิง: ${car.fuel}`,
    car.color && `สี: ${car.color}`, car.km && `เลขไมล์: ${Number(car.km).toLocaleString("en-US")} กม.`, car.prov && `จังหวัด: ${car.prov}`,
  ].filter(Boolean).join("\n");
  const messages = [
    { role: "system", content:
`คุณช่วยเจ้าของรถเขียนคำบรรยายประกาศขายรถมือสองภาษาไทย
กฎ:
- ใช้เฉพาะข้อเท็จจริงที่ให้มาเท่านั้น ห้ามเพิ่มสภาพรถ ประวัติ อุปกรณ์ การรับประกัน หรือตัวเลขที่ไม่ได้บอก
- ภาษาสุภาพ เป็นกันเอง อ่านง่าย ไม่โอ้อวดเกินจริง ไม่ใช้คำว่า "ที่สุด" "100%" "ไม่ผิดหวัง"
- ความยาว 3 ถึง 6 ประโยค ไม่เกิน 600 ตัวอักษร แบ่งย่อหน้าได้ ไม่ใช้หัวข้อ ไม่ใช้ markdown ไม่ใช้อีโมจิ
- ห้ามใส่ราคา เบอร์โทร ลิงก์ หรือช่องทางติดต่อ (หน้าเว็บแสดงให้อยู่แล้ว)
- ถ้าข้อมูลจากเจ้าของมีข้อเสีย ให้คงไว้อย่างตรงไปตรงมา
- ตอบเฉพาะคำบรรยาย ไม่ต้องมีคำนำหรือคำอธิบายอื่น` },
    { role: "user", content: `ข้อมูลรถ:\n${facts}\n\nสิ่งที่เจ้าของบอก:\n${notes}` },
  ];
  try {
    const { text } = await runChat(env, messages, { max_tokens: 500, temperature: 0.5 });
    const out = scrub(text).replace(/^["“]|["”]$/g, "").slice(0, 900);
    if (out.length < 20) throw new Error("short");
    return json({ ok: true, text: out }, 200, { "cache-control": "no-store" });
  } catch (e) {
    return json({ ok: false, error: "ตัวช่วยเขียนขัดข้องชั่วคราว ลองใหม่อีกครั้ง หรือพิมพ์เองได้เลย" }, 502);
  }
}
