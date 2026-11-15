// สร้างอัตโนมัติจาก src/car-art.js โดย build.py — อย่าแก้ไฟล์นี้ตรง ๆ
export const COLORS = { "ขาว": "#eef1f4", "ดำ": "#23272e", "เทา": "#7d8792", "เงิน": "#c3c9cf", "แดง": "#b8232f", "น้ำเงิน": "#24477f", "น้ำตาล": "#6e4f36" };
export const COLOR_SLUG = { "ขาว": "white", "ดำ": "black", "เทา": "gray", "เงิน": "silver", "แดง": "red", "น้ำเงิน": "blue", "น้ำตาล": "brown" };
/*CAR-ART-START*/
const CAR_COLORS={"ขาว":"#eef1f4","ดำ":"#23272e","เทา":"#7d8792","เงิน":"#c3c9cf","แดง":"#b8232f","น้ำเงิน":"#24477f","น้ำตาล":"#6e4f36"};
const CAR_SHAPES={
  sedan:{bl:61,b:"M14 88 Q14 76 26 72 L80 62 Q98 42 128 38 L182 38 Q206 40 226 60 L262 66 Q284 70 286 86 L286 94 Q286 100 280 100 L20 100 Q14 100 14 94Z",
    w:"M90 61 Q106 45 130 43 L152 43 L152 61Z M158 43 L182 43 Q200 45 216 61 L158 61Z",wh:[72,228],rf:[96,38,210],door:[154,104,206]},
  hatch:{bl:59,b:"M18 88 Q18 76 30 72 L86 60 Q104 36 138 32 L206 33 Q228 36 248 60 L266 70 Q280 76 280 90 L280 95 Q280 100 274 100 L24 100 Q18 100 18 94Z",
    w:"M96 59 Q112 40 140 37 L160 37 L160 59Z M166 37 L204 38 Q222 41 238 59 L166 59Z",wh:[74,224],rf:[104,32,236],door:[163,110,220]},
  suv:{bl:54,b:"M14 88 Q14 66 30 62 L74 54 Q92 28 124 25 L232 24 Q254 26 266 50 L278 60 Q288 66 288 82 L288 96 Q288 102 280 102 L22 102 Q14 102 14 96Z",
    w:"M84 54 Q100 31 126 29 L162 29 L162 54Z M168 29 L230 29 Q248 31 258 52 L168 54Z",wh:[74,232],rf:[92,25,262],door:[165,106,226]},
  pickup:{bl:54,b:"M12 88 Q12 66 28 62 L72 54 Q88 30 114 27 L170 27 Q182 27 184 38 L186 60 L280 60 Q290 60 290 70 L290 96 Q290 102 282 102 L20 102 Q12 102 12 96Z",
    w:"M80 54 Q94 33 116 31 L142 31 L142 54Z M148 31 L170 31 Q177 31 178 39 L179 54 L148 54Z",wh:[70,240],rf:[90,27,182],door:[145,100,182]},
  van:{bl:53,b:"M16 92 L18 52 Q20 30 42 24 L252 22 Q274 22 280 44 L286 74 Q290 84 290 96 Q290 102 282 102 L24 102 Q16 102 16 96Z",
    w:"M34 52 Q36 33 54 31 L102 31 L102 53 L34 53Z M110 31 L162 31 L162 53 L110 53Z M170 31 L240 30 Q258 31 266 51 L170 53Z",wh:[68,236],rf:[40,22,270],door:[106,166,230]},
};
function carArt(body,color,label,uid){
  const s=CAR_SHAPES[body]||CAR_SHAPES.sedan,col=CAR_COLORS[color]||"#8a939d",u="c"+String(uid==null?Math.random().toString(36).slice(2,7):uid).replace(/\W/g,"");
  const light=color==="ขาว"||color==="เงิน";
  const hl=light?"#ffffff":"rgba(255,255,255,.55)",sh=light?"rgba(0,0,0,.28)":"rgba(0,0,0,.45)";
  const [w1,w2]=s.wh,[rx0,ry,rx1]=s.rf,[d1,d2,d3]=s.door,base=body==="suv"||body==="pickup"||body==="van"?102:100,wy=base,wr=body==="sedan"||body==="hatch"?17:19;
  const wheel=x=>`<g><circle cx="${x}" cy="${wy}" r="${wr+4}" fill="#14161a"/><circle cx="${x}" cy="${wy}" r="${wr}" fill="url(#${u}t)"/><circle cx="${x}" cy="${wy}" r="${wr*.62}" fill="url(#${u}r)" stroke="#5c636c" stroke-width=".8"/>${[0,72,144,216,288].map(a=>`<rect x="${x-1.6}" y="${wy-wr*.6}" width="3.2" height="${wr*.48}" rx="1.4" fill="#d9dee3" stroke="#7b838c" stroke-width=".4" transform="rotate(${a} ${x} ${wy})"/>`).join("")}<circle cx="${x}" cy="${wy}" r="${wr*.17}" fill="#3a4047"/><circle cx="${x-1}" cy="${wy-1}" r="${wr*.06}" fill="#c9cfd5"/></g>`;
  return `<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label||""}"><defs>
<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity="1"/><stop offset=".08" stop-color="${hl}" stop-opacity="${light?.9:.35}"/><stop offset=".22" stop-color="${col}"/><stop offset=".62" stop-color="${col}"/><stop offset=".64" stop-color="${sh}" stop-opacity=".9"/><stop offset=".7" stop-color="${col}"/><stop offset="1" stop-color="${col}"/></linearGradient>
<linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${light?.22:.38}"/></linearGradient>
<linearGradient id="${u}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe0ee"/><stop offset=".35" stop-color="#6f8aa3"/><stop offset=".36" stop-color="#2c3d4f"/><stop offset="1" stop-color="#1a2531"/></linearGradient>
<radialGradient id="${u}t" cx=".5" cy=".5" r=".5"><stop offset=".62" stop-color="#2a2e34"/><stop offset=".9" stop-color="#1b1e22"/><stop offset="1" stop-color="#0f1113"/></radialGradient>
<radialGradient id="${u}r" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".6" stop-color="#a9b1b9"/><stop offset="1" stop-color="#6c747d"/></radialGradient>
<radialGradient id="${u}s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<clipPath id="${u}c"><path d="${s.b}"/></clipPath></defs>
<ellipse cx="150" cy="${base+9}" rx="142" ry="9" fill="url(#${u}s)"/>
<path d="${s.b}" fill="url(#${u}b)"/>
<g clip-path="url(#${u}c)"><rect x="0" y="${base-26}" width="300" height="30" fill="url(#${u}d)"/><rect x="0" y="${base-7}" width="300" height="8" fill="#1c1f24" opacity=".55"/><path d="M${rx0+20} ${ry+6} Q150 ${ry-2} ${rx1+30} ${ry+16} L${rx1+30} ${ry+22} Q150 ${ry+8} ${rx0+20} ${ry+14}Z" fill="#fff" opacity="${light?.0:.07}"/><path d="M${rx0} ${ry+1.5} L${rx1} ${ry+1.5}" stroke="#fff" stroke-opacity="${light?.9:.3}" stroke-width="2"/>
<circle cx="${w1}" cy="${wy}" r="${wr+7}" fill="#0d0f12" opacity=".85"/><circle cx="${w2}" cy="${wy}" r="${wr+7}" fill="#0d0f12" opacity=".85"/></g>
<path d="${s.b}" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="1.2"/>
<path d="${s.w}" fill="url(#${u}g)" stroke="#11161c" stroke-width="1.6" stroke-linejoin="round"/>
<path d="M${d1} ${s.bl} L${d1} ${base-12} M${d2} ${s.bl+1} L${d2-2} ${base-12} M${d3} ${s.bl+1} L${d3} ${base-14}" stroke="rgba(0,0,0,.3)" stroke-width="1"/>
<rect x="${d1-16}" y="${s.bl+8}" width="10" height="2.6" rx="1.3" fill="rgba(0,0,0,.35)"/><rect x="${d3-16}" y="${s.bl+8}" width="10" height="2.6" rx="1.3" fill="rgba(0,0,0,.35)"/>
<path d="M${rx1-6} ${ry+28} q8 -1 10 5 l-10 1z" fill="${col}" stroke="rgba(0,0,0,.45)" stroke-width=".8"/>
<path d="M${body==="van"?279:276} ${base-30} q9 1 10 9 l-10 0z" fill="#fff6d8" stroke="rgba(0,0,0,.35)" stroke-width=".8"/>
<rect x="${body==="van"?16:14}" y="${base-30}" width="7" height="9" rx="2" fill="#c8202c" stroke="rgba(0,0,0,.35)" stroke-width=".6"/>
${wheel(w1)}${wheel(w2)}</svg>`;
}

export function carSVG(body, color, label) { return carArt(body, color, label, "hero"); }
