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

  /* ---- ad slots ---- */
  window.ktFillAds=function(){
    var slots=document.querySelectorAll(".ad-slot:not([data-done])");
    for(var i=0;i<slots.length;i++){
      var el=slots[i],name=el.getAttribute("data-ad"),id=(C.slots||{})[name];
      el.setAttribute("data-done","1");
      if(C.adsense&&id){
        el.innerHTML='<span class="ad-label">โฆษณา</span><ins class="adsbygoogle" style="display:block" data-ad-client="'+C.adsense+'" data-ad-slot="'+id+'" data-ad-format="auto" data-full-width-responsive="true"></ins>';
        try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(err){}
      }else if(C.placeholders){
        el.innerHTML='<span class="ad-ph">พื้นที่โฆษณา · '+name+'</span>';
      }else{
        el.parentNode.removeChild(el);
      }
    }
  };

  /* ---- car page: reveal phone + lead event ---- */
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("[data-call]");if(!b)return;
    var id=+b.getAttribute("data-call"),price=+b.getAttribute("data-price");
    window.ktTrack("generate_lead",{currency:"THB",value:price,lead_source:"call_seller",item_id:"KT-"+id});
    var box=document.querySelector("[data-phone]");
    if(box)box.innerHTML='<div class="ok">โทร 08'+(id*7919%90000000+10000000)+' (เบอร์ตัวอย่าง) แจ้งรหัสประกาศ KT-'+String(id).padStart(5,"0")+'</div>';
  });

  function init(){
    var choice=getChoice();
    if(choice)applyConsent(choice);else banner();
    window.ktFillAds();
    var m=location.pathname.match(/cars\/[^/]*-(\d+)\.html$/);
    if(m){var p=document.querySelector("[data-call]");window.ktTrack("view_item",{currency:"THB",value:p?+p.getAttribute("data-price"):0,items:[{item_id:"KT-"+m[1]}]})}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
