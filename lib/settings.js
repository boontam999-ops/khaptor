// การตั้งค่าโฆษณา เก็บใน Cloudflare KV (binding ชื่อ SETTINGS)
export const KEY = "site-settings";
export const POSITIONS = ["leaderboard", "sidebar", "infeed", "article"];

export const DEFAULTS = {
  ads_enabled: true,          // สวิตช์หลัก เปิด/ปิดโฆษณาทั้งเว็บ
  adsense_client: "",         // ca-pub-xxxxxxxxxxxxxxxx
  placeholders: false,        // แสดงกรอบ "พื้นที่โฆษณา" ตอนยังไม่มีรหัส
  positions: Object.fromEntries(POSITIONS.map(p => [p, { on: true, slot: "" }])),
  updated_at: null,
};

let memo = { t: 0, v: null };

export function merge(v) {
  v = v || {};
  const positions = {};
  for (const p of POSITIONS) {
    const src = (v.positions || {})[p] || {};
    positions[p] = { on: src.on !== false, slot: typeof src.slot === "string" ? src.slot : "" };
  }
  return {
    ads_enabled: v.ads_enabled !== false,
    adsense_client: typeof v.adsense_client === "string" ? v.adsense_client : "",
    placeholders: v.placeholders === true,
    positions,
    updated_at: v.updated_at || null,
  };
}

export async function getSettings(env, { fresh = false } = {}) {
  if (!fresh && memo.v && Date.now() - memo.t < 30000) return memo.v;
  let raw = null;
  if (env && env.SETTINGS) {
    try { raw = await env.SETTINGS.get(KEY, "json"); } catch (e) { raw = null; }
  }
  memo = { t: Date.now(), v: merge(raw) };
  return memo.v;
}

export function clearCache() { memo = { t: 0, v: null }; }

/** ตรวจและทำความสะอาดค่าที่ส่งมาจากหน้าแอดมิน คืน {ok, value|error} */
export function validate(input) {
  if (!input || typeof input !== "object") return { ok: false, error: "ข้อมูลไม่ถูกต้อง" };
  let client = String(input.adsense_client || "").trim();
  if (client && !/^ca-pub-\d{10,20}$/.test(client)) {
    if (/^pub-\d{10,20}$/.test(client)) client = "ca-" + client;
    else return { ok: false, error: "รหัส AdSense ต้องเป็นรูปแบบ ca-pub- ตามด้วยตัวเลข" };
  }
  const positions = {};
  for (const p of POSITIONS) {
    const src = (input.positions || {})[p] || {};
    const slot = String(src.slot || "").trim();
    if (slot && !/^\d{5,20}$/.test(slot)) return { ok: false, error: `รหัสหน่วยโฆษณาตำแหน่ง ${p} ต้องเป็นตัวเลขเท่านั้น` };
    positions[p] = { on: src.on !== false, slot };
  }
  return {
    ok: true,
    value: {
      ads_enabled: input.ads_enabled !== false,
      adsense_client: client,
      placeholders: input.placeholders === true,
      positions,
      updated_at: new Date().toISOString(),
    },
  };
}

async function sha(s) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(s)));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join("");
}

/** คืน null ถ้าผ่าน หรือ Response error */
export async function checkAuth(request, env) {
  if (!env.ADMIN_PASSWORD) return json({ ok: false, error: "ยังไม่ได้ตั้งรหัสผ่านแอดมิน (ADMIN_PASSWORD) ใน Cloudflare" }, 503);
  const given = request.headers.get("x-admin-password") || "";
  if (!given || (await sha(given)) !== (await sha(env.ADMIN_PASSWORD))) {
    await new Promise(r => setTimeout(r, 800));
    return json({ ok: false, error: "รหัสผ่านไม่ถูกต้อง" }, 401);
  }
  return null;
}

export function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

/** ค่าที่ส่งให้หน้าเว็บสาธารณะ */
export function publicView(s) {
  return { ads_enabled: s.ads_enabled, adsense_client: s.adsense_client, placeholders: s.placeholders, positions: s.positions };
}
