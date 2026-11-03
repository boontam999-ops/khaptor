import { getSettings } from "../lib/settings.js";

// ads.txt สร้างจากรหัส AdSense ที่ตั้งในหน้าแอดมิน ถ้ายังไม่ตั้งจะใช้ไฟล์ ads.txt ปกติ
export async function onRequestGet({ env, next }) {
  const s = await getSettings(env);
  if (!s.adsense_client) return next();
  const pub = s.adsense_client.replace(/^ca-/, "");
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}
