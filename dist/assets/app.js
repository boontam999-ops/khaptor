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

const slug=c=>(c.year+"-"+c.brand+"-"+c.model+"-"+c.id).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const BASE=(document.body.dataset.base||"");
/* Analytics: no-op until GA4 is configured and consent given (see site.js) */
const track=(name,params)=>{try{window.ktTrack&&window.ktTrack(name,params||{})}catch(e){}};
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
  const bg=`hsl(${(c.id*37)%360} 22% ${document.documentElement.dataset.theme==="dark"?"22%":"91%"})`;
  return `<div class="pic" style="background:linear-gradient(180deg,${bg},color-mix(in srgb,${bg} 70%,#000 6%))">${carSVG(c)}`;
}

/* populate selects */
const brands=[...new Set(CARS.map(c=>c.brand))].sort();
function fillSelect(el,items,first){el.innerHTML=(first?`<option value="">${first}</option>`:"")+items.map(v=>typeof v==="object"?`<option value="${v[0]}">${v[1]}</option>`:`<option>${v}</option>`).join("")}
fillSelect($("sBrand"),brands,"ทุกยี่ห้อ");
fillSelect($("sYear"),Array.from({length:11},(_,i)=>2025-i).map(y=>[y,"ตั้งแต่ "+y]),"ทุกปี");
fillSelect($("sProv"),PROVS,"ทุกจังหวัด");
fillSelect($("slBrand"),[...brands,"อื่นๆ"]);
fillSelect($("slYear"),Array.from({length:20},(_,i)=>2026-i));
fillSelect($("slProv"),PROVS);
function refreshModels(){const b=$("sBrand").value;const ms=[...new Set(CARS.filter(c=>!b||c.brand===b).map(c=>c.model))].sort();fillSelect($("sModel"),ms,"ทุกรุ่น")}
refreshModels();
$("sBrand").addEventListener("change",refreshModels);

const state={brand:"",model:"",maxPrice:0,year:0,prov:"",body:new Set(),gear:new Set(),fuel:new Set(),seller:new Set(),km:200000,cert:false,sort:"new",onlyFav:false};

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
  if(state.year&&c.year<state.year)return false;
  if(state.prov&&c.prov!==state.prov)return false;
  if(c.km>state.km)return false;
  if(state.cert&&!c.cert)return false;
  for(const k of ["body","gear","fuel","seller"]){if(k!==skip&&state[k].size&&!state[k].has(c[k]))return false}
  return true;
}

function card(c){
  const tags=[c.cert?'<span class="tag cert">ผ่านการตรวจสภาพ</span>':"",c.fuel==="ไฟฟ้า"?'<span class="tag ev">EV</span>':"",c.days===0?'<span class="tag">ลงวันนี้</span>':""].join("");
  return `<article class="card" tabindex="0" data-id="${c.id}" aria-label="${c.brand} ${c.model} ราคา ${fmt(c.price)} บาท">
    ${picHTML(c)}<div class="tags">${tags}</div>
      <button class="fav ${favs.has(c.id)?"on":""}" type="button" data-fav="${c.id}" aria-label="บันทึกรถคันนี้" aria-pressed="${favs.has(c.id)}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="${favs.has(c.id)?"currentColor":"none"}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z"/></svg>
      </button>
    </div>
    <div class="cbody">
      <h3><a href="${BASE}cars/${slug(c)}.html" class="cardlink">${c.year} ${c.brand} ${c.model}</a></h3>
      <div class="sub">${c.sub}</div>
      <div class="specs"><span>${fmt(c.km)} กม.</span><span>${c.gear}</span><span>${c.fuel}</span><span>${c.prov}</span></div>
      <div class="pricerow">
        <div><div class="price">฿${fmt(c.price)}</div><div class="monthly">ผ่อนประมาณ ฿${fmt(monthly(c.price))}/เดือน</div></div>
        <div class="plate">${c.plate}<small>${PROV_ABBR[c.prov]}</small></div>
      </div>
      <div class="seller">${c.seller==="dealer"?"เต็นท์รถ":"เจ้าของขายเอง"} · ลงประกาศ${c.days===0?"วันนี้":` ${c.days} วันก่อน`}</div>
    </div>
  </article>`;
}

function render(){
  brandChips();
  let list=CARS.filter(c=>matches(c));
  const S={new:(a,b)=>a.days-b.days,pAsc:(a,b)=>a.price-b.price,pDesc:(a,b)=>b.price-a.price,yDesc:(a,b)=>b.year-a.year,kmAsc:(a,b)=>a.km-b.km};
  list.sort(S[state.sort]);
  const title=state.onlyFav?"รถที่ถูกใจ":[state.brand||"รถมือสอง",state.model].filter(Boolean).join(" ")+(state.prov?" ใน"+state.prov:"");
  $("resultTitle").innerHTML=`${title}<small>${list.length} คัน</small>`;
  $("grid").innerHTML=list.length?list.map((c,i)=>card(c)+(i===5&&list.length>8?'<div class="ad-slot ad-infeed" data-ad="infeed"></div>':"")).join(""):`<div class="empty">ไม่พบรถที่ตรงกับเงื่อนไข ลองขยายช่วงราคาหรือเอาตัวกรองบางอันออก</div>`;
  // facet counts
  document.querySelectorAll("[data-count]").forEach(el=>{const [k,v]=el.dataset.count.split(":");el.textContent=CARS.filter(c=>matches(c,k)&&c[k]===v).length});
  // active chips
  const chips=[];
  if(state.onlyFav)chips.push(["onlyFav","เฉพาะรถที่ถูกใจ"]);
  if(state.brand)chips.push(["brand",state.brand]);
  if(state.model)chips.push(["model",state.model]);
  if(state.maxPrice)chips.push(["maxPrice","ไม่เกิน ฿"+fmt(state.maxPrice)]);
  if(state.year)chips.push(["year","ปี "+state.year+" ขึ้นไป"]);
  if(state.prov)chips.push(["prov",state.prov]);
  window.ktFillAds&&window.ktFillAds();
  $("activeChips").innerHTML=chips.map(([k,l])=>`<button type="button" data-rm="${k}">${l} ✕</button>`).join("");
}
$("activeChips").addEventListener("click",e=>{const k=e.target.dataset.rm;if(!k)return;
  if(k==="onlyFav")state.onlyFav=false;else{state[k]=typeof state[k]==="number"?0:"";const map={brand:"sBrand",model:"sModel",maxPrice:"sMaxPrice",year:"sYear",prov:"sProv"};$(map[k]).value="";if(k==="brand"){state.model="";refreshModels()}}
  render()});
$("clearAll").addEventListener("click",()=>{
  Object.assign(state,{brand:"",model:"",maxPrice:0,year:0,prov:"",km:200000,cert:false,onlyFav:false});
  ["body","gear","fuel","seller"].forEach(k=>state[k].clear());
  document.querySelectorAll("aside input[type=checkbox]").forEach(i=>i.checked=false);
  $("fKm").value=200000;$("fKmVal").textContent="200,000 กม.";
  $("searchForm").reset();refreshModels();render();
});
$("favBtn").addEventListener("click",()=>{state.onlyFav=!state.onlyFav;render();document.getElementById("buy").scrollIntoView({behavior:"smooth"})});

function toggleFav(id){track(favs.has(id)?"remove_from_wishlist":"add_to_wishlist",{item_id:"KT-"+id});favs.has(id)?favs.delete(id):favs.add(id);saveFavs();toast(favs.has(id)?"บันทึกไว้ในรถที่ถูกใจแล้ว":"เอาออกจากรถที่ถูกใจแล้ว");render();if($("modal").classList.contains("open"))openCar(id)}
$("grid").addEventListener("click",e=>{
  const f=e.target.closest("[data-fav]");if(f){e.stopPropagation();toggleFav(+f.dataset.fav);return}
  if(e.target.closest(".cardlink")&&(e.ctrlKey||e.metaKey||e.button===1))return;
  const c=e.target.closest(".card");if(c){e.preventDefault();openCar(+c.dataset.id)}
});
$("grid").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.classList.contains("card"))openCar(+e.target.dataset.id)});

/* detail modal */
let lastFocus=null;
function openCar(id){
  const c=CARS.find(x=>x.id===id);lastFocus=lastFocus||document.activeElement;
  const m=monthly(c.price);
  track("view_item",{currency:"THB",value:c.price,items:[{item_id:"KT-"+c.id,item_name:c.year+" "+c.brand+" "+c.model,item_brand:c.brand,price:c.price}]});
  $("sheet").innerHTML=`${picHTML(c)}</div>
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
      <div><span>ตรวจสภาพ</span><b style="color:${c.cert?"var(--good)":"var(--muted)"}">${c.cert?"ผ่าน 175 จุด":"ยังไม่ตรวจ"}</b></div><div><span>รหัสประกาศ</span><b>KT-${String(c.id).padStart(5,"0")}</b></div>
    </div>
    <div class="contact">
      <button class="btn btn-amber" type="button" id="mCall">ดูเบอร์ผู้ขาย</button>
      <button class="btn btn-line" type="button" id="mLoan">คำนวณค่างวด</button>
      <a class="btn btn-line" href="${BASE}cars/${slug(c)}.html">ดูหน้าประกาศเต็ม</a>
      <button class="btn btn-line" type="button" id="mFav">${favs.has(c.id)?"เอาออกจากที่ถูกใจ":"บันทึกไว้"}</button>
    </div>
    <div id="mPhone"></div>
  </div>`;
  $("modal").classList.add("open");$("mClose").focus();
  $("mClose").onclick=closeModal;
  $("mFav").onclick=()=>toggleFav(c.id);
  $("mCall").onclick=()=>{track("generate_lead",{currency:"THB",value:c.price,lead_source:"call_seller",item_id:"KT-"+c.id});$("mPhone").innerHTML=`<div class="ok">โทร 08${(c.id*7919%90000000+10000000)} (เบอร์ตัวอย่าง) แจ้งรหัสประกาศ KT-${String(c.id).padStart(5,"0")}</div>`};
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

/* sell form */
$("sellForm").addEventListener("submit",e=>{
  e.preventDefault();
  const n={id:CARS.length+1,brand:$("slBrand").value,model:$("slModel").value.split(" ")[0]||"รถ",sub:$("slModel").value.split(" ").slice(1).join(" ")||$("slNote").value.slice(0,40)||"เจ้าของขายเอง",year:+$("slYear").value,price:+$("slPrice").value,km:+$("slKm").value,body:"sedan",gear:"อัตโนมัติ",fuel:"เบนซิน",color:"ขาว",prov:$("slProv").value,seller:"owner",cert:false,days:0,plate:"ป้ายแดง"};
  CARS.push(n);
  track("submit_listing",{brand:n.brand,province:n.prov,value:n.price,currency:"THB"});
  $("sellOk").innerHTML=`<div class="ok">ลงประกาศแล้ว รหัส KT-${String(n.id).padStart(5,"0")} ประกาศของคุณขึ้นเป็นคันแรกในรายการรถ (ในหน้าสาธิตนี้ประกาศจะอยู่จนกว่าจะรีเฟรชหน้า)</div>`;
  e.target.reset();state.sort="new";$("sort").value="new";render();
});

let tt;function toast(t){const el=$("toast");el.textContent=t;el.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>el.classList.remove("show"),1800)}
saveFavs();render();
