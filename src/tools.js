/* เครื่องมือฟรี ขับต่อ — คำนวณทั้งหมดในเบราว์เซอร์ */
(function(){
"use strict";
// ======== อัตราภาษีและค่าธรรมเนียม (แก้ที่นี่ที่เดียว) ========
const RATES={
  // รถนั่งส่วนบุคคลไม่เกิน 7 คน: [ถึง cc, บาทต่อ cc]
  carCC:[[600,0.5],[1800,1.5],[Infinity,4]],
  // ส่วนลดตามปีที่ต่อภาษี (ปีที่ 6 = 10% ... ปีที่ 10+ = 50%)
  ageDisc:{6:10,7:20,8:30,9:40,10:50},
  // [น้ำหนักไม่เกิน กก., บาท]
  van:[[1800,1300],[Infinity,1600]],
  truck:[[500,300],[750,450],[1000,600],[1250,750],[1500,900],[1750,1050],[2000,1350],[2500,1650],[3000,1950],[3500,2250],[4000,2550],[4500,2850],[5000,3150],[6000,3450],[7000,3750],[Infinity,4050]],
  ev:[[500,150],[750,300],[1000,450],[1250,800],[1500,1000],[1750,1300],[2000,1600],[2500,1900],[3000,2200],[3500,2400],[4000,2600],[4500,2800],[5000,3000],[6000,3200],[7000,3400],[Infinity,3600]],
  evDisc:80,
  lateMonthly:1, // ค่าปรับ % ต่อเดือน
  cmi:{car:645.21,ev:645.21,van:1182.35,truck:967.28}, // พ.ร.บ. รวมอากรและ VAT (ประมาณ)
  transfer:{request:5,fee:100,stampPer200:1,plate:200,book:100}
};
// =========================================================
const $=id=>document.getElementById(id);
const v=id=>{const e=$(id);return e?parseFloat(String(e.value).replace(/,/g,""))||0:0};
const s=id=>{const e=$(id);return e?e.value.trim():""};
const fmt=n=>Math.round(n).toLocaleString("th-TH");
const fmt2=n=>n.toLocaleString("th-TH",{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rows=(el,list)=>{$(el).innerHTML=list.map(r=>`<tr${r[2]?` class="${r[2]}"`:""}><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("")};
const track=(n,p)=>{try{window.ktTrack&&window.ktTrack(n,p)}catch(e){}};
const bind=(ids,fn)=>{ids.forEach(id=>{const e=$(id);if(e){e.addEventListener("input",fn);e.addEventListener("change",fn)}});const r=ready;ready=false;fn();ready=r};
const byWeight=(tbl,kg)=>{for(const [max,b] of tbl)if(kg<=max)return b;return 0};
const TOOL=(document.querySelector("[data-tool]")||{}).dataset?.tool;
let tracked=false,ready=false;const once=()=>{if(ready&&!tracked){tracked=true;track("tool_use",{tool:TOOL})}};

function ccTax(cc){let t=0,prev=0;for(const [max,r] of RATES.carCC){if(cc>prev){t+=(Math.min(cc,max)-prev)*r}prev=max}return t}
function annualTax(type,cc,kg,taxYearNo){
  if(type==="car"){const base=ccTax(cc);const d=RATES.ageDisc[Math.min(taxYearNo,10)]||0;return {base,disc:d,tax:base*(1-d/100)}}
  const base=byWeight(RATES[type],kg);return {base,disc:0,tax:base};
}
window.KT_TOOLS={ccTax,annualTax,RATES};

// ---------- 1) ภาษีรถยนต์ ----------
function carTax(){
  const type=s("tType");
  document.querySelectorAll(".t-cc").forEach(e=>e.hidden=type!=="car");
  document.querySelectorAll(".t-kg").forEach(e=>e.hidden=type==="car");
  document.querySelectorAll(".t-ev").forEach(e=>e.hidden=type!=="ev");
  const now=new Date().getFullYear();
  const no=Math.max(1,now-v("tYear")+1);
  const cc=v("tCC"),kg=v("tKg"),late=Math.max(0,Math.floor(v("tLate")));
  if((type==="car"&&!cc)||(type!=="car"&&!kg)){$("rTax").textContent="-";$("rRows").innerHTML="";$("rHint").textContent="กรอก "+(type==="car"?"cc":"น้ำหนักรถ")+" เพื่อคำนวณ";return}
  let {base,disc,tax}=annualTax(type,cc,kg,no);
  const list=[["ประเภท",$("tType").selectedOptions[0].text.replace(/ \(.+\)/,"")]];
  if(type==="car"){
    let prev=0;for(const [max,r] of RATES.carCC){if(cc>prev){const part=Math.min(cc,max)-prev;list.push([`${fmt(prev+1)}–${max===Infinity?fmt(cc):fmt(Math.min(cc,max))} cc × ${r} บาท`,fmt2(part*r)])}prev=max}
    list.push(["ภาษีเต็ม",fmt2(base)+" บาท"]);
    list.push([`ต่อภาษีปีที่ ${no}`,disc?`ลด ${disc}% (−${fmt2(base*disc/100)})`:"ยังไม่ได้ส่วนลดรถเก่า"]);
  }else{
    list.push([`น้ำหนัก ${fmt(kg)} กก.`,fmt2(base)+" บาท"]);
    if(type==="ev"&&$("tEvDisc").checked){const d=tax*RATES.evDisc/100;tax-=d;list.push([`ลด ${RATES.evDisc}% มาตรการรถ EV`,"−"+fmt2(d)])}
  }
  const fine=tax*RATES.lateMonthly/100*late;
  if(late)list.push([`ค่าปรับล่าช้า ${late} เดือน (${RATES.lateMonthly}%/เดือน)`,"+"+fmt2(fine)]);
  list.push(["ค่าภาษีที่ต้องจ่าย",fmt2(tax+fine)+" บาท","sum"]);
  let total=tax+fine;
  if(s("tCmi")==="1"){const c=RATES.cmi[type];list.push(["พ.ร.บ. (ประมาณ)","+"+fmt2(c)]);total+=c;list.push(["รวมจ่ายพร้อม พ.ร.บ.",fmt2(total)+" บาท","sum"])}
  $("rTax").textContent="฿"+fmt2(s("tCmi")==="1"?total:tax+fine);
  rows("rRows",list);
  const hints=[];
  if(type==="car"&&no<6)hints.push(`รถคันนี้จะเริ่มได้ส่วนลด 10% เมื่อต่อภาษีปีที่ 6 (อีก ${6-no} ปี)`);
  if(no>7)hints.push("รถอายุเกิน 7 ปีต้องตรวจสภาพที่ ตรอ. ก่อนต่อภาษี (ค่าตรวจรถยนต์ราว 200–300 บาท)");
  if(late>=36)hints.push("ค้างภาษีเกิน 3 ปี ทะเบียนจะถูกระงับ ต้องคืนป้ายและจดทะเบียนใหม่");
  $("rHint").textContent=hints.join(" · ");
  once();
}

// ---------- 5) ค่าโอน ----------
function transfer(){
  const T=RATES.transfer,p=v("xPrice");
  const stamp=Math.ceil(p/200)*T.stampPer200;
  const list=[["ค่าคำขอ",fmt2(T.request)],["ค่าธรรมเนียมโอน",fmt2(T.fee)],[`อากรแสตมป์ 0.5% ของ ${fmt(p)} บาท`,fmt2(stamp)]];
  let t=T.request+T.fee+stamp;
  if(s("xPlate")==="1"){list.push(["ค่าแผ่นป้ายทะเบียนใหม่",fmt2(T.plate)]);t+=T.plate}
  if(s("xBook")==="1"){list.push(["ค่าเล่มทะเบียนใหม่",fmt2(T.book)]);t+=T.book}
  const agent=v("xAgent");if(agent){list.push(["ค่าตัวแทนโอน",fmt2(agent)]);t+=agent}
  list.push(["รวม",fmt2(t)+" บาท","sum"]);
  const payer=s("xPayer");
  if(payer==="half")list.push(["ผู้ซื้อจ่าย / ผู้ขายจ่าย",`${fmt2(t/2)} / ${fmt2(t/2)}`]);
  else list.push([payer==="buyer"?"ผู้ซื้อจ่าย":"ผู้ขายจ่าย",fmt2(t)]);
  $("xTotal").textContent=p?"฿"+fmt2(t):"-";rows("xRows",list);
  $("xHint").textContent=p?"ถ้าราคาซื้อขายในสัญญาสูงกว่าราคาประเมิน ขนส่งคิดอากรจากราคาที่สูงกว่า":"กรอกราคาประเมินเพื่อคำนวณ";
  if(p)once();
}

// ---------- 3) งบซื้อรถ ----------
function afford(){
  const inc=v("aInc"),debt=v("aDebt"),down=v("aDown"),rate=v("aRate"),n=v("aMonths"),pct=v("aStyle");
  if(!inc){$("aPrice").textContent="-";$("aRows").innerHTML="";return}
  const byShare=inc*pct/100,byDsr=inc*0.4-debt;
  const pay=Math.max(0,Math.min(byShare,byDsr));
  // ค่างวด = ยอดจัด × (1 + r × ปี) ÷ งวด × 1.07  → ยอดจัด = ค่างวด × งวด ÷ 1.07 ÷ (1 + r × ปี)
  const fin=pay*n/1.07/(1+rate/100*n/12);
  const price=fin+down;
  const interest=pay*n-fin;
  rows("aRows",[
    ["ค่างวดสูงสุดที่แนะนำ",`฿${fmt(pay)} / เดือน`,"sum"],
    [`เกณฑ์ ${pct}% ของรายได้`,`฿${fmt(byShare)}`],
    ["เกณฑ์หนี้รวมไม่เกิน 40%",`฿${fmt(Math.max(0,byDsr))}`],
    ["ยอดจัดไฟแนนซ์",`฿${fmt(fin)}`],
    ["เงินดาวน์",`฿${fmt(down)}${price?` (${Math.round(down/price*100)}%)`:""}`],
    [`จ่ายรวม ${n} งวด`,`฿${fmt(pay*n)}`],
    ["ดอกเบี้ยและ VAT รวม",`฿${fmt(interest)}`]
  ]);
  $("aPrice").textContent=pay>0?"฿"+fmt(Math.floor(price/1000)*1000):"ยังไม่แนะนำให้ผ่อนเพิ่ม";
  const h=[];
  if(byDsr<=0)h.push("ภาระหนี้ปัจจุบันเกิน 40% ของรายได้แล้ว ไฟแนนซ์อาจไม่อนุมัติ ลองลดหนี้หรือเพิ่มเงินดาวน์");
  else if(price&&down/price<0.15)h.push("เงินดาวน์ต่ำกว่า 15% ไฟแนนซ์บางแห่งอาจคิดดอกเบี้ยสูงขึ้น");
  h.push("เผื่อค่าน้ำมัน ประกัน และบำรุงรักษาอีกราว 3,000–6,000 บาท/เดือน");
  $("aHint").textContent=h.join(" · ");
  $("aBrowse").href="../index.html?max="+Math.floor(price)+"#buy";
  once();
}

// ---------- 4) เปรียบเทียบรถ ----------
function compare(){
  const km=v("sKm"),down=v("sDown"),rate=v("sRate"),n=v("sMonths");
  const price={gas:v("sGas"),diesel:v("sDiesel"),hybrid:v("sGas"),ev:v("sKwh")};
  const now=new Date().getFullYear();
  const cars=[1,2,3].map(i=>{
    const p="c"+i,pr=v(p+"Price");if(!pr)return null;
    const fuel=s(p+"Fuel"),eco=v(p+"Eco"),cc=v(p+"CC"),yr=v(p+"Year")||now;
    const fin=pr*(1-down/100),pay=(fin+fin*rate/100*n/12)/n*1.07;
    const age=Math.max(1,now-yr+1);
    let tax=0;
    if(cc){tax=fuel==="ev"?annualTax("ev",0,cc,age).tax:annualTax("car",cc,0,age).tax}
    const energy=eco?km/eco*price[fuel]:0;
    const ins=v(p+"Ins");
    const years=5,months=Math.min(n,years*12);
    const own5=pr*down/100+pay*months+(tax+energy+ins)*years;
    return {name:s(p+"Name")||"คันที่ "+i,pr,pay,tax,energy,ins,km:v(p+"Km"),age,own5,yr,fuel,hasTax:!!cc,hasEco:!!eco};
  }).filter(Boolean);
  const T=$("cmpTable");
  if(cars.length<2){T.innerHTML="";$("cmpHint").textContent="กรอกราคารถอย่างน้อย 2 คันเพื่อเปรียบเทียบ";return}
  const best=(key,lo=true)=>{const vals=cars.map(c=>c[key]);const b=lo?Math.min(...vals):Math.max(...vals);return vals.map(x=>x===b&&vals.filter(y=>y===b).length<vals.length)};
  const line=(label,key,f,lo=true,skip)=>{const b=best(key,lo);return `<tr><th>${label}</th>${cars.map((c,i)=>`<td class="${b[i]&&!(skip&&skip(c))?"win":""}">${skip&&skip(c)?"–":f(c)}</td>`).join("")}</tr>`};
  T.innerHTML=`<thead><tr><th></th>${cars.map(c=>`<th>${esc(c.name)}</th>`).join("")}</tr></thead><tbody>
${line("ราคา","pr",c=>"฿"+fmt(c.pr))}
${line(`ดาวน์ ${down}%`,"pr",c=>"฿"+fmt(c.pr*down/100))}
${line(`ค่างวด (${n} งวด)`,"pay",c=>"฿"+fmt(c.pay)+"/ด.")}
${line("ภาษีประจำปี","tax",c=>"฿"+fmt(c.tax),true,c=>!c.hasTax)}
${line(`ค่าพลังงาน/ปี (${fmt(km)} กม.)`,"energy",c=>"฿"+fmt(c.energy),true,c=>!c.hasEco)}
${line("ประกันต่อปี","ins",c=>"฿"+fmt(c.ins))}
${line("เลขไมล์","km",c=>fmt(c.km)+" กม.")}
${line("อายุรถ","age",c=>(c.age-1)+" ปี")}
<tr class="sum">${(()=>{const b=best("own5");return `<th>ค่าใช้จ่ายรวม 5 ปี</th>${cars.map((c,i)=>`<td class="${b[i]?"win":""}">฿${fmt(c.own5)}</td>`).join("")}`})()}</tr>
<tr><th>เฉลี่ยต่อเดือน</th>${cars.map(c=>`<td>฿${fmt(c.own5/60)}</td>`).join("")}</tr>
</tbody>`;
  const sorted=[...cars].sort((a,b)=>a.own5-b.own5);
  $("cmpHint").textContent=`${sorted[0].name} ถูกกว่า ${sorted[1].name} ราว ฿${fmt(sorted[1].own5-sorted[0].own5)} ใน 5 ปี (฿${fmt((sorted[1].own5-sorted[0].own5)/60)}/เดือน) ยังไม่รวมค่าซ่อมบำรุงและราคาขายต่อ`;
  once();
}

// ---------- 2) สัญญาซื้อขาย ----------
const TH_M=["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const thDate=d=>{if(!d)return "";const [y,m,dd]=d.split("-").map(Number);return `${dd} ${TH_M[m-1]} พ.ศ. ${y+543}`};
const blank=(t,w=14)=>t?`<u>${esc(t)}</u>`:`<span class="blank" style="min-width:${w}ch"></span>`;
const K_IDS=["kPlace","kDate","kSName","kSId","kSTel","kSAddr","kBName","kBId","kBTel","kBAddr","kBrand","kYear","kPlate","kProv","kColor","kKm","kVin","kEng","kPrice","kDep","kPayDate","kFee","kExtra"];
// คำอ่านจำนวนเงินภาษาไทย
function bahtText(n){
  n=Math.round(n);if(!n)return "";
  const D=["","หนึ่ง","สอง","สาม","สี่","ห้า","หก","เจ็ด","แปด","เก้า"],P=["","สิบ","ร้อย","พัน","หมื่น","แสน"];
  const grp=(x,lead)=>{let s="",str=String(x),L=str.length;for(let i=0;i<L;i++){const d=+str[i],pos=L-i-1;if(!d)continue;
    if(pos===1&&d===1)s+="สิบ";else if(pos===1&&d===2)s+="ยี่สิบ";else if(pos===0&&d===1&&(L>1||!lead))s+="เอ็ด";else s+=D[d]+P[pos]}return s};
  let out="";const parts=[];while(n>0){parts.unshift(n%1000000);n=Math.floor(n/1000000);}
  parts.forEach((p,i)=>{out+=grp(p,i===0);if(i<parts.length-1)out+="ล้าน"});
  return out+"บาทถ้วน";
}
function contract(){
  const g=id=>s(id);
  const price=v("kPrice"),dep=Math.min(v("kDep"),price),rest=price-dep;
  const money=x=>x?`${blank(fmt(x))} บาท (${bahtText(x)})`:blank("",20)+" บาท";
  const extra=g("kExtra");
  const party=(p,role)=>`${blank(g(p+"Name"),26)} เลขประจำตัวประชาชน ${blank(g(p+"Id"),17)} ที่อยู่ ${blank(g(p+"Addr"),40)} โทร ${blank(g(p+"Tel"),12)} ซึ่งต่อไปในสัญญานี้เรียกว่า "${role}"`;
  let n=0;const c=t=>`<p><b>ข้อ ${++n}.</b> ${t}</p>`;
  $("kPaper").innerHTML=`<h2>สัญญาซื้อขายรถยนต์</h2>
<p class="r">ทำที่ ${blank(g("kPlace"),22)}<br>วันที่ ${blank(thDate(g("kDate")),22)}</p>
<p>สัญญานี้ทำขึ้นระหว่าง ${party("kS","ผู้ขาย")} ฝ่ายหนึ่ง กับ ${party("kB","ผู้ซื้อ")} อีกฝ่ายหนึ่ง ทั้งสองฝ่ายตกลงกันดังต่อไปนี้</p>
${c(`ผู้ขายตกลงขายและผู้ซื้อตกลงซื้อรถยนต์ยี่ห้อ/รุ่น ${blank(g("kBrand"),20)} ปี ${blank(g("kYear"),6)} สี ${blank(g("kColor"),8)} หมายเลขทะเบียน ${blank(g("kPlate"),10)} จังหวัด ${blank(g("kProv"),14)} เลขตัวรถ ${blank(g("kVin"),18)} เลขเครื่องยนต์ ${blank(g("kEng"),14)} เลขไมล์ ณ วันทำสัญญา ${blank(g("kKm"),8)} กิโลเมตร พร้อมอุปกรณ์ที่ติดมากับรถ ซึ่งต่อไปเรียกว่า "รถยนต์"`)}
${c(`ราคาซื้อขายรถยนต์ทั้งสิ้น ${money(price)}`)}
${c(dep?`ในวันทำสัญญานี้ ผู้ซื้อได้ชำระเงินมัดจำให้แก่ผู้ขายแล้วเป็นเงิน ${money(dep)} และผู้ขายได้รับเงินจำนวนดังกล่าวไว้ถูกต้องแล้ว ส่วนที่เหลืออีก ${money(rest)} ผู้ซื้อจะชำระให้ครบภายในวันที่ ${blank(thDate(g("kPayDate")),20)}`
  :`ผู้ซื้อจะชำระราคาทั้งหมดให้แก่ผู้ขายภายในวันที่ ${blank(thDate(g("kPayDate")),20)} และผู้ขายจะออกหลักฐานการรับเงินให้แก่ผู้ซื้อ`)}
${c(`ผู้ขายรับรองว่าเป็นเจ้าของกรรมสิทธิ์รถยนต์โดยชอบด้วยกฎหมาย รถยนต์ไม่ติดภาระจำนอง เช่าซื้อ หรือข้อพิพาทใด ไม่ได้มาจากการกระทำผิดกฎหมาย และเลขตัวรถกับเลขเครื่องยนต์ตรงกับเล่มทะเบียน หากปรากฏภายหลังว่าไม่เป็นความจริง ผู้ขายยินยอมคืนเงินทั้งหมดที่ได้รับและรับผิดชดใช้ความเสียหายที่เกิดขึ้นแก่ผู้ซื้อ`)}
${c(`ผู้ซื้อได้ตรวจดูสภาพรถยนต์แล้ว และยอมรับสภาพรถยนต์ตามที่เป็นอยู่ในวันทำสัญญา`)}
${c(`เมื่อผู้ซื้อชำระราคาครบถ้วน ผู้ขายจะส่งมอบรถยนต์ กุญแจ เล่มทะเบียนตัวจริง และเอกสารที่จำเป็นต่อการโอนกรรมสิทธิ์ และไปดำเนินการโอนทะเบียนที่สำนักงานขนส่งร่วมกับผู้ซื้อ ค่าธรรมเนียมการโอนและค่าใช้จ่ายที่เกี่ยวข้อง${blank(g("kFee"),10)}เป็นผู้รับผิดชอบ`)}
${c(`ความรับผิดทางแพ่งและทางอาญา ค่าปรับจราจร และภาระใดที่เกิดจากการใช้รถยนต์ก่อนวันส่งมอบเป็นความรับผิดชอบของผู้ขาย ตั้งแต่วันส่งมอบเป็นต้นไปเป็นความรับผิดชอบของผู้ซื้อ`)}
${c(dep?`หากผู้ซื้อไม่ชำระเงินส่วนที่เหลือภายในกำหนด ผู้ขายมีสิทธิ์บอกเลิกสัญญาและริบเงินมัดจำ หากผู้ขายผิดสัญญาไม่ส่งมอบรถยนต์หรือไม่โอนทะเบียน ผู้ขายต้องคืนเงินมัดจำและเงินที่ได้รับทั้งหมดแก่ผู้ซื้อ`
  :`หากฝ่ายใดผิดสัญญา อีกฝ่ายมีสิทธิ์บอกเลิกสัญญาและเรียกค่าเสียหายที่เกิดขึ้นจริงได้ และผู้ขายต้องคืนเงินที่ได้รับทั้งหมดแก่ผู้ซื้อ`)}
${extra?c(esc(extra).replace(/\n/g,"<br>")):""}
<p>สัญญานี้ทำขึ้นเป็นสองฉบับมีข้อความตรงกัน คู่สัญญาได้อ่านและเข้าใจข้อความโดยตลอดแล้ว จึงลงลายมือชื่อไว้เป็นหลักฐานต่อหน้าพยาน และเก็บไว้ฝ่ายละหนึ่งฉบับ</p>
<div class="signs">
 <div>ลงชื่อ<span class="sl"></span>ผู้ขาย<br>(${blank(g("kSName"),24)})</div>
 <div>ลงชื่อ<span class="sl"></span>ผู้ซื้อ<br>(${blank(g("kBName"),24)})</div>
 <div>ลงชื่อ<span class="sl"></span>พยาน<br>(<span class="blank" style="min-width:24ch"></span>)</div>
 <div>ลงชื่อ<span class="sl"></span>พยาน<br>(<span class="blank" style="min-width:24ch"></span>)</div>
</div>`;
}
function initContract(){
  // จำร่างไว้ในเครื่อง (sessionStorage) เผื่อรีเฟรชหน้า ไม่ส่งออกไปไหน
  if(!location.search)try{const saved=JSON.parse(sessionStorage.getItem("kt-contract")||"{}");K_IDS.forEach(id=>{if(saved[id]!=null&&$(id))$(id).value=saved[id]})}catch(e){}
  if(!$("kDate").value)$("kDate").value=new Date().toISOString().slice(0,10);
  const save=()=>{try{const o={};K_IDS.forEach(id=>o[id]=$(id).value);sessionStorage.setItem("kt-contract",JSON.stringify(o))}catch(e){}};
  bind(K_IDS,()=>{contract();save()});
  $("kPrint").onclick=()=>{track("tool_use",{tool:"contract_print"});window.print()};
  $("kClear").onclick=()=>{K_IDS.forEach(id=>{if(id!=="kFee")$(id).value=""});$("kDate").value=new Date().toISOString().slice(0,10);try{sessionStorage.removeItem("kt-contract")}catch(e){}contract()};
}


// ---------- 6) ค่าน้ำมันเทียบ EV ----------
function fuelCost(){
  const km=v("fDay")*v("fDays"),eco=v("fEco"),evEco=v("fEv"),home=Math.min(100,Math.max(0,v("fHome")))/100;
  if(!km||!eco||!evEco){$("fSave").textContent="-";$("fRows").innerHTML="";return}
  const gas=km/eco*v("fPrice");
  const kwh=km/evEco,ev=kwh*(home*v("fKwhHome")+(1-home)*v("fKwhPub"));
  const save=gas-ev,gap=v("fGap");
  rows("fRows",[
    ["ระยะทางต่อเดือน",fmt(km)+" กม."],
    ["รถน้ำมัน: ใช้น้ำมัน",fmt(km/eco)+" ลิตร/เดือน"],
    ["รถน้ำมัน: ค่าน้ำมัน",`฿${fmt(gas)}/เดือน · ฿${fmt(gas*12)}/ปี`],
    ["EV: ใช้ไฟ",fmt(kwh)+" kWh/เดือน"],
    ["EV: ค่าไฟชาร์จ",`฿${fmt(ev)}/เดือน · ฿${fmt(ev*12)}/ปี`],
    ["ต้นทุนต่อกิโลเมตร",`น้ำมัน ฿${(gas/km).toFixed(2)} · EV ฿${(ev/km).toFixed(2)}`],
    ["ประหยัดต่อปี",`฿${fmt(save*12)}`,"sum"],
    ...(gap>0&&save>0?[["คืนทุนส่วนต่างราคารถ",`${(gap/(save*12)).toFixed(1)} ปี`,"sum"]]:[])
  ]);
  $("fSave").textContent=save>0?"฿"+fmt(save):"ไม่ประหยัด";
  $("fHint").textContent=gap>0&&save>0&&gap/(save*12)>8?"ระยะคืนทุนเกิน 8 ปี ถ้าขับน้อยแบบนี้ รถน้ำมันหรือไฮบริดอาจคุ้มกว่า":(save>0?"ยังไม่รวมค่าบำรุงรักษา ซึ่ง EV มักถูกกว่าเพราะไม่ต้องเปลี่ยนน้ำมันเครื่อง":"");
  once();
}

// ---------- 7) เช็กลิสต์ ----------
function initChecklist(){
  const KEY="kt-checklist";let st={};try{st=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){}
  st.ok=st.ok||{};st.bad=st.bad||{};
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
  const boxes=[...document.querySelectorAll("[data-ck]")];
  const paint=()=>{
    boxes.forEach(b=>{const n=b.dataset.ck;b.checked=!!st.ok[n];const li=b.closest("li");li.classList.toggle("done",!!st.ok[n]);li.classList.toggle("bad",!!st.bad[n])});
    const done=Object.values(st.ok).filter(Boolean).length,bad=Object.values(st.bad).filter(Boolean).length;
    $("ckDone").textContent=done;$("ckBad").textContent=bad;$("ckFill").style.width=(done/boxes.length*100)+"%";
    document.querySelectorAll(".ck-group").forEach(g=>{const all=g.querySelectorAll("[data-ck]").length,ok=g.querySelectorAll("[data-ck]:checked").length;g.querySelector("[data-gcount]").textContent=`${ok}/${all}`});
  };
  $("ckCar").value=st.car||"";
  $("ckCar").addEventListener("input",()=>{st.car=$("ckCar").value;save()});
  document.querySelector(".ck-groups").addEventListener("change",e=>{const n=e.target.dataset.ck;if(!n)return;st.ok[n]=e.target.checked;if(e.target.checked)st.bad[n]=false;save();paint();ready&&once()});
  document.querySelector(".ck-groups").addEventListener("click",e=>{const b=e.target.closest("[data-flag]");if(!b)return;const n=b.dataset.flag;st.bad[n]=!st.bad[n];if(st.bad[n])st.ok[n]=false;save();paint();once()});
  $("ckReset").onclick=()=>{if(!confirmReset())return;st={ok:{},bad:{}};$("ckCar").value="";save();paint()};
  $("ckPrint").onclick=()=>window.print();
  paint();
}
function confirmReset(){const b=$("ckReset");if(b.dataset.armed){delete b.dataset.armed;b.textContent="เริ่มใหม่";return true}b.dataset.armed="1";b.textContent="กดอีกครั้งเพื่อล้าง";setTimeout(()=>{delete b.dataset.armed;b.textContent="เริ่มใหม่"},3000);return false}

// ---------- 8) ประเมินราคา ----------
let POOL=[];
async function initEstimate(){
  const base=document.body.dataset.base||"../";
  let demo=[];try{if(!(window.KT_SITE&&window.KT_SITE.show_demo===false))demo=await (await fetch(base+"assets/cars.json")).json()}catch(e){}
  let user=[];try{const j=await (await fetch("/api/listings")).json();user=(j.listings||[]).map(l=>({brand:l.brand,model:l.model,sub:l.sub||"",year:+l.year,price:+l.price,km:+l.km,url:"/l/"+l.id,sold:!!l.sold}))}catch(e){}
  POOL=[...user,...demo].filter(c=>c.brand&&c.price>0);
  const brands=[...new Set(POOL.map(c=>c.brand))].sort();
  $("eBrand").innerHTML='<option value="">เลือกยี่ห้อ</option>'+brands.map(b=>`<option>${esc(b)}</option>`).join("");
  $("eData").textContent=`ใช้ข้อมูลจากประกาศ ${fmt(POOL.length)} คันบนขับต่อ`;
  const q=new URLSearchParams(location.search);
  if(q.get("brand")){$("eBrand").value=q.get("brand");models();if(q.get("model"))$("eModel").value=q.get("model")}
  $("eBrand").addEventListener("change",()=>{models();estimate()});
  bind(["eModel","eYear","eKm"],estimate);
}
function models(){
  const b=$("eBrand").value,ms=[...new Set(POOL.filter(c=>c.brand===b).map(c=>c.model))].sort();
  $("eModel").innerHTML='<option value="">เลือกรุ่น</option>'+ms.map(m=>`<option>${esc(m)}</option>`).join("");
}
const median=a=>{const x=[...a].sort((p,q)=>p-q),m=x.length>>1;return x.length%2?x[m]:(x[m-1]+x[m])/2};
function estimate(){
  const b=$("eBrand").value,m=$("eModel").value,y=v("eYear"),km=v("eKm");
  if(!b){$("ePrice").textContent="-";$("eRows").innerHTML="";$("eList").innerHTML="";$("eHint").textContent="เลือกยี่ห้อเพื่อเริ่มประเมิน";return}
  if(!m){$("ePrice").textContent="เลือกรุ่น";$("eRows").innerHTML="";$("eList").innerHTML="";$("eHint").textContent="รถต่างรุ่นราคาต่างกันมาก เลือกรุ่นก่อนเพื่อให้ได้ราคาที่เทียบกันได้";return}
  let comp=POOL.filter(c=>c.brand===b&&c.model===m);
  if(y)comp=comp.filter(c=>Math.abs(c.year-y)<=4);
  if(!comp.length){$("ePrice").textContent="ข้อมูลไม่พอ";$("eRows").innerHTML="";$("eList").innerHTML="";$("eHint").textContent="ยังไม่มีประกาศรุ่นนี้ในช่วงปีใกล้เคียง ลองเลือกปีเป็น ทุกปี";return}
  const adj=comp.map(c=>{let p=c.price;if(y)p*=Math.pow(1.07,y-c.year);if(km)p*=1-0.015*(km-c.km)/10000;return {...c,adj:Math.max(p,c.price*0.4)}});
  const prices=adj.map(c=>c.adj).sort((p,q)=>p-q);
  const mid=median(prices),lo=prices[Math.floor((prices.length-1)*0.25)],hi=prices[Math.ceil((prices.length-1)*0.75)];
  const r=x=>Math.round(x/1000)*1000;
  $("ePrice").textContent="฿"+fmt(r(mid));
  rows("eRows",[
    ["ช่วงราคาที่พบบ่อย",comp.length>=3?`฿${fmt(r(lo))} – ฿${fmt(r(hi))}`:"ต้องมีอย่างน้อย 3 คัน"],
    ["ตั้งราคาขายแนะนำ",`฿${fmt(r(mid*1.03))}`],
    ["ราคาต่อรองซื้อที่สมเหตุสมผล",`฿${fmt(r(mid*0.95))}`],
    ["จำนวนประกาศที่ใช้เทียบ",comp.length+" คัน","sum"]
  ]);
  $("eHint").textContent=comp.length<5?"ข้อมูลยังน้อย ผลประเมินอาจคลาดเคลื่อน ใช้ประกอบกับราคาจากแหล่งอื่น":(y||km?"ปรับราคาแต่ละคันตามปีและเลขไมล์ของรถคุณแล้ว":"ใส่ปีและเลขไมล์เพื่อให้แม่นขึ้น");
  $("eList").innerHTML=`<thead><tr><th>รถ</th><th>ปี</th><th>เลขไมล์</th><th>ราคาประกาศ</th><th>ปรับเทียบรถคุณ</th></tr></thead><tbody>`+
    adj.sort((p,q)=>Math.abs(p.year-(y||p.year))-Math.abs(q.year-(y||q.year))||p.price-q.price).slice(0,12).map(c=>`<tr><th>${c.url?`<a href="${esc(c.url)}">${esc(c.brand+" "+c.model+" "+c.sub)}</a>`:esc(c.brand+" "+c.model+" "+c.sub)}${c.sold?" (ขายแล้ว)":""}</th><td>${c.year}</td><td>${fmt(c.km)}</td><td>฿${fmt(c.price)}</td><td>฿${fmt(c.adj)}</td></tr>`).join("")+"</tbody>";
  once();
}

// ---------- รับรถจากปุ่ม "เปรียบเทียบ" บนการ์ด ----------
const FUEL_MAP={"เบนซิน":["gas",14],"ดีเซล":["diesel",13],"ไฮบริด":["hybrid",20],"ไฟฟ้า":["ev",6.5]};
function prefillCompare(){
  let list=[];try{list=JSON.parse(localStorage.getItem("kt-compare")||"[]")}catch(e){}
  if(!list.length)return;
  [1,2,3].forEach(i=>["Name","Price","Year","Eco","CC","Ins","Km"].forEach(k=>$("c"+i+k).value=""));
  list.slice(0,3).forEach((c,i)=>{const p="c"+(i+1),f=FUEL_MAP[c.fuel]||["gas",14];
    $(p+"Name").value=c.name;$(p+"Price").value=c.price;$(p+"Year").value=c.year;$(p+"Km").value=c.km;$(p+"Fuel").value=f[0];$(p+"Eco").value=f[1];$(p+"Ins").value=Math.round(Math.max(9000,c.price*0.03)/500)*500});
  const n=document.createElement("div");n.className="cmp-from";n.innerHTML=`เปรียบเทียบรถ ${list.length} คันที่คุณเลือกจากหน้ารวมรถ ใส่ cc เพื่อคิดภาษี และแก้อัตราสิ้นเปลืองได้ <button type="button" class="btn btn-line" id="cmpClear">ล้างรายการที่เลือก</button>`;
  document.querySelector(".cmp-cols").before(n);
  $("cmpClear").onclick=()=>{try{localStorage.removeItem("kt-compare")}catch(e){}location.href=location.pathname};
}

function qsPrefill(){
  const q=new URLSearchParams(location.search);
  q.forEach((val,key)=>{const e=$(key);if(e&&/^[a-zA-Z0-9]+$/.test(key))e.value=val});
}

document.addEventListener("DOMContentLoaded",()=>{
  qsPrefill();
  if(TOOL==="car-tax")bind(["tType","tCC","tKg","tYear","tLate","tCmi","tEvDisc"],carTax);
  if(TOOL==="transfer-fee")bind(["xPrice","xPlate","xBook","xPayer","xAgent"],transfer);
  if(TOOL==="afford")bind(["aInc","aDebt","aDown","aRate","aMonths","aStyle"],afford);
  if(TOOL==="fuel-cost")bind(["fDay","fDays","fEco","fPrice","fEv","fHome","fKwhHome","fKwhPub","fGap"],fuelCost);
  if(TOOL==="checklist")initChecklist();
  if(TOOL==="price-estimate")initEstimate();
  if(TOOL==="compare"){prefillCompare();const ids=["sKm","sGas","sDiesel","sKwh","sDown","sRate","sMonths"];[1,2,3].forEach(i=>["Name","Price","Year","Fuel","Eco","CC","Ins","Km"].forEach(k=>ids.push("c"+i+k)));bind(ids,compare)}
  if(TOOL==="contract")initContract();
  ready=true;
});
})();
