import json
from shared import *

FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Schibsted+Grotesk:wght@500;700;800&display=swap"

# Station base coordinates for the desktop map (viewBox 1000 x 420). Mobile transposes x and y.
STATIONS = {
    "payer": {"name": "Payer", "xy": [70, 230], "lab": [0, 36], "mlab": [26, 6],
              "text": "The person or business paying. A UPI payment starts in an app; other rails start with an instruction to the payer's bank."},
    "corp": {"name": "Company", "xy": [70, 110], "lab": [0, -22], "mlab": [0, -24],
             "text": "Employers, lenders and billers send bulk files, such as salaries or loan instalments, through their sponsor bank to NACH."},
    "rbank": {"name": "Payer's bank", "xy": [220, 230], "lab": [-14, -26], "mlab": [-26, -10],
              "text": "Holds the payer's account, checks funds and authentication, and debits the account. It also authorises cash withdrawals made with its cards at other banks' ATMs."},
    "npci": {"name": "NPCI", "xy": [500, 110], "lab": [0, -28], "mlab": [-32, 6],
             "text": "The National Payments Corporation of India runs UPI, IMPS, NACH, the cheque clearing grids and the National Financial Switch for ATMs. Banks settle what they owe each other in their accounts at RBI.",
             "page": "NPCI"},
    "atm": {"name": "ATM", "xy": [600, 30], "lab": [22, 6], "mlab": [0, 36],
            "text": "A withdrawal at another bank's ATM travels through the National Financial Switch to the bank that issued the card."},
    "bbank": {"name": "Payee's bank", "xy": [800, 230], "lab": [-30, 6], "mlab": [40, 30],
              "text": "Credits the payee. For UPI and IMPS the customer is credited at once, and the banks settle among themselves later."},
    "payee": {"name": "Payee", "xy": [940, 230], "lab": [0, 36], "mlab": [26, 6],
              "text": "The person or shop receiving the money."},
    "iftas": {"name": "IFTAS network (SFMS)", "mname": "IFTAS (SFMS)", "xy": [330, 370], "lab": [0, 36], "mlab": [-30, 6],
              "text": "Indian Financial Technology and Allied Services runs INFINET and SFMS, the private network and messaging layer that carry RTGS and NEFT messages.",
              "page": "IFTAS"},
    "rbi": {"name": "RBI", "xy": [500, 370], "lab": [0, 36], "mlab": [-30, 6],
            "text": "The Reserve Bank of India runs RTGS and NEFT itself, and holds the accounts in which banks settle with one another.",
            "page": "RBI ecosystem"},
}

# Lines: waypoints are station ids or [x, y]. "o" is the bundle offset index.
LINES = [
    {"id": "upi", "name": "UPI", "full": "Unified Payments Interface", "o": -2,
     "pts": ["payer", "rbank", [340, 110], "npci", [800, 110], "bbank", "payee"]},
    {"id": "imps", "name": "IMPS", "full": "Immediate Payment Service", "o": -1,
     "pts": ["rbank", [340, 110], "npci", [800, 110], "bbank"]},
    {"id": "cts", "name": "CTS", "full": "Cheque Truncation System", "o": 0,
     "pts": ["rbank", [340, 110], "npci", [800, 110], "bbank"]},
    {"id": "nach", "name": "NACH", "full": "National Automated Clearing House", "o": 1,
     "pts": ["corp", [340, 110], "npci", [800, 110], "bbank"]},
    {"id": "cards", "name": "Cards and ATMs", "full": "National Financial Switch", "o": 2,
     "pts": ["atm", [600, 110], "npci", [340, 110], "rbank"]},
    {"id": "rtgs", "name": "RTGS", "full": "Real Time Gross Settlement", "o": -0.5,
     "pts": ["rbank", [220, 370], "iftas", "rbi", [800, 370], "bbank"]},
    {"id": "neft", "name": "NEFT", "full": "National Electronic Funds Transfer", "o": 0.5,
     "pts": ["rbank", [220, 370], "iftas", "rbi", [800, 370], "bbank"]},
]

CSS = """
:root{
 --bg:#ffffff;--surface:#F4F5F8;--ink:#141925;--ink-2:#4A5163;--ink-3:#687084;--rule:#E1E4EA;--rule-strong:#A3AAB8;
 --accent:#6A3EC2;--accent-ink:#5A30AE;--focus:#6A3EC2;
 --upi:#6A3EC2;--imps:#D4460E;--cts:#A86400;--nach:#2A8636;--cards:#C01E58;--rtgs:#0B6C7D;--neft:#1A62CC;--settle:#8A91A0;
 --d-found:#1A62CC;--d-design:#6A3EC2;--d-dec:#A86400;--d-gov:#0B6C7D;
 --r-sm:8px;--r-md:14px;--shadow-pop:0 10px 30px rgb(20 25 37 / .12);
 --head:"Schibsted Grotesk",system-ui,sans-serif;--sans:"Inter Tight",system-ui,sans-serif;
}
[data-theme=dark]{
 --bg:#0F1522;--surface:#18213A;--ink:#E8EBF3;--ink-2:#AAB2C6;--ink-3:#8A93AA;--rule:#27314A;--rule-strong:#4A5677;
 --accent:#A68CF2;--accent-ink:#B9A4F7;--focus:#B9A4F7;
 --upi:#A68CF2;--imps:#FF8A4F;--cts:#F0B24B;--nach:#63CF70;--cards:#FF6FA1;--rtgs:#3FC6D8;--neft:#62A5FF;--settle:#76809A;
 --d-found:#62A5FF;--d-design:#A68CF2;--d-dec:#F0B24B;--d-gov:#3FC6D8;--shadow-pop:0 10px 30px rgb(0 0 0 / .5);
}
body{background:var(--bg);color:var(--ink);font:400 1.0625rem/1.62 var(--sans)}
a{color:var(--accent-ink);text-underline-offset:.2em}
.brand-name{font-family:var(--head);font-weight:800;font-size:1.125rem;letter-spacing:-.01em}
.wrap{max-width:1240px;margin:auto;padding:0 1.5rem}

.hero{padding:3rem 0 1rem}
.hero-top{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:2.5rem;align-items:end;margin-bottom:2rem}
h1{font-family:var(--head);font-weight:800;font-size:clamp(2.3rem,1.5rem + 3vw,3.9rem);line-height:1.02;letter-spacing:-.03em;margin:0 0 1rem}
h1 .h1-sub{display:block;font-weight:500;color:var(--ink-2);font-size:.5em;letter-spacing:-.015em;margin-top:.4rem}
.promise{font-size:1.1875rem;color:var(--ink-2);margin:0;max-width:36rem}
.fact{margin:0;padding:1rem 1.25rem;border-radius:var(--r-md);background:var(--surface);font-size:1.0625rem}
.fact strong{font-family:var(--head);font-weight:700}
.fact small{display:block;color:var(--ink-2);font-size:.875rem;margin-top:.2rem}

.map-card{border:1px solid var(--rule);border-radius:var(--r-md);padding:1.25rem;background:var(--bg)}
.map-head{display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;justify-content:space-between;margin-bottom:.75rem}
.map-head h2{font-family:var(--head);font-size:1.25rem;font-weight:700;margin:0;letter-spacing:-.01em}
.map-hint{margin:0;color:var(--ink-2);font-size:.9375rem}
.legend{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 .75rem;padding:0;list-style:none}
.chip{display:inline-flex;align-items:center;gap:.5rem;min-height:36px;padding:0 .8rem 0 .6rem;border:1px solid var(--rule-strong);border-radius:999px;background:var(--bg);color:var(--ink);font:500 .9375rem var(--sans);cursor:pointer}
.chip i{width:1.4rem;height:.35rem;border-radius:2px;background:var(--c)}
.chip[aria-pressed=true]{border-color:var(--c);box-shadow:inset 0 0 0 1.5px var(--c);background:var(--surface)}
.chip.reset{border-style:dashed}
.map-body{display:grid;grid-template-columns:minmax(0,1fr) 19rem;gap:1.25rem;align-items:start}
.map-svg{width:100%;height:auto;display:block}
.map-m{display:none}
.ln{fill:none;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;transition:opacity .2s;cursor:pointer}
.ln.settle{stroke:var(--settle);stroke-width:2.5;stroke-dasharray:6 7;cursor:default}
.draw .ln:not(.settle){stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.6s cubic-bezier(.4,0,.2,1) forwards}
@keyframes draw{to{stroke-dashoffset:0}}
[data-theme=dark] .ln:not(.settle){filter:drop-shadow(0 0 3px color-mix(in srgb,currentColor 55%,transparent))}
.st{cursor:pointer;outline:none}
.st .cap-o{stroke:var(--ink);stroke-linecap:round}
.st .cap-i{stroke:var(--bg);stroke-linecap:round}
.st:hover .cap-o,.st:focus-visible .cap-o{stroke:var(--accent)}
.st:focus-visible .cap-o{stroke-width:22}
.st.sel .cap-i{stroke:var(--accent)}
.st text{font:600 17px var(--sans);fill:var(--ink);paint-order:stroke;stroke:var(--bg);stroke-width:5px;stroke-linejoin:round}
.map-m .st text{font-size:19px}
.settle-lab{font:500 13px var(--sans);fill:var(--ink-2);paint-order:stroke;stroke:var(--bg);stroke-width:4px}
.iso .ln:not(.on){opacity:.1}
.iso .st:not(.on){opacity:.35}
.panel{border-left:1px solid var(--rule);padding-left:1.25rem;min-height:12rem}
.panel h3{font-family:var(--head);font-weight:700;font-size:1.3rem;margin:0 0 .4rem;letter-spacing:-.01em}
.panel p{margin:0 0 .75rem;color:var(--ink-2);font-size:.975rem}
.panel .serves{display:flex;flex-wrap:wrap;gap:.35rem;margin:0 0 .9rem;padding:0;list-style:none}
.panel .serves li{display:inline-flex;align-items:center;gap:.35rem;font-size:.8125rem;font-weight:600;padding:.1rem .5rem;border-radius:999px;background:var(--surface)}
.panel .serves i{width:.6rem;height:.6rem;border-radius:50%;background:var(--c)}
.panel a.open{display:inline-flex;align-items:center;min-height:40px;padding:0 1rem;border-radius:var(--r-sm);background:var(--accent);color:var(--bg);text-decoration:none;font-weight:600}
.map-foot{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;justify-content:space-between;margin-top:.75rem;font-size:.875rem;color:var(--ink-2)}
.map-foot details{max-width:100%}
.map-foot summary{cursor:pointer;color:var(--accent-ink);font-weight:600}
.map-foot ul{margin:.5rem 0 0;padding-left:1.1rem}

.path-wrap{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 0;margin-top:2rem}
.path-row{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 0;margin:0;padding:0;list-style:none;counter-reset:p}
.path-label{font-weight:600;margin-right:1rem}
.path-row li{counter-increment:p;display:flex;align-items:center}
.path-row li:not(:last-child)::after{content:"";width:1.5rem;height:4px;background:var(--rule-strong);border-radius:2px;margin:0 .25rem}
.path-row a{display:inline-flex;align-items:center;gap:.45rem;min-height:36px;color:var(--ink);text-decoration:none;font-weight:500}
.path-row a::before{content:counter(p);display:inline-grid;place-items:center;width:1.6rem;height:1.6rem;border-radius:50%;border:3px solid var(--ink);font:700 .75rem var(--head)}
.path-row a:hover{color:var(--accent-ink)}

.doc{display:grid;grid-template-columns:minmax(0,72ch) 15rem;gap:4rem;justify-content:center;margin-top:5rem}
.crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin:0 0 1rem;padding:0;list-style:none;font-size:.9375rem}
.crumbs li{display:flex;align-items:center;gap:.5rem}
.crumbs li+li::before{content:"";width:1.25rem;height:3px;border-radius:2px;background:var(--d-found)}
.crumbs a{color:var(--ink-2);text-decoration:none}
.crumbs a:hover{text-decoration:underline}
.bullet{display:inline-grid;place-items:center;width:1.25rem;height:1.25rem;border-radius:50%;background:var(--d-found);color:#fff;font:700 .7rem var(--head)}
[data-theme=dark] .bullet{color:var(--bg)}
.prose h2,.idx-head h2,.sources h2{font-family:var(--head);font-weight:700;font-size:clamp(1.75rem,1.4rem + 1.3vw,2.4rem);line-height:1.12;letter-spacing:-.02em;margin:0 0 1.1rem}
.prose p{margin:0 0 1.15rem}
.cite a{font-size:.72em;font-weight:700;text-decoration:none;padding:0 .2em;color:var(--accent-ink)}
.sn-mark{font:700 .7rem/1 var(--sans);vertical-align:super;margin-left:.15em;min-width:1.5rem;min-height:1.5rem;border:0;border-radius:999px;background:var(--surface);color:var(--accent-ink);cursor:pointer}
.sn-mark[aria-expanded=true]{background:var(--accent);color:var(--bg)}
.sn{display:none}.sn.open{display:block;margin:.5rem 0;padding:.6rem .9rem;border-radius:var(--r-sm);background:var(--surface);font-size:.9375rem;color:var(--ink-2)}
.sn-num{font-weight:700;color:var(--ink);margin-right:.25rem}
.fig{margin:2.25rem 0;padding:1.25rem;border:1px solid var(--rule);border-radius:var(--r-md)}
.fig-title{font-family:var(--head);font-weight:700;font-size:1.15rem;margin:0 0 1rem}
.fig-sub{font-size:.875rem;font-weight:600;color:var(--ink-2);text-align:center;margin:0 0 .25rem}
.dg-node circle{fill:var(--bg);stroke:var(--ink);stroke-width:3}
.dg-node text{fill:var(--ink);font:600 12px var(--sans)}
.dg-edge{fill:none;stroke:var(--ink-3);stroke-width:2}
.dg-edge--key{stroke:var(--upi);stroke-width:5;stroke-linecap:round}
.dg-head{fill:var(--ink-3)}
#arr-n path{fill:var(--upi)}
.dg-lab{fill:var(--ink);font:600 13px var(--sans);paint-order:stroke;stroke:var(--bg);stroke-width:4px}
.dg-lab--key{fill:var(--accent-ink)}
.dg-pos{fill:var(--ink-2);font:500 12px var(--sans)}
figcaption{font-size:.9375rem;color:var(--ink-2);margin-top:.75rem}
.fig-dl{margin-left:.5rem;font-weight:600}
.fig-alt{font-size:.9375rem;margin-top:.5rem}.fig-alt summary{color:var(--accent-ink);font-weight:600}
.table-wrap{margin:2rem 0 .5rem;border:1px solid var(--rule);border-radius:var(--r-md)}
table.data{font-size:.9375rem}
caption{caption-side:top;text-align:left;font-family:var(--head);font-weight:700;font-size:1.05rem;padding:1rem 1rem .5rem}
table.data th,table.data td{text-align:left;vertical-align:top;padding:.7rem 1rem;border-top:1px solid var(--rule)}
table.data thead th{font-size:.8125rem;font-weight:600;color:var(--ink-2);background:var(--surface)}
table.data tbody th{white-space:nowrap}
table.data tbody th abbr{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--head);font-weight:700;text-decoration:none}
table.data tbody th abbr::before{content:"";width:.85rem;height:.85rem;border-radius:50%;border:3.5px solid var(--c,var(--ink))}
.table-note{font-size:.875rem;color:var(--ink-2);margin:.25rem 0 0}
.callout{margin:2rem 0;padding:1rem 1.25rem;border-radius:var(--r-md);background:color-mix(in srgb,var(--neft) 9%,var(--bg));border:1px solid color-mix(in srgb,var(--neft) 35%,var(--bg))}
.callout p{margin:0}.callout-label{display:flex;align-items:center;gap:.5rem;font-weight:700;margin-bottom:.3rem!important}
.onpage{position:sticky;top:6rem;align-self:start;font-size:.9375rem}
.onpage p{font-weight:600;margin:0 0 .5rem}
.onpage ul{list-style:none;margin:0;padding:0}
.onpage a{display:block;padding:.3rem 0 .3rem .9rem;color:var(--ink-2);text-decoration:none;border-left:3px solid var(--rule)}
.onpage a[aria-current]{color:var(--ink);font-weight:600;border-left-color:var(--d-found)}

.idx-head{margin:5rem 0 1.5rem;display:flex;flex-wrap:wrap;gap:1rem;align-items:end;justify-content:space-between}
.idx-head h2{margin:0}
.idx-head p{margin:0;color:var(--ink-2);max-width:34rem}
.cards{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,18rem),1fr));gap:2rem 2rem}
.cards a{display:flex;flex-direction:column;gap:.5rem;height:100%;padding:1.35rem .25rem 1.25rem;border-top:4px solid var(--d-design);color:inherit;text-decoration:none;position:relative;transition:background .15s}
.cards a::before{content:"";position:absolute;left:-2px;top:-10px;width:10px;height:10px;border-radius:50%;background:var(--bg);border:3px solid var(--d-design)}
.cards a:hover{background:var(--surface)}
.cards a:hover .t{color:var(--accent-ink)}
.cards .t{font-family:var(--head);font-weight:700;font-size:1.15rem;line-height:1.25;letter-spacing:-.01em;margin-top:.35rem}
.cards .b{color:var(--ink-2);font-size:.9375rem;flex:1}
.cards .m{display:flex;gap:1rem;align-items:center;font-size:.8125rem;color:var(--ink-2)}
.stops{width:40px;height:12px}
.stops line{stroke:var(--rule-strong);stroke-width:3}
.stops circle{fill:var(--bg);stroke:var(--rule-strong);stroke-width:2.5}
.stops circle.on{stroke:var(--d-design);fill:var(--d-design)}
.cards .dep{display:inline-flex;align-items:center;gap:.45rem;color:var(--ink);font-weight:500}
.cards li.lead{grid-column:span 2;grid-row:span 2}
.cards li.lead a{background:var(--surface);padding:1.6rem 1.5rem;justify-content:flex-start}
.cards li.lead a::before{left:1.25rem}
.cards li.lead .t{font-size:clamp(1.5rem,1.2rem + 1vw,2rem);max-width:18ch}
.cards li.lead .b{font-size:1.0625rem;max-width:36rem}
.start{font-weight:700;color:var(--accent-ink)}
.sources{margin-top:4rem;font-size:.9375rem;color:var(--ink-2)}
.sources h2{font-size:1.4rem}
.sources li{margin-bottom:.5rem}
.src-type{font-weight:600;color:var(--ink)}

@media (max-width:1000px){
 .hero-top{grid-template-columns:1fr;gap:1.5rem}
 .map-body{grid-template-columns:1fr}
 .panel{border-left:0;border-top:1px solid var(--rule);padding:1rem 0 0;min-height:0}
 .doc{grid-template-columns:minmax(0,1fr)}
 .onpage{display:none}
}
@media (max-width:640px){
 .wrap{padding:0 1rem}
 .hero{padding-top:1.75rem}
 .map-card{padding:1rem .75rem;margin:0 -.25rem}
 .map-d{display:none}.map-m{display:block;max-width:360px;margin:auto}
 .cards li.lead{grid-column:auto;grid-row:auto}
 .cards li.lead .t{font-size:1.3rem}
}
@media (prefers-reduced-motion:reduce){.draw .ln:not(.settle){animation:none;stroke-dashoffset:0;stroke-dasharray:none}}
"""

JS = r"""
(function(){
 var NS='http://www.w3.org/2000/svg', S=__ST__, L=__LN__, GAP=6;
 var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
 function base(pt,m){var xy=typeof pt==='string'?S[pt].xy:pt;return m?[xy[1],xy[0]]:xy}
 function rounded(pts,r){var d='M'+pts[0].join(' ');
  for(var i=1;i<pts.length-1;i++){var a=pts[i-1],b=pts[i],c=pts[i+1];
   var l1=Math.hypot(b[0]-a[0],b[1]-a[1]),l2=Math.hypot(c[0]-b[0],c[1]-b[1]),rr=Math.min(r,l1/2,l2/2);
   var p1=[b[0]+(a[0]-b[0])*rr/l1,b[1]+(a[1]-b[1])*rr/l1],p2=[b[0]+(c[0]-b[0])*rr/l2,b[1]+(c[1]-b[1])*rr/l2];
   d+='L'+p1.join(' ')+'Q'+b.join(' ')+' '+p2.join(' ');}
  return d+'L'+pts[pts.length-1].join(' ');}
 function build(svg,m){
  var gl=el('g',{},svg), gs=el('g',{},svg);
  var n=base('npci',m),r=base('rbi',m);
  el('path',{class:'ln settle',d:'M'+n.join(' ')+'L'+r.join(' ')},gl);
  var sl=el('text',{class:'settle-lab',x:m?(n[0]+r[0])/2:n[0]-10,y:m?n[1]-12:(n[1]+r[1])/2,'text-anchor':m?'middle':'end'},gl);
  sl.textContent='Net settlement';
  var passing={};
  L.forEach(function(line,i){
   var pts=line.pts.map(function(p){var b=base(p,m);return [b[0]+line.o*GAP,b[1]+line.o*GAP]});
   var p=el('path',{class:'ln','data-line':line.id,d:rounded(pts,16),pathLength:1,style:'stroke:var(--'+line.id+');color:var(--'+line.id+');animation-delay:'+(i*0.12)+'s'},gl);
   p.addEventListener('click',function(){iso(line.id)});
   line.pts.forEach(function(q){if(typeof q==='string'){(passing[q]=passing[q]||[]).push(line)}});
  });
  Object.keys(S).forEach(function(id){
   var s=S[id],b=base(id,m),ls=passing[id]||[],os=ls.map(function(l){return l.o}),lo=Math.min.apply(0,os),hi=Math.max.apply(0,os);
   var g=el('g',{class:'st','data-st':id,tabindex:0,role:'button','aria-label':s.name+'. Show details'},gs);
   g.dataset.lines=ls.map(function(l){return l.id}).join(' ');
   var a=[b[0]+lo*GAP,b[1]+lo*GAP],c=[b[0]+hi*GAP,b[1]+hi*GAP];
   var dd='M'+a.join(' ')+'L'+c.join(' ');
   el('path',{class:'cap-o',d:dd,'stroke-width':18},g);el('path',{class:'cap-i',d:dd,'stroke-width':10},g);
   var lab=m?s.mlab:s.lab, dx=lab[0], dy=lab[1], anc=Math.abs(dx)>Math.abs(dy)?(dx>0?'start':'end'):'middle';
   var t=el('text',{x:b[0]+dx,y:b[1]+dy+(Math.abs(dy)>Math.abs(dx)?0:0),'text-anchor':anc},g);t.textContent=m&&s.mname?s.mname:s.name;
   g.addEventListener('click',function(){pick(id)});
   g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(id)}});
  });
 }
 var maps=document.querySelectorAll('.map-svg');
 build(maps[0],false);build(maps[1],true);
 if(!reduce)maps.forEach(function(s){s.classList.add('draw')});
 var current=null, chips=document.querySelectorAll('.chip[data-line]');
 function iso(id){current=current===id?null:id;apply()}
 function apply(){
  chips.forEach(function(c){c.setAttribute('aria-pressed',c.dataset.line===current)});
  maps.forEach(function(s){s.classList.toggle('iso',!!current);
   s.querySelectorAll('.ln[data-line]').forEach(function(p){p.classList.toggle('on',p.dataset.line===current)});
   s.querySelectorAll('.st').forEach(function(g){g.classList.toggle('on',!!current&&g.dataset.lines.split(' ').indexOf(current)>-1)});});
 }
 chips.forEach(function(c){c.addEventListener('click',function(){iso(c.dataset.line)})});
 document.querySelector('.chip.reset').addEventListener('click',function(){current=null;apply()});
 var panel=document.getElementById('panel');
 function pick(id){
  var s=S[id],ls=L.filter(function(l){return l.pts.indexOf(id)>-1});
  document.querySelectorAll('.st').forEach(function(g){g.classList.toggle('sel',g.dataset.st===id)});
  panel.innerHTML='<h3>'+s.name+'</h3><p>'+s.text+'</p><ul class="serves" aria-label="Rails through this stop">'+
   ls.map(function(l){return '<li style="--c:var(--'+l.id+')"><i></i>'+l.name+'</li>'}).join('')+'</ul>'+
   (s.page?'<a class="open" href="#">Open '+s.page+'</a>':'');
 }
})();
"""


def stops(depth):
    n = {"Introductory": 1, "Intermediate": 2, "Advanced": 3}[depth]
    c = "".join(f'<circle cx="{6 + i * 14}" cy="6" r="4"{" class=\"on\"" if i < n else ""}/>' for i in range(3))
    return f'<svg class="stops" viewBox="0 0 40 12" aria-hidden="true"><line x1="6" y1="6" x2="34" y2="6"/>{c}</svg>'


def cards():
    out = []
    for i, (tid, t, b, d, m) in enumerate(TOPICS):
        lead = ' class="lead"' if i == 0 else ""
        start = '<span class="start">Start here</span>' if i == 0 else ""
        out.append(f'<li{lead}><a href="#{tid}"><span class="t">{t}</span><span class="b">{b}</span>'
                   f'<span class="m"><span class="dep">{stops(d)}{d}</span><span>{m} min read</span>{start}</span></a></li>')
    return "\n".join(out)


colors = {"RTGS": "rtgs", "NEFT": "neft", "IMPS": "imps", "UPI": "upi", "NACH": "nach", "CTS": "cts"}
section = content_section()
rows_colored = section
for k, v in colors.items():
    rows_colored = rows_colored.replace(f'<th scope="row"><abbr title="{dict((r[0], r[1]) for r in RAILS)[k]}">',
                                        f'<th scope="row" style="--c:var(--{v})"><abbr title="{dict((r[0], r[1]) for r in RAILS)[k]}">')

legend = "".join(f'<li><button class="chip" type="button" data-line="{l["id"]}" aria-pressed="false" style="--c:var(--{l["id"]})"><i></i>{l["name"]}</button></li>' for l in LINES)
legend += '<li><button class="chip reset" type="button">Show all</button></li>'
alt = "".join(
    f'<li>{l["name"]} ({l["full"]}): ' + ", then ".join(STATIONS[p]["name"] for p in l["pts"] if isinstance(p, str)) + '.</li>'
    for l in LINES)
path = "".join(f'<li><a href="#">{p}</a></li>' for p in READING_PATH)

BODY = f'''{header()}
<main id="main"><div class="wrap">
<section class="hero" aria-labelledby="hero-h">
<div class="hero-top">
<div><h1 id="hero-h">Indian Banking Ecosystem<span class="h1-sub">Complete Knowledge Base</span></h1>
<p class="promise">{PITCH} Follow a payment across the map, then open any stop to go deeper.</p></div>
<p class="fact">In July 2026, UPI handled <strong>{UPI_FACT["value"]}</strong> transactions, the most in any month so far.{cite(2)}<small>Reported figure, as of {UPI_FACT["asof"]}</small></p>
</div>
<div class="map-card">
<div class="map-head"><h2>How a payment travels</h2><p class="map-hint">Select a rail to isolate it, or a stop to read about it.</p></div>
<ul class="legend" aria-label="Payment rails">{legend}</ul>
<div class="map-body">
<div>
<svg class="map-svg map-d" viewBox="0 0 1000 420" role="group" aria-label="Map of Indian payment rails"></svg>
<svg class="map-svg map-m" viewBox="-10 0 440 1000" role="group" aria-label="Map of Indian payment rails"></svg>
</div>
<div class="panel" id="panel" aria-live="polite"><h3>Pick a stop</h3><p>Each stop is an institution or system that a payment passes through. Stops where lines meet are shared by several rails.</p></div>
</div>
<div class="map-foot"><span>Illustrative and simplified. Routes show which institutions a payment touches, not exact message paths.</span>
<details><summary>Text version of the map</summary><ul>{alt}<li>Banks settle their NPCI positions net, in their accounts at RBI.</li></ul></details></div>
</div>
<div class="path-wrap"><span class="path-label" id="rp">Suggested reading path</span><ol class="path-row" aria-labelledby="rp" style="margin:0">{path}</ol></div>
</section>

<div class="doc">
<div>
<ol class="crumbs"><li><span class="bullet" aria-hidden="true">F</span><a href="#">Foundations</a></li><li><a href="#">Payment rails</a></li></ol>
{rows_colored}
</div>
<nav class="onpage" aria-label="On this page"><p>On this page</p><ul><li><a href="#settlement" aria-current="true">Gross versus net settlement</a></li><li><a href="#">RTGS and NEFT</a></li><li><a href="#">IMPS and UPI</a></li><li><a href="#">Cheque clearing</a></li><li><a href="#">Which rail for which job</a></li></ul></nav>
</div>

<div class="idx-head"><h2>Architecture</h2><p>Nine models that shape how Indian banks build systems. Open any topic for the full explanation, diagrams and sources.</p></div>
<ul class="cards">{cards()}</ul>
{sources_list()}
</div></main>
{footer()}'''

JS = JS.replace("__ST__", json.dumps(STATIONS)).replace("__LN__", json.dumps(LINES))
open("../b-rail-map.html", "w").write(page("Mockup B: Rail Map", FONTS, CSS, BODY, JS))
print("ok")
