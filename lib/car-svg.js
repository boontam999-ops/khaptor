// ภาพรถแบบเวกเตอร์ (เหมือนใน src/app.js) ใช้เรนเดอร์หน้าประกาศฝั่ง Cloudflare
export const COLORS = { "ขาว": "#eef1f4", "ดำ": "#22262c", "เทา": "#8a939d", "เงิน": "#c3c9cf", "แดง": "#c0303a", "น้ำเงิน": "#2b4f8f", "น้ำตาล": "#7a5a3e" };
export const COLOR_SLUG = { "ขาว": "white", "ดำ": "black", "เทา": "gray", "เงิน": "silver", "แดง": "red", "น้ำเงิน": "blue", "น้ำตาล": "brown" };
const P = {
  sedan: "M18 92 L30 72 Q34 66 44 64 L86 58 Q100 40 126 38 L184 38 Q206 40 222 58 L262 64 Q280 68 284 84 L284 96 Q284 100 278 100 L22 100 Q16 100 18 92Z",
  hatch: "M22 92 L32 72 Q36 64 48 62 L90 56 Q108 34 140 32 L210 34 Q232 38 250 60 L266 70 Q276 76 276 90 L276 98 Q276 100 270 100 L26 100 Q18 100 22 92Z",
  suv: "M18 90 L24 66 Q28 58 40 56 L78 52 Q96 26 124 24 L232 24 Q252 26 262 48 L276 58 Q284 64 284 80 L284 96 Q284 102 276 102 L24 102 Q16 102 18 90Z",
  pickup: "M16 90 L22 66 Q26 58 38 56 L76 52 Q92 28 116 26 L170 26 Q180 26 182 36 L184 58 L278 58 Q286 58 286 66 L286 96 Q286 102 278 102 L22 102 Q14 102 16 90Z",
  van: "M20 94 L22 50 Q24 30 44 24 L250 22 Q272 22 278 44 L284 76 Q286 84 286 96 Q286 102 278 102 L26 102 Q18 102 20 94Z",
};
const W = {
  sedan: "M92 60 Q106 44 128 43 L150 43 L150 60Z M156 43 L182 43 Q200 45 214 60 L156 60Z",
  hatch: "M96 58 Q112 38 140 37 L160 37 L160 58Z M166 37 L208 38 Q226 42 240 60 L166 58Z",
  suv: "M84 52 Q100 30 126 29 L160 29 L160 52Z M166 29 L228 29 Q244 31 254 50 L166 52Z",
  pickup: "M82 52 Q96 32 118 31 L144 31 L144 52Z M150 31 L172 31 Q176 31 177 38 L178 52 L150 52Z",
  van: "M36 50 Q38 32 54 30 L100 30 L100 52 L36 52Z M108 30 L160 30 L160 52 L108 52Z M168 30 L240 29 Q258 30 264 50 L168 52Z",
};
export function carSVG(body, color, label) {
  const col = COLORS[color] || "#999";
  const glass = ["ดำ", "น้ำเงิน", "น้ำตาล", "แดง"].includes(color) ? "#9fb7cc" : "#3d5266";
  const b = P[body] ? body : "sedan";
  const wheels = [70, 230].map(x => `<circle cx="${x}" cy="100" r="17" fill="#1c1f24"/><circle cx="${x}" cy="100" r="8" fill="#b9c0c8"/><circle cx="${x}" cy="100" r="2.5" fill="#1c1f24"/>`).join("");
  return `<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><ellipse cx="150" cy="112" rx="132" ry="7" fill="rgba(0,0,0,.18)"/><path d="${P[b]}" fill="${col}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><path d="${W[b]}" fill="${glass}" opacity=".9"/><path d="M30 82 L270 82" stroke="rgba(0,0,0,.12)" stroke-width="2"/><rect x="270" y="72" width="12" height="6" rx="2" fill="#ffd27a"/><rect x="18" y="74" width="8" height="6" rx="2" fill="#d9454f"/>${wheels}</svg>`;
}
