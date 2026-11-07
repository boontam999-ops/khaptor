// ล็อกอินด้วย Google: ตรวจ ID token จาก Google Identity Services แล้วออก session cookie ที่เซ็นด้วย HMAC
// Client ID ของปุ่ม Sign in with Google (เปิดเผยได้ ไม่ใช่ความลับ) ตั้งค่า GOOGLE_CLIENT_ID ใน Cloudflare เพื่อเปลี่ยน
export const DEFAULT_GOOGLE_CLIENT_ID = "473630577364-rmshclin71mi38ier97iv0msdpsdr4fc.apps.googleusercontent.com";
export const googleClientId = env => env.GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;
const enc = new TextEncoder();
const dec = new TextDecoder();

export function b64urlToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}
export function bytesToB64url(b) {
  const u = new Uint8Array(b);
  let s = "";
  for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const jsonPart = s => JSON.parse(dec.decode(b64urlToBytes(s)));

let jwksCache = { t: 0, keys: null };
async function googleKeys(env) {
  // KT_TEST_JWKS ใช้เฉพาะตอนทดสอบในเครื่อง ห้ามตั้งบน Cloudflare
  if (env.KT_TEST_JWKS) return JSON.parse(env.KT_TEST_JWKS).keys;
  if (jwksCache.keys && Date.now() - jwksCache.t < 3600e3) return jwksCache.keys;
  const r = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  if (!r.ok) throw new Error("โหลดกุญแจของ Google ไม่ได้");
  const j = await r.json();
  jwksCache = { t: Date.now(), keys: j.keys };
  return j.keys;
}

export async function verifyGoogleIdToken(token, env) {
  const clientId = googleClientId(env);
  const parts = String(token || "").split(".");
  if (parts.length !== 3) throw new Error("token ไม่ถูกต้อง");
  const [h, p, s] = parts;
  const header = jsonPart(h), payload = jsonPart(p);
  if (header.alg !== "RS256") throw new Error("token ไม่ถูกต้อง");
  const jwk = (await googleKeys(env)).find(k => k.kid === header.kid);
  if (!jwk) throw new Error("token ไม่ถูกต้อง");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlToBytes(s), enc.encode(h + "." + p));
  if (!ok) throw new Error("ลายเซ็น token ไม่ถูกต้อง");
  if (payload.aud !== clientId) throw new Error("token ไม่ได้ออกให้เว็บนี้");
  if (payload.iss !== "accounts.google.com" && payload.iss !== "https://accounts.google.com") throw new Error("token ไม่ได้มาจาก Google");
  if (!payload.exp || payload.exp * 1000 < Date.now()) throw new Error("token หมดอายุ ลองล็อกอินใหม่");
  if (payload.email_verified === false || payload.email_verified === "false") throw new Error("อีเมล Google นี้ยังไม่ได้ยืนยัน");
  return { sub: String(payload.sub), email: String(payload.email || ""), name: String(payload.name || "").slice(0, 80) };
}

async function hmacKey(env) {
  let secret = await env.SETTINGS.get("session-secret");
  if (!secret) {
    secret = bytesToB64url(crypto.getRandomValues(new Uint8Array(32)));
    await env.SETTINGS.put("session-secret", secret);
  }
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

const SESSION_DAYS = 30;
export async function makeSessionCookie(env, user) {
  const body = bytesToB64url(enc.encode(JSON.stringify({ ...user, exp: Date.now() + SESSION_DAYS * 864e5 })));
  const sig = bytesToB64url(await crypto.subtle.sign("HMAC", await hmacKey(env), enc.encode(body)));
  return `kt_session=${body}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}
export const clearSessionCookie = "kt_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";

export async function readSession(request, env) {
  if (!env.SETTINGS) return null;
  const m = (request.headers.get("cookie") || "").match(/(?:^|;\s*)kt_session=([^;]+)/);
  if (!m) return null;
  const [body, sig] = m[1].split(".");
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(env), b64urlToBytes(sig), enc.encode(body));
    if (!ok) return null;
    const u = jsonPart(body);
    if (!u.exp || u.exp < Date.now()) return null;
    return { sub: u.sub, email: u.email, name: u.name };
  } catch (e) { return null; }
}

/** กันการส่งฟอร์มจากเว็บอื่น (CSRF): POST ต้องมาจากโดเมนเดียวกัน */
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return new URL(origin).host === new URL(request.url).host;
}
