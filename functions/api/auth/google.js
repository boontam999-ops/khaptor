import { verifyGoogleIdToken, makeSessionCookie, sameOrigin } from "../../../lib/auth.js";
import { json } from "../../../lib/settings.js";

// POST /api/auth/google  {credential}  รับ ID token จากปุ่ม Sign in with Google
export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ ok: false, error: "คำขอไม่ได้มาจากเว็บนี้" }, 403);
  if (!env.GOOGLE_CLIENT_ID || !env.SETTINGS) return json({ ok: false, error: "ระบบล็อกอินยังไม่ได้ตั้งค่า" }, 503);
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, 400); }
  try {
    const user = await verifyGoogleIdToken(body.credential, env);
    return json({ ok: true, user }, 200, { "set-cookie": await makeSessionCookie(env, user), "cache-control": "no-store" });
  } catch (e) {
    return json({ ok: false, error: e.message || "ล็อกอินไม่สำเร็จ" }, 401);
  }
}
