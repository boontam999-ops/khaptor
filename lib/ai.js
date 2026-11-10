// ผู้ช่วย AI (Cloudflare Workers AI, binding ชื่อ AI)
// งบประมาณ: นับจำนวนครั้งต่อวันใน KV (ai-count:<YYYY-MM-DD>) ไม่ให้เกินเพดานที่ตั้งในหลังบ้าน
import { getSite } from "./site.js";

// ลองตามลำดับ ถ้ารุ่นแรกใช้ไม่ได้ (ถูกถอดจาก catalog) จะใช้ตัวถัดไป
export const MODELS = [
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/google/gemma-4-26b-a4b-it",
  "@cf/meta/llama-3.1-8b-instruct-fast",
];

const today = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10); // วันตามเวลาไทย
const countKey = d => "ai-count:" + d;

export async function aiStatus(env) {
  const site = await getSite(env);
  const cap = site.ai_daily_cap;
  let used = 0;
  if (env.SETTINGS) { try { used = +(await env.SETTINGS.get(countKey(today()))) || 0; } catch (e) {} }
  return { bound: !!env.AI, enabled: site.ai_enabled !== false && !!env.AI, cap, used };
}

// จองโควตา 1 ครั้ง คืน false ถ้าเกินเพดานหรือปิดอยู่
export async function takeQuota(env) {
  const s = await aiStatus(env);
  if (!s.enabled || s.used >= s.cap) return false;
  if (env.SETTINGS) {
    try { await env.SETTINGS.put(countKey(today()), String(s.used + 1), { expirationTtl: 3 * 86400 }); } catch (e) {}
  }
  return true;
}

// จำกัดต่อ IP แบบประมาณ ด้วย Cache API (ไม่กินโควตาเขียน KV)
export async function ipLimit(request, bucket, max) {
  try {
    const ip = request.headers.get("cf-connecting-ip") || "0";
    const key = new Request(`https://rl.khaptor.internal/${bucket}/${today()}/${encodeURIComponent(ip)}`);
    const cache = caches.default;
    const hit = await cache.match(key);
    const n = hit ? +(await hit.text()) || 0 : 0;
    if (n >= max) return false;
    await cache.put(key, new Response(String(n + 1), { headers: { "cache-control": "max-age=86400" } }));
    return true;
  } catch (e) { return true; }
}

export async function runChat(env, messages, { max_tokens = 600, temperature = 0.4, models: only } = {}) {
  let lastErr;
  const models = only || (env.AI_MODEL ? [env.AI_MODEL, ...MODELS] : MODELS);
  for (const model of models) {
    try {
      const r = await env.AI.run(model, { messages, max_tokens, temperature });
      const text = typeof r === "string" ? r : (r && (r.response ?? r.choices?.[0]?.message?.content)) || "";
      if (typeof text === "string" && text.trim()) return { text: text.trim(), model };
      if (r && typeof r.response === "object") return { text: JSON.stringify(r.response), model };
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("AI ไม่ตอบ");
}

// ตัดเบอร์โทร ลิงก์ และอีเมลออก กันการแอบใส่ช่องทางติดต่อ/สแปมในคำบรรยาย
export function scrub(t) {
  return String(t)
    .replace(/https?:\/\/\S+|www\.\S+/gi, "")
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "")
    .replace(/(?:\+?66|0)[\s-]?\d(?:[\s-]?\d){7,8}/g, "")
    .replace(/\b(?:line|ไลน์)\s*(?:id)?\s*[:：]?\s*@?[\w.-]+/gi, "")
    .replace(/[*#`_]{1,3}/g, "")
    .replace(/(?:โทร|ติดต่อ|สอบถาม)(?:ได้ที่)?\s*[:：]?\s*(?=\s|$|หรือ)/g, "")
    .replace(/[ \t]{2,}/g, " ").replace(/ +([,.])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
