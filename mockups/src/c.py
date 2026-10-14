from shared import *

FONTS = "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600;7..72,700&display=swap"

LANES = [(60, "Your", "app"), (180, "Your", "bank"), (300, "NPCI", ""), (420, "Payee's", "bank"), (540, "Payee", "")]

STEPS = [
    ("You start the payment", "You enter the payee's UPI ID or scan their QR code, type the amount and confirm with your UPI PIN.", "self", 60, None),
    ("Your app sends the request", "The app passes the request, through the bank it works with, to NPCI's UPI system.", "arrow", 60, 300),
    ("NPCI finds the payee's bank", "NPCI checks which bank holds the account behind the payee's UPI ID.", "arrow", 300, 420),
    ("Your bank debits you", "NPCI asks your bank to debit your account. Your bank checks your UPI PIN and balance, debits you and replies.", "arrow", 300, 180),
    ("The payee's bank credits them", "NPCI asks the payee's bank to credit the payee, and the bank confirms.", "arrow", 300, 420),
    ("Everyone is told", "NPCI confirms to your app, and the payee's bank notifies the payee. This usually takes seconds.", "arrow2", 300, 60),
    ("The banks settle later", "The banks settle what they owe each other, net, in their accounts at the Reserve Bank of India.", "band", None, None),
]

CSS = """
:root{
 --bg:#ffffff;--surface:#F4F5F7;--ink:#1B1E24;--ink-2:#50555E;--ink-3:#6B707A;--rule:#E2E4E8;--rule-strong:#A6ABB5;
 --accent:#2340B8;--accent-ink:#2340B8;--accent-tint:#EDF0FC;--focus:#2340B8;
 --r-sm:4px;--r-md:10px;--shadow-pop:0 10px 30px rgb(27 30 36 / .12);
 --serif:"Literata",Georgia,serif;--sans:"Figtree",system-ui,sans-serif;--margin:17rem;
}
[data-theme=dark]{
 --bg:#1B1A18;--surface:#26241F;--ink:#ECE8E1;--ink-2:#B7B1A6;--ink-3:#9A9489;--rule:#3A3731;--rule-strong:#5E5A52;
 --accent:#9DB0FF;--accent-ink:#A9BAFF;--accent-tint:#262B44;--focus:#A9BAFF;--shadow-pop:0 10px 30px rgb(0 0 0 / .5);
}
body{background:var(--bg);color:var(--ink);font:400 1.0625rem/1.6 var(--sans)}
a{color:var(--accent-ink);text-underline-offset:.2em}
.brand-name{font-family:var(--serif);font-weight:700;font-size:1.125rem}
.wrap{max-width:1180px;margin:auto;padding:0 1.5rem}

.opener{padding:3.5rem 0 2.75rem;border-bottom:1px solid var(--rule)}
h1{font-family:var(--serif);font-weight:600;font-size:clamp(2.6rem,1.4rem + 5vw,5.4rem);line-height:.98;letter-spacing:-.035em;margin:0;max-width:12ch;font-variation-settings:"opsz" 72}
.h1-sub{display:block;font-family:var(--sans);font-weight:500;font-size:clamp(1.05rem,.9rem + .6vw,1.35rem);letter-spacing:0;color:var(--ink-2);margin-top:1.1rem}
.dek{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:3rem;margin-top:2.5rem;align-items:start}
.dek p{margin:0}
.promise{font-family:var(--serif);font-size:clamp(1.2rem,1.05rem + .5vw,1.45rem);line-height:1.5;max-width:34em}
.fact{font-size:1rem;color:var(--ink-2);border-left:3px solid var(--accent);padding-left:1rem}
.fact strong{color:var(--ink);font-weight:700}
.fact small{display:block;margin-top:.3rem;font-size:.875rem}
.route{margin-top:2.25rem;display:flex;flex-wrap:wrap;gap:.5rem 1.25rem;align-items:baseline}
.route-title{font-weight:600}
.route ol{display:flex;flex-wrap:wrap;gap:.5rem 1.25rem;margin:0;padding:0;list-style:none;counter-reset:r}
.route li{counter-increment:r}
.route a{color:var(--ink);text-decoration:none;border-bottom:1px solid var(--rule-strong);padding-bottom:.1rem}
.route a::before{content:counter(r) ". ";color:var(--ink-3);font-variant-numeric:tabular-nums}
.route a:hover{border-color:var(--accent);color:var(--accent-ink)}

/* Explainer */
.xp{padding:4rem 0;border-bottom:1px solid var(--rule)}
.xp-head{max-width:40rem;margin-bottom:2rem}
.xp-head h2{font-family:var(--serif);font-weight:600;font-size:clamp(1.9rem,1.4rem + 1.6vw,2.6rem);line-height:1.1;letter-spacing:-.02em;margin:0 0 .6rem}
.xp-head p{margin:0;color:var(--ink-2)}
.xp-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:3rem;align-items:start}
.xp-fig{position:sticky;top:6rem;margin:0}
.xp-svg{width:100%;height:auto;display:block}
.xp-svg .hd rect{fill:var(--surface);stroke:var(--rule-strong);stroke-width:1.2;transition:fill .2s,stroke .2s}
.xp-svg .hd text{font:600 15px var(--sans);fill:var(--ink)}
.xp-svg .hd.on rect{fill:var(--accent-tint);stroke:var(--accent);stroke-width:2}
.xp-svg .life{stroke:var(--rule-strong);stroke-dasharray:3 5}
.xp-svg .msg{fill:none;stroke:var(--rule-strong);stroke-width:1.5;transition:stroke .2s,opacity .2s}
.xp-svg .msg.back{stroke-dasharray:5 5}
.xp-svg .num circle{fill:var(--bg);stroke:var(--rule-strong);stroke-width:1.5}
.xp-svg .num text{font:700 12px var(--sans);fill:var(--ink-2)}
.xp-svg .step.on .msg{stroke:var(--accent);stroke-width:3}
.xp-svg .step.on .num circle{fill:var(--accent);stroke:var(--accent)}
.xp-svg .step.on .num text{fill:var(--bg)}
.xp-svg .step.past .msg{stroke:var(--ink-3)}
.xp-svg .head{fill:var(--rule-strong)}
.xp-svg .step.on .head{fill:var(--accent)}
.xp-svg .step.past .head{fill:var(--ink-3)}
.xp-svg .band rect{fill:var(--surface);stroke:var(--rule-strong);stroke-dasharray:4 4}
.xp-svg .band text{font:600 14px var(--sans);fill:var(--ink-2)}
.xp-svg .band.on rect{fill:var(--accent-tint);stroke:var(--accent);stroke-dasharray:none;stroke-width:2}
.xp-svg .band.on text{fill:var(--ink)}
.xp-fig figcaption{font-size:.875rem;color:var(--ink-2);margin-top:.5rem}
.steps{list-style:none;margin:0;padding:0;counter-reset:s;border-top:1px solid var(--rule)}
.steps li{border-bottom:1px solid var(--rule)}
.steps button{all:unset;box-sizing:border-box;display:flex;gap:1rem;align-items:baseline;width:100%;padding:1rem 0;cursor:pointer;font:600 1.0625rem/1.35 var(--sans);color:var(--ink-2)}
.steps button:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.steps .n{flex:none;display:inline-grid;place-items:center;width:1.9rem;height:1.9rem;border-radius:50%;border:1.5px solid var(--rule-strong);font-size:.875rem;font-variant-numeric:tabular-nums}
.steps li.on button{color:var(--ink)}
.steps li.on .n{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.steps .body{margin:0;padding:0 0 1.1rem 2.9rem;font-family:var(--serif);font-size:1.0625rem;line-height:1.65;color:var(--ink)}
.js .steps li:not(.on) .body{display:none}
.xp-note{display:none;font-size:.875rem;color:var(--ink-2)}
@media (max-width:640px){.xp-note{display:block}}
.xp-ctrl{display:none;gap:.5rem;align-items:center;margin-top:1.25rem}
.js .xp-ctrl{display:flex}
.xp-ctrl button{min-height:42px;padding:0 1.1rem;border-radius:var(--r-sm);border:1px solid var(--rule-strong);background:var(--bg);color:var(--ink);font:600 .9375rem var(--sans);cursor:pointer}
.xp-ctrl button.primary{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.xp-ctrl button:disabled{opacity:.45;cursor:default}
.xp-ctrl output{margin-left:auto;color:var(--ink-2);font-size:.9375rem}

/* Article with sidenotes */
.article{padding:4rem 0 0}
.art-meta{display:flex;flex-wrap:wrap;gap:.5rem 1.25rem;font-size:.9375rem;color:var(--ink-2);margin:0 0 1.25rem}
.art-meta a{color:var(--ink-2)}
.domain{display:inline-flex;align-items:center;gap:.45rem;font-weight:600;color:var(--ink)}
.domain::before{content:"";width:.6rem;height:.6rem;background:var(--accent)}
.prose{max-width:calc(68ch + var(--margin) + 3rem);padding-right:calc(var(--margin) + 3rem);position:relative}
.prose h2,.contents-head h2,.sources h2{font-family:var(--serif);font-weight:600;font-size:clamp(1.9rem,1.4rem + 1.6vw,2.6rem);line-height:1.1;letter-spacing:-.02em;margin:0 0 1.25rem}
.prose > p{font-family:var(--serif);font-size:1.125rem;line-height:1.72;margin:0 0 1.2rem}
.prose > p.table-note{font-family:var(--sans);font-size:.875rem;line-height:1.5;color:var(--ink-2)}
.cite a{font-family:var(--sans);font-size:.7em;font-weight:700;text-decoration:none;padding:0 .15em}
.sn-mark{all:unset;font:700 .72rem var(--sans);vertical-align:super;color:var(--accent-ink);padding:0 .15em}
.sn{float:right;clear:right;width:var(--margin);margin-right:calc(-1 * (var(--margin) + 3rem));font:400 .875rem/1.5 var(--sans);color:var(--ink-2);position:relative}
.sn-num{font-weight:700;color:var(--accent-ink);margin-right:.25rem}
.pull{margin:2rem 0;padding:0;font-family:var(--serif);font-weight:500;font-size:clamp(1.35rem,1.1rem + .9vw,1.8rem);line-height:1.3;letter-spacing:-.01em;color:var(--ink);border-top:2px solid var(--ink);padding-top:1rem;max-width:30ch}
.fig{margin:2.75rem calc(-1 * (var(--margin) + 3rem)) 2.75rem 0;padding:1.5rem 0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)}
.fig-title{font-family:var(--serif);font-weight:600;font-size:1.3rem;margin:0 0 1rem}
.fig-panels{gap:2rem}
.fig-sub{font-size:.9375rem;font-weight:600;color:var(--ink-2);text-align:center;margin:0 0 .25rem}
.dg-node circle{fill:var(--bg);stroke:var(--ink);stroke-width:1.5}
.dg-node text{fill:var(--ink);font:600 12px var(--sans)}
.dg-edge{fill:none;stroke:var(--ink-3);stroke-width:1.5}
.dg-edge--key{stroke:var(--accent);stroke-width:3}
.dg-head{fill:var(--ink-3)}#arr-n path{fill:var(--accent)}
.dg-lab{fill:var(--ink);font:600 13px var(--sans);paint-order:stroke;stroke:var(--bg);stroke-width:4px}
.dg-lab--key{fill:var(--accent-ink)}
.dg-pos{fill:var(--ink-2);font:500 12px var(--sans)}
figcaption{font-size:.9375rem;color:var(--ink-2);margin-top:1rem;max-width:68ch}
.fig-dl{margin-left:.5rem;font-weight:600}
.fig-alt{font-size:.9375rem;margin-top:.5rem}.fig-alt summary{color:var(--accent-ink);font-weight:600}
.table-wrap{margin:2.5rem calc(-1 * (var(--margin) + 3rem)) .5rem 0;max-width:none}
table.data{font-size:.9375rem}
caption{caption-side:top;text-align:left;font-family:var(--serif);font-weight:600;font-size:1.2rem;padding:0 0 .75rem}
table.data th,table.data td{text-align:left;vertical-align:top;padding:.75rem 1rem .75rem 0;border-bottom:1px solid var(--rule)}
table.data thead th{font-weight:600;font-size:.875rem;color:var(--ink-2);border-bottom:1.5px solid var(--ink)}
table.data tbody th abbr{font-weight:700;text-decoration:none}
.table-note{font-size:.875rem;color:var(--ink-2);margin:.25rem 0 0}
.callout{margin:2.25rem 0;padding:1.1rem 1.25rem;background:var(--accent-tint);border-radius:var(--r-md)}
.callout p{margin:0}.callout-label{display:flex;align-items:center;gap:.5rem;font-weight:700;margin-bottom:.35rem!important;color:var(--accent-ink)}

/* Contents by depth */
.contents{padding-top:5rem}
.contents-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:2rem;align-items:end;border-bottom:1.5px solid var(--ink);padding-bottom:1.25rem;margin-bottom:.5rem}
.contents-head h2{margin:0}
.contents-head p{margin:0;color:var(--ink-2)}
.depths{display:grid;grid-template-columns:1fr 1.6fr 1fr;gap:0 2.5rem}
.depth h3{font:600 1rem var(--sans);color:var(--ink-2);margin:1.25rem 0 0;padding-bottom:.6rem;border-bottom:1px solid var(--rule)}
.depth h3 span{font-weight:400}
.depth ul{list-style:none;margin:0;padding:0}
.depth li{border-bottom:1px solid var(--rule)}
.depth a{display:block;padding:1.1rem 0;color:inherit;text-decoration:none}
.depth .t{display:block;font-family:var(--serif);font-weight:600;font-size:1.25rem;line-height:1.25;letter-spacing:-.01em}
.depth .b{display:block;margin-top:.35rem;color:var(--ink-2);font-size:.9375rem}
.depth .m{display:block;margin-top:.4rem;font-size:.8125rem;color:var(--ink-3)}
.depth a:hover .t{color:var(--accent-ink);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.2em}
.depth.first .t{font-size:1.6rem}
.depth.mid ul{display:grid;grid-template-columns:1fr 1fr;column-gap:2rem}
.sources{margin-top:4rem;font-size:.9375rem;color:var(--ink-2)}
.sources h2{font-size:1.5rem}
.sources li{margin-bottom:.5rem}
.src-type{font-weight:600;color:var(--ink)}

@media (max-width:1100px){
 :root{--margin:0rem}
 .prose{padding-right:0;max-width:68ch}
 .fig,.table-wrap{margin-right:0}
 .sn-mark{all:unset;font:700 .72rem/1 var(--sans);vertical-align:super;display:inline-grid;place-items:center;min-width:1.5rem;min-height:1.5rem;border-radius:50%;background:var(--accent-tint);color:var(--accent-ink);cursor:pointer;margin-left:.1em}
 .sn-mark:focus-visible{outline:3px solid var(--focus)}
 .sn-mark[aria-expanded=true]{background:var(--accent);color:var(--bg)}
 .sn{float:none;display:none;width:auto;margin:0}
 .sn.open{display:block;margin:.6rem 0;padding:.6rem .9rem;border-left:2px solid var(--accent);background:var(--surface)}
 .xp-grid{grid-template-columns:1fr;gap:1.5rem}
 .xp-fig{position:static}
 .depths{grid-template-columns:1fr}
 .depth.mid ul{grid-template-columns:1fr}
 .contents-head{grid-template-columns:1fr;gap:.75rem}
}
@media (max-width:640px){
 .wrap{padding:0 1rem}
 .opener{padding:2.5rem 0 2rem}
 .dek{grid-template-columns:1fr;gap:1.5rem}
 .xp-fig{position:sticky;top:0;z-index:5;background:var(--bg);padding:.5rem 0 .6rem;border-bottom:1px solid var(--rule)}
 .xp-fig figcaption{display:none}
 .xp-svg .hd text{font-size:22px}
 .xp-svg .num text{font-size:15px}
 .xp-svg .band text{font-size:20px}
 .depth.first .t{font-size:1.35rem}
}
"""

JS = r"""
(function(){
 document.documentElement.classList.add('js');
 var items=[].slice.call(document.querySelectorAll('.steps li')),svgSteps=document.querySelectorAll('.xp-svg [data-step]');
 var prev=document.getElementById('xp-prev'),next=document.getElementById('xp-next'),out=document.getElementById('xp-out'),i=0;
 var who=__WHO__;
 function show(n){i=n;
  items.forEach(function(li,k){li.classList.toggle('on',k===n);li.querySelector('button').setAttribute('aria-expanded',k===n)});
  svgSteps.forEach(function(g){var k=+g.dataset.step;g.classList.toggle('on',k===n);g.classList.toggle('past',k<n)});
  document.querySelectorAll('.xp-svg .hd').forEach(function(h){h.classList.toggle('on',who[n].indexOf(+h.dataset.lane)>-1)});
  prev.disabled=n===0;next.disabled=n===items.length-1;out.textContent='Step '+(n+1)+' of '+items.length;
 }
 items.forEach(function(li,k){li.querySelector('button').addEventListener('click',function(){show(k)})});
 prev.addEventListener('click',function(){if(i>0)show(i-1)});
 next.addEventListener('click',function(){if(i<items.length-1)show(i+1)});
 show(0);
})();
"""


def explainer_svg():
    parts = ['<svg class="xp-svg" viewBox="0 0 600 470" role="img" aria-labelledby="xp-t xp-d"><title id="xp-t">One UPI payment, step by step</title>'
             '<desc id="xp-d">Sequence diagram with five parties: your app, your bank, NPCI, the payee\'s bank and the payee. The numbered steps in the list are highlighted in turn.</desc>'
             '<defs><marker id="xh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>']
    for k, (x, a, b) in enumerate(LANES):
        parts.append(f'<line class="life" x1="{x}" y1="70" x2="{x}" y2="392"/>')
        t = f'<tspan x="{x}" dy="0">{a}</tspan>' + (f'<tspan x="{x}" dy="1.15em">{b}</tspan>' if b else "")
        y = 34 if b else 44
        parts.append(f'<g class="hd" data-lane="{k}"><rect x="{x - 54}" y="10" width="108" height="56" rx="8"/><text x="{x}" y="{y}" text-anchor="middle">{t}</text></g>')
    y = 100
    for n, (title, body, kind, x1, x2) in enumerate(STEPS):
        g = [f'<g class="step" data-step="{n}">']
        if kind == "self":
            g.append(f'<path class="msg" d="M{x1 + 4} {y - 8} h36 v22 h-32" marker-end="url(#xh)"/>')
            nx = x1 + 58
        elif kind in ("arrow", "arrow2"):
            d = 1 if x2 > x1 else -1
            g.append(f'<path class="msg" d="M{x1 + d * 6} {y} H{x2 - d * 6}" marker-end="url(#xh)"/>')
            if kind == "arrow" and n in (2, 3, 4):
                g.append(f'<path class="msg back" d="M{x2 - d * 6} {y + 14} H{x1 + d * 6}" marker-end="url(#xh)"/>')
            if kind == "arrow2":
                g.append(f'<path class="msg" d="M426 {y + 12} H534" marker-end="url(#xh)"/>')
            nx = (x1 + x2) / 2
        else:
            g = [f'<g class="band" data-step="{n}"><rect x="10" y="404" width="580" height="54" rx="8"/><text x="300" y="437" text-anchor="middle">RBI: banks settle net later</text>']
            g.append(f'<g class="num"><circle cx="34" cy="431" r="13"/><text x="34" y="435" text-anchor="middle">{n + 1}</text></g></g>')
            parts.append("".join(g))
            continue
        g.append(f'<g class="num"><circle cx="{nx}" cy="{y - 16 if kind != "self" else y + 3}" r="12"/><text x="{nx}" y="{(y - 16 if kind != "self" else y + 3) + 4}" text-anchor="middle">{n + 1}</text></g></g>')
        parts.append("".join(g))
        y += 50
    parts.append("</svg>")
    return "".join(parts)


WHO = [[0], [0, 2], [2, 3], [1, 2], [2, 3], [0, 2, 3, 4], [1, 3]]

steps_html = "".join(
    f'<li><button type="button" aria-expanded="false" aria-controls="st-{n}"><span class="n" aria-hidden="true">{n + 1}</span><span><span class="visually-hidden">Step {n + 1}: </span>{t}</span></button><p class="body" id="st-{n}">{b}</p></li>'
    for n, (t, b, *_rest) in enumerate(STEPS))

by = {"Introductory": [], "Intermediate": [], "Advanced": []}
for t in TOPICS:
    by[t[3]].append(t)


def col(label, extra, cls, lst):
    li = "".join(f'<li><a href="#{tid}"><span class="t">{t}</span><span class="b">{b}</span><span class="m">{m} min read</span></a></li>' for tid, t, b, d, m in lst)
    return f'<div class="depth {cls}"><h3>{label} <span>{extra}</span></h3><ul>{li}</ul></div>'


contents = (col("Start here", "introductory", "first", by["Introductory"]) +
            col("Next", "intermediate", "mid", by["Intermediate"]) +
            col("Deeper", "advanced", "last", by["Advanced"]))

section = content_section()
section = section.replace("This is why a customer can see a credit within seconds while the banks settle later.</p>",
                          "This is why a customer can see a credit within seconds while the banks settle later.</p>\n<blockquote class=\"pull\"><p style=\"margin:0\">The customer sees the credit in seconds. The banks settle later.</p></blockquote>")
path = "".join(f'<li><a href="#">{p}</a></li>' for p in READING_PATH)

BODY = f'''{header()}
<main id="main">
<div class="wrap">
<section class="opener" aria-labelledby="hero-h">
<h1 id="hero-h">Indian Banking Ecosystem<span class="h1-sub">Complete Knowledge Base</span></h1>
<div class="dek">
<p class="promise">{PITCH} A field guide to the core systems, payment rails, architecture, regulators and institutions behind every rupee you send.</p>
<p class="fact">In July 2026, UPI handled <strong>{UPI_FACT["value"]}</strong> transactions, the most in any month so far.{cite(2)}<small>Reported figure, as of {UPI_FACT["asof"]}</small></p>
</div>
<div class="route"><span class="route-title" id="route-t">Suggested reading path</span><ol aria-labelledby="route-t">{path}</ol></div>
</section>

<section class="xp" aria-labelledby="xp-h">
<div class="xp-head"><h2 id="xp-h">Follow one UPI payment</h2><p>Select a step, or use Next, to see who does what when you pay someone by UPI.</p></div>
<div class="xp-grid">
<figure class="xp-fig">{explainer_svg()}<figcaption>Simplified and illustrative. Real flows also involve the app providers and the banks they work with.</figcaption></figure>
<div><ol class="steps">{steps_html}</ol><p class="xp-note">Simplified and illustrative. Real flows also involve the app providers and the banks they work with.</p>
<div class="xp-ctrl"><button type="button" id="xp-prev">Previous</button><button type="button" id="xp-next" class="primary">Next step</button><output id="xp-out" aria-live="polite"></output></div></div>
</div>
</section>

<article class="article" aria-label="Sample page section">
<p class="art-meta"><span class="domain">Foundations</span><a href="#">Payment rails</a><span>Last verified 28 September 2026</span></p>
{section}
</article>

<section class="contents" aria-labelledby="ct-h">
<div class="contents-head"><h2 id="ct-h">Architecture</h2><p>Nine models that shape how Indian banks build systems, arranged by how much background they assume.</p></div>
<div class="depths">{contents}</div>
</section>
{sources_list()}
</div></main>
{footer()}'''

import json
open("../c-field-guide.html", "w").write(page("Mockup C: Field Guide", FONTS, CSS, BODY, JS.replace("__WHO__", json.dumps(WHO))))
print("ok")
