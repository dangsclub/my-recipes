const CACHE_NAME='my-recipes-qna-v1';
const RECIPE_PAGES=['haemul-jiri.html','jokbal.html','ori-tang.html','yukgaejang.html','sikhye.html'];
self.addEventListener('install',event=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.mode!=='navigate')return;
  const url=new URL(req.url);
  const page=url.pathname.split('/').pop()||'index.html';
  if(!RECIPE_PAGES.includes(page))return;
  event.respondWith((async()=>{
    const res=await fetch(req);
    const html=await res.text();
    const injected=html.replace('</body>','<script type="module" src="./qna.js?v=2"></script></body>');
    return new Response(injected,{status:res.status,statusText:res.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}});
  })());
});