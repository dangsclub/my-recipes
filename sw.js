const CACHE_NAME='my-recipes-qna-v7';
const RECIPE_PAGES=['haemul-jiri.html','jokbal.html','ori-tang.html','yukgaejang.html','sikhye.html','dongtae-tang.html','kodari-jjim.html','cocktail.html'];
self.addEventListener('install',event=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.mode!=='navigate')return;
 const url=new URL(req.url); const page=url.pathname.split('/').pop()||'index.html';
 if(!RECIPE_PAGES.includes(page))return;
 event.respondWith((async()=>{
  try{
   const res=await fetch(req); const html=await res.text();
   let fresh=html;
   // 육개장에 남아 있던 예전 localStorage Q&A UI를 제거하고 공통 Q&A로 통일
   if(page==='yukgaejang.html') fresh=fresh.replace(/<button class="qna-tab"[\s\S]*?<\/script>\s*<\/body>/i,'</body>');
   fresh=fresh.replace(/qna\.js(?:\?[^"']*)?/g,'qna.js?v=20261001-5');
   if(!fresh.includes('qna.js?v=20261001-5')){
    fresh=fresh.replace(/<\/body>/i,'<script type="module" src="./qna.js?v=20261001-5"></script>\n</body>');
   }
   return new Response(fresh,{status:res.status,statusText:res.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
  }catch(e){ return fetch(req); }
 })());
});