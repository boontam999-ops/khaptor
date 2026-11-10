import { checkAuth, json } from "../../../lib/settings.js";
import { aiStatus, MODELS } from "../../../lib/ai.js";
// POST /api/admin/ai {} → สถานะ AI วันนี้ | {test:true} → ทดสอบความเร็วแต่ละรุ่น
export async function onRequestPost({ request, env }) {
  const denied = await checkAuth(request, env);
  if (denied) return denied;
  let b = {}; try { b = await request.json(); } catch (e) {}
  if (b.test && env.AI) {
    const out = [];
    for (const m of (b.models || MODELS)) {
      const t = Date.now();
      try {
        const r = await env.AI.run(m, { messages: [{ role: "system", content: "ตอบเป็น JSON อย่างเดียว" }, { role: "user", content: 'แปลง "กระบะดีเซล ไม่เกิน 6 แสน" เป็น {"body":"","fuel":"","maxPrice":0}' }], max_tokens: 80, temperature: 0 });
        out.push({ model: m, ms: Date.now() - t, out: String(r && (r.response ?? r.choices?.[0]?.message?.content) ?? JSON.stringify(r)).slice(0, 200) });
      } catch (e) { out.push({ model: m, ms: Date.now() - t, error: String(e && e.message || e).slice(0, 200) }); }
    }
    return json({ ok: true, data: out }, 200, { "cache-control": "no-store" });
  }
  return json({ ok: true, data: await aiStatus(env) }, 200, { "cache-control": "no-store" });
}
