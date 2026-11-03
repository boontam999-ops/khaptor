import { getSettings, publicView, json, checkAuth, validate, KEY, clearCache } from "../../lib/settings.js";

// GET /api/settings  ค่าสาธารณะ (ใช้ดีบัก)
export async function onRequestGet({ env }) {
  return json(publicView(await getSettings(env)), 200, { "cache-control": "public, max-age=30" });
}

// POST /api/settings  {action:"login"} หรือ {action:"save", settings:{...}}  ต้องมี header X-Admin-Password
export async function onRequestPost({ request, env }) {
  const denied = await checkAuth(request, env);
  if (denied) return denied;
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ใช่ JSON" }, 400); }
  const kv = !!env.SETTINGS;

  if (body.action === "login") {
    return json({ ok: true, kv, settings: await getSettings(env, { fresh: true }) }, 200, { "cache-control": "no-store" });
  }
  if (body.action === "save") {
    if (!kv) return json({ ok: false, error: "ยังไม่ได้ผูก KV ชื่อ SETTINGS กับโปรเจกต์ใน Cloudflare จึงบันทึกไม่ได้" }, 503);
    const r = validate(body.settings);
    if (!r.ok) return json(r, 400);
    await env.SETTINGS.put(KEY, JSON.stringify(r.value));
    clearCache();
    return json({ ok: true, kv, settings: r.value }, 200, { "cache-control": "no-store" });
  }
  return json({ ok: false, error: "action ไม่รู้จัก" }, 400);
}
