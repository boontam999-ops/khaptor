import { readSession } from "../../lib/auth.js";
import { listMine } from "../../lib/listings.js";
import { json } from "../../lib/settings.js";

// GET /api/me  ผู้ใช้ที่ล็อกอินอยู่ และประกาศของเขา
export async function onRequestGet({ request, env }) {
  const h = { "cache-control": "no-store" };
  const user = await readSession(request, env);
  if (!user) return json({ ok: true, user: null }, 200, h);
  const listings = (await listMine(env, user.sub)).map(({ owner, ...l }) => l);
  return json({ ok: true, user, listings }, 200, h);
}
