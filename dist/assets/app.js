const PROVS=["กรุงเทพมหานคร","นนทบุรี","ปทุมธานี","สมุทรปราการ","ชลบุรี","เชียงใหม่","ขอนแก่น","นครราชสีมา","ภูเก็ต","สงขลา"];
const PROV_ABBR={"กรุงเทพมหานคร":"กรุงเทพมหานคร","นนทบุรี":"นนทบุรี","ปทุมธานี":"ปทุมธานี","สมุทรปราการ":"สมุทรปราการ","ชลบุรี":"ชลบุรี","เชียงใหม่":"เชียงใหม่","ขอนแก่น":"ขอนแก่น","นครราชสีมา":"นครราชสีมา","ภูเก็ต":"ภูเก็ต","สงขลา":"สงขลา"};
const BODY={sedan:"เก๋ง",hatch:"แฮทช์แบ็ก",suv:"SUV / PPV",pickup:"กระบะ",van:"รถตู้"};
const COLORS={"ขาว":"#eef1f4","ดำ":"#22262c","เทา":"#8a939d","เงิน":"#c3c9cf","แดง":"#c0303a","น้ำเงิน":"#2b4f8f","น้ำตาล":"#7a5a3e"};
// [brand, model, sub, year, price, km, body, gear, fuel, color, prov, seller, cert, daysAgo, plate]
const RAW=[
["Toyota","Hilux Revo","2.4 Prerunner Entry D-Cab",2021,629000,58000,"pickup","อัตโนมัติ","ดีเซล","ขาว","นครราชสีมา","dealer",1,1,"1ฒข 4821"],
["Honda","City","1.0 Turbo SV",2022,489000,32000,"sedan","อัตโนมัติ","เบนซิน","แดง","กรุงเทพมหานคร","dealer",1,0,"9กษ 1170"],
["Isuzu","D-Max","1.9 Hi-Lander Cab4 Z",2020,559000,96000,"pickup","อัตโนมัติ","ดีเซล","เทา","ขอนแก่น","owner",0,2,"บต 3308"],
["Toyota","Yaris Ativ","1.2 Premium",2023,459000,18000,"sedan","อัตโนมัติ","เบนซิน","เงิน","นนทบุรี","dealer",1,3,"1ขม 7735"],
["Toyota","Fortuner","2.4 V 2WD",2019,899000,112000,"suv","อัตโนมัติ","ดีเซล","ดำ","ชลบุรี","dealer",1,1,"กว 9152"],
["Mazda","2","1.3 Skyactiv-G SP Sports",2019,329000,74000,"hatch","อัตโนมัติ","เบนซิน","แดง","เชียงใหม่","owner",0,4,"กธ 2219"],
["Mazda","CX-5","2.0 SP",2020,729000,61000,"suv","อัตโนมัติ","เบนซิน","น้ำเงิน","กรุงเทพมหานคร","dealer",1,0,"8กม 6402"],
["Honda","HR-V","1.5 e:HEV RS",2022,989000,27000,"suv","อัตโนมัติ","ไฮบริด","ขาว","ปทุมธานี","dealer",1,2,"1กล 5508"],
["Nissan","Almera","1.0 Turbo VL",2021,369000,49000,"sedan","อัตโนมัติ","เบนซิน","เทา","สมุทรปราการ","owner",0,5,"2กพ 8813"],
["Ford","Ranger","2.0 Wildtrak 4x4 D-Cab",2022,1089000,41000,"pickup","อัตโนมัติ","ดีเซล","น้ำตาล","ภูเก็ต","dealer",1,1,"กข 1144"],
["MG","ZS EV","Long Range X",2022,529000,36000,"suv","อัตโนมัติ","ไฟฟ้า","ขาว","กรุงเทพมหานคร","dealer",0,3,"7ขค 2290"],
["BYD","Atto 3","Extended Range",2023,789000,22000,"suv","อัตโนมัติ","ไฟฟ้า","เทา","นนทบุรี","owner",0,0,"1ขฉ 4467"],
["Mitsubishi","Pajero Sport","2.4 GT Premium 2WD",2020,889000,83000,"suv","อัตโนมัติ","ดีเซล","ดำ","สงขลา","dealer",1,6,"ขพ 6610"],
["Honda","Jazz","1.5 RS",2018,389000,98000,"hatch","อัตโนมัติ","เบนซิน","น้ำเงิน","ขอนแก่น","owner",0,7,"ฆฉ 9071"],
["Toyota","Camry","2.5 Hybrid Premium",2019,899000,88000,"sedan","อัตโนมัติ","ไฮบริด","ดำ","กรุงเทพมหานคร","dealer",1,2,"6กฐ 3387"],
["Mercedes-Benz","C-Class","C220d Avantgarde",2019,1290000,79000,"sedan","อัตโนมัติ","ดีเซล","เงิน","กรุงเทพมหานคร","dealer",1,4,"5กร 1912"],
["BMW","3 Series","320d M Sport",2020,1390000,65000,"sedan","อัตโนมัติ","ดีเซล","ขาว","ชลบุรี","dealer",1,1,"1กว 8008"],
["Suzuki","Swift","1.2 GLX",2021,399000,39000,"hatch","อัตโนมัติ","เบนซิน","แดง","ปทุมธานี","owner",0,3,"3กฬ 4520"],
["Toyota","Corolla Cross","1.8 Hybrid Premium Safety",2021,789000,52000,"suv","อัตโนมัติ","ไฮบริด","ขาว","เชียงใหม่","dealer",1,0,"1กศ 2663"],
["Isuzu","D-Max","3.0 V-Cross 4x4 M",2023,989000,19000,"pickup","อัตโนมัติ","ดีเซล","เทา","นครราชสีมา","dealer",1,2,"1ฒฌ 1001"],
["Toyota","Vios","1.5 E",2016,239000,141000,"sedan","อัตโนมัติ","เบนซิน","เงิน","สงขลา","owner",0,9,"ฆง 5733"],
["Toyota","Hiace","Commuter 2.8",2019,1099000,156000,"van","อัตโนมัติ","ดีเซล","ขาว","กรุงเทพมหานคร","dealer",0,5,"ฮก 7712"],
["Nissan","Navara","2.5 Calibre E Single Cab",2018,349000,132000,"pickup","ธรรมดา","ดีเซล","ขาว","ขอนแก่น","owner",0,8,"ผพ 2047"],
["Honda","Civic","1.5 Turbo RS",2021,889000,44000,"sedan","อัตโนมัติ","เบนซิน","เทา","สมุทรปราการ","dealer",1,1,"4กธ 9915"]
];
const CARS=RAW.map((r,i)=>({id:i+1,brand:r[0],model:r[1],sub:r[2],year:r[3],price:r[4],km:r[5],body:r[6],gear:r[7],fuel:r[8],color:r[9],prov:r[10],seller:r[11],cert:!!r[12],days:r[13],plate:r[14]}));
/* รถตัวอย่างถูกปิดในหลังบ้าน */
if(window.KT_SITE&&window.KT_SITE.show_demo===false)CARS.length=0;

const slug=c=>(c.year+"-"+c.brand+"-"+c.model+"-"+c.id).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const BASE=(document.body.dataset.base||"");
/* Analytics: no-op until GA4 is configured and consent given (see site.js) */
const track=(name,params)=>{try{window.ktTrack&&window.ktTrack(name,params||{})}catch(e){}};
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>Math.round(n).toLocaleString("th-TH");
const $=id=>document.getElementById(id);
let favs=new Set();
try{favs=new Set(JSON.parse(localStorage.getItem("khaptor-favs")||"[]"))}catch(e){}
const saveFavs=()=>{try{localStorage.setItem("khaptor-favs",JSON.stringify([...favs]))}catch(e){};$("favCount").textContent=favs.size};

function monthly(price,downPct=15,rate=3.49,months=72){
  const fin=price*(1-downPct/100);
  const total=fin+fin*(rate/100)*(months/12);
  return total/months*1.07;
}

/* SVG car drawing by body type */
function carSVG(c){
  const col=COLORS[c.color]||"#999";
  const dark=c.color==="ดำ"||c.color==="น้ำเงิน"||c.color==="น้ำตาล"||c.color==="แดง";
  const glass=dark?"#9fb7cc":"#3d5266";
  const P={
    sedan:"M18 92 L30 72 Q34 66 44 64 L86 58 Q100 40 126 38 L184 38 Q206 40 222 58 L262 64 Q280 68 284 84 L284 96 Q284 100 278 100 L22 100 Q16 100 18 92Z",
    hatch:"M22 92 L32 72 Q36 64 48 62 L90 56 Q108 34 140 32 L210 34 Q232 38 250 60 L266 70 Q276 76 276 90 L276 98 Q276 100 270 100 L26 100 Q18 100 22 92Z",
    suv:"M18 90 L24 66 Q28 58 40 56 L78 52 Q96 26 124 24 L232 24 Q252 26 262 48 L276 58 Q284 64 284 80 L284 96 Q284 102 276 102 L24 102 Q16 102 18 90Z",
    pickup:"M16 90 L22 66 Q26 58 38 56 L76 52 Q92 28 116 26 L170 26 Q180 26 182 36 L184 58 L278 58 Q286 58 286 66 L286 96 Q286 102 278 102 L22 102 Q14 102 16 90Z",
    van:"M20 94 L22 50 Q24 30 44 24 L250 22 Q272 22 278 44 L284 76 Q286 84 286 96 Q286 102 278 102 L26 102 Q18 102 20 94Z"
  };
  const W={
    sedan:"M92 60 Q106 44 128 43 L150 43 L150 60Z M156 43 L182 43 Q200 45 214 60 L156 60Z",
    hatch:"M96 58 Q112 38 140 37 L160 37 L160 58Z M166 37 L208 38 Q226 42 240 60 L166 58Z",
    suv:"M84 52 Q100 30 126 29 L160 29 L160 52Z M166 29 L228 29 Q244 31 254 50 L166 52Z",
    pickup:"M82 52 Q96 32 118 31 L144 31 L144 52Z M150 31 L172 31 Q176 31 177 38 L178 52 L150 52Z",
    van:"M36 50 Q38 32 54 30 L100 30 L100 52 L36 52Z M108 30 L160 30 L160 52 L108 52Z M168 30 L240 29 Q258 30 264 50 L168 52Z"
  };
  const b=c.body;
  return `<svg viewBox="0 0 300 130" role="img" aria-label="ภาพประกอบ ${c.brand} ${c.model} สี${c.color}">
    <ellipse cx="150" cy="112" rx="132" ry="7" fill="rgba(0,0,0,.18)"/>
    <path d="${P[b]}" fill="${col}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>
    <path d="${W[b]}" fill="${glass}" opacity=".9"/>
    <path d="M30 82 L270 82" stroke="rgba(0,0,0,.12)" stroke-width="2"/>
    <rect x="270" y="72" width="12" height="6" rx="2" fill="#ffd27a"/>
    <rect x="18" y="74" width="8" height="6" rx="2" fill="#d9454f"/>
    ${[70,230].map(x=>`<circle cx="${x}" cy="100" r="17" fill="#1c1f24"/><circle cx="${x}" cy="100" r="8" fill="#b9c0c8"/><circle cx="${x}" cy="100" r="2.5" fill="#1c1f24"/>`).join("")}
  </svg>`;
}
function picHTML(c){
  if(c.photos&&c.photos.length)return `<div class="pic has-photo"><img src="/p/${esc(c.photos[0])}-t.jpg" alt="${esc(c.year+" "+c.brand+" "+c.model)}" loading="lazy">${c.photos.length>1?`<span class="ph-count">${c.photos.length} รูป</span>`:""}`;
  const bg=`hsl(${(c.id*37)%360} 22% ${document.documentElement.dataset.theme==="dark"?"22%":"91%"})`;
  return `<div class="pic" style="background:linear-gradient(180deg,${bg},color-mix(in srgb,${bg} 70%,#000 6%))">${carSVG(c)}`;
}

/* populate selects */
const brands=[...new Set(CARS.map(c=>c.brand))].sort();
function fillSelect(el,items,first){el.innerHTML=(first?`<option value="">${first}</option>`:"")+items.map(v=>typeof v==="object"?`<option value="${v[0]}">${v[1]}</option>`:`<option>${v}</option>`).join("")}
fillSelect($("sBrand"),brands,"ทุกยี่ห้อ");
fillSelect($("sYear"),Array.from({length:16},(_,i)=>new Date().getFullYear()-i).map(y=>[y,"ตั้งแต่ "+y]),"ทุกปี");
fillSelect($("sProv"),PROVS,"ทุกจังหวัด");
const SELL_BRANDS=["BMW","BYD","Chevrolet","Ford","Honda","Hyundai","Isuzu","Kia","Mazda","Mercedes-Benz","MG","Mitsubishi","Nissan","Subaru","Suzuki","Toyota","Volvo","อื่นๆ"];
fillSelect($("slBrand"),SELL_BRANDS,"เลือกยี่ห้อ");
fillSelect($("slYear"),Array.from({length:25},(_,i)=>new Date().getFullYear()-i));
fillSelect($("slProv"),[...PROVS,"อื่นๆ"],"เลือกจังหวัด");
fillSelect($("slBody"),Object.entries(BODY),"เลือกประเภท");
fillSelect($("slGear"),["อัตโนมัติ","ธรรมดา"]);
fillSelect($("slFuel"),["เบนซิน","ดีเซล","ไฮบริด","ไฟฟ้า"]);
fillSelect($("slColor"),Object.keys(COLORS));
function refreshModels(){const b=$("sBrand").value;const ms=[...new Set(CARS.filter(c=>!b||c.brand===b).map(c=>c.model))].sort();fillSelect($("sModel"),ms,"ทุกรุ่น")}
refreshModels();
$("sBrand").addEventListener("change",refreshModels);

const state={brand:"",model:"",minPrice:0,maxPrice:0,year:0,prov:"",body:new Set(),gear:new Set(),fuel:new Set(),seller:new Set(),km:200000,cert:false,sort:"new",onlyFav:false};

function checkboxGroup(elId,key,values,labelFn){
  $(elId).innerHTML=values.map(v=>`<label class="ck"><input type="checkbox" data-k="${key}" value="${v}"> ${labelFn?labelFn(v):v}<span data-count="${key}:${v}"></span></label>`).join("");
}
checkboxGroup("fBody","body",Object.keys(BODY),v=>BODY[v]);
checkboxGroup("fGear","gear",["อัตโนมัติ","ธรรมดา"]);
checkboxGroup("fFuel","fuel",["เบนซิน","ดีเซล","ไฮบริด","ไฟฟ้า"]);
checkboxGroup("fSeller","seller",["dealer","owner"],v=>v==="dealer"?"เต็นท์รถ / ดีลเลอร์":"เจ้าของขายเอง");
document.querySelectorAll("aside input[data-k]").forEach(i=>i.addEventListener("change",e=>{const s=state[e.target.dataset.k];e.target.checked?s.add(e.target.value):s.delete(e.target.value);if(e.target.checked)track("filter",{filter_type:e.target.dataset.k,filter_value:e.target.value});render()}));
$("fKm").addEventListener("input",e=>{state.km=+e.target.value;$("fKmVal").textContent=fmt(state.km)+" กม.";render()});
$("fCert").addEventListener("change",e=>{state.cert=e.target.checked;render()});
$("sort").addEventListener("change",e=>{state.sort=e.target.value;render()});

function brandChips(){
  const counts={};CARS.forEach(c=>counts[c.brand]=(counts[c.brand]||0)+1);
  $("brandChips").innerHTML=`<button type="button" class="chip ${!state.brand?"on":""}" data-b=""><b>ทั้งหมด</b><span>${CARS.length}</span></button>`+
    Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([b,n])=>`<button type="button" class="chip ${state.brand===b?"on":""}" data-b="${b}"><b>${b}</b><span>${n}</span></button>`).join("");
}
$("brandChips").addEventListener("click",e=>{const t=e.target.closest(".chip");if(!t)return;state.brand=t.dataset.b;state.model="";$("sBrand").value=state.brand;refreshModels();render()});

$("searchForm").addEventListener("submit",e=>{
  e.preventDefault();
  state.brand=$("sBrand").value;state.model=$("sModel").value;state.maxPrice=+$("sMaxPrice").value||0;state.year=+$("sYear").value||0;state.prov=$("sProv").value;state.onlyFav=false;
  render();track("search",{search_term:[state.brand,state.model,state.prov].filter(Boolean).join(" ")||"all",max_price:state.maxPrice||null,year_from:state.year||null});document.getElementById("buy").scrollIntoView({behavior:"smooth"});
});

function matches(c,skip){
  if(state.onlyFav&&!favs.has(c.id))return false;
  if(state.brand&&c.brand!==state.brand)return false;
  if(state.model&&c.model!==state.model)return false;
  if(state.maxPrice&&c.price>state.maxPrice)return false;
  if(state.minPrice&&c.price<state.minPrice)return false;
  if(state.year&&c.year<state.year)return false;
  if(state.prov&&c.prov!==state.prov)return false;
  if(c.km>state.km)return false;
  if(state.cert&&!c.cert)return false;
  for(const k of ["body","gear","fuel","seller"]){if(k!==skip&&state[k].size&&!state[k].has(c[k]))return false}
  return true;
}

/* ส่งข้อมูลรถไปเครื่องมือ: สัญญาซื้อขาย และเปรียบเทียบ */
function contractURL(c){const q=new URLSearchParams({kBrand:(c.brand+" "+c.model+" "+(c.sub||"")).trim(),kYear:c.year,kColor:c.color||"",kKm:c.km,kPrice:c.price,kProv:c.prov||""});return BASE+"tools/contract.html?"+q}
function getCmp(){try{return JSON.parse(localStorage.getItem("kt-compare")||"[]")}catch(e){return []}}
function cmpKey(c){return c.uid||String(c.id)}
function toggleCmp(id){
  const c=CARS.find(x=>x.id===id);if(!c)return;let l=getCmp();const k=cmpKey(c);
  if(l.some(x=>x.key===k))l=l.filter(x=>x.key!==k);
  else{if(l.length>=3){toast("เปรียบเทียบได้สูงสุด 3 คัน");return}l.push({key:k,name:`${c.year} ${c.brand} ${c.model}`,price:c.price,year:c.year,km:c.km,fuel:c.fuel});track("add_to_compare",{item_id:k})}
  try{localStorage.setItem("kt-compare",JSON.stringify(l))}catch(e){}
  render();cmpBar();if($("modal").classList.contains("open"))openCar(id);
}
function cmpBar(){
  const l=getCmp();let b=$("cmpBar");
  if(!b){b=document.createElement("div");b.id="cmpBar";b.className="cmp-bar";document.body.appendChild(b);
    b.addEventListener("click",e=>{if(e.target.id==="cmpBarClear"){try{localStorage.removeItem("kt-compare")}catch(x){}render();cmpBar()}})}
  b.hidden=!l.length;
  b.innerHTML=`<span>เลือกเปรียบเทียบ <b>${l.length}</b>/3 คัน: ${l.map(x=>esc(x.name)).join(", ")}</span><button type="button" class="btn btn-line btn-sm" id="cmpBarClear">ล้าง</button><a class="btn btn-amber btn-sm" href="${BASE}tools/compare.html">${l.length<2?"เลือกอีกคัน":"ดูตารางเปรียบเทียบ"}</a>`;
}

function card(c){
  const tags=[c.cert?'<span class="tag cert">ผ่านการตรวจสภาพ</span>':"",c.fuel==="ไฟฟ้า"?'<span class="tag ev">EV</span>':"",c.sold?'<span class="tag sold-tag">ขายแล้ว</span>':"",c.user&&!c.sold?'<span class="tag">เจ้าของขายเอง</span>':"",c.days===0?'<span class="tag">ลงวันนี้</span>':""].join("");
  return `<article class="card${c.sold?" sold":""}" tabindex="0" data-id="${c.id}" aria-label="${c.brand} ${c.model} ราคา ${fmt(c.price)} บาท">
    ${picHTML(c)}<div class="tags">${tags}</div>
      <button class="fav ${favs.has(c.id)?"on":""}" type="button" data-fav="${c.id}" aria-label="บันทึกรถคันนี้" aria-pressed="${favs.has(c.id)}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="${favs.has(c.id)?"currentColor":"none"}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z"/></svg>
      </button>
      <button class="cmp-btn ${getCmp().some(x=>x.key===cmpKey(c))?"on":""}" type="button" data-cmp="${c.id}" aria-pressed="${getCmp().some(x=>x.key===cmpKey(c))}">เทียบ</button>
    </div>
    <div class="cbody">
      <h3><a href="${c.url||BASE+"cars/"+slug(c)+".html"}" class="cardlink">${c.year} ${c.brand} ${c.model}</a></h3>
      <div class="sub">${c.sub}</div>
      <div class="specs"><span>${fmt(c.km)} กม.</span><span>${c.gear}</span><span>${c.fuel}</span><span>${c.prov}</span></div>
      <div class="pricerow">
        <div><div class="price">฿${fmt(c.price)}</div><div class="monthly">ผ่อนประมาณ ฿${fmt(monthly(c.price))}/เดือน</div></div>
        <div class="plate">${esc(c.plate)}<small>${esc(PROV_ABBR[c.prov]||c.prov)}</small></div>
      </div>
      <div class="seller">${c.seller==="dealer"?"เต็นท์รถ":"เจ้าของขายเอง"} · ลงประกาศ${c.days===0?"วันนี้":` ${c.days} วันก่อน`}</div>
    </div>
  </article>`;
}

function render(){
  brandChips();
  let list=CARS.filter(c=>matches(c));
  const S={new:(a,b)=>a.days-b.days,pAsc:(a,b)=>a.price-b.price,pDesc:(a,b)=>b.price-a.price,yDesc:(a,b)=>b.year-a.year,kmAsc:(a,b)=>a.km-b.km};
  list.sort((a,b)=>(a.sold?1:0)-(b.sold?1:0)||S[state.sort](a,b));
  const title=state.onlyFav?"รถที่ถูกใจ":[state.brand||"รถมือสอง",state.model].filter(Boolean).join(" ")+(state.prov?" ใน"+state.prov:"");
  $("resultTitle").innerHTML=`${title}<small>${list.length} คัน</small>`;
  $("grid").innerHTML=list.length?list.map((c,i)=>card(c)+(i===5&&list.length>8?'<div class="ad-slot ad-infeed" data-ad="infeed"></div>':"")).join(""):(CARS.length?`<div class="empty">ไม่พบรถที่ตรงกับเงื่อนไข ลองขยายช่วงราคาหรือเอาตัวกรองบางอันออก</div>`:`<div class="empty">ยังไม่มีประกาศขายรถ <a href="#sell">ลงประกาศคันแรกฟรี</a></div>`);
  // facet counts
  document.querySelectorAll("[data-count]").forEach(el=>{const [k,v]=el.dataset.count.split(":");el.textContent=CARS.filter(c=>matches(c,k)&&c[k]===v).length});
  // active chips
  const chips=[];
  if(state.onlyFav)chips.push(["onlyFav","เฉพาะรถที่ถูกใจ"]);
  if(state.brand)chips.push(["brand",state.brand]);
  if(state.model)chips.push(["model",state.model]);
  if(state.minPrice)chips.push(["minPrice","ตั้งแต่ ฿"+fmt(state.minPrice)]);
  if(state.maxPrice)chips.push(["maxPrice","ไม่เกิน ฿"+fmt(state.maxPrice)]);
  if(state.year)chips.push(["year","ปี "+state.year+" ขึ้นไป"]);
  if(state.prov)chips.push(["prov",state.prov]);
  window.ktFillAds&&window.ktFillAds();
  const nF=state.body.size+state.gear.size+state.fuel.size+state.seller.size+(state.cert?1:0)+(state.km<200000?1:0);$("fCount").textContent=nF?String(nF):"";
  $("activeChips").innerHTML=chips.map(([k,l])=>`<button type="button" data-rm="${k}">${l} ✕</button>`).join("");
}
$("activeChips").addEventListener("click",e=>{const k=e.target.dataset.rm;if(!k)return;
  if(k==="onlyFav")state.onlyFav=false;else{state[k]=typeof state[k]==="number"?0:"";const map={brand:"sBrand",model:"sModel",maxPrice:"sMaxPrice",year:"sYear",prov:"sProv"};if(map[k])$(map[k]).value="";if(k==="brand"){state.model="";refreshModels()}}
  render()});
$("clearAll").addEventListener("click",()=>{
  Object.assign(state,{brand:"",model:"",minPrice:0,maxPrice:0,year:0,prov:"",km:200000,cert:false,onlyFav:false});
  ["body","gear","fuel","seller"].forEach(k=>state[k].clear());
  document.querySelectorAll("aside input[type=checkbox]").forEach(i=>i.checked=false);
  $("fKm").value=200000;$("fKmVal").textContent="200,000 กม.";
  $("searchForm").reset();refreshModels();render();
});
$("favBtn").addEventListener("click",()=>{state.onlyFav=!state.onlyFav;render();document.getElementById("buy").scrollIntoView({behavior:"smooth"})});

function toggleFav(id){track(favs.has(id)?"remove_from_wishlist":"add_to_wishlist",{item_id:"KT-"+id});favs.has(id)?favs.delete(id):favs.add(id);saveFavs();toast(favs.has(id)?"บันทึกไว้ในรถที่ถูกใจแล้ว":"เอาออกจากรถที่ถูกใจแล้ว");render();if($("modal").classList.contains("open"))openCar(id)}
$("grid").addEventListener("click",e=>{
  const f=e.target.closest("[data-fav]");if(f){e.stopPropagation();toggleFav(+f.dataset.fav);return}
  const cb=e.target.closest("[data-cmp]");if(cb){e.stopPropagation();toggleCmp(+cb.dataset.cmp);return}
  if(e.target.closest(".cardlink")&&(e.ctrlKey||e.metaKey||e.button===1))return;
  const c=e.target.closest(".card");if(c){e.preventDefault();openCar(+c.dataset.id)}
});
$("grid").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.classList.contains("card"))openCar(+e.target.dataset.id)});

/* ปุ่มแชร์ในกล่องรายละเอียด: รถตัวอย่างแชร์หน้ารถ ประกาศผู้ใช้แชร์ลิงก์ #listing-<id> */
function shareHTML(c){
  const origin=location.origin.startsWith("http")?location.origin:"https://khaptor.com";
  const url=c.user?origin+"/l/"+c.uid:origin+"/cars/"+slug(c)+".html";
  const title=`${c.year} ${c.brand} ${c.model} ${c.sub||""} ราคา ${fmt(c.price)} บาท`.replace(/\s+/g," ");
  const u=encodeURIComponent(url),t=encodeURIComponent(title);
  return `<div class="share" data-share-url="${esc(url)}" data-share-title="${esc(title)}"><span class="share-label">แชร์</span>
  <button type="button" class="sh sh-native" data-share="native" hidden>แชร์</button>
  <a class="sh sh-line" data-share="line" href="https://social-plugins.line.me/lineit/share?url=${u}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ LINE">LINE</a>
  <a class="sh sh-fb" data-share="facebook" href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ Facebook">Facebook</a>
  <a class="sh sh-x" data-share="x" href="https://twitter.com/intent/tweet?url=${u}&text=${t}" target="_blank" rel="noopener" aria-label="แชร์ไปที่ X">X</a>
  <button type="button" class="sh sh-copy" data-share="copy">คัดลอกลิงก์</button></div>`;
}

/* detail modal */
let lastFocus=null;
function openCar(id){
  const c=CARS.find(x=>x.id===id);lastFocus=lastFocus||document.activeElement;
  const m=monthly(c.price);
  track("view_item",{currency:"THB",value:c.price,items:[{item_id:"KT-"+c.id,item_name:c.year+" "+c.brand+" "+c.model,item_brand:c.brand,price:c.price}]});
  $("sheet").innerHTML=`${c.photos&&c.photos.length?`<div class="sheet-media">${galleryHTML(c.photos,c.year+" "+c.brand+" "+c.model)}</div>`:picHTML(c)+"</div>"}
  <div class="info">
    <button class="x" type="button" id="mClose" aria-label="ปิด">✕</button>
    <div><div class="sub" style="color:var(--muted);font-size:13px">${c.seller==="dealer"?"เต็นท์รถ":"เจ้าของขายเอง"} · ${c.prov}</div>
    <h2 id="mTitle" style="font-size:22px">${c.year} ${c.brand} ${c.model}</h2><div style="color:var(--muted)">${c.sub}</div></div>
    <div style="display:flex;align-items:end;justify-content:space-between;gap:10px">
      <div><div class="price" style="font-size:28px">฿${fmt(c.price)}</div><div class="monthly">ดาวน์ 15% ผ่อน 72 งวด ประมาณ ฿${fmt(m)}/เดือน</div></div>
      <div class="plate" style="font-size:13px">${c.plate}<small>${c.prov}</small></div>
    </div>
    <div class="spec-table">
      <div><span>ปีจดทะเบียน</span><b>${c.year}</b></div><div><span>เลขไมล์</span><b>${fmt(c.km)} กม.</b></div>
      <div><span>ประเภท</span><b>${BODY[c.body]}</b></div><div><span>เกียร์</span><b>${c.gear}</b></div>
      <div><span>เชื้อเพลิง</span><b>${c.fuel}</b></div><div><span>สี</span><b>${c.color}</b></div>
      <div><span>ตรวจสภาพ</span><b style="color:${c.cert?"var(--good)":"var(--muted)"}">${c.cert?"ผ่าน 175 จุด":"ยังไม่ตรวจ"}</b></div><div><span>รหัสประกาศ</span><b>${c.user?esc(c.code):"KT-"+String(c.id).padStart(5,"0")}</b></div>
    </div>
    <div class="contact">
      ${c.sold?`<span class="sold-note">รถคันนี้ขายแล้ว</span>`:`<button class="btn btn-amber" type="button" id="mCall">ดูเบอร์ผู้ขาย</button>`}
      <button class="btn btn-line" type="button" id="mLoan">คำนวณค่างวด</button>
      <a class="btn btn-line" href="${c.user?"/l/"+esc(c.uid):BASE+"cars/"+slug(c)+".html"}">ดูหน้าประกาศเต็ม</a>
      <button class="btn btn-line" type="button" id="mFav">${favs.has(c.id)?"เอาออกจากที่ถูกใจ":"บันทึกไว้"}</button>
      <button class="btn btn-line" type="button" id="mCmp">${getCmp().some(x=>x.key===cmpKey(c))?"เอาออกจากการเปรียบเทียบ":"เพิ่มเปรียบเทียบ"}</button>
    </div>
    <div class="tool-links"><a href="${contractURL(c)}">ทำสัญญาซื้อขายคันนี้</a><a href="${BASE}tools/price-estimate.html?brand=${encodeURIComponent(c.brand)}&model=${encodeURIComponent(c.model)}&eYear=${c.year}&eKm=${c.km}">เช็กราคากลางรุ่นนี้</a><a href="${BASE}tools/checklist.html">เช็กลิสต์ตรวจรถก่อนซื้อ</a></div>
    ${c.user&&c.note?`<p style="margin:0;white-space:pre-line">${esc(c.note)}</p>`:""}
    <div id="mPhone"></div>
    ${shareHTML(c)}
    ${c.user?`<button type="button" class="report-link" data-report="${esc(c.uid)}">แจ้งประกาศไม่เหมาะสม</button>`:""}
  </div>`;
  $("modal").classList.add("open");$("mClose").focus();window.ktInitShare&&window.ktInitShare($("sheet"));
  $("mClose").onclick=closeModal;
  $("mFav").onclick=()=>toggleFav(c.id);
  $("mCmp").onclick=()=>toggleCmp(c.id);
  if($("mCall"))$("mCall").onclick=()=>{track("generate_lead",{currency:"THB",value:c.price,lead_source:"call_seller",item_id:c.user?c.code:"KT-"+c.id});$("mPhone").innerHTML=c.user?`<div class="ok">${esc(c.sellerName)} โทร ${esc(c.tel)} แจ้งว่าเห็นประกาศ ${esc(c.code)} จากขับต่อ</div>`:`<div class="ok">โทร 08${(c.id*7919%90000000+10000000)} (เบอร์ตัวอย่าง) แจ้งรหัสประกาศ KT-${String(c.id).padStart(5,"0")}</div>`};
  $("mLoan").onclick=()=>{$("cPrice").value=c.price;calc();closeModal();$("loan").scrollIntoView({behavior:"smooth"})};
}
function closeModal(){$("modal").classList.remove("open");if(lastFocus)lastFocus.focus();lastFocus=null}
$("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("modal").classList.contains("open"))closeModal()});

/* dealer areas */
const BKK=[["กาญจนาภิเษก",282,"กรุงเทพมหานคร"],["รามอินทรา-สุขาภิบาล 5",68,"กรุงเทพมหานคร"],["เลียบด่วนรามอินทรา-เกษตรนวมินทร์",82,"กรุงเทพมหานคร"],["ศรีนครินทร์-เทพารักษ์",89,"สมุทรปราการ"],["แจ้งวัฒนะ-ติวานนท์",57,"นนทบุรี"],["รังสิต-คลองหลวง",44,"ปทุมธานี"]];
const PRV=[["เมืองชลบุรี",36,"ชลบุรี"],["เมืองเชียงใหม่",41,"เชียงใหม่"],["เมืองขอนแก่น",29,"ขอนแก่น"],["เมืองนครราชสีมา",33,"นครราชสีมา"],["หาดใหญ่",22,"สงขลา"],["ถลาง-เมืองภูเก็ต",15,"ภูเก็ต"]];
const areaBtn=a=>`<button type="button" class="area" data-prov="${a[2]}"><b>${a[0]}</b><span>${a[1]} เต็นท์</span></button>`;
/* dealer areas link to province pages when JS is off; JS keeps filtering in-page */
$("areasBkk").innerHTML=BKK.map(areaBtn).join("");$("areasProv").innerHTML=PRV.map(areaBtn).join("");
document.querySelectorAll(".area").forEach(b=>b.addEventListener("click",()=>{state.prov=b.dataset.prov;$("sProv").value=state.prov;state.seller.clear();state.seller.add("dealer");document.querySelector('input[data-k=seller][value=dealer]').checked=true;document.querySelector('input[data-k=seller][value=owner]').checked=false;render();document.getElementById("buy").scrollIntoView({behavior:"smooth"})}));

/* loan calc */
function calc(){
  const p=+$("cPrice").value||0,d=+$("cDown").value,r=+$("cRate").value||0,t=+$("cTerm").value;
  $("oDown").textContent="฿"+fmt(p*d/100);$("oFin").textContent="฿"+fmt(p*(1-d/100));$("oMonth").textContent="฿"+fmt(monthly(p,d,r,t));
}
let calcTracked=false;["cPrice","cDown","cRate","cTerm"].forEach(id=>$(id).addEventListener("input",()=>{calc();if(!calcTracked){calcTracked=true;track("use_loan_calculator",{})}}));calc();

/* ---- รูปรถ: ย่อและลบ EXIF ในเบราว์เซอร์ แล้วอัปโหลดทีละรูป ---- */
const MAX_PHOTOS=8;
async function loadBitmap(file){
  try{return await createImageBitmap(file,{imageOrientation:"from-image"})}catch(e){}
  return await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(new Error("เปิดไฟล์รูปนี้ไม่ได้ ลองใช้รูป JPG หรือ PNG"));i.src=URL.createObjectURL(file)});
}
function toJpeg(bmp,max,q){
  const w=bmp.width,h=bmp.height,s=Math.min(1,max/Math.max(w,h));
  const c=document.createElement("canvas");c.width=Math.max(1,Math.round(w*s));c.height=Math.max(1,Math.round(h*s));
  const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(bmp,0,0,c.width,c.height);
  return new Promise((ok,no)=>c.toBlob(b=>b?ok(b):no(new Error("แปลงรูปไม่สำเร็จ")),"image/jpeg",q));
}
async function uploadPhoto(file){
  if(!/^image\//.test(file.type||"image/"))throw new Error("ไฟล์นี้ไม่ใช่รูปภาพ");
  const bmp=await loadBitmap(file);
  let full=await toJpeg(bmp,1280,.8);if(full.size>880*1024)full=await toJpeg(bmp,1280,.62);
  const thumb=await toJpeg(bmp,480,.72);
  const fd=new FormData();fd.append("full",full,"full.jpg");fd.append("thumb",thumb,"thumb.jpg");
  let j;
  try{const r=await fetch("/api/photos",{method:"POST",body:fd,credentials:"same-origin"});try{j=await r.json()}catch(e){j={ok:false,error:"อัปโหลดไม่สำเร็จ ("+r.status+")"}}}
  catch(e){j={ok:false,error:"เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง"}}
  if(!j.ok)throw new Error(j.error||"อัปโหลดไม่สำเร็จ");
  return j.id;
}
class PhotoPicker{
  constructor(el,ids){this.el=el;this.items=[];this.reset(ids);
    el.addEventListener("click",e=>{const b=e.target.closest("[data-pact]");if(!b)return;e.preventDefault();
      const i=+b.getAttribute("data-i"),a=b.getAttribute("data-pact"),it=this.items;
      if(a==="del")it.splice(i,1);
      else if(a==="left"&&i>0)[it[i-1],it[i]]=[it[i],it[i-1]];
      else if(a==="right"&&i<it.length-1)[it[i+1],it[i]]=[it[i],it[i+1]];
      else if(a==="cover"&&i>0)it.unshift(it.splice(i,1)[0]);
      this.render()});
    el.addEventListener("change",e=>{if(e.target.matches("input[type=file]")){this.add([...e.target.files]);e.target.value=""}});
  }
  reset(ids){this.items=(ids||[]).map(id=>({id,url:"/p/"+id+"-t.jpg",status:"ok"}));this.render()}
  ids(){return this.items.filter(x=>x.status==="ok").map(x=>x.id)}
  busy(){return this.items.some(x=>x.status==="up")}
  add(files){
    const room=MAX_PHOTOS-this.items.length;
    if(files.length>room)toast(`ใส่รูปได้อีก ${room} รูป`);
    files.slice(0,Math.max(0,room)).forEach(f=>{
      const it={id:null,url:URL.createObjectURL(f),status:"up"};this.items.push(it);
      uploadPhoto(f).then(id=>{it.id=id;it.status="ok"},err=>{it.status="err";it.msg=err.message}).then(()=>this.render());
    });
    this.render();
  }
  render(){
    const n=this.items.length;
    this.el.innerHTML=this.items.map((it,i)=>`<div class="ph-tile ${it.status}">
      <img src="${esc(it.url)}" alt="รูปที่ ${i+1}">
      ${i===0&&it.status==="ok"?'<span class="ph-cover">รูปปก</span>':""}
      ${it.status==="up"?'<span class="ph-state">กำลังอัปโหลด...</span>':""}
      ${it.status==="err"?`<span class="ph-state err">${esc(it.msg||"อัปโหลดไม่สำเร็จ")}</span>`:""}
      <div class="ph-acts">
        ${i>0&&it.status==="ok"?`<button type="button" data-pact="cover" data-i="${i}" title="ตั้งเป็นรูปปก">ปก</button>`:""}
        ${i>0?`<button type="button" data-pact="left" data-i="${i}" aria-label="เลื่อนไปทางซ้าย">‹</button>`:""}
        ${i<n-1?`<button type="button" data-pact="right" data-i="${i}" aria-label="เลื่อนไปทางขวา">›</button>`:""}
        <button type="button" data-pact="del" data-i="${i}" aria-label="ลบรูปนี้">✕</button>
      </div></div>`).join("")+(n<MAX_PHOTOS?`<label class="ph-add"><input type="file" accept="image/*" multiple hidden><span>+ เพิ่มรูป</span><small>${n}/${MAX_PHOTOS}</small></label>`:"");
  }
}
function galleryHTML(photos,alt){
  const n=photos.length;
  return `<div class="gallery" data-gallery><div class="g-track">${photos.map((p,i)=>`<img src="/p/${esc(p)}.jpg" alt="${esc(alt)} รูปที่ ${i+1}"${i?' loading="lazy"':""}>`).join("")}</div>
  ${n>1?`<button type="button" class="g-nav g-prev" data-g="-1" aria-label="รูปก่อนหน้า">‹</button><button type="button" class="g-nav g-next" data-g="1" aria-label="รูปถัดไป">›</button><span class="g-count">1/${n}</span>`:""}</div>
  ${n>1?`<div class="g-thumbs">${photos.map((p,i)=>`<button type="button"${i?"":` class="on"`} data-gi="${i}" aria-label="ดูรูปที่ ${i+1}"><img src="/p/${esc(p)}-t.jpg" alt=""></button>`).join("")}</div>`:""}`;
}
const sellPicker=new PhotoPicker($("slPhotos"),[]);

/* ---- ลงประกาศ: ต้องล็อกอิน Google (ทำงานผ่าน Cloudflare Functions) ---- */
const AUTH=window.KT_AUTH||null;
async function api(path,opt){
  try{
    const r=await fetch(path,Object.assign({credentials:"same-origin",headers:{"content-type":"application/json"}},opt||{}));
    try{return await r.json()}catch(e){return{ok:false,error:"เซิร์ฟเวอร์ตอบกลับผิดรูปแบบ ("+r.status+")"}}
  }catch(e){return{ok:false,error:"เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่"}}
}
const STATUS={pending:["รอตรวจ","warn"],approved:["เผยแพร่แล้ว","good"],rejected:["ถูกซ่อนโดยทีมงาน","bad"]};
function renderMine(list){
  const box=$("myListings");
  if(!list||!list.length){box.innerHTML="";return}
  box.innerHTML=`<h4 class="mine-h">ประกาศของคุณ</h4>`+list.map(l=>{const st=STATUS[l.status]||["",""];
    return `<div class="mine"><div><b>${esc(l.year+" "+l.brand+" "+l.model)}</b><small>฿${fmt(l.price)} · ${esc(l.prov)} · ส่งเมื่อ ${new Date(l.created_at).toLocaleDateString("th-TH")}</small></div>
    <span class="pill ${l.sold?"sold":st[1]}">${l.sold?"ขายแล้ว":st[0]}</span><span class="mine-acts"><button type="button" class="btn btn-line btn-sm" data-editph="${esc(l.id)}">แก้รูป (${(l.photos||[]).length})</button><button type="button" class="btn btn-sm ${l.sold?"btn-line":"btn-road"}" data-sold="${esc(l.id)}" data-v="${l.sold?"0":"1"}">${l.sold?"ยังไม่ขาย":"ขายแล้ว"}</button><a class="btn btn-line btn-sm" href="${contractURL(l)}">ทำสัญญา</a><button type="button" class="btn btn-line btn-sm" data-del="${esc(l.id)}">ลบ</button></span><div class="mine-edit" id="me-${esc(l.id)}" hidden></div></div>`}).join("");
  MINE=list;
}
let MINE=[];
$("myListings").addEventListener("click",async e=>{
  const eid=e.target.getAttribute&&e.target.getAttribute("data-editph");
  if(eid){
    const box=$("me-"+eid);if(!box)return;
    if(!box.hidden){box.hidden=true;box.innerHTML="";return}
    const l=MINE.find(x=>x.id===eid)||{};
    box.hidden=false;box.innerHTML=`<div class="ph-grid"></div><div class="mine-edit-acts"><button type="button" class="btn btn-road btn-sm" data-saveph>บันทึกรูป</button><button type="button" class="btn btn-line btn-sm" data-cancelph>ยกเลิก</button></div>`;
    const pk=new PhotoPicker(box.querySelector(".ph-grid"),l.photos||[]);
    box.querySelector("[data-cancelph]").onclick=()=>{box.hidden=true;box.innerHTML=""};
    box.querySelector("[data-saveph]").onclick=async ev=>{
      if(pk.busy()){toast("รอให้อัปโหลดรูปเสร็จก่อน");return}
      ev.target.disabled=true;
      const j=await api("/api/listings/"+encodeURIComponent(eid),{method:"PATCH",body:JSON.stringify({photos:pk.ids()})});
      if(!j.ok){toast(j.error||"บันทึกไม่สำเร็จ");ev.target.disabled=false;return}
      toast("บันทึกรูปแล้ว");loadMe();loadListings();
    };
    return;
  }
  const sid=e.target.getAttribute&&e.target.getAttribute("data-sold");
  if(sid){
    const sold=e.target.getAttribute("data-v")==="1";e.target.disabled=true;
    const j=await api("/api/listings/"+encodeURIComponent(sid),{method:"PATCH",body:JSON.stringify({sold})});
    if(!j.ok){toast(j.error||"บันทึกไม่สำเร็จ");e.target.disabled=false;return}
    if(sold)track("mark_sold",{item_id:sid});
    toast(sold?"ทำเครื่องหมายขายแล้ว ยินดีด้วยครับ":"เปลี่ยนกลับเป็นยังไม่ขายแล้ว");loadMe();loadListings();return;
  }
  const id=e.target.getAttribute&&e.target.getAttribute("data-del");if(!id)return;
  if(e.target.dataset.confirm!=="1"){e.target.dataset.confirm="1";e.target.textContent="กดอีกครั้งเพื่อลบ";return}
  e.target.disabled=true;
  const j=await api("/api/listings/"+encodeURIComponent(id),{method:"DELETE"});
  if(!j.ok){toast(j.error||"ลบไม่สำเร็จ");e.target.disabled=false;return}
  toast("ลบประกาศแล้ว");loadMe();loadListings();
});
function setUser(u,list){
  $("sellFields").disabled=!u;
  $("authBox").hidden=!!u;
  const bar=$("userBar");bar.hidden=!u;
  if(u){
    bar.innerHTML=`<span>ลงประกาศในชื่อ <b>${esc(u.name||u.email)}</b> <small>${esc(u.email)}</small></span><button type="button" class="btn btn-line btn-sm" id="logoutBtn">ออกจากระบบ</button>`;
    $("logoutBtn").onclick=async()=>{await api("/api/auth/logout",{method:"POST"});try{google.accounts.id.disableAutoSelect()}catch(e){}setUser(null,[]);$("sellOk").innerHTML=""};
    if(!$("slName").value)$("slName").value=u.name||"";
  }
  renderMine(list);
}
async function loadMe(){const j=await api("/api/me");if(j.ok)setUser(j.user,j.listings||[]);return j}
function initGoogle(){
  const msg=$("authMsg");
  if(!AUTH){msg.textContent="การลงประกาศใช้ได้บนเว็บจริงที่ khaptor.com";return}
  if(!AUTH.googleClientId){msg.textContent="ระบบลงประกาศกำลังจะเปิดให้ใช้งานเร็วๆ นี้";return}
  loadMe();
  const sc=document.createElement("script");sc.src="https://accounts.google.com/gsi/client";sc.async=true;
  sc.onload=()=>{
    google.accounts.id.initialize({client_id:AUTH.googleClientId,ux_mode:"popup",callback:async res=>{
      msg.textContent="กำลังเข้าสู่ระบบ...";
      const j=await api("/api/auth/google",{method:"POST",body:JSON.stringify({credential:res.credential})});
      if(!j.ok){msg.textContent=j.error||"ล็อกอินไม่สำเร็จ ลองใหม่อีกครั้ง";return}
      track("login",{method:"Google"});await loadMe();$("slBrand").focus();
    }});
    google.accounts.id.renderButton($("gBtn"),{theme:"outline",size:"large",text:"signin_with",shape:"pill",locale:"th",width:280});
  };
  sc.onerror=()=>{msg.textContent="โหลดปุ่มล็อกอินของ Google ไม่ได้ ลองรีเฟรชหน้า"};
  document.head.appendChild(sc);
}
$("sellForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const v=id=>$(id).value.trim();
  if(sellPicker.busy()){$("sellOk").innerHTML=`<div class="err">รอให้อัปโหลดรูปเสร็จก่อน</div>`;return}
  const body={photos:sellPicker.ids(),brand:v("slBrand"),model:v("slModel"),sub:v("slSub"),year:v("slYear"),km:v("slKm"),body:v("slBody"),gear:v("slGear"),fuel:v("slFuel"),color:v("slColor"),price:v("slPrice"),prov:v("slProv"),name:v("slName"),tel:v("slTel"),note:v("slNote"),consent:$("slConsent").checked};
  $("sellBtn").disabled=true;$("sellOk").innerHTML="";
  const j=await api("/api/listings",{method:"POST",body:JSON.stringify(body)});
  $("sellBtn").disabled=false;
  if(!j.ok){$("sellOk").innerHTML=`<div class="err">${esc(j.error||"ส่งประกาศไม่สำเร็จ")}</div>`;if(j.error&&/ล็อกอิน/.test(j.error))setUser(null,[]);return}
  track("submit_listing",{brand:body.brand,province:body.prov,value:+body.price,currency:"THB"});
  $("sellOk").innerHTML=`<div class="ok">ลงประกาศแล้ว ประกาศของคุณขึ้นเป็นคันแรกในรายการรถ <a href="/l/${esc(j.listing.id)}">ดูหน้าประกาศ</a></div>`;
  ["slModel","slSub","slKm","slPrice","slNote"].forEach(id=>$(id).value="");$("slConsent").checked=false;sellPicker.reset([]);
  loadMe();await loadListings();state.sort="new";$("sort").value="new";render();
});

/* ประกาศจริงที่อนุมัติแล้ว ขึ้นก่อนรถตัวอย่าง */
async function loadListings(){
  if(!AUTH)return;
  const j=await api("/api/listings");
  if(!j.ok||!j.listings)return;
  for(let i=CARS.length-1;i>=0;i--)if(CARS[i].user)CARS.splice(i,1);
  if(!j.listings.length){refreshModels();render();return}
  const now=Date.now();
  const extra=j.listings.map((l,i)=>({id:100000+i,uid:l.id,user:true,code:"KT-U"+String(l.id).slice(-6).toUpperCase(),url:"/l/"+l.id,
    brand:l.brand,model:l.model,sub:l.sub||"",year:l.year,price:l.price,km:l.km,body:l.body,gear:l.gear,fuel:l.fuel,color:l.color,prov:l.prov,
    seller:"owner",cert:false,days:Math.max(0,Math.floor((now-Date.parse(l.created_at))/864e5)),plate:"เจ้าของขาย",tel:l.tel,sellerName:l.name,note:l.note||"",sold:!!l.sold,photos:Array.isArray(l.photos)?l.photos:[]}));
  CARS.unshift(...extra);
  refreshModels();render();
  openFromHash();
}
function openFromHash(){
  const m=location.hash.match(/^#listing-(.+)$/);
  if(m){const c=CARS.find(x=>x.uid===m[1]);if(c)openCar(c.id)}
}
window.addEventListener("hashchange",openFromHash);

/* ตัวกรองบนมือถือ: พับไว้ กดเปิดเมื่อต้องการ */
const mqSmall=window.matchMedia("(max-width:960px)");
function setFilters(open){const a=document.querySelector("aside.filters");a.classList.toggle("collapsed",!open);$("filterToggle").setAttribute("aria-expanded",String(open))}
$("filterToggle").addEventListener("click",()=>{if(mqSmall.matches)setFilters(document.querySelector("aside.filters").classList.contains("collapsed"))});
setFilters(!mqSmall.matches);
(mqSmall.addEventListener?mqSmall.addEventListener("change",e=>setFilters(!e.matches)):null);

let tt;function toast(t){const el=$("toast");el.textContent=t;el.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>el.classList.remove("show"),1800)}
(function(){const mx=+new URLSearchParams(location.search).get("max");if(mx>0){state.maxPrice=mx;const sel=$("sMaxPrice");if(![...sel.options].some(o=>+o.value===mx)){const o=document.createElement("option");o.value=mx;o.textContent=fmt(mx)+" บาท";sel.appendChild(o)}sel.value=String(mx)}})();
/* ======== ค้นหาด้วยประโยค (กฎในเครื่อง + AI) ======== */
const TH_BRAND={"โตโยต้า":"Toyota","ฮอนด้า":"Honda","อีซูซุ":"Isuzu","มาสด้า":"Mazda","นิสสัน":"Nissan","มิตซู":"Mitsubishi","ฟอร์ด":"Ford","เบนซ์":"Mercedes-Benz","บีเอ็ม":"BMW","ซูซูกิ":"Suzuki","เอ็มจี":"MG","บีวายดี":"BYD","เกีย":"Kia","ฮุนได":"Hyundai","เชฟ":"Chevrolet","ซูบารุ":"Subaru","วอลโว่":"Volvo","เลกซัส":"Lexus","ออดี้":"Audi","จีลี่":"Geely","เกรท":"GWM","ฮาวาล":"GWM","โอร่า":"GWM"};
function parseMoney(t){const m=t.match(/(\d+(?:\.\d+)?)\s*(ล้าน|แสน|หมื่น|k\b|K\b)?/);if(!m)return 0;let n=+m[1];const u=m[2];if(u==="ล้าน")n*=1e6;else if(u==="แสน")n*=1e5;else if(u==="หมื่น")n*=1e4;else if(u&&/k/i.test(u))n*=1e3;return n>=10000?Math.round(n):0}
function ruleParse(q){
  const t=q.toLowerCase(),f={brand:"",model:"",body:[],fuel:[],gear:[],minPrice:0,maxPrice:0,minYear:0,maxKm:0,prov:"",sort:"",cert:false};
  const brands=[...new Set(CARS.map(c=>c.brand))];
  f.brand=brands.find(b=>t.includes(b.toLowerCase()))||"";
  if(!f.brand)for(const [th,en] of Object.entries(TH_BRAND))if(t.includes(th)&&brands.includes(en)){f.brand=en;break}
  const ms=[...new Set(CARS.filter(c=>!f.brand||c.brand===f.brand).map(c=>c.model))].sort((a,b)=>b.length-a.length);
  const tok=" "+t.replace(/[^\p{L}\p{N}.-]+/gu," ")+" ";const mm=ms.find(m=>tok.includes(" "+m.toLowerCase()+" "));if(mm){f.model=mm;if(!f.brand)f.brand=(CARS.find(c=>c.model===mm)||{}).brand||""}
  const B=[[/เก๋ง|ซีดาน|sedan/,"sedan"],[/แฮทช์|hatch|รถเล็ก|อีโค|eco ?car/,"hatch"],[/suv|ppv|อเนกประสงค์|7 ?ที่นั่ง|ครอบครัว/,"suv"],[/กระบะ|ปิคอัพ|pick ?up|ขนของ/,"pickup"],[/ตู้|van|7 ?ที่นั่ง|ครอบครัว|10 ?ที่นั่ง/,"van"]];
  B.forEach(([r,v])=>{if(r.test(t)&&!f.body.includes(v))f.body.push(v)});
  if(/ไฟฟ้า|\bev\b/.test(t))f.fuel.push("ไฟฟ้า");if(/ไฮบริด|hybrid/.test(t))f.fuel.push("ไฮบริด");if(/ดีเซล|diesel/.test(t))f.fuel.push("ดีเซล");if(/เบนซิน/.test(t))f.fuel.push("เบนซิน");
  if(/ประหยัด/.test(t)&&!f.fuel.length)f.fuel.push("ไฮบริด","เบนซิน","ไฟฟ้า");
  if(/ออโต้|อัตโนมัติ|auto/.test(t))f.gear.push("อัตโนมัติ");if(/ธรรมดา|manual|เกียร์มือ/.test(t))f.gear.push("ธรรมดา");
  const money=[...t.matchAll(/(ไม่เกิน|ต่ำกว่า|งบ|ไม่ถึง|ราคา|ตั้งแต่|มากกว่า|ขึ้นไป|เกิน|ถึง|-)?\s*(\d+(?:\.\d+)?\s*(?:ล้าน|แสน|หมื่น|k\b)?)\s*(บาท)?\s*(ขึ้นไป)?/g)];
  money.forEach(m=>{const n=parseMoney(m[2]);if(!n||(n>=1900&&n<=2600&&!/[ล้านแสนหมื่นk]/.test(m[2])))return;if(/ตั้งแต่|มากกว่า|เกิน/.test(m[1]||"")&&!/ไม่เกิน/.test(m[1]||"")||m[4])f.minPrice=n;else f.maxPrice=n});
  const y=t.match(/(?:ปี\s*)?\b((?:19|20)\d\d|25\d\d)\b/);if(y){let yy=+y[1];if(yy>2400)yy-=543;f.minYear=yy}
  const age=t.match(/(?:ไม่เกิน|อายุไม่เกิน)\s*(\d+)\s*ปี/);if(age)f.minYear=new Date().getFullYear()-+age[1];
  if(/ไมล์น้อย/.test(t)){f.maxKm=60000;f.sort="kmAsc"}
  const km=t.match(/(?:ไมล์|วิ่ง)\s*(?:ไม่เกิน)?\s*(\d+(?:\.\d+)?)\s*(หมื่น|พัน|k)?/);if(km){let n=+km[1];if(km[2]==="หมื่น")n*=1e4;else if(km[2]==="พัน"||km[2]==="k")n*=1e3;if(n>=1000)f.maxKm=n}
  if(/ถูกสุด|ราคาถูก/.test(t))f.sort="pAsc";if(/ใหม่สุด|ใหม่ๆ/.test(t))f.sort="yDesc";
  if(/ตรวจสภาพ|ผ่านการตรวจ/.test(t))f.cert=true;
  f.prov=PROVS.find(p=>t.includes(p))||(/กรุงเทพ|กทม/.test(t)?"กรุงเทพมหานคร":"");
  return f;
}
function applyFilters(f){
  Object.assign(state,{brand:f.brand||"",model:f.model||"",minPrice:f.minPrice||0,maxPrice:f.maxPrice||0,year:f.minYear||0,prov:f.prov||"",km:f.maxKm&&f.maxKm<200000?f.maxKm:200000,cert:!!f.cert,onlyFav:false});
  ["body","gear","fuel","seller"].forEach(k=>state[k].clear());(f.body||[]).forEach(v=>state.body.add(v));(f.fuel||[]).forEach(v=>state.fuel.add(v));(f.gear||[]).forEach(v=>state.gear.add(v));
  document.querySelectorAll("aside input[type=checkbox][data-k]").forEach(i=>i.checked=state[i.dataset.k]&&state[i.dataset.k].has(i.value));
  $("fCert").checked=state.cert;$("fKm").value=state.km;$("fKmVal").textContent=fmt(state.km)+" กม.";
  $("sBrand").value=state.brand;refreshModels();$("sModel").value=state.model;$("sProv").value=state.prov;
  const ensure=(sel,v,label)=>{if(!v){sel.value="";return}if(![...sel.options].some(o=>+o.value===v)){const o=document.createElement("option");o.value=v;o.textContent=label;sel.appendChild(o)}sel.value=String(v)};
  ensure($("sMaxPrice"),state.maxPrice,fmt(state.maxPrice)+" บาท");ensure($("sYear"),state.year,"ตั้งแต่ "+state.year);
  if(f.sort){state.sort=f.sort;$("sort").value=f.sort}
  render();
}
function describeFilters(f){const p=[];if(f.brand)p.push(f.brand+(f.model?" "+f.model:""));if(f.body&&f.body.length)p.push(f.body.map(b=>BODY[b]).join("/"));if(f.fuel&&f.fuel.length)p.push(f.fuel.join("/"));if(f.gear&&f.gear.length)p.push("เกียร์"+f.gear.join("/"));if(f.minPrice)p.push("ตั้งแต่ ฿"+fmt(f.minPrice));if(f.maxPrice)p.push("ไม่เกิน ฿"+fmt(f.maxPrice));if(f.minYear)p.push("ปี "+f.minYear+" ขึ้นไป");if(f.maxKm)p.push("ไมล์ไม่เกิน "+fmt(f.maxKm));if(f.prov)p.push(f.prov);if(f.cert)p.push("ผ่านการตรวจสภาพ");return p.join(" · ")}
const hasAny=f=>!!(f.brand||f.body.length||f.fuel.length||f.gear.length||f.minPrice||f.maxPrice||f.minYear||f.maxKm||f.prov||f.cert);
let askSeq=0;
function showAsk(f,via,q){
  const out=$("askOut");out.hidden=false;
  if(!hasAny(f)){out.innerHTML=`ยังไม่เข้าใจคำค้นนี้ ลองระบุยี่ห้อ ประเภทรถ หรืองบ เช่น "กระบะดีเซล ไม่เกิน 5 แสน"`;return}
  applyFilters(f);
  const n=CARS.filter(c=>matches(c)).length;
  out.innerHTML=`<span>${via==="ai"?"✦ ":""}ค้นหา: <b>${esc(describeFilters(f))}</b> พบ ${n} คัน${via==="wait"?' <i class="ask-thinking">AI กำลังปรับผลให้ตรงขึ้น…</i>':""}</span><button type="button" id="askClear">ล้าง</button>`;
  $("askClear").onclick=()=>{askSeq++;$("clearAll").click();out.hidden=true;$("askQ").value=""};
}
$("askForm").addEventListener("submit",async e=>{
  e.preventDefault();const q=$("askQ").value.trim();if(q.length<2)return;
  const seq=++askSeq,rules=ruleParse(q),useAI=!!(window.KT_SITE&&window.KT_SITE.ai);
  showAsk(rules,useAI?"wait":"rule",q);
  if(hasAny(rules)||useAI)document.getElementById("buy").scrollIntoView({behavior:"smooth"});
  let via="rule";
  if(useAI){
    try{
      const brands=[...new Set(CARS.map(c=>c.brand))].sort(),models={};brands.forEach(b=>models[b]=[...new Set(CARS.filter(c=>c.brand===b).map(c=>c.model))]);
      const provs=[...new Set(CARS.map(c=>c.prov))];
      const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),15000);
      const r=await fetch("/api/ai/search",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({q,brands,models,provs}),signal:ctl.signal});
      clearTimeout(to);const j=await r.json();
      if(seq!==askSeq)return;
      if(j.ok&&hasAny(j.filters)){via="ai";showAsk(j.filters,"ai",q)}else showAsk(rules,"rule",q);
    }catch(err){if(seq===askSeq)showAsk(rules,"rule",q)}
  }
  track("ai_search",{via,search_term:q.slice(0,100)});
});
document.querySelectorAll("[data-ask]").forEach(b=>b.addEventListener("click",()=>{$("askQ").value=b.dataset.ask;$("askForm").requestSubmit()}));

/* ======== AI ช่วยเขียนรายละเอียดประกาศ ======== */
(function(){
  const val=id=>($(id)?$(id).value.trim():"");
  const btn=$("aiWrite");if(!btn)return;
  if(!(window.KT_SITE&&window.KT_SITE.ai)){btn.closest(".ai-write").hidden=true;return}
  let prev="";
  btn.addEventListener("click",async()=>{
    const notes=$("slNote").value.trim(),msg=$("aiMsg");
    if(!val("slBrand")||!val("slModel")){msg.textContent="เลือกยี่ห้อและรุ่นก่อน";return}
    if(notes.length<4){msg.textContent="พิมพ์จุดเด่นสั้น ๆ ในช่องด้านบนก่อน เช่น เข้าศูนย์ตลอด ไม่เคยชน ยางใหม่";$("slNote").focus();return}
    btn.disabled=true;btn.classList.add("loading");msg.textContent="กำลังเรียบเรียง...";
    try{
      const car={brand:val("slBrand"),model:val("slModel"),sub:val("slSub"),year:val("slYear"),km:val("slKm"),body:val("slBody"),gear:val("slGear"),fuel:val("slFuel"),color:val("slColor"),prov:val("slProv")};
      const r=await fetch("/api/ai/describe",{method:"POST",headers:{"content-type":"application/json"},credentials:"same-origin",body:JSON.stringify({car,notes})});
      const j=await r.json();
      if(!j.ok){msg.textContent=j.error||"ใช้งานไม่ได้ชั่วคราว";return}
      prev=notes;const ta=$("slNote");ta.value=j.text.slice(0,1000);ta.style.height="auto";ta.style.height=Math.min(ta.scrollHeight+4,420)+"px";$("slNote").dispatchEvent(new Event("input"));
      msg.innerHTML='เขียนให้แล้ว ตรวจและแก้ให้ตรงกับรถจริงก่อนส่ง <button type="button" class="linkbtn" id="aiUndo">ใช้ข้อความเดิม</button>';
      $("aiUndo").onclick=()=>{$("slNote").value=prev;msg.textContent=""};
      track("ai_describe",{});
    }catch(e){msg.textContent="เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง"}
    finally{btn.disabled=false;btn.classList.remove("loading")}
  });
})();

saveFavs();render();cmpBar();initGoogle();loadListings();
