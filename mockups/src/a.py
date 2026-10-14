from shared import *

FONTS = "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap"

MICRO = "how money moves in india and the technology underneath it  " * 14

CSS = """
:root{
 --bg:#ffffff;--surface:#F3F6F5;--ink:#15203F;--ink-2:#4A536B;--ink-3:#687085;--rule:#D6DCE1;--rule-strong:#98A3B5;
 --accent:#0B7465;--accent-ink:#0A6558;--focus:#4B4AA8;
 --d-found:#4B4AA8;--d-design:#0B7465;--d-design-t:#E6F3F0;--d-dec:#8A6200;--d-gov:#8A3B5B;
 --g1:#B8B7E4;--g2:#98CFC4;--g3:#E2C680;--g4:#DCAFC1;
 --r-sm:3px;--r-md:6px;--shadow-pop:0 8px 24px rgb(21 32 63 / .12);
 --serif:"Source Serif 4",Georgia,serif;--sans:"Public Sans",system-ui,sans-serif;
}
[data-theme=dark]{
 --bg:#0E1426;--surface:#161E36;--ink:#E7EAF3;--ink-2:#AFB6C9;--ink-3:#8790A8;--rule:#2A3350;--rule-strong:#4D5980;
 --accent:#5CCDB9;--accent-ink:#6FD8C5;--focus:#AFAEF7;
 --d-found:#AFAEF7;--d-design:#5CCDB9;--d-design-t:#10302D;--d-dec:#E3B955;--d-gov:#EDA2C0;
 --g1:#5B5CBA;--g2:#2C8A7C;--g3:#9E7F2E;--g4:#9A5476;--shadow-pop:0 8px 24px rgb(0 0 0 / .5);
}
body{background:var(--bg);color:var(--ink);font:400 1.0625rem/1.65 var(--sans)}
a{color:var(--accent-ink);text-underline-offset:.18em}
.brand-name{font-family:var(--serif);font-size:1.25rem;font-weight:700;letter-spacing:-.005em}
.site-header{border-bottom:3px double var(--rule-strong)}

/* Hero */
.hero{max-width:1240px;margin:2rem auto 0;padding:0 1.5rem}
.hero-frame{position:relative;border:1px solid var(--rule-strong);padding:3rem clamp(1.25rem,4vw,3.5rem);display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:2rem;align-items:center;overflow:hidden}
.micro{position:absolute;left:0;right:0;font-size:6.5px;line-height:1;letter-spacing:.08em;color:var(--ink-3);white-space:nowrap;overflow:hidden;user-select:none}
.micro.top{top:5px}.micro.bottom{bottom:5px}
h1{font-family:var(--serif);font-weight:700;font-size:clamp(2.4rem,1.6rem + 3.2vw,4.1rem);line-height:1.04;letter-spacing:-.02em;margin:0 0 1.25rem}
h1 .h1-sub{display:block;font-weight:400;font-size:.52em;letter-spacing:-.005em;color:var(--ink-2);margin-top:.35rem}
.promise{font-size:1.1875rem;color:var(--ink-2);max-width:34rem;margin:0 0 1.75rem}
.fact{border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:.9rem 0;max-width:34rem;margin:0 0 1.75rem;font-family:var(--serif);font-size:1.25rem;line-height:1.45}
.fact-num{font-weight:700;font-variant-numeric:lining-nums tabular-nums}
.fact-meta{display:block;font-family:var(--sans);font-size:.875rem;color:var(--ink-2);margin-top:.25rem}
.path-title{font-size:.9375rem;font-weight:600;margin:0 0 .5rem}
.path{list-style:none;counter-reset:p;display:flex;flex-wrap:wrap;gap:.35rem 0;margin:0;padding:0}
.path li{counter-increment:p;display:flex;align-items:center}
.path li:not(:last-child)::after{content:"";width:1.25rem;height:1px;background:var(--rule-strong);margin:0 .35rem}
.path a{display:inline-flex;align-items:center;gap:.45rem;color:var(--ink);text-decoration:none;padding:.3rem .1rem;min-height:32px}
.path a::before{content:counter(p);font-family:var(--serif);font-weight:600;font-size:.8125rem;width:1.5rem;height:1.5rem;display:inline-grid;place-items:center;border:1px solid var(--rule-strong);border-radius:50%}
.path a:hover{color:var(--accent-ink)}
.rosette-wrap{display:grid;place-items:center}
#rosette{width:100%;max-width:440px;aspect-ratio:1;display:block}
#rosette path{fill:none;stroke-width:.7}
#rosette .l1{stroke:var(--g1)}#rosette .l2{stroke:var(--g2)}#rosette .l3{stroke:var(--g3)}#rosette .l4{stroke:var(--g4)}
#rosette g{transform-origin:220px 220px;transition:transform .6s ease-out}
@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.drawing path{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.8s ease-out forwards}
.drawing .l2 path,.drawing path.l2{animation-delay:.15s}
.divider{display:block;width:100%;height:28px;margin:3.5rem 0}
.divider path{fill:none;stroke:var(--g2);stroke-width:1}
.divider path:nth-child(odd){stroke:var(--g1)}

/* Layout */
.wrap{max-width:1240px;margin:auto;padding:0 1.5rem}
.page-grid{display:grid;grid-template-columns:14rem minmax(0,72ch);gap:3rem;justify-content:center}
.folio{font-size:.875rem;color:var(--ink-2);position:sticky;top:6rem;align-self:start}
.crumb{display:flex;gap:.4rem;flex-wrap:wrap;margin:0 0 1rem;padding:0;list-style:none}
.crumb li+li::before{content:"›";margin-right:.4rem;color:var(--ink-3)}
.crumb a{color:var(--ink-2)}
.toc-title{font-weight:600;color:var(--ink);margin:1.5rem 0 .5rem}
.toc{list-style:none;margin:0;padding:0;border-left:1px solid var(--rule)}
.toc a{display:block;padding:.3rem 0 .3rem .9rem;color:var(--ink-2);text-decoration:none;margin-left:-1px;border-left:2px solid transparent}
.toc a[aria-current]{color:var(--ink);border-left-color:var(--d-found);font-weight:600}
.domain-mark{display:inline-flex;align-items:center;gap:.5rem;color:var(--ink);font-weight:600}
.domain-mark::before{content:"";width:.7rem;height:.7rem;border:2px solid var(--d-found);border-radius:50%;box-shadow:0 0 0 2px var(--bg),0 0 0 3px var(--d-found)}

.prose h2,.index-head h2,.sources h2{font-family:var(--serif);font-weight:700;font-size:clamp(1.8rem,1.4rem + 1.4vw,2.44rem);line-height:1.12;letter-spacing:-.015em;margin:0 0 1.25rem}
.prose p{margin:0 0 1.15rem}
.cite a{font-size:.72em;font-weight:600;text-decoration:none;padding:0 .15em;color:var(--accent-ink)}
.sn-mark{font:600 .7rem/1 var(--sans);vertical-align:super;margin-left:.1em;min-width:1.5rem;min-height:1.5rem;padding:0 .3rem;border:1px solid var(--rule-strong);border-radius:50%;background:var(--bg);color:var(--accent-ink);cursor:pointer}
.sn-mark[aria-expanded=true]{background:var(--accent);color:var(--bg);border-color:var(--accent)}
.sn{display:none}.sn.open{display:block;margin:.5rem 0 .25rem;padding:.6rem .9rem;border-left:2px solid var(--accent);background:var(--surface);font-size:.9375rem;color:var(--ink-2)}
.sn-num{font-weight:700;color:var(--ink);margin-right:.25rem}

.fig{margin:2.25rem 0;border-top:1px solid var(--ink);border-bottom:1px solid var(--rule);padding:1.25rem 0 1rem}
.fig-title{font-family:var(--serif);font-weight:600;font-size:1.25rem;margin:0 0 1rem}
.fig-sub{font-size:.875rem;font-weight:600;color:var(--ink-2);margin:0 0 .25rem;text-align:center}
.dg-node circle{fill:var(--bg);stroke:var(--ink);stroke-width:1.5}
.dg-node text{fill:var(--ink);font:600 12px var(--sans)}
.dg-edge{fill:none;stroke:var(--ink-2);stroke-width:1.5}
.dg-edge--key{stroke:var(--d-design);stroke-width:2.5}
.dg-head{fill:var(--ink-2)}
#arr-n path{fill:var(--d-design)}
.dg-lab{fill:var(--ink);font:600 13px var(--sans);paint-order:stroke;stroke:var(--bg);stroke-width:4px}
.dg-lab--key{fill:var(--accent-ink)}
.dg-pos{fill:var(--ink-2);font:500 12px var(--sans)}
figcaption{font-size:.9375rem;color:var(--ink-2);margin-top:.75rem}
.fig-dl{margin-left:.5rem;font-weight:600}
.fig-alt{font-size:.9375rem;margin-top:.5rem}
.fig-alt summary{color:var(--accent-ink);font-weight:600}

.table-wrap{margin:2rem 0 .5rem;border-top:2px solid var(--ink)}
table.data{font-size:.9375rem}
caption{caption-side:top;text-align:left;font-family:var(--serif);font-weight:600;font-size:1.125rem;padding:.75rem 0}
table.data th,table.data td{text-align:left;vertical-align:top;padding:.65rem .75rem .65rem 0;border-bottom:1px solid var(--rule)}
table.data thead th{font-weight:600;color:var(--ink-2);border-bottom:1px solid var(--ink);font-size:.875rem}
table.data tbody th{font-family:var(--serif);font-weight:700;font-size:1rem}
abbr{text-decoration:underline dotted var(--ink-3);text-underline-offset:.2em;cursor:help}
.table-note{font-size:.875rem;color:var(--ink-2);margin:.25rem 0 0}

.callout{margin:2rem 0;padding:1rem 1.25rem;border:1px solid var(--rule-strong);border-left:4px solid var(--d-found);background:var(--surface)}
.callout p{margin:0}
.callout-label{display:flex;align-items:center;gap:.5rem;font-weight:600;margin-bottom:.35rem!important}

/* Topic index */
.index-head{display:flex;justify-content:space-between;align-items:end;gap:1rem;flex-wrap:wrap;margin:4.5rem 0 1rem;border-bottom:3px double var(--rule-strong);padding-bottom:1rem}
.index-head h2{margin:0}
.index-head p{margin:0;color:var(--ink-2);max-width:36rem}
.index{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:3.5rem}
@media (max-width:800px){.index{grid-template-columns:minmax(0,1fr)}}
.index li{border-bottom:1px solid var(--rule)}
.index a{display:grid;grid-template-columns:1fr;gap:.25rem 1rem;padding:1.25rem 0;color:inherit;text-decoration:none}
.index .t{font-family:var(--serif);font-weight:600;font-size:1.3rem;line-height:1.25}
.index .b{grid-column:1/-1;color:var(--ink-2);font-size:.975rem}
.index .m{display:flex;gap:1rem;align-items:center;grid-column:1/-1;font-size:.875rem;color:var(--ink-2)}
.index .depth{display:inline-flex;align-items:center;gap:.4rem;color:var(--ink)}
.rings{width:34px;height:14px}
.rings circle{fill:none;stroke:var(--rule-strong);stroke-width:1.4}
.rings circle.on{stroke:var(--d-design)}
.index .go{align-self:start;width:1.9rem;height:1.9rem;border:1px solid var(--rule-strong);border-radius:50%;display:grid;place-items:center;color:var(--ink-2);transition:background .15s,color .15s}
.index a:hover .t{color:var(--accent-ink);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.2em}
.index a:hover .go{background:var(--accent);color:var(--bg);border-color:var(--accent)}
.index li.lead{grid-column:1/-1}
.index li.lead .t{font-size:clamp(1.5rem,1.2rem + 1vw,1.95rem)}
.index li.lead .b{font-size:1.0625rem;max-width:44rem}
.start{color:var(--accent-ink);font-weight:600}

.sources{margin-top:4rem;font-size:.9375rem;color:var(--ink-2)}
.sources h2{font-size:1.5rem}
.sources li{margin-bottom:.5rem}
.src-type{font-weight:600;color:var(--ink)}
.site-footer{border-top:3px double var(--rule-strong);position:relative;overflow:hidden}
.footer-inner{position:relative}
.watermark{position:absolute;right:-60px;top:-80px;width:340px;opacity:.55;pointer-events:none}
.watermark path{fill:none;stroke:var(--g1);stroke-width:.6}

@media (max-width:1000px){
 .hero-frame{grid-template-columns:1fr;padding-top:2.5rem}
 .rosette-wrap{order:-1}
 #rosette{max-width:260px}
 .page-grid{grid-template-columns:minmax(0,1fr)}
 .folio{position:static}
 .toc-title,.toc{display:none}
}
@media (max-width:480px){
 .hero{padding:0 .75rem;margin-top:1rem}
 .wrap{padding:0 1rem}
 .hero-frame{padding:2.25rem 1rem 2rem}
 #rosette{max-width:200px}
 .index .t{font-size:1.2rem}
}
@media (prefers-reduced-motion:reduce){.drawing path{stroke-dashoffset:0;animation:none}#rosette g{transition:none}}
"""

JS = r"""
(function(){
 var NS='http://www.w3.org/2000/svg';
 function rosePath(cx,cy,base,amp,k,phase,wob){
  var d='',n=720;
  for(var i=0;i<=n;i++){var t=i/n*Math.PI*2;var r=base+amp*Math.cos(k*t+phase)+wob*Math.sin((k*2+1)*t);
   d+=(i?'L':'M')+(cx+r*Math.cos(t)).toFixed(2)+' '+(cy+r*Math.sin(t)).toFixed(2);}
  return d+'Z';
 }
 function layer(svg,cls,base,amp,k,count,wob){
  var g=document.createElementNS(NS,'g');g.setAttribute('class',cls);
  for(var j=0;j<count;j++){var p=document.createElementNS(NS,'path');
   p.setAttribute('d',rosePath(220,220,base,amp,k,j*Math.PI*2/(count*k)*k/2,wob));p.setAttribute('pathLength','1');g.appendChild(p);}
  svg.appendChild(g);return g;
 }
 var svg=document.getElementById('rosette');
 var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduce)svg.classList.add('drawing');
 var gs=[layer(svg,'l1',178,16,24,10,2),layer(svg,'l2',138,22,16,12,0),layer(svg,'l3',96,18,12,10,1.5),layer(svg,'l4',56,12,8,8,0)];
 if(!reduce){
  var hero=document.querySelector('.hero-frame'),raf=0;
  hero.addEventListener('pointermove',function(e){
   if(raf)return;raf=requestAnimationFrame(function(){raf=0;
    var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5;
    gs.forEach(function(g,i){g.style.transform='rotate('+(x*(i%2?-6:6)*(1+i*.4)).toFixed(2)+'deg)'})});
  });
 }
 // Wave dividers and footer watermark
 document.querySelectorAll('.divider').forEach(function(s){
  for(var j=0;j<6;j++){var d='';for(var x=0;x<=1200;x+=6){var y=14+8*Math.sin(x/38+j*.55)*Math.cos(x/310);d+=(x?'L':'M')+x+' '+y.toFixed(2);}
   var p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p);}
 });
 var w=document.querySelector('.watermark');
 for(var j=0;j<9;j++){var p=document.createElementNS(NS,'path');p.setAttribute('d',rosePath(170,170,120,18,18,j*.19,0));w.appendChild(p);}
})();
"""


def rings(depth):
    n = {"Introductory": 1, "Intermediate": 2, "Advanced": 3}[depth]
    c = "".join(f'<circle cx="{6 + i * 11}" cy="7" r="5"{" class=\"on\"" if i < n else ""}/>' for i in range(3))
    return f'<svg class="rings" viewBox="0 0 34 14" aria-hidden="true">{c}</svg>'


def cards():
    items = []
    for i, (tid, t, b, d, m) in enumerate(TOPICS):
        lead = ' class="lead"' if i == 0 else ""
        start = '<span class="start">Start here</span>' if i == 0 else ""
        items.append(f'''<li{lead}><a href="#{tid}"><span class="t">{t}</span><span class="b">{b}</span><span class="m"><span class="depth">{rings(d)}{d}</span><span>{m} min read</span>{start}</span></a></li>''')
    return "\n".join(items)


path = "".join(f'<li><a href="#">{p}</a></li>' for p in READING_PATH)

BODY = f'''{header()}
<main id="main">
<section class="hero" aria-labelledby="hero-h">
<div class="hero-frame">
<div class="micro top" aria-hidden="true">{MICRO}</div><div class="micro bottom" aria-hidden="true">{MICRO}</div>
<div>
<h1 id="hero-h">Indian Banking Ecosystem<span class="h1-sub">Complete Knowledge Base</span></h1>
<p class="promise">{PITCH} Core systems, payment rails, architecture, regulation and the institutions around RBI, explained plainly and sourced line by line.</p>
<p class="fact">In July 2026, UPI handled <span class="fact-num">{UPI_FACT["value"]}</span> transactions, the most in any month so far.{cite(2)}<span class="fact-meta">Reported figure, as of {UPI_FACT["asof"]}</span></p>
<p class="path-title">Suggested reading path</p>
<ol class="path">{path}</ol>
</div>
<div class="rosette-wrap"><svg id="rosette" viewBox="0 0 440 440" aria-hidden="true" focusable="false"></svg></div>
</div>
</section>
<svg class="divider" viewBox="0 0 1200 28" preserveAspectRatio="none" aria-hidden="true"></svg>
<div class="wrap">
<div class="page-grid">
<aside class="folio" aria-label="Page context">
<ol class="crumb"><li><a href="#">Foundations</a></li><li><a href="#">Payment rails</a></li></ol>
<span class="domain-mark">Foundations</span>
<p class="toc-title">On this page</p>
<ul class="toc"><li><a href="#settlement" aria-current="true">Gross versus net settlement</a></li><li><a href="#">RTGS and NEFT</a></li><li><a href="#">IMPS and UPI</a></li><li><a href="#">Cheque clearing</a></li><li><a href="#">Which rail for which job</a></li></ul>
</aside>
<div>{content_section()}</div>
</div>
<div class="index-head"><h2>Architecture</h2><p>Nine models that shape how Indian banks build systems. Open any topic for the full explanation, diagrams and sources.</p></div>
<ul class="index">{cards()}</ul>
{sources_list()}
</div>
</main>
{footer().replace('<div class="footer-inner">', '<svg class="watermark" viewBox="0 0 340 340" aria-hidden="true"></svg><div class="footer-inner">')}'''

open("../a-security-print.html", "w").write(page("Mockup A: Security Print", FONTS, CSS, BODY, JS))
print("ok")
