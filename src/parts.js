/* หน้าอะไหล่และของแต่ง (/parts/) — โค้ดอัปโหลดรูป (PhotoPicker) ถูกแทรกด้านบนตอน build จาก app.js */
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>Math.round(n).toLocaleString("th-TH");
const track=(n,p)=>{try{window.ktTrack&&window.ktTrack(n,p||{})}catch(e){}};
let tt;function toast(t){const el=$("toast");if(!el)return;el.textContent=t;el.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>el.classList.remove("show"),2600)}
const CATS={wheel:"ล้อและยาง",audio:"เครื่องเสียงและจอ",exterior:"ชุดแต่งภายนอก",light:"ไฟและโคม",interior:"ภายในห้องโดยสาร",engine:"เครื่องยนต์และช่วงล่าง",other:"อื่น ๆ"};
const CAT_ICON={wheel:"◎",audio:"♫",exterior:"◆",light:"✦",interior:"▣",engine:"⚙",other:"…"};
const BRANDS=["BMW","BYD","Chevrolet","Ford","Honda","Hyundai","Isuzu","Kia","Mazda","Mercedes-Benz","MG","Mitsubishi","Nissan","Subaru","Suzuki","Toyota","Volvo","อื่นๆ"];
const PROVS=["กรุงเทพมหานคร","นนทบุรี","ปทุมธานี","สมุทรปราการ","ชลบุรี","เชียงใหม่","ขอนแก่น","นครราชสีมา","ภูเก็ต","สงขลา","อื่นๆ"];
const fill=(el,items,first)=>{el.innerHTML=(first!=null?`<option value="">${first}</option>`:"")+items.map(x=>Array.isArray(x)?`<option value="${esc(x[0])}">${esc(x[1])}</option>`:`<option>${esc(x)}</option>`).join("")};
const fits=l=>{const y=l.yearFrom&&l.yearTo?`${l.yearFrom}–${l.yearTo}`:l.yearFrom?`${l.yearFrom}+`:l.yearTo?`ถึง ${l.yearTo}`:"";return [l.brand==="ทุกยี่ห้อ"?"หลายยี่ห้อ":l.brand,l.model,y].filter(Boolean).join(" ")};
async function api(path,opt){
  try{const r=await fetch(path,Object.assign({credentials:"same-origin",headers:{"content-type":"application/json"}},opt||{}));
    try{return await r.json()}catch(e){return{ok:false,error:"เซิร์ฟเวอร์ตอบกลับผิดรูปแบบ ("+r.status+")"}}}
  catch(e){return{ok:false,error:"เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่"}}
}

/* ---------- รายการและตัวกรอง ---------- */
let PARTS=[];
const st={cat:"",q:"",brand:"",model:"",cond:"",max:0,prov:"",sort:"new"};
function readURL(){const q=new URLSearchParams(location.search);["cat","q","brand","model","cond","prov"].forEach(k=>{if(q.get(k))st[k]=q.get(k)});if(q.get("max"))st.max=+q.get("max")||0}
function writeURL(){const q=new URLSearchParams();["cat","q","brand","model","cond","prov"].forEach(k=>{if(st[k])q.set(k,st[k])});if(st.max)q.set("max",st.max);history.replaceState(null,"",location.pathname+(q.toString()?"?"+q:"")+location.hash)}
function match(l){
  if(st.cat&&l.cat!==st.cat)return false;
  if(st.brand&&l.brand!==st.brand&&l.brand!=="ทุกยี่ห้อ")return false;
  if(st.model&&!(l.model||"").toLowerCase().includes(st.model.toLowerCase())&&!l.title.toLowerCase().includes(st.model.toLowerCase()))return false;
  if(st.cond&&l.cond!==st.cond)return false;
  if(st.max&&l.price>st.max)return false;
  if(st.prov&&l.prov!==st.prov)return false;
  if(st.q){const hay=(l.title+" "+(l.note||"")+" "+l.brand+" "+(l.model||"")+" "+CATS[l.cat]).toLowerCase();if(!st.q.toLowerCase().split(/\s+/).every(w=>hay.includes(w)))return false}
  return true;
}
function cardP(l){
  const days=Math.max(0,Math.floor((Date.now()-Date.parse(l.created_at))/864e5));
  const ph=(l.photos||[])[0];
  const img=l.wm?`<img src="${esc(l.wm.src.replace(/\{w\}/g,500))}" alt="ภาพประกอบ ${esc(l.title)}" loading="lazy" referrerpolicy="no-referrer"><span class="wm-credit">ภาพ: ${esc(l.wm.by)} · ${esc(l.wm.lic)} · Wikimedia Commons</span>`
    :ph?`<img src="/p/${esc(ph)}-t.jpg" alt="${esc(l.title)}" loading="lazy">`:`<span>${CAT_ICON[l.cat]||"…"}</span>`;
  return `<a class="pcard${l.sold?" sold":""}" href="${l.demo?"/parts/demo/"+esc(l.id.replace(/^demo-/,""))+".html":"/l/"+esc(l.id)}">
    <div class="pimg">${img}${l.sold?'<span class="tag sold-tag">ขายแล้ว</span>':`<span class="tag">${esc(l.cond)}</span>`}${l.demo?'<span class="tag demo">ตัวอย่าง</span>':""}</div>
    <div class="pbody"><b>${esc(l.title)}</b><small>${esc(CATS[l.cat]||"")}${fits(l)?" · ใส่กับ "+esc(fits(l)):""}</small>
    <div class="pfoot"><span class="price">฿${fmt(l.price)}</span><small>${esc(l.prov)} · ${days?days+" วันก่อน":"วันนี้"}</small></div></div></a>`;
}
function render(){
  const list=PARTS.filter(match).sort((a,b)=>(a.sold?1:0)-(b.sold?1:0)||(st.sort==="new"?(a.demo?1:0)-(b.demo?1:0):0)||(st.sort==="pAsc"?a.price-b.price:st.sort==="pDesc"?b.price-a.price:Date.parse(b.created_at)-Date.parse(a.created_at)));
  $("pTitle").innerHTML=`${st.cat?esc(CATS[st.cat]):"อะไหล่ทั้งหมด"} <small>${list.length} รายการ</small>`;
  document.querySelectorAll("[data-cat]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.cat===st.cat)));
  $("pGrid").innerHTML=list.length?list.map(cardP).join(""):`<div class="parts-empty"><b>${PARTS.length?"ยังไม่มีอะไหล่ที่ตรงกับตัวกรอง":"ยังไม่มีประกาศอะไหล่"}</b><p>${PARTS.length?"ลองล้างตัวกรองหรือค้นด้วยคำอื่น":"เป็นคนแรกที่ลงขาย ลงฟรีและขึ้นหน้าเว็บทันที"}</p><a class="btn btn-amber" href="#sellPart">ลงขายอะไหล่ฟรี</a></div>`;
  writeURL();
}
function initFilters(){
  readURL();
  const counts=()=>{const c={};PARTS.forEach(l=>{if(!l.sold)c[l.cat]=(c[l.cat]||0)+1});return c};
  const drawCats=()=>{const c=counts();$("partCats").innerHTML=`<button type="button" role="tab" data-cat="">ทั้งหมด <small>${PARTS.filter(l=>!l.sold).length}</small></button>`+Object.entries(CATS).map(([k,v])=>`<button type="button" role="tab" data-cat="${k}"><i>${CAT_ICON[k]}</i>${v} <small>${c[k]||0}</small></button>`).join("")};
  drawCats();
  $("partCats").addEventListener("click",e=>{const b=e.target.closest("[data-cat]");if(!b)return;st.cat=b.dataset.cat;render()});
  fill($("pBrand"),BRANDS.filter(b=>b!=="อื่นๆ"),"ทุกยี่ห้อ");fill($("pProv"),PROVS,"ทุกจังหวัด");
  const bind=(id,k,num)=>{const el=$(id);el.value=st[k]||"";el.addEventListener("input",()=>{st[k]=num?+el.value||0:el.value.trim();render()})};
  bind("pQ","q");bind("pBrand","brand");bind("pModel","model");bind("pCond","cond");bind("pMax","max",true);bind("pProv","prov");
  $("pSort").addEventListener("change",()=>{st.sort=$("pSort").value;render()});
  return drawCats;
}
async function loadParts(redraw){
  const j=await api("/api/listings");
  const real=(j.ok&&j.listings||[]).filter(l=>l.kind==="part");
  const demo=(typeof DEMO_PARTS!=="undefined"&&!(window.KT_SITE&&window.KT_SITE.show_demo===false))?DEMO_PARTS.map(d=>({...d,created_at:new Date(Date.now()-d.days*864e5).toISOString()})):[];
  PARTS=[...real,...demo];
  redraw();render();
}

/* ---------- ลงขาย ---------- */
const AUTH=window.KT_AUTH||null;
let picker,MINE=[];
function renderMine(list){
  MINE=(list||[]).filter(l=>l.kind==="part");
  const box=$("myParts");
  if(!MINE.length){box.innerHTML="";return}
  box.innerHTML=`<h4 class="mine-h">อะไหล่ที่คุณลงขาย</h4>`+MINE.map(l=>`<div class="mine"><div><b>${esc(l.title)}</b><small>฿${fmt(l.price)} · ${esc(l.prov)} · ${new Date(l.created_at).toLocaleDateString("th-TH")}</small></div>
    <span class="pill ${l.sold?"sold":l.status==="approved"?"good":"bad"}">${l.sold?"ขายแล้ว":l.status==="approved"?"เผยแพร่แล้ว":"ถูกซ่อนโดยทีมงาน"}</span>
    <span class="mine-acts"><a class="btn btn-line btn-sm" href="/l/${esc(l.id)}">ดู</a><button type="button" class="btn btn-sm ${l.sold?"btn-line":"btn-road"}" data-sold="${esc(l.id)}" data-v="${l.sold?"0":"1"}">${l.sold?"ยังไม่ขาย":"ขายแล้ว"}</button><button type="button" class="btn btn-line btn-sm" data-del="${esc(l.id)}">ลบ</button></span></div>`).join("");
}
function setUser(u,list){
  $("partFields").disabled=!u;$("authBox").hidden=!!u;
  const bar=$("userBar");bar.hidden=!u;
  if(u){
    bar.innerHTML=`<span>ลงประกาศในชื่อ <b>${esc(u.name||u.email)}</b> <small>${esc(u.email)}</small></span><button type="button" class="btn btn-line btn-sm" id="logoutBtn">ออกจากระบบ</button>`;
    $("logoutBtn").onclick=async()=>{await api("/api/auth/logout",{method:"POST"});try{google.accounts.id.disableAutoSelect()}catch(e){}setUser(null,[])};
    if(!$("ptName").value)$("ptName").value=u.name||"";
  }
  renderMine(list);
}
async function loadMe(){const j=await api("/api/me");if(j.ok)setUser(j.user,j.listings||[]);return j}
function initGoogle(){
  const msg=$("authMsg");
  if(!AUTH){msg.textContent="การลงประกาศใช้ได้บนเว็บจริงที่ khaptor.com";return}
  if(!AUTH.googleClientId){msg.textContent="ระบบลงประกาศกำลังจะเปิดให้ใช้งานเร็ว ๆ นี้";return}
  loadMe();
  const sc=document.createElement("script");sc.src="https://accounts.google.com/gsi/client";sc.async=true;
  sc.onload=()=>{
    google.accounts.id.initialize({client_id:AUTH.googleClientId,ux_mode:"popup",callback:async res=>{
      msg.textContent="กำลังเข้าสู่ระบบ...";
      const j=await api("/api/auth/google",{method:"POST",body:JSON.stringify({credential:res.credential})});
      if(!j.ok){msg.textContent=j.error||"ล็อกอินไม่สำเร็จ ลองใหม่อีกครั้ง";return}
      track("login",{method:"Google"});await loadMe();$("ptTitle").focus();
    }});
    google.accounts.id.renderButton($("gBtn"),{theme:"outline",size:"large",text:"signin_with",shape:"pill",locale:"th",width:280});
  };
  sc.onerror=()=>{msg.textContent="โหลดปุ่มล็อกอินของ Google ไม่ได้ ลองรีเฟรชหน้า"};
  document.head.appendChild(sc);
}
function initSell(redraw){
  fill($("ptCat"),Object.entries(CATS),"เลือกหมวด");fill($("ptBrand"),[["ทุกยี่ห้อ","ใส่ได้หลายยี่ห้อ / ไม่ระบุ"],...BRANDS.filter(b=>b!=="อื่นๆ").map(b=>[b,b])]);fill($("ptProv"),PROVS,"เลือกจังหวัด");
  picker=new PhotoPicker($("ptPhotos"),[]);
  $("partForm").addEventListener("submit",async e=>{
    e.preventDefault();const v=id=>$(id).value.trim();
    if(picker.busy()){$("ptOk").innerHTML='<div class="err">รอให้อัปโหลดรูปเสร็จก่อน</div>';return}
    const body={kind:"part",photos:picker.ids(),title:v("ptTitle"),cat:v("ptCat"),cond:v("ptCond"),price:v("ptPrice"),brand:v("ptBrand"),model:v("ptModel"),yearFrom:v("ptYf"),yearTo:v("ptYt"),prov:v("ptProv"),name:v("ptName"),tel:v("ptTel"),note:v("ptNote"),consent:$("ptConsent").checked,legal:$("ptLegal").checked};
    if(!body.photos.length){$("ptOk").innerHTML='<div class="err">ใส่รูปสินค้าอย่างน้อย 1 รูป</div>';return}
    $("ptBtn").disabled=true;$("ptOk").innerHTML="";
    const j=await api("/api/listings",{method:"POST",body:JSON.stringify(body)});
    $("ptBtn").disabled=false;
    if(!j.ok){$("ptOk").innerHTML=`<div class="err">${esc(j.error||"ส่งประกาศไม่สำเร็จ")}</div>`;if(j.error&&/ล็อกอิน/.test(j.error))setUser(null,[]);return}
    track("submit_listing",{kind:"part",category:body.cat,value:+body.price,currency:"THB"});
    $("ptOk").innerHTML=`<div class="ok">ลงขายแล้ว <a href="/l/${esc(j.listing.id)}">ดูหน้าประกาศ</a></div>`;
    ["ptTitle","ptPrice","ptModel","ptYf","ptYt","ptNote"].forEach(id=>$(id).value="");$("ptConsent").checked=false;$("ptLegal").checked=false;picker.reset([]);
    loadMe();loadParts(redraw);
  });
  $("myParts").addEventListener("click",async e=>{
    const sid=e.target.getAttribute&&e.target.getAttribute("data-sold");
    if(sid){const sold=e.target.getAttribute("data-v")==="1";e.target.disabled=true;
      const j=await api("/api/listings/"+encodeURIComponent(sid),{method:"PATCH",body:JSON.stringify({sold})});
      if(!j.ok){toast(j.error||"บันทึกไม่สำเร็จ");e.target.disabled=false;return}
      toast(sold?"ทำเครื่องหมายขายแล้ว":"เปลี่ยนกลับเป็นยังไม่ขายแล้ว");loadMe();loadParts(redraw);return}
    const id=e.target.getAttribute&&e.target.getAttribute("data-del");if(!id)return;
    if(e.target.dataset.confirm!=="1"){e.target.dataset.confirm="1";e.target.textContent="กดอีกครั้งเพื่อลบ";return}
    e.target.disabled=true;
    const j=await api("/api/listings/"+encodeURIComponent(id),{method:"DELETE"});
    if(!j.ok){toast(j.error||"ลบไม่สำเร็จ");e.target.disabled=false;return}
    toast("ลบประกาศแล้ว");loadMe();loadParts(redraw);
  });
}
document.addEventListener("DOMContentLoaded",()=>{
  const redraw=initFilters();render();initSell(redraw);initGoogle();loadParts(redraw);
});
