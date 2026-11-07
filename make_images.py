#!/usr/bin/env python3
"""สร้างรูปแชร์ (Open Graph 1200x630) และไอคอน ลงใน src/og/  ใช้ Playwright:  pip install playwright && playwright install chromium"""
import build as B
from playwright.sync_api import sync_playwright

OUT = B.SRC / "og"
OUT.mkdir(exist_ok=True)
FONT = '<link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@600;700&family=IBM+Plex+Sans+Thai:wght@500&display=swap" rel="stylesheet">'
BASE_CSS = "*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;font-family:'Bai Jamjuree',Loma,sans-serif;background:radial-gradient(700px 300px at 90% -10%,rgba(255,90,54,.55),transparent 60%),radial-gradient(600px 360px at 0% 120%,rgba(64,120,255,.45),transparent 60%),linear-gradient(160deg,#121b30,#0b1222);color:#fff;display:flex;padding:56px;gap:40px;align-items:center}"


def shot(page, html, path, w=1200, h=630):
    page.set_viewport_size({"width": w, "height": h})
    page.set_content(html, wait_until="networkidle")
    page.screenshot(path=str(path), **({"type": "jpeg", "quality": 85} if str(path).endswith(".jpg") else {}))


with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    logo = B.LOGO.replace('width="34" height="34"', 'width="{s}" height="{s}"')
    shot(pg, f"""<html><head>{FONT}<style>{BASE_CSS}h1{{font-size:76px;line-height:1.15}}p{{font-size:34px;opacity:.85;margin-top:16px;font-family:'IBM Plex Sans Thai',Loma,sans-serif}}</style></head>
<body><div>{logo.format(s=110)}<h1 style="margin-top:28px">{B.C['SITE_NAME']}<br>ตลาดรถมือสองทั่วไทย</h1><p>เทียบราคา ดูสเปก คำนวณค่างวด ลงขายรถฟรี</p></div></body></html>""", OUT / "site.jpg")
    for size in (180, 512):
        shot(pg, f"<html><body style='margin:0'>{logo.format(s=size)}</body></html>", OUT / f"icon-{size}.png", size, size)
    for c in B.CARS:
        shot(pg, f"""<html><head>{FONT}<style>{BASE_CSS}
.pic{{flex:1.2;height:100%;border-radius:24px;background:{B.pic_bg(c)};display:grid;place-items:center}}.pic svg{{width:92%}}
.t{{flex:1}}h1{{font-size:54px;line-height:1.15}}.s{{font-size:28px;opacity:.8;font-family:'IBM Plex Sans Thai',Loma,sans-serif;margin:8px 0 24px}}
.pr{{font-size:64px;color:#ff7a59}}.m{{font-size:26px;opacity:.85;font-family:'IBM Plex Sans Thai',Loma,sans-serif}}.br{{margin-top:30px;font-size:26px;display:flex;gap:12px;align-items:center}}</style></head>
<body><div class="pic">{B.car_svg(c)}</div><div class="t"><h1>{B.E(B.car_name(c))}</h1><div class="s">{B.E(c['sub'])} · {B.fmt(c['km'])} กม. · {c['prov']}</div>
<div class="pr">฿{B.fmt(c['price'])}</div><div class="m">ผ่อนประมาณ ฿{B.fmt(B.monthly(c['price']))}/เดือน</div><div class="br">{logo.format(s=40)} {B.C['SITE_NAME']}</div></div></body></html>""",
             OUT / f"car-{c['id']}.jpg")
    COLOR_SLUG = {"ขาว": "white", "ดำ": "black", "เทา": "gray", "เงิน": "silver", "แดง": "red", "น้ำเงิน": "blue", "น้ำตาล": "brown"}
    for body in ["sedan", "hatch", "suv", "pickup", "van"]:
        for color, cs in COLOR_SLUG.items():
            c = {"id": 7, "body": body, "color": color, "brand": "", "model": ""}
            shot(pg, f"""<html><head>{FONT}<style>{BASE_CSS}
.pic{{flex:1.3;height:100%;border-radius:24px;background:#eef1f5;display:grid;place-items:center}}.pic svg{{width:92%}}
.t{{flex:.8}}h1{{font-size:52px;line-height:1.15}}p{{font-size:28px;opacity:.85;font-family:'IBM Plex Sans Thai',Loma,sans-serif;margin-top:14px}}</style></head>
<body><div class="pic">{B.car_svg(c)}</div><div class="t">{logo.format(s=90)}<h1 style="margin-top:22px">{B.C['SITE_NAME']}</h1><p>ประกาศขายรถมือสอง<br>จากเจ้าของโดยตรง</p></div></body></html>""",
                 OUT / f"gen-{body}-{cs}.jpg")
    b.close()
print("images ->", OUT)
