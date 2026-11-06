# เว็บ ขับต่อ: คู่มือขึ้นเว็บ ทำ SEO และหารายได้

## ในชุดนี้มีอะไร
| ไฟล์/โฟลเดอร์ | ใช้ทำอะไร |
|---|---|
| `dist/` | **เว็บที่สร้างเสร็จแล้ว** อัปโหลดโฟลเดอร์นี้ขึ้นโฮสต์ได้เลย |
| `build.py` | ตัวสร้างเว็บ แก้ค่าในส่วน `CONFIG` แล้วรัน `python3 build.py` |
| `content/articles/` | บทความ (ไฟล์ .md) ใส่วันที่ล่วงหน้าได้ ระบบจะเผยแพร่เมื่อถึงวัน |
| `AUTO_ARTICLES.md` | คู่มือสำหรับงานเขียนบทความอัตโนมัติ จันทร์ พุธ ศุกร์ |
| `src/` | โค้ดต้นฉบับ (CSS, JS, เทมเพลต, รูปแชร์, หน้าแอดมิน) |
| `functions/`, `lib/` | โค้ดฝั่ง Cloudflare สำหรับหน้าแอดมินและการตั้งค่าโฆษณา |
| `make_images.py` | สร้างรูปแชร์ Facebook/LINE ใหม่ เมื่อมีรถเพิ่ม |

## สิ่งที่ทำ SEO ไว้แล้ว
- หน้าแยกสำหรับรถทุกคัน ทุกยี่ห้อ ทุกจังหวัด และบทความ (ตอนนี้ 53 หน้า)
- title และ meta description ภาษาไทยที่มีคีย์เวิร์ด เช่น "รถมือสอง Toyota" และ "รถมือสองเชียงใหม่"
- Structured data (JSON-LD): Car + Offer, BreadcrumbList, ItemList, FAQPage, BlogPosting และ Organization
- canonical, Open Graph และรูปแชร์ 1200x630 ของรถแต่ละคัน (แชร์ลง Facebook หรือ LINE แล้วขึ้นรูปสวย)
- sitemap.xml, robots.txt, หน้า 404 และลิงก์ภายในระหว่างรถ ยี่ห้อ จังหวัด และบทความ
- การ์ดรถเขียนเป็น HTML จริงตั้งแต่โหลดหน้า Google จึงอ่านได้แม้ไม่รัน JavaScript

## ขั้นตอนขึ้นเว็บจริง
1. **ซื้อโดเมน** เช่น .com หรือ .co.th
2. **แก้ `CONFIG` ใน build.py** ใส่ `DOMAIN` แล้วรัน `python3 build.py`
3. **โฮสต์ฟรี:** สร้างโปรเจกต์ใน Cloudflare Pages หรือ Netlify แล้วเชื่อมกับ GitHub repo ของเว็บนี้
   - Build command: `pip install markdown && python3 build.py`
   - Output directory: `dist`
   - ทุกครั้งที่มีบทความใหม่ถูก push ขึ้น GitHub เว็บจะอัปเดตเอง
4. ผูกโดเมนในหน้าตั้งค่าของ Cloudflare Pages หรือ Netlify

## Google Search Console
1. เข้า search.google.com/search-console แล้วเพิ่ม property แบบ **Domain** และยืนยันผ่าน DNS (แนะนำ)
   ถ้าเลือกแบบ URL prefix ให้คัดลอกค่า content ของ meta tag ไปใส่ `GSC_VERIFICATION` แล้ว build ใหม่
2. ไปที่เมนู Sitemaps แล้วส่ง `sitemap.xml`
3. ใช้ URL Inspection ขอ index หน้าแรกและหน้ายี่ห้อหลักๆ

## Google Analytics 4
1. สร้าง property ใน analytics.google.com แล้วคัดลอก Measurement ID (`G-...`) ไปใส่ `GA4_ID`
2. Event ที่ส่งให้อัตโนมัติ: `search`, `filter`, `view_item`, `generate_lead` (กดดูเบอร์ผู้ขาย), `add_to_wishlist`, `use_loan_calculator`, `submit_listing`
3. ใน GA4 ให้ตั้ง `generate_lead` และ `submit_listing` เป็น Key event เพื่อวัดผล

## หน้าแอดมินโฆษณา (khaptor.com/admin.html)
เปิดปิดโฆษณาทั้งเว็บหรือทีละตำแหน่ง และใส่รหัส AdSense ได้เองโดยไม่ต้องแก้โค้ด ต้องตั้งค่าใน Cloudflare ครั้งเดียว:
1. Cloudflare > **Storage & databases** > **Workers KV** > **Create** ตั้งชื่อ `khaptor-settings`
2. **Workers & Pages** > **khaptor** > **Settings** > **Bindings** > **Add** > **KV namespace**
   ช่อง Variable name ใส่ `SETTINGS` และเลือก namespace `khaptor-settings`
3. ในหน้า Settings เดียวกัน ไปที่ **Variables and Secrets** > **Add** เลือก Type เป็น **Secret**
   ตั้งชื่อ `ADMIN_PASSWORD` แล้วใส่รหัสผ่านยาว 12 ตัวอักษรขึ้นไป
4. ไปที่แท็บ **Deployments** กด **...** ที่รายการล่าสุด แล้วกด **Retry deployment** เพื่อให้ค่าใหม่มีผล

การทำงาน: ไฟล์ `functions/_middleware.js` อ่านค่าจาก KV แล้วใส่สคริปต์ AdSense ลงทุกหน้า ถ้าปิดโฆษณา สคริปต์จะไม่ถูกโหลดเลย (Auto ads ก็จะหายไปด้วย)
ส่วน `functions/ads.txt.js` สร้างไฟล์ ads.txt จากรหัสที่ใส่ในหน้าแอดมิน
แพ็กเกจฟรีของ Cloudflare เรียกใช้ Functions ได้ 100,000 ครั้งต่อวัน และอ่าน KV ได้ 100,000 ครั้งต่อวัน พอสำหรับเว็บที่เพิ่งเริ่ม

## ลงประกาศด้วยบัญชี Google
คนที่จะลงขายรถต้องล็อกอิน Google ก่อน ประกาศใหม่จะมีสถานะ "รอตรวจ" ให้แอดมินอนุมัติในหน้า admin.html ก่อนขึ้นเว็บ
ผู้ใช้ 1 บัญชีลงประกาศได้สูงสุด 3 คันต่อวัน และดูหรือลบประกาศของตัวเองได้ในหน้าแรก

ตั้งค่าครั้งเดียว:
1. Google Cloud Console > APIs & Services > **OAuth consent screen** ตั้งชื่อแอป "ขับต่อ" และใส่อีเมลติดต่อ แล้วเลือก External และ Publish
2. **Credentials** > **Create credentials** > **OAuth client ID** เลือก Web application
   ในช่อง Authorized JavaScript origins ใส่ `https://khaptor.com` และ `https://www.khaptor.com`
3. คัดลอก Client ID (ลงท้ายด้วย `.apps.googleusercontent.com`)
4. Cloudflare > khaptor > Settings > Variables and Secrets > Add เลือก Type: **Text** ตั้งชื่อ `GOOGLE_CLIENT_ID` แล้ววาง Client ID จากนั้น Retry deployment

ข้อมูลประกาศเก็บใน KV เดียวกับการตั้งค่าโฆษณา (SETTINGS) ไม่ต้องสร้างเพิ่ม และกุญแจสำหรับเซ็น session สร้างให้อัตโนมัติ

## Google AdSense
1. สมัครที่ adsense.google.com โดยใช้โดเมนของคุณ แล้วใส่ `ca-pub-...` ในหน้าแอดมิน
   ระบบจะใส่ meta tag ยืนยัน สคริปต์ AdSense และไฟล์ `ads.txt` ให้เอง
2. ช่องโฆษณาที่เตรียมไว้: `leaderboard` (ใต้แถบยี่ห้อ), `sidebar` (ใต้ตัวกรอง), `infeed` (ในรายการรถ) และ `article` (ในบทความกับหน้ารถ)
   สร้าง Display ad unit ใน AdSense แล้วนำเลข data-ad-slot มาใส่ในหน้าแอดมิน หรือจะเปิด Auto ads อย่างเดียวก็ได้

**สำคัญ:** AdSense ไม่อนุมัติเว็บที่มีข้อมูลสมมติหรือเนื้อหาน้อย ก่อนสมัครควรทำสิ่งเหล่านี้
- เปลี่ยนรถตัวอย่าง 24 คันเป็นประกาศจริง (แก้ `RAW` ใน `src/app.js`) และเปลี่ยนเบอร์โทรตัวอย่าง
- มีบทความอย่างน้อย 15 ถึง 20 เรื่อง (งานอัตโนมัติจะเพิ่มให้สัปดาห์ละ 3 เรื่อง ใช้เวลาราว 5 ถึง 6 สัปดาห์)
- หน้าเกี่ยวกับเรา ติดต่อ และนโยบายความเป็นส่วนตัวต้องมีข้อมูลจริง

## คุกกี้และ PDPA
เว็บมีแบนเนอร์ให้ผู้ใช้เลือก "ยอมรับทั้งหมด" หรือ "เฉพาะที่จำเป็น" และใช้ Google Consent Mode v2
ก่อนผู้ใช้ยอมรับ Analytics จะไม่เก็บคุกกี้ และโฆษณาจะไม่ปรับตามความสนใจ ผู้ใช้เปลี่ยนการตั้งค่าได้จากลิงก์ "ตั้งค่าคุกกี้" ท้ายเว็บ

## สิ่งที่ยังต้องทำเพื่อใช้งานจริง
ตอนนี้ฟอร์มลงขายรถยังไม่ได้บันทึกลงฐานข้อมูล ต้องเพิ่มระบบหลังบ้านก่อน เช่น Supabase หรือ Firebase พร้อมระบบสมาชิกและอัปโหลดรูป
