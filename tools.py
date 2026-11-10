"""หน้าเครื่องมือฟรี (/tools/*) — เรียกจาก build.py
อัตราภาษีและค่าธรรมเนียมอยู่ใน src/tools.js (RATES) ที่เดียว ถ้ากรมการขนส่งทางบกเปลี่ยนอัตรา แก้ที่นั่น
"""

TOOLS = [
    # slug, ชื่อ, คำอธิบายสั้น, title, meta description
    ("car-tax", "คำนวณภาษีรถยนต์ประจำปี", "ใส่ cc หรือน้ำหนักรถ รู้ยอดต่อภาษี ส่วนลดรถเก่า และค่าปรับล่าช้า",
     "คำนวณภาษีรถยนต์ประจำปี 2569 ตาม cc และน้ำหนัก ลดรถเก่า",
     "คำนวณภาษีรถยนต์ประจำปีออนไลน์ฟรี รถเก๋งตาม cc กระบะ รถตู้ และรถไฟฟ้า EV ตามน้ำหนัก พร้อมส่วนลดรถอายุเกิน 5 ปี ค่าปรับต่อภาษีล่าช้า และค่า พ.ร.บ."),
    ("transfer-fee", "คำนวณค่าโอนรถยนต์", "ค่าคำขอ ค่าธรรมเนียมโอน และอากรแสตมป์ 0.5% ของราคาประเมิน",
     "คำนวณค่าโอนรถยนต์มือสอง ค่าธรรมเนียม อากรแสตมป์",
     "คำนวณค่าโอนกรรมสิทธิ์รถยนต์ที่ขนส่ง ค่าคำขอ ค่าธรรมเนียมโอน อากรแสตมป์ 0.5% ของราคาประเมิน และค่าใช้จ่ายอื่น พร้อมรายการเอกสารที่ต้องเตรียม"),
    ("afford", "เงินเดือนเท่าไหร่ ผ่อนรถได้", "ใส่รายได้และหนี้ที่มี รู้ราคารถที่ซื้อไหวและค่างวดที่ปลอดภัย",
     "เงินเดือนเท่าไหร่ ซื้อรถราคาเท่าไหร่ได้ คำนวณงบซื้อรถ",
     "คำนวณว่าเงินเดือนของคุณผ่อนรถได้เดือนละเท่าไหร่ และซื้อรถราคาเท่าไหร่ได้ ตามภาระหนี้ เงินดาวน์ ดอกเบี้ย และจำนวนงวด"),
    ("compare", "เปรียบเทียบรถ 2-3 คัน", "เทียบค่างวด ภาษี ค่าน้ำมัน และค่าใช้จ่ายรวม 5 ปี",
     "เปรียบเทียบรถยนต์ 2-3 คัน ค่างวด ค่าน้ำมัน ค่าใช้จ่ายรวม",
     "เปรียบเทียบรถมือสอง 2 ถึง 3 คันแบบตัวเลข ค่างวด ภาษีประจำปี ค่าน้ำมันหรือค่าไฟ ประกันภัย และค่าใช้จ่ายรวม 5 ปี รู้ทันทีว่าคันไหนคุ้มกว่า"),
    ("contract", "สัญญาซื้อขายรถยนต์", "กรอกข้อมูลแล้วพิมพ์หรือบันทึกเป็น PDF ได้ทันที",
     "สัญญาซื้อขายรถยนต์มือสอง กรอกออนไลน์ พิมพ์ได้ทันที",
     "แบบฟอร์มสัญญาซื้อขายรถยนต์มือสองระหว่างบุคคล กรอกข้อมูลผู้ซื้อ ผู้ขาย และรถ แล้วพิมพ์หรือบันทึกเป็น PDF ฟรี ข้อมูลไม่ถูกส่งออกจากเครื่องของคุณ"),
    ("fuel-cost", "ค่าน้ำมันต่อเดือน เทียบรถไฟฟ้า", "ขับวันละกี่กิโล จ่ายค่าน้ำมันหรือค่าไฟเท่าไหร่ คุ้มไหมถ้าเปลี่ยนเป็น EV",
     "คำนวณค่าน้ำมันต่อเดือน รถน้ำมันเทียบรถไฟฟ้า EV คุ้มไหม",
     "คำนวณค่าน้ำมันรถต่อเดือนและต่อปีจากระยะขับต่อวัน เทียบกับค่าไฟชาร์จรถยนต์ไฟฟ้า EV ที่บ้านและสถานีชาร์จ พร้อมระยะเวลาคืนทุนส่วนต่างราคารถ"),
    ("checklist", "เช็กลิสต์ตรวจรถมือสอง", "ติ๊กทีละข้อบนมือถือตอนไปดูรถจริง เอกสาร ตัวถัง เครื่องยนต์ และการลองขับ",
     "เช็กลิสต์ตรวจรถมือสองก่อนซื้อ ติ๊กได้บนมือถือ",
     "เช็กลิสต์ตรวจสภาพรถมือสองก่อนซื้อแบบติ๊กได้ ครอบคลุมเอกสาร ตัวถัง ร่องรอยชนและน้ำท่วม ห้องเครื่อง ภายในห้องโดยสาร และการลองขับ เปิดบนมือถือได้ทันที"),
    ("price-estimate", "ประเมินราคารถมือสอง", "เลือกยี่ห้อ รุ่น ปี และเลขไมล์ ดูช่วงราคาจากประกาศจริงในเว็บ",
     "ประเมินราคารถมือสอง เช็กราคากลางจากประกาศขายจริง",
     "ประเมินราคารถมือสองจากประกาศขายจริงบนขับต่อ เลือกยี่ห้อ รุ่น ปี และเลขไมล์ แล้วดูช่วงราคากลาง พร้อมรายการรถที่ใช้เทียบ เหมาะสำหรับตั้งราคาขายหรือต่อรองราคาซื้อ"),
]

ICONS = {
    "car-tax": '<path d="M7 3h10l4 4v14H3V3h4z"/><path d="M8 11h8M8 15h5"/>',
    "transfer-fee": '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    "afford": '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1 1-1.6 2.5-1.6s2.5.7 2.5 1.7c0 2.6-5 1.4-5 4 0 1 1 1.7 2.5 1.7s2.5-.6 2.5-1.6"/>',
    "compare": '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    "contract": '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h7M9 17h5"/>',
    "fuel-cost": '<path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3M7 7h5"/>',
    "checklist": '<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
    "price-estimate": '<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
}

CHECKLIST = [
    ("เอกสารและประวัติ", [
        "ชื่อในเล่มทะเบียนตรงกับบัตรประชาชนของผู้ขาย (หรือมีหนังสือมอบอำนาจ)",
        "เลขตัวถังและเลขเครื่องที่ตัวรถตรงกับเล่มทะเบียน",
        "ดูหน้ารายการจดทะเบียน ไม่มีการเปลี่ยนสีหรือเปลี่ยนเครื่องที่ไม่ได้แจ้ง",
        "ถามว่ารถติดไฟแนนซ์หรือไม่ ถ้าติดต้องรู้ยอดปิดบัญชี",
        "ภาษีและ พ.ร.บ. ยังไม่หมดอายุ (ดูป้ายวงกลมหน้ารถ)",
        "สมุดประวัติการเข้าศูนย์ เลขไมล์ในใบเสร็จต่อเนื่องกัน",
        "กุญแจครบ รวมกุญแจสำรองและรีโมต",
    ]),
    ("ภายนอกและตัวถัง", [
        "สีทั้งคันเฉดเดียวกัน ไม่มีส่วนที่สีเพี้ยนหรือผิวส้ม",
        "ร่องระหว่างประตู ฝากระโปรง และบังโคลนเท่ากันทั้งสองฝั่ง",
        "น็อตยึดบังโคลนและบานพับประตูไม่มีรอยขันหรือสีถลอก",
        "ไม่มีสนิมหรือรอยเชื่อมที่ขอบประตู ซุ้มล้อ และใต้ท้องรถ",
        "กระจกทุกบานมีปีผลิตใกล้เคียงกัน (ดูตัวเลขมุมกระจก)",
        "ยางสึกเท่ากันทุกเส้น ไม่กินด้านใดด้านหนึ่ง และปีผลิตยางไม่เกิน 5 ปี",
        "ไฟหน้า ไฟท้าย ไฟเลี้ยว ไฟเบรก ไฟถอยติดครบ",
    ]),
    ("ร่องรอยน้ำท่วม", [
        "ไม่มีกลิ่นอับหรือกลิ่นโคลนในห้องโดยสาร",
        "ใต้พรมและในร่องรางเบาะไม่มีคราบโคลนหรือทราย",
        "เข็มขัดนิรภัยดึงออกจนสุดแล้วไม่มีคราบน้ำหรือรอยด่าง",
        "ขั้วไฟและสายไฟใต้คอนโซลไม่มีสนิมเขียว",
        "ไม่มีฝ้าหรือหยดน้ำค้างในโคมไฟหน้าและไฟท้าย",
    ]),
    ("ห้องเครื่องยนต์", [
        "ไม่มีคราบน้ำมันรั่วซึมรอบฝาวาล์วและใต้เครื่อง",
        "น้ำมันเครื่องไม่ดำข้นหรือเป็นคราบขาวคล้ายโคลน",
        "น้ำในหม้อน้ำสะอาด ไม่มีคราบน้ำมันลอย",
        "สตาร์ทตอนเครื่องเย็นติดง่าย ไม่มีเสียงเคาะหรือควันขาว/ดำ",
        "สายพานไม่แตกลายงา และไม่มีเสียงหวีดตอนเร่ง",
        "แบตเตอรี่ไม่บวม ขั้วไม่มีคราบเกลือ",
    ]),
    ("ภายในห้องโดยสาร", [
        "ไฟเตือนบนหน้าปัดดับหมดหลังติดเครื่อง (ไฟเครื่องยนต์ ABS ถุงลม)",
        "แอร์เย็นเร็วทุกช่อง ไม่มีกลิ่นเหม็นอับ",
        "กระจกไฟฟ้า ล็อกประตู กระจกมองข้าง และเครื่องเสียงใช้งานได้",
        "ความสึกของพวงมาลัย หัวเกียร์ และแป้นเบรกสอดคล้องกับเลขไมล์",
        "เบาะและพรมหลังคาไม่ขาดหรือเป็นคราบ",
    ]),
    ("ลองขับ", [
        "เกียร์เปลี่ยนนุ่ม ไม่กระตุกหรือรอรอบ",
        "ปล่อยมือจากพวงมาลัยบนทางตรง รถไม่ดึงไปด้านใดด้านหนึ่ง",
        "เบรกแล้วรถไม่เบี้ยว แป้นเบรกไม่สั่น",
        "ขับผ่านลูกระนาดไม่มีเสียงดังกึกกักจากช่วงล่าง",
        "หมุนพวงมาลัยสุดทั้งสองข้างไม่มีเสียงดังจากเพลาขับ",
        "เข็มความร้อนอยู่กลางเกจตลอดการขับ",
    ]),
    ("ก่อนจ่ายเงิน", [
        "ต่อรองราคาจากข้อบกพร่องที่เจอในเช็กลิสต์นี้",
        "ทำสัญญาซื้อขายเป็นลายลักษณ์อักษร มีพยาน 2 คน",
        "นัดวันโอนที่ขนส่งพร้อมกันทั้งสองฝ่าย",
        "โอนเงินเข้าบัญชีชื่อเดียวกับเจ้าของในเล่มทะเบียนเท่านั้น",
    ]),
]


def icon(slug):
    return f'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[slug]}</svg>'


def f(id, label, inp, hint="", cls=""):
    return f'<div class="field {cls}"><label for="{id}">{label}</label>{inp}{f"<small class=hint>{hint}</small>" if hint else ""}</div>'


def num(id, val="", ph="", step="any", mn="0"):
    return f'<input type="number" inputmode="decimal" id="{id}" value="{val}" placeholder="{ph}" step="{step}" min="{mn}">'


def txt(id, ph="", val=""):
    return f'<input type="text" id="{id}" placeholder="{ph}" value="{val}">'


def sel(id, opts, val=None):
    return f'<select id="{id}">' + "".join(f'<option value="{v}"{" selected" if v == val else ""}>{t}</option>' for v, t in opts) + "</select>"


SRC_NOTE = ('<p class="tool-note">อัตราอ้างอิงพระราชบัญญัติรถยนต์ พ.ศ. 2522 และประกาศกรมการขนส่งทางบก ใช้ประมาณการเท่านั้น '
            'ยอดจริงอาจต่างไปตามข้อมูลในเล่มทะเบียนและมาตรการลดหย่อนที่ประกาศเพิ่ม ตรวจยอดที่ต้องชำระจริงได้ที่ '
            '<a href="https://eservice.dlt.go.th" rel="noopener" target="_blank">eservice.dlt.go.th</a> หรือแอป DLT Vehicle Tax Plus</p>')


def body_car_tax(year):
    years = [(str(y), f"{y + 543} ({y})") for y in range(year, year - 31, -1)]
    return f'''<div class="tool-grid">
  <form class="tool-card" id="taxForm" onsubmit="return false">
    {f("tType", "ประเภทรถ", sel("tType", [("car", "รถเก๋ง / SUV / รถนั่งไม่เกิน 7 ที่นั่ง (คิดตาม cc)"), ("van", "รถตู้ / รถนั่งเกิน 7 ที่นั่ง (คิดตามน้ำหนัก)"), ("truck", "กระบะ / รถบรรทุกส่วนบุคคล (คิดตามน้ำหนัก)"), ("ev", "รถยนต์ไฟฟ้า EV ไม่เกิน 7 ที่นั่ง (คิดตามน้ำหนัก)")]), "รถไฮบริดและปลั๊กอินไฮบริดคิดตาม cc เหมือนรถน้ำมัน")}
    <div class="row2">
      {f("tCC", "ความจุกระบอกสูบ (cc)", num("tCC", "1500", "เช่น 1496"), "ดูได้จากเล่มทะเบียน ช่อง 'ซีซี'", "t-cc")}
      {f("tKg", "น้ำหนักรถ (กก.)", num("tKg", "1800", "เช่น 1850"), "ดูจากเล่มทะเบียน ช่อง 'น้ำหนักรถ'", "t-kg")}
      {f("tYear", "ปีที่จดทะเบียนครั้งแรก", sel("tYear", years, str(year - 6)))}
    </div>
    <div class="row2">
      {f("tLate", "ต่อภาษีช้ากว่ากำหนด (เดือน)", num("tLate", "0", "0", "1"), "ค่าปรับเดือนละ 1% ของค่าภาษี")}
      {f("tCmi", "รวมค่า พ.ร.บ. ด้วยไหม", sel("tCmi", [("1", "รวม พ.ร.บ. (ประมาณการ)"), ("0", "ไม่รวม")]))}
    </div>
    <label class="chk t-ev"><input type="checkbox" id="tEvDisc"> รถ EV ได้สิทธิ์ลดภาษี 80% ในปีแรกตามมาตรการรัฐ (ใช้กับรถใหม่ที่จดทะเบียนในช่วงมาตรการเท่านั้น)</label>
  </form>
  <div class="tool-card tool-result" aria-live="polite">
    <h2>ผลการคำนวณ</h2>
    <div class="big"><small>ค่าภาษีที่ต้องจ่ายปีนี้</small><b id="rTax">-</b></div>
    <table class="breakdown" id="rRows"></table>
    <p class="tool-hint" id="rHint"></p>
  </div>
</div>
<section class="prose tool-guide">
  <h2>ภาษีรถยนต์คิดอย่างไร</h2>
  <p>รถเก๋ง SUV และรถนั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง (ป้ายขาว ตัวอักษรดำ) คิดภาษีตามความจุกระบอกสูบแบบขั้นบันได 600 cc แรก cc ละ 50 สตางค์ ส่วน 601 ถึง 1,800 cc คิด cc ละ 1.50 บาท และส่วนที่เกิน 1,800 cc คิด cc ละ 4 บาท ตัวอย่างรถ 1,500 cc จ่าย 600 × 0.5 + 900 × 1.5 = 1,650 บาท</p>
  <p>รถที่ต่อภาษีเป็นปีที่ 6 ขึ้นไปได้ส่วนลด ปีที่ 6 ลด 10% ปีที่ 7 ลด 20% ปีที่ 8 ลด 30% ปีที่ 9 ลด 40% และปีที่ 10 เป็นต้นไปลด 50% ส่วนลดนี้ใช้กับรถที่คิดตาม cc เท่านั้น</p>
  <p>รถตู้เกิน 7 ที่นั่ง (ตัวอักษรสีน้ำเงิน) รถกระบะส่วนบุคคล (ตัวอักษรสีเขียว) และรถยนต์ไฟฟ้า คิดตามน้ำหนักรถ ถ้าต่อภาษีช้าเสียค่าปรับเดือนละ 1% ของค่าภาษี และถ้าค้างเกิน 3 ปี ทะเบียนจะถูกระงับ ต้องคืนแผ่นป้ายและจดทะเบียนใหม่</p>
  <h2>ต่อภาษีต้องเตรียมอะไร</h2>
  <p>ใช้ พ.ร.บ. (ประกันภัยภาคบังคับ) ที่ยังไม่หมดอายุ และใบรับรองการตรวจสภาพจาก ตรอ. สำหรับรถอายุเกิน 7 ปี ต่อได้ล่วงหน้า 90 วันทั้งที่สำนักงานขนส่ง เคาน์เตอร์ห้าง ไปรษณีย์ หรือออนไลน์ผ่านเว็บและแอปของกรมการขนส่งทางบก</p>
</section>'''


def body_transfer():
    return f'''<div class="tool-grid">
  <form class="tool-card" onsubmit="return false">
    {f("xPrice", "ราคาประเมินรถของกรมการขนส่งทางบก (บาท)", num("xPrice", "450000", "เช่น 450000"), "ถ้าไม่ทราบ ใส่ราคาซื้อขายไปก่อน ขนส่งจะใช้ราคาไหนสูงกว่าเป็นฐานอากร")}
    <div class="row2">
      {f("xPlate", "เปลี่ยนป้ายทะเบียนใหม่ไหม", sel("xPlate", [("0", "ใช้ป้ายเดิม"), ("1", "เปลี่ยนป้าย (ย้ายจังหวัด)")]))}
      {f("xBook", "ขอเล่มทะเบียนใหม่ไหม", sel("xBook", [("0", "ไม่ขอ"), ("1", "ขอเล่มใหม่")]))}
    </div>
    <div class="row2">
      {f("xPayer", "ใครจ่ายค่าโอน", sel("xPayer", [("buyer", "ผู้ซื้อจ่ายทั้งหมด"), ("half", "แบ่งจ่ายคนละครึ่ง"), ("seller", "ผู้ขายจ่ายทั้งหมด")]))}
      {f("xAgent", "ค่าจ้างตัวแทนโอน (ถ้ามี)", num("xAgent", "0", "0"))}
    </div>
  </form>
  <div class="tool-card tool-result" aria-live="polite">
    <h2>ค่าใช้จ่ายโดยประมาณ</h2>
    <div class="big"><small>รวมค่าโอน</small><b id="xTotal">-</b></div>
    <table class="breakdown" id="xRows"></table>
    <p class="tool-hint" id="xHint"></p>
  </div>
</div>
<section class="prose tool-guide">
  <h2>ค่าโอนรถยนต์มีอะไรบ้าง</h2>
  <p>การโอนกรรมสิทธิ์รถที่สำนักงานขนส่งมีค่าคำขอ 5 บาท ค่าธรรมเนียมการโอน 100 บาท และอากรแสตมป์ 0.5% ของราคาประเมินรถหรือราคาซื้อขาย แล้วแต่ราคาไหนสูงกว่า เช่น รถราคา 400,000 บาท เสียอากร 2,000 บาท ถ้าย้ายจังหวัดต้องเปลี่ยนแผ่นป้ายและเสียค่าแผ่นป้ายเพิ่ม</p>
  <h2>เอกสารที่ต้องใช้</h2>
  <ul>
    <li>เล่มทะเบียนรถตัวจริง</li>
    <li>บัตรประชาชนตัวจริงของผู้ซื้อและผู้ขาย พร้อมสำเนาที่เซ็นรับรอง</li>
    <li>แบบคำขอโอนและรับโอน และหนังสือมอบอำนาจถ้าให้คนอื่นไปแทน</li>
    <li>หลักฐานการตรวจสภาพรถหรือตรวจเลขตัวถังและเลขเครื่อง (นำรถไปตรวจที่ขนส่ง)</li>
    <li>ถ้ารถติดไฟแนนซ์ ต้องปิดยอดและรับหนังสือยินยอมให้โอนจากไฟแนนซ์ก่อน</li>
  </ul>
  <p>ผู้ซื้อต้องยื่นโอนภายใน 15 วันนับจากวันที่รับโอน ถ้าเกินกำหนดอาจถูกปรับ แนะนำให้ไปขนส่งพร้อมกันทั้งสองฝ่ายในวันที่จ่ายเงินงวดสุดท้าย</p>
</section>'''


def body_afford():
    return f'''<div class="tool-grid">
  <form class="tool-card" onsubmit="return false">
    <div class="row2">
      {f("aInc", "รายได้ต่อเดือน (บาท)", num("aInc", "30000", "เช่น 30000"), "เงินเดือนรวมรายได้ประจำอื่น ก่อนหักภาษี")}
      {f("aDebt", "ผ่อนหนี้อื่นอยู่ต่อเดือน (บาท)", num("aDebt", "0", "0"), "บ้าน บัตรเครดิต สินเชื่อส่วนบุคคล")}
    </div>
    <div class="row2">
      {f("aDown", "เงินดาวน์ที่มี (บาท)", num("aDown", "80000", "เช่น 80000"))}
      {f("aRate", "ดอกเบี้ย flat ต่อปี (%)", num("aRate", "4.5", "4.5", "0.01"), "รถมือสองส่วนใหญ่ 3.5 ถึง 7%")}
    </div>
    <div class="row2">
      {f("aMonths", "ผ่อนกี่งวด", sel("aMonths", [("48", "48 งวด (4 ปี)"), ("60", "60 งวด (5 ปี)"), ("72", "72 งวด (6 ปี)"), ("84", "84 งวด (7 ปี)")], "72"))}
      {f("aStyle", "สไตล์การเงิน", sel("aStyle", [("15", "ระวังมาก (ค่างวด 15% ของรายได้)"), ("20", "สมดุล (20%)"), ("25", "เต็มที่ (25%)")], "20"))}
    </div>
  </form>
  <div class="tool-card tool-result" aria-live="polite">
    <h2>งบซื้อรถของคุณ</h2>
    <div class="big"><small>ราคารถที่ซื้อได้สบาย ๆ</small><b id="aPrice">-</b></div>
    <table class="breakdown" id="aRows"></table>
    <p class="tool-hint" id="aHint"></p>
    <a class="btn btn-amber" id="aBrowse" href="../index.html#buy">ดูรถในงบนี้</a>
  </div>
</div>
<section class="prose tool-guide">
  <h2>หลักคิดงบซื้อรถ</h2>
  <p>ค่างวดรถไม่ควรเกิน 15 ถึง 25% ของรายได้ และหนี้ทุกก้อนรวมกันไม่ควรเกิน 40% ของรายได้ ซึ่งเป็นเกณฑ์ที่ไฟแนนซ์ส่วนใหญ่ใช้พิจารณาอนุมัติ เครื่องมือนี้เลือกค่างวดที่ต่ำกว่าระหว่างสองเกณฑ์นี้ แล้วคำนวณย้อนกลับเป็นยอดจัดไฟแนนซ์บวกเงินดาวน์</p>
  <p>อย่าลืมเผื่อค่าใช้จ่ายรายเดือนนอกจากค่างวด ทั้งน้ำมัน ประกันชั้น 1 ค่าที่จอด และค่าบำรุงรักษา ซึ่งรวมกันมักอยู่ราว 3,000 ถึง 6,000 บาทต่อเดือนสำหรับรถเก๋งทั่วไป</p>
</section>'''


def car_col(i, d):
    p = f"c{i}"
    return f'''<fieldset class="cmp-col">
  <legend>คันที่ {i}{" (ไม่บังคับ)" if i == 3 else ""}</legend>
  {f(p + "Name", "ชื่อรถ", txt(p + "Name", "เช่น Honda City 2019", d[0]))}
  <div class="row2">{f(p + "Price", "ราคา (บาท)", num(p + "Price", d[1]))}{f(p + "Year", "ปีจดทะเบียน (ค.ศ.)", num(p + "Year", d[2], "", "1"))}</div>
  <div class="row2">{f(p + "Fuel", "เชื้อเพลิง", sel(p + "Fuel", [("gas", "เบนซิน"), ("diesel", "ดีเซล"), ("hybrid", "ไฮบริด"), ("ev", "ไฟฟ้า")], d[3]))}{f(p + "Eco", "อัตราสิ้นเปลือง", num(p + "Eco", d[4]), "กม./ลิตร หรือ กม./kWh สำหรับ EV")}</div>
  <div class="row2">{f(p + "CC", "cc / น้ำหนัก EV (กก.)", num(p + "CC", d[5]))}{f(p + "Ins", "ประกันต่อปี (บาท)", num(p + "Ins", d[6]))}</div>
  {f(p + "Km", "เลขไมล์ (กม.)", num(p + "Km", d[7]))}
</fieldset>'''


def body_compare():
    cols = [car_col(1, ("Honda City 1.0 Turbo", "429000", "2021", "gas", "17", "998", "14000", "52000")),
            car_col(2, ("Toyota Yaris Ativ 1.2", "389000", "2020", "gas", "19", "1197", "13000", "68000")),
            car_col(3, ("", "", "", "ev", "", "", "", ""))]
    return f'''<form class="tool-card cmp-shared" onsubmit="return false">
  {f("sKm", "ขับต่อปี (กม.)", num("sKm", "15000"))}
  {f("sGas", "ราคาน้ำมันเบนซิน (บาท/ลิตร)", num("sGas", "36", "", "0.01"))}
  {f("sDiesel", "ราคาดีเซล (บาท/ลิตร)", num("sDiesel", "33", "", "0.01"))}
  {f("sKwh", "ค่าไฟชาร์จ (บาท/kWh)", num("sKwh", "4.5", "", "0.01"))}
  {f("sDown", "ดาวน์ (%)", num("sDown", "20", "", "1"))}
  {f("sRate", "ดอกเบี้ย flat (%)", num("sRate", "4.5", "", "0.01"))}
  {f("sMonths", "งวด", sel("sMonths", [("48", "48"), ("60", "60"), ("72", "72"), ("84", "84")], "72"))}
</form>
<div class="cmp-cols">{"".join(cols)}</div>
<div class="tool-card tool-result" aria-live="polite">
  <h2>ผลเปรียบเทียบ</h2>
  <div class="tablewrap"><table class="cmp-table" id="cmpTable"></table></div>
  <p class="tool-hint" id="cmpHint"></p>
</div>
<section class="prose tool-guide">
  <h2>เทียบรถให้ครบต้องดูอะไร</h2>
  <p>ราคาป้ายเป็นแค่ส่วนหนึ่ง รถที่ราคาถูกกว่าอาจแพงกว่าในระยะยาวเพราะกินน้ำมันมากกว่า ภาษีสูงกว่า หรือเบี้ยประกันแพงกว่า ตารางนี้รวมค่างวด ภาษีประจำปี ค่าพลังงาน และประกันภัยเป็นค่าใช้จ่ายรวม 5 ปี เพื่อให้เทียบกันได้ตรง ๆ</p>
  <p>ตัวเลขยังไม่รวมค่าซ่อมบำรุงและราคาขายต่อ ซึ่งรถยี่ห้อญี่ปุ่นยอดนิยมมักได้เปรียบ ถ้าสองคันค่าใช้จ่ายใกล้กัน ให้เลือกคันที่เลขไมล์น้อยกว่าและมีประวัติเข้าศูนย์ครบ</p>
</section>'''


def body_contract():
    party = lambda p, t: f'''<fieldset><legend>{t}</legend>
    {f(p + "Name", "ชื่อ-นามสกุล", txt(p + "Name"))}
    <div class="row2">{f(p + "Id", "เลขบัตรประชาชน", txt(p + "Id", "x-xxxx-xxxxx-xx-x"))}{f(p + "Tel", "เบอร์โทร", txt(p + "Tel"))}</div>
    {f(p + "Addr", "ที่อยู่", txt(p + "Addr", "บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด"))}
  </fieldset>'''
    return f'''<div class="contract-grid">
  <form class="tool-card contract-form" id="kForm" onsubmit="return false" autocomplete="off">
    <p class="tool-note" style="margin-top:0">ข้อมูลที่กรอกอยู่ในเครื่องของคุณเท่านั้น ไม่ถูกส่งหรือบันทึกที่เซิร์ฟเวอร์</p>
    <fieldset><legend>สถานที่และวันที่ทำสัญญา</legend>
      <div class="row2">{f("kPlace", "ทำที่", txt("kPlace", "เช่น กรุงเทพมหานคร"))}{f("kDate", "วันที่", '<input type="date" id="kDate">')}</div>
    </fieldset>
    {party("kS", "ผู้ขาย")}
    {party("kB", "ผู้ซื้อ")}
    <fieldset><legend>ข้อมูลรถ (ดูจากเล่มทะเบียน)</legend>
      <div class="row2">{f("kBrand", "ยี่ห้อ / รุ่น", txt("kBrand", "เช่น Toyota Yaris Ativ"))}{f("kYear", "ปีรถ", txt("kYear", "เช่น 2020"))}</div>
      <div class="row2">{f("kPlate", "เลขทะเบียน", txt("kPlate", "เช่น 1กข 1234"))}{f("kProv", "จังหวัด", txt("kProv", "เช่น กรุงเทพมหานคร"))}</div>
      <div class="row2">{f("kColor", "สี", txt("kColor"))}{f("kKm", "เลขไมล์ (กม.)", txt("kKm"))}</div>
      <div class="row2">{f("kVin", "เลขตัวรถ (ตัวถัง)", txt("kVin"))}{f("kEng", "เลขเครื่องยนต์", txt("kEng"))}</div>
    </fieldset>
    <fieldset><legend>ราคาและการชำระเงิน</legend>
      <div class="row2">{f("kPrice", "ราคาขาย (บาท)", num("kPrice", "", "เช่น 389000"))}{f("kDep", "เงินมัดจำวันทำสัญญา (บาท)", num("kDep", "", "0"))}</div>
      <div class="row2">{f("kPayDate", "ชำระส่วนที่เหลือภายในวันที่", '<input type="date" id="kPayDate">')}{f("kFee", "ค่าโอนและค่าใช้จ่าย", sel("kFee", [("ผู้ซื้อ", "ผู้ซื้อเป็นผู้จ่าย"), ("ผู้ขาย", "ผู้ขายเป็นผู้จ่าย"), ("ผู้ซื้อและผู้ขายคนละครึ่ง", "จ่ายคนละครึ่ง")]))}</div>
      {f("kExtra", "เงื่อนไขเพิ่มเติม (ถ้ามี)", '<textarea id="kExtra" rows="3" placeholder="เช่น ผู้ขายมอบยางอะไหล่และกุญแจสำรอง 1 ดอก"></textarea>')}
    </fieldset>
    <div class="contract-actions">
      <button type="button" class="btn btn-amber" id="kPrint">พิมพ์ / บันทึกเป็น PDF</button>
      <button type="button" class="btn btn-line" id="kClear">ล้างข้อมูล</button>
    </div>
  </form>
  <div class="contract-preview-wrap"><article class="contract-paper" id="kPaper" aria-label="ตัวอย่างสัญญา"></article></div>
</div>
<section class="prose tool-guide no-print">
  <h2>ใช้สัญญานี้อย่างไร</h2>
  <p>กรอกข้อมูลให้ตรงกับเล่มทะเบียนและบัตรประชาชน กดพิมพ์ 2 ชุด ให้ผู้ซื้อและผู้ขายเซ็นทุกหน้าต่อหน้าพยาน 2 คน แล้วเก็บไว้ฝ่ายละ 1 ชุด ในหน้าต่างพิมพ์ เลือกปลายทางเป็น "บันทึกเป็น PDF" ถ้าต้องการไฟล์</p>
  <p>สัญญานี้เป็นแบบฟอร์มทั่วไปสำหรับการซื้อขายรถระหว่างบุคคลที่ชำระเงินสด ถ้ารถยังติดไฟแนนซ์ ต้องให้ไฟแนนซ์ยินยอมก่อน และหากมูลค่าสูงหรือมีเงื่อนไขซับซ้อน ควรปรึกษานักกฎหมาย</p>
</section>'''


def body_fuel():
    return f'''<div class="tool-grid">
  <form class="tool-card" onsubmit="return false">
    <div class="row2">
      {f("fDay", "ขับวันละ (กม.)", num("fDay", "40"))}
      {f("fDays", "ขับกี่วันต่อเดือน", num("fDays", "26", "", "1"))}
    </div>
    <fieldset class="plain"><legend>รถน้ำมัน</legend>
    <div class="row2">
      {f("fEco", "อัตราสิ้นเปลือง (กม./ลิตร)", num("fEco", "14", "", "0.1"), "เก๋งเล็ก 14 ถึง 18 · กระบะ 11 ถึง 13 · ไฮบริด 20 ขึ้นไป")}
      {f("fPrice", "ราคาน้ำมัน (บาท/ลิตร)", num("fPrice", "36", "", "0.01"), "ดูราคาวันนี้จากปั๊มที่เติมประจำ")}
    </div></fieldset>
    <fieldset class="plain"><legend>รถไฟฟ้า EV</legend>
    <div class="row2">
      {f("fEv", "อัตราสิ้นเปลือง (กม./kWh)", num("fEv", "6.5", "", "0.1"), "EV ทั่วไป 5.5 ถึง 7.5 กม./kWh")}
      {f("fHome", "ชาร์จที่บ้าน (%)", num("fHome", "80", "", "5"), "ส่วนที่เหลือชาร์จสถานีสาธารณะ")}
    </div>
    <div class="row2">
      {f("fKwhHome", "ค่าไฟที่บ้าน (บาท/kWh)", num("fKwhHome", "4.5", "", "0.01"), "มิเตอร์ TOU ช่วงกลางคืนจะถูกกว่านี้")}
      {f("fKwhPub", "ค่าชาร์จสถานี (บาท/kWh)", num("fKwhPub", "7.5", "", "0.01"))}
    </div>
    {f("fGap", "รถ EV แพงกว่าคันน้ำมัน (บาท)", num("fGap", "100000"), "ใส่ 0 ถ้าราคาเท่ากัน ใช้คำนวณระยะคืนทุน")}
    </fieldset>
  </form>
  <div class="tool-card tool-result" aria-live="polite">
    <h2>ค่าพลังงานของคุณ</h2>
    <div class="big"><small>ใช้ EV ประหยัดได้ต่อเดือน</small><b id="fSave">-</b></div>
    <table class="breakdown" id="fRows"></table>
    <p class="tool-hint" id="fHint"></p>
  </div>
</div>
<section class="prose tool-guide">
  <h2>รถไฟฟ้าคุ้มกว่ารถน้ำมันจริงไหม</h2>
  <p>ค่าพลังงานต่อกิโลเมตรของรถไฟฟ้าที่ชาร์จที่บ้านมักต่ำกว่ารถน้ำมันราว 3 ถึง 4 เท่า ยิ่งขับมากยิ่งคุ้ม แต่ถ้าต้องพึ่งสถานีชาร์จเร็วเป็นหลัก ส่วนต่างจะลดลงมาก เครื่องมือนี้จึงให้ใส่สัดส่วนการชาร์จที่บ้านด้วย</p>
  <p>อย่าดูแค่ค่าน้ำมัน ให้ดูราคาขายต่อ ค่าประกัน และสุขภาพแบตเตอรี่ประกอบ ถ้าซื้อ EV มือสองให้ขอผลตรวจแบตเตอรี่ (State of Health) และเช็กเงื่อนไขรับประกันแบตเตอรี่ที่โอนต่อได้</p>
</section>'''


def body_checklist():
    groups = []
    n = 0
    for g, items in CHECKLIST:
        lis = []
        for it in items:
            n += 1
            lis.append(f'<li><label><input type="checkbox" data-ck="{n}"><span>{it}</span></label><button type="button" class="ck-flag" data-flag="{n}" aria-label="ทำเครื่องหมายว่าพบปัญหา" title="พบปัญหา">!</button></li>')
        groups.append(f'<section class="ck-group"><h2>{g} <small data-gcount></small></h2><ul>{"".join(lis)}</ul></section>')
    return f'''<div class="ck-bar tool-card" id="ckBar">
  <div class="ck-prog"><div><b id="ckDone">0</b> / {n} ข้อ · พบปัญหา <b id="ckBad">0</b> ข้อ</div><div class="ck-track"><span id="ckFill"></span></div></div>
  <div class="ck-actions">{f("ckCar", "รถที่ไปดู", txt("ckCar", "เช่น City 2019 สีขาว ทะเบียน 1กข 1234"))}
  <button type="button" class="btn btn-line" id="ckPrint">พิมพ์</button><button type="button" class="btn btn-line" id="ckReset">เริ่มใหม่</button></div>
</div>
<p class="tool-note">ติ๊กข้อที่ตรวจแล้วผ่าน กดปุ่ม ! ถ้าเจอปัญหา ระบบจำไว้ในเครื่องนี้ ปิดหน้าแล้วกลับมาทำต่อได้ ไม่ส่งข้อมูลออกไปไหน</p>
<div class="ck-groups">{"".join(groups)}</div>
<section class="prose tool-guide no-print">
  <h2>ใช้เช็กลิสต์นี้ให้ได้ผล</h2>
  <p>ไปดูรถตอนกลางวันและตอนเครื่องยนต์ยังเย็น ขอให้ผู้ขายอย่าติดเครื่องรอไว้ก่อน เพราะอาการสตาร์ทติดยากหรือควันผิดปกติจะเห็นได้ชัดตอนเครื่องเย็น ถ้าเจอปัญหาหลายข้อในหมวดน้ำท่วมหรือตัวถัง ควรพาช่างหรือศูนย์ตรวจสภาพไปดูอีกรอบก่อนตัดสินใจ</p>
  <p>ข้อที่พบปัญหาใช้เป็นเหตุผลต่อรองราคาได้ ซื้อแล้วให้ใช้ <a href="contract.html">สัญญาซื้อขายรถยนต์</a> และเช็ก <a href="transfer-fee.html">ค่าโอน</a> ก่อนนัดวันไปขนส่ง</p>
</section>'''


def body_estimate(year):
    years = [("", "ทุกปี")] + [(str(y), str(y)) for y in range(year, year - 21, -1)]
    return f'''<div class="tool-grid">
  <form class="tool-card" onsubmit="return false">
    <div class="row2">
      {f("eBrand", "ยี่ห้อ", '<select id="eBrand"><option value="">กำลังโหลด...</option></select>')}
      {f("eModel", "รุ่น", '<select id="eModel"><option value="">เลือกรุ่น</option></select>')}
    </div>
    <div class="row2">
      {f("eYear", "ปีรถ (ค.ศ.)", sel("eYear", years))}
      {f("eKm", "เลขไมล์ (กม.)", num("eKm", "", "เช่น 60000"))}
    </div>
    <p class="tool-hint" id="eData" style="margin:0"></p>
  </form>
  <div class="tool-card tool-result" aria-live="polite">
    <h2>ราคาประเมิน</h2>
    <div class="big"><small id="eLabel">ราคากลางโดยประมาณ</small><b id="ePrice">-</b></div>
    <table class="breakdown" id="eRows"></table>
    <p class="tool-hint" id="eHint"></p>
  </div>
</div>
<section class="tool-card" style="margin-top:20px"><h2 style="margin-top:0;font-size:18px">ประกาศที่ใช้เทียบ</h2><div class="tablewrap"><table class="cmp-table" id="eList"></table></div></section>
<section class="prose tool-guide">
  <h2>วิธีประเมินราคา</h2>
  <p>ระบบดึงประกาศยี่ห้อและรุ่นเดียวกันบนขับต่อ แล้วปรับราคาของแต่ละคันให้เทียบเท่ากับปีและเลขไมล์ของรถคุณ โดยคิดค่าเสื่อมราว 7% ต่อปีและ 1.5% ต่อทุก 10,000 กิโลเมตร จากนั้นใช้ค่ากลาง (median) เพื่อไม่ให้ประกาศที่ตั้งราคาสูงหรือต่ำผิดปกติดึงผลเพี้ยน</p>
  <p>ราคาในประกาศเป็นราคาที่ผู้ขายตั้ง ราคาที่ตกลงกันจริงมักต่ำกว่า 3 ถึง 8% และรถที่มีประวัติศูนย์ครบ ไม่เคยชน และผ่านการตรวจสภาพจะขายได้ใกล้ราคาบนของช่วง ยิ่งมีประกาศในเว็บมาก ผลประเมินยิ่งแม่นขึ้น</p>
</section>'''


def build_tools(page, crumbs, ad, share_bar, E, C, D, year):
    """สร้าง /tools/index.html และหน้าเครื่องมือแต่ละตัว คืนค่า list ของ URL สำหรับ sitemap"""
    base = "../"
    bodies = {"car-tax": body_car_tax(year), "transfer-fee": body_transfer(), "afford": body_afford(),
              "compare": body_compare(), "contract": body_contract(), "fuel-cost": body_fuel(),
              "checklist": body_checklist(), "price-estimate": body_estimate(year)}
    urls = [f"{D}/tools/index.html"]
    for slug, name, short, title, desc in TOOLS:
        url = f"{D}/tools/{slug}.html"
        bc_html, bc_ld = crumbs([("หน้าแรก", "index.html"), ("เครื่องมือฟรี", "tools/index.html"), (name, None)], base)
        app_ld = {"@context": "https://schema.org", "@type": "WebApplication", "name": name, "url": url, "description": desc,
                  "applicationCategory": "BusinessApplication" if slug in ("contract", "checklist") else "FinanceApplication",
                  "operatingSystem": "Any", "inLanguage": "th-TH", "isAccessibleForFree": True,
                  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "THB"}}
        others = "".join(f'<a href="{s}.html">{icon(s)}<span>{n}</span></a>' for s, n, *_ in TOOLS if s != slug)
        body = f'''<main class="wrap page toolpage" data-tool="{slug}">
  {bc_html}
  <header class="tool-head no-print"><span class="tool-ico">{icon(slug)}</span><div><h1>{E(name)}</h1><p class="lead">{E(desc)}</p></div></header>
  {bodies[slug]}
  {SRC_NOTE if slug in ("car-tax", "transfer-fee", "compare") else ""}
  <div class="no-print">{share_bar(url, name + " ฟรี | " + C["SITE_NAME"])}</div>
  <div class="no-print">{ad("leaderboard")}</div>
  <nav class="tool-others no-print" aria-label="เครื่องมืออื่น"><h2>เครื่องมืออื่น</h2><div>{others}</div></nav>
</main>'''
        page(f"tools/{slug}.html", f"{title} | {C['SITE_NAME']}", desc, body, base,
             ld=[app_ld, bc_ld], scripts=["assets/tools.js"])
        urls.append(url)
    bc_html, bc_ld = crumbs([("หน้าแรก", "index.html"), ("เครื่องมือฟรี", None)], base)
    cards = "".join(f'<a class="tool-tile" href="{s}.html"><span class="tool-ico">{icon(s)}</span><b>{E(n)}</b><small>{E(sh)}</small></a>' for s, n, sh, *_ in TOOLS)
    page("tools/index.html", f"เครื่องมือฟรีสำหรับซื้อขายรถ ภาษี ค่าโอน สัญญา | {C['SITE_NAME']}",
         "รวมเครื่องมือฟรีสำหรับคนซื้อขายรถมือสอง คำนวณภาษีรถยนต์ ค่าโอน งบซื้อรถจากเงินเดือน เปรียบเทียบรถ และสัญญาซื้อขายรถยนต์พิมพ์ได้",
         f'''<main class="wrap page">{bc_html}<h1>เครื่องมือฟรีสำหรับคนซื้อขายรถ</h1>
<p class="lead">ใช้ได้ทันทีไม่ต้องสมัคร คำนวณในเครื่องของคุณ ไม่เก็บข้อมูล</p>
<div class="tool-tiles">{cards}<a class="tool-tile" href="../index.html#loan"><span class="tool-ico"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h8"/></svg></span><b>คำนวณค่างวดรถ</b><small>ดาวน์ ดอกเบี้ย และจำนวนงวด รู้ค่าผ่อนต่อเดือน</small></a></div>
{ad("leaderboard")}</main>''', base, ld=[bc_ld])
    return urls
