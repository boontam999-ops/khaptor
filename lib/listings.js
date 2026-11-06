// ประกาศขายรถจากผู้ใช้ เก็บใน KV (binding SETTINGS)
//   listing:<id>        ข้อมูลประกาศเต็ม
//   listings:index      รายการ id ทั้งหมด ใหม่สุดก่อน
//   listings:public     สำเนาประกาศที่อนุมัติแล้ว สำหรับหน้าเว็บ (อ่านครั้งเดียว)
//   user:<sub>          id ประกาศของผู้ใช้แต่ละคน
export const BRANDS = ["BMW", "BYD", "Chevrolet", "Ford", "Honda", "Hyundai", "Isuzu", "Kia", "Mazda", "Mercedes-Benz", "MG", "Mitsubishi", "Nissan", "Subaru", "Suzuki", "Toyota", "Volvo", "อื่นๆ"];
export const PROVS = ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "ชลบุรี", "เชียงใหม่", "ขอนแก่น", "นครราชสีมา", "ภูเก็ต", "สงขลา", "อื่นๆ"];
export const BODIES = ["sedan", "hatch", "suv", "pickup", "van"];
export const GEARS = ["อัตโนมัติ", "ธรรมดา"];
export const FUELS = ["เบนซิน", "ดีเซล", "ไฮบริด", "ไฟฟ้า"];
export const COLORS = ["ขาว", "ดำ", "เทา", "เงิน", "แดง", "น้ำเงิน", "น้ำตาล"];
export const MAX_PER_DAY = 3;

const get = (env, k) => env.SETTINGS.get(k, "json");
const put = (env, k, v) => env.SETTINGS.put(k, JSON.stringify(v));

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const getListing = (env, id) => get(env, "listing:" + id);
export const saveListing = (env, l) => put(env, "listing:" + l.id, l);

export async function indexAdd(env, l) {
  const ids = (await get(env, "listings:index")) || [];
  ids.unshift(l.id);
  await put(env, "listings:index", ids.slice(0, 5000));
  const mine = (await get(env, "user:" + l.owner.sub)) || [];
  mine.unshift(l.id);
  await put(env, "user:" + l.owner.sub, mine.slice(0, 200));
}
export async function indexRemove(env, l) {
  const ids = ((await get(env, "listings:index")) || []).filter(x => x !== l.id);
  await put(env, "listings:index", ids);
  const mine = ((await get(env, "user:" + l.owner.sub)) || []).filter(x => x !== l.id);
  await put(env, "user:" + l.owner.sub, mine);
}
export async function listByIds(env, ids) {
  const out = await Promise.all(ids.map(id => getListing(env, id)));
  return out.filter(Boolean);
}
export async function listMine(env, sub) {
  return listByIds(env, (await get(env, "user:" + sub)) || []);
}
export async function listAll(env, limit = 300) {
  return listByIds(env, ((await get(env, "listings:index")) || []).slice(0, limit));
}

/** ข้อมูลที่แสดงสาธารณะ ไม่มีอีเมลหรือรหัสบัญชี Google ของผู้ขาย */
export function publicView(l) {
  const { owner, status, ...rest } = l;
  return rest;
}
export async function rebuildPublic(env) {
  const all = await listAll(env, 2000);
  await put(env, "listings:public", all.filter(l => l.status === "approved").map(publicView));
}
export async function getPublic(env) {
  return (await get(env, "listings:public")) || [];
}

const str = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f<>&"'`]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const int = v => (/^\d+$/.test(String(v).trim()) ? parseInt(v, 10) : NaN);

export function validateListing(b) {
  const year = int(b.year), km = int(b.km), price = int(b.price);
  const thisYear = new Date().getFullYear();
  const v = {
    brand: str(b.brand, 30), model: str(b.model, 40), sub: str(b.sub, 60),
    year, km, price, prov: str(b.prov, 30),
    body: str(b.body, 10), gear: str(b.gear, 10), fuel: str(b.fuel, 10), color: str(b.color, 10),
    name: str(b.name, 50), tel: str(b.tel, 15).replace(/[\s-]/g, ""), note: str(b.note, 600),
  };
  if (!BRANDS.includes(v.brand)) return "เลือกยี่ห้อรถ";
  if (v.model.length < 1) return "กรอกรุ่นรถ";
  if (!(year >= 1985 && year <= thisYear + 1)) return "ปีจดทะเบียนไม่ถูกต้อง";
  if (!(km >= 0 && km <= 2000000)) return "เลขไมล์ไม่ถูกต้อง";
  if (!(price >= 10000 && price <= 100000000)) return "ราคาต้องอยู่ระหว่าง 10,000 ถึง 100,000,000 บาท";
  if (!PROVS.includes(v.prov)) return "เลือกจังหวัด";
  if (!BODIES.includes(v.body)) return "เลือกประเภทรถ";
  if (!GEARS.includes(v.gear)) return "เลือกเกียร์";
  if (!FUELS.includes(v.fuel)) return "เลือกเชื้อเพลิง";
  if (!COLORS.includes(v.color)) return "เลือกสีรถ";
  if (v.name.length < 2) return "กรอกชื่อผู้ขาย";
  if (!/^0\d{8,9}$/.test(v.tel)) return "เบอร์โทรต้องเป็นตัวเลข 9 ถึง 10 หลัก ขึ้นต้นด้วย 0";
  if (b.consent !== true) return "ต้องยินยอมให้แสดงเบอร์โทรในประกาศ";
  return v;
}
