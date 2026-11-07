/* ขับต่อ: คุกกี้ (PDPA + Google Consent Mode v2), Google Analytics events, ช่องโฆษณา AdSense */
(function(){
  var C=window.KT_CONFIG||{};
  var KEY="kt-consent";
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){dataLayer.push(arguments)};
  function getChoice(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function setChoice(v){try{localStorage.setItem(KEY,v)}catch(e){}}

  function applyConsent(v){
    var g=v==="all"?"granted":"denied";
    gtag("consent","update",{analytics_storage:g,ad_storage:g,ad_user_data:g,ad_personalization:g});
    (window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=v==="all"?0:1;
  }

  /* GA4 event helper used by app.js and car pages */
  window.ktTrack=function(name,params){if(C.ga4)gtag("event",name,params||{})};

  /* ---- cookie banner ---- */
  function banner(){
    if(document.getElementById("ktConsent"))return;
    var d=document.createElement("div");
    d.id="ktConsent";d.className="consent";d.setAttribute("role","dialog");d.setAttribute("aria-label","การตั้งค่าคุกกี้");
    d.innerHTML='<p>เราใช้คุกกี้เพื่อวิเคราะห์การใช้งานและแสดงโฆษณาที่เกี่ยวข้อง คุณเลือกได้ว่าจะยินยอมหรือไม่ อ่านรายละเอียดใน <a href="'+(C.privacy||"privacy.html")+'">นโยบายความเป็นส่วนตัว</a></p>'+
      '<div class="consent-btns"><button type="button" class="btn btn-line" data-c="necessary">เฉพาะที่จำเป็น</button><button type="button" class="btn btn-amber" data-c="all">ยอมรับทั้งหมด</button></div>';
    d.addEventListener("click",function(e){var v=e.target.getAttribute("data-c");if(!v)return;setChoice(v);applyConsent(v);d.remove()});
    document.body.appendChild(d);
  }
  document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-consent-open]");if(t){e.preventDefault();banner()}});

  /* ---- ad slots ----
     ค่าจากหน้าแอดมินมาทาง window.KT_ADS (ใส่โดย Cloudflare middleware)
     ถ้าไม่มี (เปิดไฟล์ในเครื่อง) จะใช้ค่าใน build.py แทน */
  function adCfg(){
    var A=window.KT_ADS;
    if(A&&A.positions)return{on:A.ads_enabled!==false,client:A.adsense_client||"",placeholders:!!A.placeholders,pos:A.positions};
    var pos={};var sl=C.slots||{};for(var k in sl)pos[k]={on:true,slot:sl[k]};
    return{on:true,client:C.adsense||"",placeholders:!!C.placeholders,pos:pos};
  }
  window.ktFillAds=function(){
    var A=adCfg();
    var slots=document.querySelectorAll(".ad-slot:not([data-done])");
    for(var i=0;i<slots.length;i++){
      var el=slots[i],name=el.getAttribute("data-ad"),p=A.pos[name]||{on:true,slot:""};
      el.setAttribute("data-done","1");
      if(!A.on||p.on===false){el.parentNode.removeChild(el);continue}
      if(A.client&&p.slot){
        el.innerHTML='<span class="ad-label">โฆษณา</span><ins class="adsbygoogle" style="display:block" data-ad-client="'+A.client+'" data-ad-slot="'+p.slot+'" data-ad-format="auto" data-full-width-responsive="true"></ins>';
        try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(err){}
      }else if(A.placeholders&&!A.client){
        el.innerHTML='<span class="ad-ph">พื้นที่โฆษณา · '+name+'</span>';
      }else{
        el.parentNode.removeChild(el);
      }
    }
  };

  /* ---- car page: reveal phone + lead event ---- */
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("[data-call]");if(!b)return;
    var id=b.getAttribute("data-call"),price=+b.getAttribute("data-price"),tel=b.getAttribute("data-tel");
    window.ktTrack("generate_lead",{currency:"THB",value:price,lead_source:"call_seller",item_id:tel?id:"KT-"+id});
    var box=document.querySelector("[data-phone]");
    if(box&&tel){var d=document.createElement("div");d.className="ok";d.textContent=(b.getAttribute("data-name")||"ผู้ขาย")+" โทร "+tel+" แจ้งว่าเห็นประกาศ "+id+" จากขับต่อ";box.innerHTML="";box.appendChild(d);return}
    id=+id;
    if(box)box.innerHTML='<div class="ok">โทร 08'+(id*7919%90000000+10000000)+' (เบอร์ตัวอย่าง) แจ้งรหัสประกาศ KT-'+String(id).padStart(5,"0")+'</div>';
  });

  /* ---- ปุ่มแชร์ ---- */
  function shareTrack(method,box){window.ktTrack("share",{method:method,content_type:"page",item_id:box.getAttribute("data-share-url")})}
  window.ktInitShare=function(root){
    var boxes=(root||document).querySelectorAll(".share");
    for(var i=0;i<boxes.length;i++){var n=boxes[i].querySelector(".sh-native");if(n&&navigator.share)n.hidden=false}
  };
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("[data-share]");if(!b)return;
    var box=b.closest(".share"),url=box.getAttribute("data-share-url"),title=box.getAttribute("data-share-title"),m=b.getAttribute("data-share");
    if(m==="native"){e.preventDefault();navigator.share({title:title,url:url}).then(function(){shareTrack("native",box)}).catch(function(){});return}
    if(m==="copy"){
      e.preventDefault();
      var done=function(){var t=b.textContent;b.textContent="คัดลอกแล้ว";b.classList.add("ok-copy");setTimeout(function(){b.textContent=t;b.classList.remove("ok-copy")},1600);shareTrack("copy",box)};
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(done,function(){prompt("คัดลอกลิงก์นี้",url)})}
      else{prompt("คัดลอกลิงก์นี้",url)}
      return;
    }
    shareTrack(m,box);
  });

  /* ---- แกลเลอรีรูป (หน้าประกาศและกล่องรายละเอียด) ---- */
  function gTrack(el){var g=el.closest(".sheet-media, .car-hero, .gallery-box")||el.closest("[data-gallery]").parentNode;return g.querySelector(".g-track")}
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("[data-g],[data-gi]");if(!b)return;
    var t=gTrack(b);if(!t)return;
    if(b.hasAttribute("data-g"))t.scrollBy({left:+b.getAttribute("data-g")*t.clientWidth,behavior:"smooth"});
    else t.scrollTo({left:+b.getAttribute("data-gi")*t.clientWidth,behavior:"smooth"});
  });
  document.addEventListener("scroll",function(e){
    var t=e.target;if(!t.classList||!t.classList.contains("g-track"))return;
    var i=Math.round(t.scrollLeft/Math.max(1,t.clientWidth)),g=t.parentNode,c=g.querySelector(".g-count");
    if(c)c.textContent=(i+1)+"/"+t.children.length;
    var th=g.parentNode.querySelectorAll(".g-thumbs button");for(var k=0;k<th.length;k++)th[k].classList.toggle("on",k===i);
  },true);

  function init(){
    window.ktInitShare();
    var choice=getChoice();
    if(choice)applyConsent(choice);else banner();
    window.ktFillAds();
    var m=location.pathname.match(/cars\/[^/]*-(\d+)\.html$/);
    if(m){var p=document.querySelector("[data-call]");window.ktTrack("view_item",{currency:"THB",value:p?+p.getAttribute("data-price"):0,items:[{item_id:"KT-"+m[1]}]})}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
