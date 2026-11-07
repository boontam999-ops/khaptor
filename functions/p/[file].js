// GET /p/<id>.jpg (รูปเต็ม)  /p/<id>-t.jpg (รูปย่อ)
export async function onRequestGet({ env, params }) {
  const m = String(params.file || "").match(/^([a-z0-9]{10})(-t)?\.jpg$/);
  if (!m || !env.SETTINGS) return new Response("Not found", { status: 404 });
  const buf = await env.SETTINGS.get("photo:" + m[1] + (m[2] ? ":t" : ""), "arrayBuffer");
  if (!buf) return new Response("Not found", { status: 404, headers: { "cache-control": "public, max-age=60" } });
  return new Response(buf, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
}
