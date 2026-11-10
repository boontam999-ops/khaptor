// บัญชีผู้ใช้ที่ล็อกอินด้วย Google
//   user-info:<sub>  {sub,email,name,first_seen,last_seen,banned,ban_reason}
//   users:index      รายการ sub
const get = (env, k) => env.SETTINGS.get(k, "json");
const put = (env, k, v) => env.SETTINGS.put(k, JSON.stringify(v));

export const getUser = (env, sub) => get(env, "user-info:" + sub);
export const saveUser = (env, u) => put(env, "user-info:" + u.sub, u);

/** บันทึกการเข้าใช้ (เขียนเฉพาะผู้ใช้ใหม่ หรือห่างจากครั้งก่อนเกิน 12 ชม. เพื่อประหยัดโควตา) คืนข้อมูลผู้ใช้ */
export async function touchUser(env, user) {
  const now = new Date().toISOString();
  let u = await getUser(env, user.sub);
  if (!u) {
    u = { sub: user.sub, email: user.email, name: user.name, first_seen: now, last_seen: now, banned: false };
    await saveUser(env, u);
    const idx = (await get(env, "users:index")) || [];
    idx.unshift(user.sub);
    await put(env, "users:index", idx.slice(0, 10000));
  } else if (Date.now() - Date.parse(u.last_seen || 0) > 12 * 3600e3 || u.email !== user.email || u.name !== user.name) {
    u = { ...u, email: user.email, name: user.name, last_seen: now };
    await saveUser(env, u);
  }
  return u;
}
export async function isBanned(env, sub) {
  const u = await getUser(env, sub);
  return !!(u && u.banned);
}
export async function listUsers(env, limit = 1000) {
  const idx = ((await get(env, "users:index")) || []).slice(0, limit);
  return (await Promise.all(idx.map(s => getUser(env, s)))).filter(Boolean);
}
