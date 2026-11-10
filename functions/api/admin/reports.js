import { checkAuth, json } from "../../../lib/settings.js";
import { getReports, saveReports, REASONS } from "../../../lib/reports.js";
import { getListing } from "../../../lib/listings.js";

// POST /api/admin/reports  {action:"list"} | {action:"resolve"|"reopen"|"delete", id}
export async function onRequestPost({ request, env }) {
  const denied = await checkAuth(request, env);
  if (denied) return denied;
  if (!env.SETTINGS) return json({ ok: false, error: "ยังไม่ได้ผูก KV" }, 503);
  let b;
  try { b = await request.json(); } catch (e) { return json({ ok: false, error: "ข้อมูลไม่ถูกต้อง" }, 400); }
  const list = await getReports(env);
  if (b.action === "list") {
    const ids = [...new Set(list.map(r => r.listing_id))];
    const ls = Object.fromEntries((await Promise.all(ids.map(id => getListing(env, id)))).filter(Boolean).map(l => [l.id, l]));
    return json({ ok: true, reasons: REASONS, reports: list.map(r => { const l = ls[r.listing_id]; return { ...r, listing: l ? { id: l.id, title: `${l.year} ${l.brand} ${l.model} ${l.sub || ""}`.trim(), status: l.status, sold: !!l.sold, owner: l.owner && l.owner.email, owner_sub: l.owner && l.owner.sub } : null }; }) }, 200, { "cache-control": "no-store" });
  }
  const i = list.findIndex(r => r.id === b.id);
  if (i < 0) return json({ ok: false, error: "ไม่พบรายงาน" }, 404);
  if (b.action === "resolve") list[i].status = "done";
  else if (b.action === "reopen") list[i].status = "open";
  else if (b.action === "delete") list.splice(i, 1);
  else return json({ ok: false, error: "action ไม่รู้จัก" }, 400);
  await saveReports(env, list);
  return json({ ok: true });
}
