#!/usr/bin/env python3
"""
สร้างเว็บ "ขับต่อ" เป็นไฟล์ HTML พร้อมขึ้นโฮสต์ (โฟลเดอร์ dist/)

วิธีใช้:  แก้ค่าในส่วน CONFIG ด้านล่าง แล้วรัน  python3 build.py
"""
import json, re, html, shutil, datetime
import markdown  # pip install markdown
from pathlib import Path
from tools import build_tools

# ============================== CONFIG ==============================
CONFIG = {
    "SITE_NAME": "ขับต่อ",
    # โดเมนจริงของคุณ ไม่มี / ท้าย เช่น https://www.khaptor.com
    "DOMAIN": "https://khaptor.com",
    # Google Analytics 4 Measurement ID เช่น G-AB12CD34EF  (ว่างไว้ = ยังไม่เปิด)
    "GA4_ID": "G-BQV73C8MX1",
    # Google AdSense: แนะนำให้ตั้งในหน้าแอดมิน khaptor.com/admin.html แทน (ใส่ตรงนี้เฉพาะถ้าไม่ใช้แอดมิน)
    "ADSENSE_CLIENT": "",
    # รหัสหน่วยโฆษณา (ad unit / data-ad-slot) จาก AdSense แต่ละตำแหน่ง ว่างไว้ = ใช้ Auto ads อย่างเดียว
    "ADSENSE_SLOTS": {"leaderboard": "", "sidebar": "", "infeed": "", "article": ""},
    # กรอบ "พื้นที่โฆษณา" ตอนดูไฟล์ในเครื่อง (บนเว็บจริงตั้งได้ในหน้าแอดมิน)
    "SHOW_AD_PLACEHOLDERS": True,
    # Google Search Console: ค่า content ของ meta tag ยืนยัน (ถ้ายืนยันผ่าน DNS ไม่ต้องใส่)
    "GSC_VERIFICATION": "",
    "CONTACT_EMAIL": "hello@khaptor.com",
    "CONTACT_PHONE": "02-000-0000",
}
# ====================================================================

ROOT = Path(__file__).parent
SRC, DIST, ARTICLES = ROOT / "src", ROOT / "dist", ROOT / "content" / "articles"
TODAY = datetime.date.today()
C = CONFIG
D = C["DOMAIN"].rstrip("/")
E = html.escape
import hashlib
ASSET_V = hashlib.md5(b"".join((Path(__file__).parent / "src" / n).read_bytes() for n in ("style.css", "site.js", "app.js", "tools.js"))).hexdigest()[:8]

# ---------- data (read from app.js so there is one source of truth) ----------
app_js = (SRC / "app.js").read_text(encoding="utf-8")
RAW = json.loads(re.search(r"const RAW=(\[.*?\n\]);", app_js, re.S).group(1))
KEYS = "brand model sub year price km body gear fuel color prov seller cert days plate".split()
CARS = [dict(zip(KEYS, r), id=i + 1) for i, r in enumerate(RAW)]

BODY = {"sedan": "เก๋ง", "hatch": "แฮทช์แบ็ก", "suv": "SUV / PPV", "pickup": "กระบะ", "van": "รถตู้"}
BODY_SCHEMA = {"sedan": "Sedan", "hatch": "Hatchback", "suv": "SUV", "pickup": "Pickup truck", "van": "Van"}
FUEL_SCHEMA = {"เบนซิน": "Gasoline", "ดีเซล": "Diesel", "ไฮบริด": "Hybrid", "ไฟฟ้า": "Electric"}
COLORS = {"ขาว": "#eef1f4", "ดำ": "#22262c", "เทา": "#8a939d", "เงิน": "#c3c9cf", "แดง": "#c0303a", "น้ำเงิน": "#2b4f8f", "น้ำตาล": "#7a5a3e"}
PROV_SLUG = {"กรุงเทพมหานคร": "bangkok", "นนทบุรี": "nonthaburi", "ปทุมธานี": "pathum-thani", "สมุทรปราการ": "samut-prakan",
             "ชลบุรี": "chonburi", "เชียงใหม่": "chiang-mai", "ขอนแก่น": "khon-kaen", "นครราชสีมา": "nakhon-ratchasima",
             "ภูเก็ต": "phuket", "สงขลา": "songkhla"}


def slugify(s): return re.sub(r"[^a-z0-9]+", "-", str(s).lower()).strip("-")
def car_slug(c): return slugify(f"{c['year']}-{c['brand']}-{c['model']}-{c['id']}")
def brand_slug(b): return slugify(b)
def fmt(n): return f"{round(n):,}"
def monthly(price, down=15, rate=3.49, months=72):
    fin = price * (1 - down / 100)
    return (fin + fin * rate / 100 * months / 12) / months * 1.07
def car_name(c): return f"{c['year']} {c['brand']} {c['model']}"
def listed_date(c): return TODAY - datetime.timedelta(days=c["days"])


# ---------- car illustration (same drawing as app.js) ----------
P = {
 "sedan": "M18 92 L30 72 Q34 66 44 64 L86 58 Q100 40 126 38 L184 38 Q206 40 222 58 L262 64 Q280 68 284 84 L284 96 Q284 100 278 100 L22 100 Q16 100 18 92Z",
 "hatch": "M22 92 L32 72 Q36 64 48 62 L90 56 Q108 34 140 32 L210 34 Q232 38 250 60 L266 70 Q276 76 276 90 L276 98 Q276 100 270 100 L26 100 Q18 100 22 92Z",
 "suv": "M18 90 L24 66 Q28 58 40 56 L78 52 Q96 26 124 24 L232 24 Q252 26 262 48 L276 58 Q284 64 284 80 L284 96 Q284 102 276 102 L24 102 Q16 102 18 90Z",
 "pickup": "M16 90 L22 66 Q26 58 38 56 L76 52 Q92 28 116 26 L170 26 Q180 26 182 36 L184 58 L278 58 Q286 58 286 66 L286 96 Q286 102 278 102 L22 102 Q14 102 16 90Z",
 "van": "M20 94 L22 50 Q24 30 44 24 L250 22 Q272 22 278 44 L284 76 Q286 84 286 96 Q286 102 278 102 L26 102 Q18 102 20 94Z"}
W = {
 "sedan": "M92 60 Q106 44 128 43 L150 43 L150 60Z M156 43 L182 43 Q200 45 214 60 L156 60Z",
 "hatch": "M96 58 Q112 38 140 37 L160 37 L160 58Z M166 37 L208 38 Q226 42 240 60 L166 58Z",
 "suv": "M84 52 Q100 30 126 29 L160 29 L160 52Z M166 29 L228 29 Q244 31 254 50 L166 52Z",
 "pickup": "M82 52 Q96 32 118 31 L144 31 L144 52Z M150 31 L172 31 Q176 31 177 38 L178 52 L150 52Z",
 "van": "M36 50 Q38 32 54 30 L100 30 L100 52 L36 52Z M108 30 L160 30 L160 52 L108 52Z M168 30 L240 29 Q258 30 264 50 L168 52Z"}


def car_svg(c, attrs='viewBox="0 0 300 130"'):
    col = COLORS.get(c["color"], "#999")
    glass = "#9fb7cc" if c["color"] in ("ดำ", "น้ำเงิน", "น้ำตาล", "แดง") else "#3d5266"
    wheels = "".join(f'<circle cx="{x}" cy="100" r="17" fill="#1c1f24"/><circle cx="{x}" cy="100" r="8" fill="#b9c0c8"/><circle cx="{x}" cy="100" r="2.5" fill="#1c1f24"/>' for x in (70, 230))
    return (f'<svg {attrs} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ภาพประกอบ {E(c["brand"])} {E(c["model"])} สี{c["color"]}">'
            f'<ellipse cx="150" cy="112" rx="132" ry="7" fill="rgba(0,0,0,.18)"/>'
            f'<path d="{P[c["body"]]}" fill="{col}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>'
            f'<path d="{W[c["body"]]}" fill="{glass}" opacity=".9"/>'
            f'<path d="M30 82 L270 82" stroke="rgba(0,0,0,.12)" stroke-width="2"/>'
            f'<rect x="270" y="72" width="12" height="6" rx="2" fill="#ffd27a"/><rect x="18" y="74" width="8" height="6" rx="2" fill="#d9454f"/>'
            f'{wheels}</svg>')


def pic_bg(c): return f"hsl({(c['id']*37) % 360} 22% 91%)"


def static_card(c, base):
    tags = "".join([
        '<span class="tag cert">ผ่านการตรวจสภาพ</span>' if c["cert"] else "",
        '<span class="tag ev">EV</span>' if c["fuel"] == "ไฟฟ้า" else ""])
    return f'''<article class="card" data-id="{c["id"]}" data-demo>
  <div class="pic" style="background:{pic_bg(c)}">{car_svg(c)}<div class="tags">{tags}</div></div>
  <div class="cbody">
    <h3><a class="cardlink" href="{base}cars/{car_slug(c)}.html">{E(car_name(c))}</a></h3>
    <div class="sub">{E(c["sub"])}</div>
    <div class="specs"><span>{fmt(c["km"])} กม.</span><span>{c["gear"]}</span><span>{c["fuel"]}</span><span>{c["prov"]}</span></div>
    <div class="pricerow"><div><div class="price">฿{fmt(c["price"])}</div><div class="monthly">ผ่อนประมาณ ฿{fmt(monthly(c["price"]))}/เดือน</div></div>
      <div class="plate">{E(c["plate"])}<small>{c["prov"]}</small></div></div>
    <div class="seller">{"เต็นท์รถ" if c["seller"] == "dealer" else "เจ้าของขายเอง"}</div>
  </div>
</article>'''


# ---------- shared page parts ----------
def jsonld(obj): return f'<script type="application/ld+json"{" data-demo" if obj.get("@type") in ("ItemList", "Car") else ""}>{json.dumps(obj, ensure_ascii=False)}</script>'


def head(title, desc, path, base, ld=(), og_image="og/site.jpg", noindex=False, og_type="website"):
    url = f"{D}/{path}".replace("/index.html", "/")
    ga = C["GA4_ID"].strip()
    ads = C["ADSENSE_CLIENT"].strip()
    parts = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        f"<title>{E(title)}</title>",
        f'<meta name="description" content="{E(desc)}">',
        f'<meta name="robots" content="{"noindex, follow" if noindex else "index, follow, max-image-preview:large"}">',
        f'<link rel="canonical" href="{url}">',
        f'<link rel="alternate" hreflang="th" href="{url}">',
        f'<meta property="og:type" content="{og_type}">',
        f'<meta property="og:site_name" content="{E(C["SITE_NAME"])}">',
        '<meta property="og:locale" content="th_TH">',
        f'<meta property="og:title" content="{E(title)}">',
        f'<meta property="og:description" content="{E(desc)}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{D}/{og_image}">',
        '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="theme-color" content="#0b1222">',
        f'<link rel="icon" href="{base}favicon.svg" type="image/svg+xml">',
        f'<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">',
        '<link rel="manifest" href="/manifest.webmanifest">',
        '<meta name="mobile-web-app-capable" content="yes">',
        '<meta name="apple-mobile-web-app-capable" content="yes">',
        '<meta name="apple-mobile-web-app-status-bar-style" content="default">',
        f'<meta name="apple-mobile-web-app-title" content="{E(C["SITE_NAME"])}">',
    ]
    if C["GSC_VERIFICATION"].strip():
        parts.append(f'<meta name="google-site-verification" content="{E(C["GSC_VERIFICATION"].strip())}">')
    if ads:
        parts.append(f'<meta name="google-adsense-account" content="{E(ads)}">')
    # Consent Mode v2: everything denied until the visitor accepts (PDPA)
    parts.append("""<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('kt-consent')==='all')gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'})}catch(e){}
gtag('js',new Date());""" + (f"gtag('config','{ga}');" if ga else "") + "</script>")
    if ga:
        parts.append(f'<script async src="https://www.googletagmanager.com/gtag/js?id={E(ga)}"></script>')
    if ads:
        parts.append(f'<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={E(ads)}" crossorigin="anonymous"></script>')
    cfg = {"ga4": ga, "adsense": ads, "slots": C["ADSENSE_SLOTS"], "placeholders": bool(C["SHOW_AD_PLACEHOLDERS"]) and not ads, "privacy": base + "privacy.html"}
    parts.append(f"<script>window.KT_CONFIG={json.dumps(cfg)}</script>")
    parts += ['<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
              '<link href="https://fonts.googleapis.com/css2?family=Anuphan:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&display=swap" rel="stylesheet">',
              f'<link rel="stylesheet" href="{base}assets/style.css?v={ASSET_V}">']
    parts += [jsonld(x) for x in ld]
    return "<!DOCTYPE html>\n<html lang=\"th\">\n<head>\n" + "\n".join(parts) + "\n</head>\n"


LOGO = '<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" rx="10" fill="#ff5a36"/><circle cx="17" cy="17" r="9" fill="none" stroke="#fff" stroke-width="3"/><circle cx="17" cy="17" r="2.6" fill="#fff"/><path d="M17 8v6M17 20v6M8 17h6M20 17h6" stroke="#fff" stroke-width="2"/></svg>'


def header(base, is_index=False):
    home = "" if is_index else f"{base}index.html"
    fav = ('<button class="btn btn-ghost" id="favBtn" type="button">รถที่ถูกใจ <span id="favCount">0</span></button>' if is_index
           else f'<a class="btn btn-ghost" href="{base}index.html#buy">ดูรถทั้งหมด</a>')
    return f'''<header class="top">
  <div class="wrap">
    <a class="logo" href="{base}index.html" aria-label="{C["SITE_NAME"]} หน้าแรก">{LOGO}<span>{C["SITE_NAME"]}<small>ตลาดรถมือสองทั่วไทย</small></span></a>
    <nav class="main" aria-label="เมนูหลัก">
      <a href="{home}#buy">ซื้อรถ</a><a href="{home}#sell">ขายรถ</a><a href="{home}#dealers">ดีลเลอร์</a><a href="{base}tools/index.html">เครื่องมือฟรี</a><a href="{base}articles/index.html">บทความ</a>
    </nav>
    <div class="top-actions"><button class="btn btn-ghost install-btn" type="button" data-install hidden>ติดตั้งแอป</button>{fav}<a class="btn btn-amber" href="{home}#sell">ลงขายรถฟรี</a></div>
  </div>
</header>'''


BRANDS = sorted({c["brand"] for c in CARS})
PROVS = [p for p in PROV_SLUG if any(c["prov"] == p for c in CARS)]


def footer(base):
    brand_links = "".join(f'<li><a href="{base}brand/{brand_slug(b)}.html">รถมือสอง {b}</a></li>' for b in BRANDS[:8])
    prov_links = "".join(f'<li><a href="{base}province/{PROV_SLUG[p]}.html">รถมือสอง{p}</a></li>' for p in PROVS[:8])
    return f'''<footer>
  <div class="wrap">
    <div class="cols">
      <div><h4>{C["SITE_NAME"]}</h4><p style="margin:0;max-width:34ch">ตลาดซื้อขายรถมือสองสำหรับผู้ซื้อ เจ้าของรถ และเต็นท์รถทั่วประเทศไทย</p>
        <ul style="margin-top:10px"><li><a href="{base}articles/index.html">บทความรถมือสอง</a></li><li><a href="{base}tools/index.html">เครื่องมือฟรี</a></li><li><a href="{base}tools/car-tax.html">คำนวณภาษีรถยนต์</a></li><li><a href="{base}tools/contract.html">สัญญาซื้อขายรถยนต์</a></li><li><a href="{base}about.html">เกี่ยวกับเรา / ติดต่อ</a></li><li><a href="{base}privacy.html">นโยบายความเป็นส่วนตัว</a></li><li><a href="#" data-consent-open>ตั้งค่าคุกกี้</a></li><li><a href="#" data-install-help>ติดตั้งแอปขับต่อ</a></li></ul></div>
      <div data-demo><h4>ตามยี่ห้อ</h4><ul>{brand_links}</ul></div>
      <div data-demo><h4>ตามจังหวัด</h4><ul>{prov_links}</ul></div>
      <div><h4>ติดต่อ</h4><ul><li data-site="phone">{E(C["CONTACT_PHONE"])}</li><li data-site="email">{E(C["CONTACT_EMAIL"])}</li></ul></div>
    </div>
    <nav class="partner-links" id="kt-links" aria-label="เว็บไซต์พันธมิตร" hidden></nav>
    <div class="copy">© {TODAY.year} {C["SITE_NAME"]} · ข้อมูลรถในเว็บตัวอย่างนี้เป็นข้อมูลสมมติ</div>
  </div>
</footer>'''


def page(path, title, desc, body, base, ld=(), og_image="og/site.jpg", noindex=False, scripts=(), is_index=False, og_type="website"):
    out = head(title, desc, path, base, ld, og_image, noindex, og_type)
    out += f'<body data-base="{base}">\n' + header(base, is_index) + "\n" + body + "\n" + footer(base) + "\n"
    out += f'<script src="{base}assets/site.js?v={ASSET_V}"></script>\n'
    out += "".join(f'<script src="{base}{s}?v={ASSET_V}"></script>\n' for s in scripts)
    out += "</body>\n</html>\n"
    f = DIST / path
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(out, encoding="utf-8")


def crumbs(items, base):
    """items: list of (name, path or None). Returns (html, jsonld)"""
    lis, ld = [], []
    for i, (n, p) in enumerate(items, 1):
        lis.append(f'<li><a href="{base}{p}">{E(n)}</a></li>' if p else f'<li aria-current="page">{E(n)}</li>')
        ld.append({"@type": "ListItem", "position": i, "name": n, **({"item": f"{D}/{p}".replace('/index.html', '/')} if p else {})})
    return (f'<nav class="crumbs" aria-label="เส้นทาง"><ol>{"".join(lis)}</ol></nav>',
            {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": ld})


def item_list(cars, name):
    return {"@context": "https://schema.org", "@type": "ItemList", "name": name, "numberOfItems": len(cars),
            "itemListElement": [{"@type": "ListItem", "position": i, "url": f"{D}/cars/{car_slug(c)}.html", "name": car_name(c)} for i, c in enumerate(cars, 1)]}


def share_bar(url, title):
    from urllib.parse import quote
    u, t = quote(url, safe=""), quote(title, safe="")
    return f'''<div class="share" data-share-url="{E(url)}" data-share-title="{E(title)}">
  <span class="share-label">แชร์</span>
  <button type="button" class="sh sh-native" data-share="native" hidden>แชร์</button>
  <a class="sh sh-line" data-share="line" href="https://social-plugins.line.me/lineit/share?url={u}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ LINE">LINE</a>
  <a class="sh sh-fb" data-share="facebook" href="https://www.facebook.com/sharer/sharer.php?u={u}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ Facebook">Facebook</a>
  <a class="sh sh-x" data-share="x" href="https://twitter.com/intent/tweet?url={u}&amp;text={t}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ X">X</a>
  <button type="button" class="sh sh-copy" data-share="copy">คัดลอกลิงก์</button>
</div>'''


def ad(slot): return f'<div class="ad-slot ad-{slot}" data-ad="{slot}"></div>'


ORG = {"@context": "https://schema.org", "@type": "Organization", "name": C["SITE_NAME"], "url": D + "/",
       "logo": f"{D}/og/icon-512.png", "email": C["CONTACT_EMAIL"], "telephone": C["CONTACT_PHONE"]}

FAQ = [
    ("ซื้อรถมือสองต้องเตรียมเอกสารอะไรบ้าง",
     "ผู้ซื้อใช้บัตรประชาชนและสำเนาทะเบียนบ้าน หากซื้อเงินสดให้ตรวจเล่มทะเบียนตัวจริงว่าชื่อผู้ขายตรงกับบัตรประชาชน ถ้าขอสินเชื่อ ไฟแนนซ์มักขอสลิปเงินเดือนหรือ statement ย้อนหลัง 3 ถึง 6 เดือนเพิ่ม"),
    ("ควรตรวจอะไรก่อนตัดสินใจซื้อรถมือสอง",
     "ดูเลขตัวถังและเลขเครื่องให้ตรงกับเล่มทะเบียน ตรวจประวัติการเข้าศูนย์ ร่องรอยการชนหรือน้ำท่วม ลองขับเพื่อฟังเสียงช่วงล่างและดูการเปลี่ยนเกียร์ ถ้าไม่มั่นใจให้พาช่างหรือใช้บริการตรวจสภาพก่อนจ่ายเงิน"),
    ("ค่างวดรถมือสองคิดอย่างไร",
     "ไฟแนนซ์ในไทยส่วนใหญ่คิดดอกเบี้ยแบบคงที่ (flat rate) คือนำยอดจัดคูณอัตราดอกเบี้ยต่อปีคูณจำนวนปี บวกกับยอดจัด แล้วหารด้วยจำนวนงวด ค่างวดที่แจ้งมักรวม VAT 7% แล้ว อัตราจริงขึ้นกับอายุรถและเครดิตของผู้กู้"),
    ("รถเต็นท์กับรถเจ้าของขายเองต่างกันอย่างไร",
     "เต็นท์รถมักช่วยเดินเรื่องไฟแนนซ์และโอนกรรมสิทธิ์ และบางแห่งมีรับประกันเครื่องยนต์ เกียร์ ส่วนรถเจ้าของขายเองมักได้ราคาดีกว่าและถามประวัติการใช้งานได้ละเอียด แต่ผู้ซื้อต้องเดินเรื่องโอนที่ขนส่งเอง"),
]


# ---------- articles ----------
TH_MONTHS = "ม.ค. ก.พ. มี.ค. เม.ย. พ.ค. มิ.ย. ก.ค. ส.ค. ก.ย. ต.ค. พ.ย. ธ.ค.".split()
def th_date(d): return f"{d.day} {TH_MONTHS[d.month-1]} {d.year + 543}"


def load_articles():
    """content/articles/*.md  front matter: title, description, date (YYYY-MM-DD), slug, category, tags.
    บทความที่ date ยังไม่ถึงจะยังไม่ถูกเผยแพร่ (ตั้งเวลาล่วงหน้าได้)"""
    posts = []
    for f in sorted(ARTICLES.glob("*.md")):
        raw = f.read_text(encoding="utf-8")
        m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
        if not m:
            print("skip (no front matter):", f.name); continue
        meta = {}
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1); meta[k.strip()] = v.strip().strip('"')
        try:
            d = datetime.date.fromisoformat(meta["date"])
        except Exception:
            print("skip (bad date):", f.name); continue
        if d > TODAY:
            continue
        body_md = m.group(2)
        posts.append({
            "title": meta["title"], "description": meta.get("description", ""), "date": d,
            "slug": slugify(meta.get("slug") or f.stem), "category": meta.get("category", "คู่มือรถมือสอง"),
            "tags": [t.strip().lower() for t in meta.get("tags", "").split(",") if t.strip()],
            "html": markdown.markdown(body_md, extensions=["tables", "sane_lists"]),
            "words": len(body_md),
        })
    return sorted(posts, key=lambda p: p["date"], reverse=True)


def post_card(p, base):
    return (f'<article class="post"><span class="kicker">{E(p["category"])}</span>'
            f'<h3><a href="{base}articles/{p["slug"]}.html">{E(p["title"])}</a></h3>'
            f'<p>{E(p["description"])}</p><time datetime="{p["date"].isoformat()}">{th_date(p["date"])}</time></article>')


# ---------- installable app (PWA) ----------
def write_pwa():
    manifest = {
        "id": "/",
        "name": f"{C['SITE_NAME']} ตลาดรถมือสอง",
        "short_name": C["SITE_NAME"],
        "description": "ซื้อขายรถมือสองทั่วไทย เทียบราคา ดูสเปก คำนวณค่างวด และลงขายรถฟรี",
        "lang": "th", "dir": "ltr",
        "start_url": "/?source=app", "scope": "/",
        "display": "standalone", "display_override": ["window-controls-overlay", "standalone"],
        "orientation": "any",
        "background_color": "#f4f5f7", "theme_color": "#ffffff",
        "categories": ["shopping", "lifestyle", "auto"],
        "icons": [
            {"src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": "/icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
        "screenshots": [
            {"src": "/icons/screen-wide.png", "sizes": "1440x900", "type": "image/png", "form_factor": "wide", "label": "หน้าแรก ขับต่อ บนคอมพิวเตอร์"},
            {"src": "/icons/screen-narrow.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow", "label": "หน้าแรก ขับต่อ บนมือถือ"},
        ],
        "shortcuts": [
            {"name": "ลงขายรถฟรี", "url": "/?source=app#sell", "icons": [{"src": "/icons/icon-192.png", "sizes": "192x192"}]},
            {"name": "คำนวณค่างวด", "url": "/?source=app#loan", "icons": [{"src": "/icons/icon-192.png", "sizes": "192x192"}]},
            {"name": "บทความ", "url": "/articles/index.html", "icons": [{"src": "/icons/icon-192.png", "sizes": "192x192"}]},
        ],
    }
    (DIST / "manifest.webmanifest").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    version = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    (DIST / "sw.js").write_text((SRC / "sw.js").read_text(encoding="utf-8").replace("__VERSION__", version), encoding="utf-8")
    (DIST / "_headers").write_text(
        "/sw.js\n  Cache-Control: no-cache\n  Service-Worker-Allowed: /\n"
        "/manifest.webmanifest\n  Content-Type: application/manifest+json\n  Cache-Control: public, max-age=3600\n"
        "/icons/*\n  Cache-Control: public, max-age=604800\n"
        "/assets/*\n  Cache-Control: public, max-age=3600, must-revalidate\n", encoding="utf-8")


# ---------- build ----------
def build():
    if DIST.exists():
        shutil.rmtree(DIST)
    (DIST / "assets").mkdir(parents=True)
    shutil.copy(SRC / "style.css", DIST / "assets/style.css")
    shutil.copy(SRC / "site.js", DIST / "assets/site.js")
    shutil.copy(SRC / "app.js", DIST / "assets/app.js")
    shutil.copy(SRC / "tools.js", DIST / "assets/tools.js")
    (DIST / "assets/cars.json").write_text(json.dumps([{k: c[k] for k in ("brand", "model", "sub", "year", "price", "km")} | {"url": f"/cars/{car_slug(c)}.html"} for c in CARS], ensure_ascii=False), encoding="utf-8")
    shutil.copy(SRC / "admin.html", DIST / "admin.html")
    if (SRC / "og").exists():
        shutil.copytree(SRC / "og", DIST / "og")
    shutil.copytree(SRC / "icons", DIST / "icons")
    POSTS = load_articles()
    write_pwa()
    (DIST / "favicon.svg").write_text(LOGO.replace('aria-hidden="true"', 'xmlns="http://www.w3.org/2000/svg"'), encoding="utf-8")

    # ---- index ----
    body = (SRC / "index_body.html").read_text(encoding="utf-8")
    body = body[body.index('<div class="hero"'):]
    body = body[:body.index("<footer>")] + body[body.index("</footer>") + 9:]
    body = body.replace("<h1>หารถมือสองคันถัดไปของคุณ</h1>", "<h1>ตลาดซื้อขายรถมือสองทั่วไทย</h1>")
    body = body.replace('aria-label="ยี่ห้อยอดนิยม"></div></div>', 'aria-label="ยี่ห้อยอดนิยม"></div></div>\n<div class="wrap">' + ad("leaderboard") + "</div>")
    body = body.replace("    </aside>", "      " + ad("sidebar") + "\n    </aside>")
    newest = sorted(CARS, key=lambda c: c["days"])
    body = body.replace('<div class="grid" id="grid"></div>', '<div class="grid" id="grid">' + "".join(static_card(c, "") for c in newest) + "</div>")
    links = f'''<section class="band" id="browse" data-demo>
  <div class="wrap">
    <h2>ดูรถมือสองตามยี่ห้อและจังหวัด</h2>
    <p class="lead">รวมประกาศขายรถแยกตามยี่ห้อและพื้นที่ เลือกดูเฉพาะที่สนใจได้เลย</p>
    <div class="linkcols">
      <div><h3>ตามยี่ห้อ</h3><ul class="linklist">{"".join(f'<li><a href="brand/{brand_slug(b)}.html">รถมือสอง {b}</a> <span>{sum(c["brand"] == b for c in CARS)}</span></li>' for b in BRANDS)}</ul></div>
      <div><h3>ตามจังหวัด</h3><ul class="linklist">{"".join(f'<li><a href="province/{PROV_SLUG[p]}.html">รถมือสอง{p}</a> <span>{sum(c["prov"] == p for c in CARS)}</span></li>' for p in PROVS)}</ul></div>
    </div>
  </div>
</section>'''
    guide = f'''<section class="band" id="guide">
  <div class="wrap guide-grid">
   <div class="prose">
    <h2>คู่มือซื้อรถมือสองให้คุ้ม</h2>
    <p>ตั้งงบจากค่างวดที่จ่ายไหวต่อเดือนก่อนราคารถ แล้วเผื่อค่าประกันภัย ค่าต่อภาษี และค่าซ่อมบำรุงปีแรกไว้ราว 5 ถึง 10% ของราคารถ ใช้ตัวคำนวณค่างวดด้านบนเทียบระยะผ่อน 48, 60 และ 72 งวด จะเห็นว่าผ่อนนานขึ้นค่างวดต่ำลงแต่ดอกเบี้ยรวมสูงขึ้น</p>
    <p>รถกระบะและ PPV อย่าง Hilux Revo, D-Max และ Fortuner ราคาขายต่อดีในตลาดไทย ส่วนเก๋งเล็กอย่าง City, Yaris Ativ และ Almera ประหยัดน้ำมันและค่าบำรุงรักษาต่ำ เหมาะกับใช้ในเมือง ถ้าสนใจรถไฟฟ้ามือสอง ให้ถามสุขภาพแบตเตอรี่ (State of Health) และเงื่อนไขรับประกันแบตเตอรี่ที่เหลือ</p>
   </div>
   <div class="faq">
    <h2>คำถามที่พบบ่อย</h2>
    {"".join(f'<details><summary>{E(q)}</summary><p>{E(a)}</p></details>' for q, a in FAQ)}
   </div>
  </div>
</section>'''
    latest = (f'<section class="band" id="articles"><div class="wrap"><h2>บทความล่าสุด</h2><p class="lead">เคล็ดลับซื้อขายรถมือสอง สินเชื่อ และการดูแลรถ</p>'
              f'<div class="posts">{"".join(post_card(p, "") for p in POSTS[:4])}</div>'
              f'<p style="margin-top:14px"><a class="btn btn-line" href="articles/index.html">ดูบทความทั้งหมด</a></p></div></section>') if POSTS else ""
    body = body.replace('<section class="band" id="sell">', links + "\n" + latest + "\n" + guide + '\n<section class="band" id="sell">')
    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}
    site_ld = {"@context": "https://schema.org", "@type": "WebSite", "name": C["SITE_NAME"], "url": D + "/", "inLanguage": "th-TH"}
    page("index.html", f"{C['SITE_NAME']} | ซื้อขายรถมือสอง รถบ้าน เต็นท์รถ ทั่วไทย",
         f"ตลาดรถมือสองทั่วไทย {len(CARS)} คัน รถเก๋ง กระบะ SUV จากเต็นท์รถและเจ้าของขายเอง เทียบราคา ดูสเปก คำนวณค่างวด และลงขายรถฟรี",
         body, "", ld=[site_ld, ORG, item_list(newest, "รถมือสองลงประกาศล่าสุด"), faq_ld], scripts=["assets/app.js"], is_index=True)

    # ---- car pages ----
    for c in CARS:
        base = "../"
        name = car_name(c)
        m = monthly(c["price"])
        title = f"{name} {c['sub']} มือสอง ราคา {fmt(c['price'])} บาท | {C['SITE_NAME']}"
        desc = (f"ขาย {name} {c['sub']} สี{c['color']} ไมล์ {fmt(c['km'])} กม. เกียร์{c['gear']} {c['fuel']} "
                f"ที่{c['prov']} ราคา {fmt(c['price'])} บาท ผ่อนประมาณ {fmt(m)} บาท/เดือน")
        bc_html, bc_ld = crumbs([("หน้าแรก", "index.html"), (f"รถมือสอง {c['brand']}", f"brand/{brand_slug(c['brand'])}.html"), (f"{name} {c['sub']}", None)], base)
        related = [x for x in CARS if x["id"] != c["id"] and (x["brand"] == c["brand"] or x["body"] == c["body"])][:4]
        seller = "เต็นท์รถ" if c["seller"] == "dealer" else "เจ้าของขายเอง"
        car_ld = {
            "@context": "https://schema.org", "@type": "Car", "name": f"{name} {c['sub']}",
            "url": f"{D}/cars/{car_slug(c)}.html", "image": f"{D}/og/car-{c['id']}.jpg",
            "description": desc, "brand": {"@type": "Brand", "name": c["brand"]}, "model": c["model"],
            "vehicleConfiguration": c["sub"], "vehicleModelDate": str(c["year"]), "productionDate": str(c["year"]),
            "bodyType": BODY_SCHEMA[c["body"]], "color": c["color"], "fuelType": FUEL_SCHEMA[c["fuel"]],
            "vehicleTransmission": "AutomaticTransmission" if c["gear"] == "อัตโนมัติ" else "ManualTransmission",
            "mileageFromOdometer": {"@type": "QuantitativeValue", "value": c["km"], "unitCode": "KMT"},
            "itemCondition": "https://schema.org/UsedCondition", "sku": f"KT-{c['id']:05d}",
            "offers": {"@type": "Offer", "price": c["price"], "priceCurrency": "THB", "availability": "https://schema.org/InStock",
                       "url": f"{D}/cars/{car_slug(c)}.html", "itemCondition": "https://schema.org/UsedCondition",
                       "availableAtOrFrom": {"@type": "Place", "address": {"@type": "PostalAddress", "addressRegion": c["prov"], "addressCountry": "TH"}}}}
        body = f'''<main class="wrap carpage">
  {bc_html}
  <div class="car-top">
    <div class="pic car-hero" style="background:{pic_bg(c)}">{car_svg(c)}</div>
    <div class="car-info">
      <div class="sub" style="color:var(--muted);font-size:13px">{seller} · {c["prov"]} · ลงประกาศ {listed_date(c).strftime("%d/%m/%Y")}</div>
      <h1>{E(name)} <span>{E(c["sub"])}</span></h1>
      <div style="display:flex;align-items:end;justify-content:space-between;gap:10px">
        <div><div class="price" style="font-size:30px">฿{fmt(c["price"])}</div><div class="monthly">ดาวน์ 15% ผ่อน 72 งวด ประมาณ ฿{fmt(m)}/เดือน</div></div>
        <div class="plate" style="font-size:13px">{E(c["plate"])}<small>{c["prov"]}</small></div>
      </div>
      <div class="contact">
        <button class="btn btn-amber" type="button" data-call="{c["id"]}" data-price="{c["price"]}">ดูเบอร์ผู้ขาย</button>
        <a class="btn btn-line" href="../index.html#loan">คำนวณค่างวดแบบละเอียด</a>
      </div>
      <div data-phone></div>
      {share_bar(f"{D}/cars/{car_slug(c)}.html", f"{name} {c['sub']} ราคา {fmt(c['price'])} บาท")}
    </div>
  </div>
  <div class="car-cols">
    <div>
      <h2>สเปกและรายละเอียด</h2>
      <div class="spec-table">
        <div><span>ปีจดทะเบียน</span><b>{c["year"]}</b></div><div><span>เลขไมล์</span><b>{fmt(c["km"])} กม.</b></div>
        <div><span>ประเภท</span><b>{BODY[c["body"]]}</b></div><div><span>เกียร์</span><b>{c["gear"]}</b></div>
        <div><span>เชื้อเพลิง</span><b>{c["fuel"]}</b></div><div><span>สี</span><b>{c["color"]}</b></div>
        <div><span>ตรวจสภาพ</span><b>{"ผ่าน 175 จุด" if c["cert"] else "ยังไม่ตรวจ"}</b></div><div><span>รหัสประกาศ</span><b>KT-{c["id"]:05d}</b></div>
      </div>
      <div class="prose" style="margin-top:16px">
        <p>{E(name)} รุ่น {E(c["sub"])} สี{c["color"]} ใช้งานมา {fmt(c["km"])} กิโลเมตร เกียร์{c["gear"]} เครื่องยนต์{c["fuel"]} รถจอดอยู่ที่{c["prov"]} ขายโดย{seller}{" รถผ่านการตรวจสภาพ 175 จุดแล้ว" if c["cert"] else ""}</p>
        <p>ก่อนนัดดูรถ แนะนำให้ขอดูเล่มทะเบียนตัวจริง เทียบเลขตัวถังและเลขเครื่องกับตัวรถ และขอประวัติการเข้าศูนย์ แจ้งรหัสประกาศ KT-{c["id"]:05d} เมื่อติดต่อผู้ขาย</p>
      </div>
    </div>
    <aside>{ad("article")}</aside>
  </div>
  <section class="related">
    <h2>รถที่คล้ายกัน</h2>
    <div class="grid">{"".join(static_card(x, base) for x in related)}</div>
  </section>
</main>'''
        page(f"cars/{car_slug(c)}.html", title, desc, body, base, ld=[car_ld, bc_ld], og_image=f"og/car-{c['id']}.jpg", og_type="product")

    # ---- brand & province pages ----
    def listing_page(path, h1, intro, cars, title, desc, crumb_name):
        base = "../"
        bc_html, bc_ld = crumbs([("หน้าแรก", "index.html"), (crumb_name, None)], base)
        prices = [c["price"] for c in cars]
        body = f'''<main class="wrap listpage">
  {bc_html}
  <h1>{E(h1)}</h1>
  <p class="lead">{E(intro)} ราคาตั้งแต่ ฿{fmt(min(prices))} ถึง ฿{fmt(max(prices))}</p>
  {ad("leaderboard")}
  <div class="grid">{"".join(static_card(c, base) for c in sorted(cars, key=lambda c: c["days"]))}</div>
</main>'''
        page(path, title, desc, body, base, ld=[item_list(cars, h1), bc_ld])

    for b in BRANDS:
        cars = [c for c in CARS if c["brand"] == b]
        models = sorted({c["model"] for c in cars})
        listing_page(f"brand/{brand_slug(b)}.html", f"รถมือสอง {b} ({len(cars)} คัน)",
                     f"รวมประกาศขาย {b} มือสอง รุ่น {', '.join(models)} จากเต็นท์รถและเจ้าของขายเองทั่วไทย",
                     cars, f"รถมือสอง {b} ราคาถูก {len(cars)} คัน ทั่วไทย | {C['SITE_NAME']}",
                     f"ซื้อ {b} มือสอง รุ่น {', '.join(models)} ราคาเริ่มต้น {fmt(min(c['price'] for c in cars))} บาท ดูสเปก เลขไมล์ และคำนวณค่างวดได้ทันที",
                     f"รถมือสอง {b}")
    for p in PROVS:
        cars = [c for c in CARS if c["prov"] == p]
        listing_page(f"province/{PROV_SLUG[p]}.html", f"รถมือสอง{p} ({len(cars)} คัน)",
                     f"ประกาศขายรถมือสองใน{p} ทั้งรถเต็นท์และรถบ้าน",
                     cars, f"รถมือสอง{p} เต็นท์รถและรถบ้าน {len(cars)} คัน | {C['SITE_NAME']}",
                     f"รวมรถมือสองขายใน{p} {len(cars)} คัน ราคาเริ่มต้น {fmt(min(c['price'] for c in cars))} บาท ทั้งเก๋ง กระบะ และ SUV",
                     f"รถมือสอง{p}")

    # ---- articles ----
    for p in POSTS:
        base = "../"
        url = f"{D}/articles/{p['slug']}.html"
        bc_html, bc_ld = crumbs([("หน้าแรก", "index.html"), ("บทความ", "articles/index.html"), (p["title"], None)], base)
        content = p["html"].replace("<table>", '<div class="tablewrap"><table>').replace("</table>", "</table></div>")
        paras = [m.end() for m in re.finditer(r"</p>", content)]
        if len(paras) >= 3:
            content = content[:paras[1]] + ad("article") + content[paras[1]:]
        tagset = set(p["tags"])
        cars = [c for c in CARS if brand_slug(c["brand"]) in tagset or c["body"] in tagset or slugify(c["model"]) in tagset]
        cars = (cars or sorted(CARS, key=lambda c: c["days"]))[:4]
        more = [x for x in POSTS if x["slug"] != p["slug"]][:3]
        art_ld = {"@context": "https://schema.org", "@type": "BlogPosting", "headline": p["title"], "description": p["description"],
                  "datePublished": p["date"].isoformat(), "dateModified": p["date"].isoformat(), "inLanguage": "th-TH",
                  "mainEntityOfPage": url, "image": f"{D}/og/site.jpg",
                  "author": {"@type": "Organization", "name": f"ทีมงาน{C['SITE_NAME']}", "url": D + "/about.html"},
                  "publisher": {"@type": "Organization", "name": C["SITE_NAME"], "logo": {"@type": "ImageObject", "url": f"{D}/og/icon-512.png"}}}
        body = f"""<main class="wrap page">
  {bc_html}
  <div class="article-layout">
  <article class="article">
    <span class="kicker" style="font-size:13px;font-weight:600;color:var(--road)">{E(p["category"])}</span>
    <h1>{E(p["title"])}</h1>
    <div class="meta">โดยทีมงาน{C["SITE_NAME"]} · <time datetime="{p["date"].isoformat()}">{th_date(p["date"])}</time> · อ่านประมาณ {max(2, round(p["words"] / 900))} นาที</div>
    <div class="prose">{content}</div>
    {share_bar(url, p["title"])}
  </article>
  <aside class="article-side">
    <section data-demo><h2>รถที่เกี่ยวข้อง</h2><div class="grid side-grid">{"".join(static_card(c, base) for c in cars)}</div></section>
    {f'<section><h2>บทความอื่น</h2><div class="posts side-posts">{"".join(post_card(x, base) for x in more)}</div></section>' if more else ""}
    {ad("sidebar")}
  </aside>
  </div>
</main>"""
        page(f"articles/{p['slug']}.html", f"{p['title']} | {C['SITE_NAME']}", p["description"], body, base, ld=[art_ld, bc_ld], og_type="article")
    if POSTS:
        bc_html, bc_ld = crumbs([("หน้าแรก", "index.html"), ("บทความ", None)], "../")
        page("articles/index.html", f"บทความรถมือสอง เคล็ดลับซื้อขายและสินเชื่อ | {C['SITE_NAME']}",
             "รวมบทความแนะนำการซื้อรถมือสอง ตรวจสภาพรถ สินเชื่อรถยนต์ และการขายรถให้ได้ราคา อัปเดตทุกสัปดาห์",
             f'<main class="wrap page">{bc_html}<h1>บทความรถมือสอง</h1><p class="lead">เคล็ดลับซื้อขายรถ สินเชื่อ และการดูแลรถ อัปเดตทุกจันทร์ พุธ ศุกร์</p>'
             f'<div class="posts">{"".join(post_card(p, "../") for p in POSTS)}</div></main>',
             "../", ld=[bc_ld])

    # ---- free tools ----
    tool_urls = build_tools(page, crumbs, ad, share_bar, E, C, D, TODAY.year)

    # ---- template for user listing pages (filled by functions/l/[id].js) ----
    page("l/_template.html", "%%TITLE%%", "%%DESC%%", "%%MAIN%%", "../", og_image="%%OGIMG%%", og_type="product")

    # ---- about, privacy, 404 ----
    base = ""
    page("about.html", f"เกี่ยวกับเรา และติดต่อ {C['SITE_NAME']}", f"{C['SITE_NAME']} ตลาดซื้อขายรถมือสองออนไลน์ ติดต่อทีมงานได้ทางโทรศัพท์และอีเมล",
         f'''<main class="wrap prose page"><h1>เกี่ยวกับ{C["SITE_NAME"]}</h1>
<p>{C["SITE_NAME"]} เป็นตลาดออนไลน์สำหรับซื้อขายรถมือสองในประเทศไทย ผู้ซื้อค้นหาและเปรียบเทียบรถจากเต็นท์รถและเจ้าของขายเองได้ฟรี ส่วนเจ้าของรถลงประกาศขายได้โดยไม่มีค่าใช้จ่าย</p>
<p>เราไม่ได้เป็นผู้ขายรถเอง การซื้อขายเกิดขึ้นโดยตรงระหว่างผู้ซื้อกับผู้ขาย ก่อนโอนเงินทุกครั้ง โปรดตรวจเอกสารและตัวรถด้วยตัวเอง</p>
<h2>ติดต่อเรา</h2><p>โทร <span data-site="phone">{E(C["CONTACT_PHONE"])}</span><br>อีเมล <span data-site="email">{E(C["CONTACT_EMAIL"])}</span><br>เวลาทำการ จันทร์ถึงเสาร์ 9:00 ถึง 18:00 น.</p>
<h2>แจ้งประกาศไม่เหมาะสม</h2><p>หากพบประกาศที่น่าสงสัยว่าเป็นการหลอกลวง แจ้งรหัสประกาศมาทางอีเมล ทีมงานจะตรวจสอบภายใน 1 วันทำการ</p></main>''',
         base, ld=[ORG])
    page("privacy.html", f"นโยบายความเป็นส่วนตัวและคุกกี้ | {C['SITE_NAME']}", f"นโยบายความเป็นส่วนตัวของ {C['SITE_NAME']} ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA) และการใช้คุกกี้",
         f'''<main class="wrap prose page"><h1>นโยบายความเป็นส่วนตัวและคุกกี้</h1>
<p>ปรับปรุงล่าสุด {TODAY.strftime("%d/%m/%Y")}</p>
<h2>ข้อมูลที่เราเก็บ</h2><p>การลงประกาศต้องล็อกอินด้วยบัญชี Google เราได้รับชื่อ อีเมล และรหัสบัญชีจาก Google เพื่อยืนยันตัวตนและป้องกันประกาศหลอกลวง อีเมลไม่แสดงในประกาศ เมื่อคุณลงประกาศ เราเก็บชื่อ เบอร์โทรศัพท์ และรายละเอียดรถที่คุณกรอก และแสดงชื่อกับเบอร์โทรในประกาศเมื่อคุณยินยอม ประกาศขึ้นเว็บทันที ทีมงานอาจซ่อนหรือลบประกาศที่ผิดกฎหรือน่าสงสัยว่าหลอกลวง และคุณลบประกาศของตัวเองได้ทุกเมื่อ เราเก็บข้อมูลการใช้งานเว็บไซต์ เช่น หน้าที่เข้าชมและประเภทอุปกรณ์ ผ่านคุกกี้เมื่อคุณยินยอมเท่านั้น</p>
<h2>คุกกี้ที่ใช้</h2>
<p><b>คุกกี้ที่จำเป็น</b> ใช้จดจำการตั้งค่าคุกกี้ รายการรถที่คุณบันทึกไว้ และสถานะการล็อกอิน (คุกกี้ kt_session อายุ 30 วัน)</p>
<p><b>คุกกี้วิเคราะห์ (Google Analytics)</b> ช่วยให้เรารู้ว่าผู้ใช้ค้นหาและดูรถแบบไหน เพื่อปรับปรุงเว็บไซต์ ข้อมูลถูกประมวลผลโดย Google</p>
<p><b>คุกกี้โฆษณา (Google AdSense)</b> ผู้ให้บริการบุคคลที่สามรวมถึง Google ใช้คุกกี้เพื่อแสดงโฆษณาตามการเข้าชมเว็บไซต์นี้และเว็บไซต์อื่นของคุณ คุณปิดโฆษณาที่ปรับตามความสนใจได้ที่ <a href="https://adssettings.google.com">การตั้งค่าโฆษณาของ Google</a> และอ่านวิธีที่ Google ใช้ข้อมูลได้ที่ <a href="https://policies.google.com/technologies/partner-sites">policies.google.com/technologies/partner-sites</a></p>
<p>คุณเปลี่ยนการยินยอมได้ทุกเมื่อที่ <a href="#" data-consent-open>ตั้งค่าคุกกี้</a></p>
<h2>สิทธิของคุณ</h2><p>คุณขอเข้าถึง แก้ไข ลบ หรือคัดค้านการประมวลผลข้อมูลส่วนบุคคลของคุณได้ โดยติดต่อ {E(C["CONTACT_EMAIL"])} เราจะตอบกลับภายใน 30 วัน</p>
<h2>ระยะเวลาเก็บข้อมูล</h2><p>ข้อมูลประกาศขายรถเก็บไว้จนกว่าคุณจะลบประกาศ หรือไม่เกิน 1 ปีหลังประกาศหมดอายุ</p></main>''',
         base)
    page("offline.html", f"ออฟไลน์ | {C['SITE_NAME']}", "ไม่มีการเชื่อมต่ออินเทอร์เน็ต",
         '<main class="wrap prose page"><h1>ตอนนี้ไม่มีอินเทอร์เน็ต</h1><p>ตรวจการเชื่อมต่อแล้วกดลองใหม่ หน้าที่คุณเคยเปิดแล้วยังเปิดดูได้แบบออฟไลน์</p><p><button class="btn btn-amber" type="button" onclick="location.reload()">ลองใหม่</button></p></main>',
         "/", noindex=True)
    page("404.html", f"ไม่พบหน้านี้ | {C['SITE_NAME']}", "ไม่พบหน้าที่คุณต้องการ",
         '<main class="wrap prose page"><h1>ไม่พบหน้านี้</h1><p>ประกาศนี้อาจขายไปแล้วหรือถูกลบ ลองค้นหารถคันอื่นที่ <a href="/index.html#buy">หน้ารวมรถมือสอง</a></p></main>',
         "/", noindex=True)

    # ---- sitemap, robots, ads.txt ----
    urls = [(D + "/", TODAY, "daily", "1.0"), (f"{D}/about.html", TODAY, "yearly", "0.3"), (f"{D}/privacy.html", TODAY, "yearly", "0.2")]
    urls += [(f"{D}/brand/{brand_slug(b)}.html", TODAY, "daily", "0.8") for b in BRANDS]
    urls += [(f"{D}/province/{PROV_SLUG[p]}.html", TODAY, "daily", "0.8") for p in PROVS]
    if POSTS:
        urls.append((f"{D}/articles/index.html", POSTS[0]["date"], "daily", "0.7"))
        urls += [(f"{D}/articles/{p['slug']}.html", p["date"], "monthly", "0.7") for p in POSTS]
    urls += [(u, TODAY, "monthly", "0.8") for u in tool_urls]
    urls += [(f"{D}/cars/{car_slug(c)}.html", listed_date(c), "weekly", "0.6") for c in CARS]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    sm += [f"  <url><loc>{u}</loc><lastmod>{d.isoformat()}</lastmod><changefreq>{f}</changefreq><priority>{p}</priority></url>" for u, d, f, p in urls]
    sm.append("</urlset>")
    (DIST / "sitemap.xml").write_text("\n".join(sm) + "\n", encoding="utf-8")
    (DIST / "robots.txt").write_text(f"User-agent: *\nAllow: /\nDisallow: /404.html\nDisallow: /admin.html\nDisallow: /api/\nDisallow: /l/_template.html\nDisallow: /offline.html\n\nSitemap: {D}/sitemap.xml\nSitemap: {D}/sitemap-listings.xml\n", encoding="utf-8")
    pub = C["ADSENSE_CLIENT"].replace("ca-", "").strip()
    (DIST / "ads.txt").write_text((f"google.com, {pub}, DIRECT, f08c47fec0942fa0\n" if pub else
                                   "# ใส่ ADSENSE_CLIENT ใน build.py แล้วรันใหม่ ไฟล์นี้จะมีบรรทัดของ Google ให้อัตโนมัติ\n"), encoding="utf-8")
    print(f"built {len(urls)} indexable pages ({len(POSTS)} articles) -> {DIST}")


if __name__ == "__main__":
    build()
