// รูปประกาศ เก็บใน KV (binding SETTINGS)
//   photo:<id>    รูปเต็ม (JPEG ยาวสุด 1280px)
//   photo:<id>:t  รูปย่อ (JPEG ยาวสุด 480px) metadata {owner, t}
//   pcount:<sub>:<YYYY-MM-DD>  จำนวนรูปที่อัปโหลดวันนั้น (หมดอายุเอง)
export const MAX_PHOTOS = 8;
export const MAX_PER_DAY = 40;
export const MAX_FULL = 900 * 1024;
export const MAX_THUMB = 150 * 1024;

export const newPhotoId = () => [...crypto.getRandomValues(new Uint8Array(10))].map(b => (b % 36).toString(36)).join("");
export const isPhotoId = id => /^[a-z0-9]{10}$/.test(String(id));

export function isJpeg(buf) {
  const u = new Uint8Array(buf);
  return u.length > 3 && u[0] === 0xff && u[1] === 0xd8 && u[2] === 0xff;
}

export async function photoOwner(env, id) {
  if (!isPhotoId(id)) return null;
  const r = await env.SETTINGS.getWithMetadata("photo:" + id + ":t", "arrayBuffer");
  return r && r.value ? (r.metadata || {}).owner || null : null;
}

/** ตรวจว่ารูปทุกใบเป็นของผู้ใช้คนนี้ คืนรายการ id ที่ถูกต้อง หรือข้อความผิดพลาด */
export async function checkOwnedPhotos(env, ids, sub) {
  if (ids == null) return [];
  if (!Array.isArray(ids)) return "ข้อมูลรูปไม่ถูกต้อง";
  const clean = [...new Set(ids.map(String))];
  if (clean.length > MAX_PHOTOS) return `ใส่รูปได้ไม่เกิน ${MAX_PHOTOS} รูป`;
  const owners = await Promise.all(clean.map(id => photoOwner(env, id)));
  if (owners.some(o => o !== sub)) return "มีรูปที่ไม่พบหรือไม่ใช่ของคุณ ลองอัปโหลดใหม่";
  return clean;
}

export async function deletePhotos(env, ids) {
  await Promise.all((ids || []).filter(isPhotoId).flatMap(id => [env.SETTINGS.delete("photo:" + id), env.SETTINGS.delete("photo:" + id + ":t")]));
}
