"""Shared content for the three Stage 1 mockups. Only design differs between them."""

SITE = "Indian Banking Ecosystem: Complete Knowledge Base"
PITCH = "How money moves in India, and the technology underneath it."
FOOTER = "Infrastructure Team's Knowledgebase"

NAV = [
    ("Foundations", ["Core systems", "Payment rails"]),
    ("Design", ["Architecture", "Technologies", "High-volume systems"]),
    ("Decisions and risk", ["Build vs buy", "Limitations"]),
    ("Governance", ["Regulators", "RBI ecosystem"]),
    ("Reference", ["Glossary", "Sources"]),
]

READING_PATH = ["Core systems", "Payment rails", "Architecture", "Regulators", "Limitations"]

UPI_FACT = {
    "value": "23.66 billion",
    "text": "UPI transactions in July 2026, the highest month so far",
    "asof": "31 July 2026",
    "src": 2,
}

TOPICS = [
    ("cbs", "Core banking system architecture", "The system of record for accounts, deposits and loans, and why its end-of-day cycle shapes everything around it.", "Introductory", 11),
    ("payments", "Payment system architecture", "Switches, participants, message standards and settlement: the moving parts behind every transfer.", "Intermediate", 13),
    ("event-driven", "Event-driven architecture", "Publishing what happened instead of asking for it, and where banks use streams for fraud, alerts and analytics.", "Intermediate", 10),
    ("modernisation", "Legacy modernisation", "Replacing a core piece by piece: strangler fig, wrapping the core, parallel runs and cutover risk.", "Intermediate", 9),
    ("multi-dc", "Multi-data-centre and disaster recovery", "Keeping services up when a data centre fails: topologies, recovery objectives and failover drills.", "Advanced", 12),
    ("api-first", "API-first and open banking", "Layered APIs from channel to core, and consent-based data sharing through Account Aggregators.", "Intermediate", 10),
    ("data", "Data architecture", "From ledgers to lakehouses: analytics, risk features and regulatory reporting with lineage.", "Intermediate", 9),
    ("security", "Security architecture", "Defence in depth for money: segmentation, key management, privileged access and detection.", "Advanced", 11),
    ("hybrid-cloud", "Hybrid and multi-cloud deployment", "Placing workloads across on-premises, private and public cloud under localisation and outsourcing rules.", "Intermediate", 8),
]

SOURCES = [
    (1, "Introduction of Continuous Clearing and Settlement on Realisation in Cheque Truncation System (RBI/2025-26/73), 13 August 2025",
     "Reserve Bank of India", "https://website.rbi.org.in/web/rbi/-/notifications/introduction-of-continuous-clearing-and-settlement-on-realisation-in-cheque-truncation-system", "Primary source"),
    (2, "UPI completes 10 years, clocks nearly 13,000-fold rise in transaction volume, August 2026",
     "YourStory", "https://yourstory.com/2026/08/upi-completes-10-years-clocks-nearly-13000-fold-rise-transaction-volume", "Reported"),
]

RAILS = [
    ("RTGS", "Real Time Gross Settlement", "RBI", "Gross, one payment at a time, in real time", "Large-value and time-critical transfers"),
    ("NEFT", "National Electronic Funds Transfer", "RBI", "Deferred net, in batches through the day", "Everyday account-to-account transfers"),
    ("IMPS", "Immediate Payment Service", "NPCI", "Customer credited instantly; banks settle net later", "Instant transfers by account number"),
    ("UPI", "Unified Payments Interface", "NPCI", "Customer credited instantly; banks settle net later", "Person-to-person and shop payments by UPI ID or QR code"),
    ("NACH", "National Automated Clearing House", "NPCI", "Batch, net", "Salaries, loan instalments and other recurring bulk payments"),
    ("CTS", "Cheque Truncation System", "NPCI", "Continuous clearing; settles hourly on realisation", "Cheques, cleared by image instead of paper"),
]


def cite(n):
    return f'<sup class="cite"><a href="#src-{n}" aria-label="Source {n}">{n}</a></sup>'


def sidenote(n, text):
    """Marker plus note. Directions choose how to show it (margin, inline toggle or hidden)."""
    return (f'<button class="sn-mark" type="button" aria-expanded="false" aria-controls="sn-{n}" '
            f'aria-label="Note {n}">{n}</button><span class="sn" id="sn-{n}" role="note">'
            f'<span class="sn-num">{n}</span> {text}</span>')


def rails_table():
    rows = "\n".join(
        f'<tr><th scope="row"><abbr title="{full}">{short}</abbr></th><td>{op}</td><td>{st}</td><td>{use}</td></tr>'
        for short, full, op, st, use in RAILS)
    return f'''<div class="table-wrap" tabindex="0" role="region" aria-labelledby="rails-cap">
<table class="data">
<caption id="rails-cap">Six payment rails and how each one settles</caption>
<thead><tr><th scope="col">Rail</th><th scope="col">Run by</th><th scope="col">How it settles</th><th scope="col">Typical use</th></tr></thead>
<tbody>
{rows}
</tbody></table></div>
<p class="table-note">Mockup content. Every row is re-checked against primary sources in the fact-ledger stage. CTS settlement from the RBI circular.{cite(1)}</p>'''


def _panel(pid, title, net):
    # Nodes: A (60,190), B (240,190), C (150,56); r = 26
    nodes = [("A", 60, 190), ("B", 240, 190), ("C", 150, 56)]
    n_svg = "".join(
        f'<g class="dg-node"><circle cx="{x}" cy="{y}" r="26"/><text x="{x}" y="{y + 5}" text-anchor="middle">Bank {k}</text></g>'
        for k, x, y in nodes)
    m = f'<defs><marker id="arr-{pid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dg-head"/></marker></defs>'
    if not net:
        e = f'''<path class="dg-edge" d="M84 202 Q150 244 216 202" marker-end="url(#arr-{pid})"/>
<text class="dg-lab" x="150" y="246" text-anchor="middle">₹100</text>
<path class="dg-edge" d="M216 180 Q150 146 84 180" marker-end="url(#arr-{pid})"/>
<text class="dg-lab" x="150" y="150" text-anchor="middle">₹70</text>
<path class="dg-edge" d="M227 168 L165 78" marker-end="url(#arr-{pid})"/>
<text class="dg-lab" x="210" y="116">₹50</text>
<path class="dg-edge" d="M135 78 L73 168" marker-end="url(#arr-{pid})"/>
<text class="dg-lab" x="90" y="116" text-anchor="end">₹30</text>'''
        pos = ""
    else:
        e = f'''<path class="dg-edge dg-edge--key" d="M227 168 L165 78" marker-end="url(#arr-{pid})"/>
<text class="dg-lab dg-lab--key" x="210" y="116">₹20</text>'''
        pos = '''<text class="dg-pos" x="60" y="236" text-anchor="middle">net 0</text>
<text class="dg-pos" x="240" y="236" text-anchor="middle">pays ₹20</text>
<text class="dg-pos" x="150" y="18" text-anchor="middle">receives ₹20</text>'''
    return f'''<svg class="dg" viewBox="0 0 300 260" role="img" aria-labelledby="{pid}-t {pid}-d">
<title id="{pid}-t">{title}</title><desc id="{pid}-d">{"One transfer of ₹20 from Bank B to Bank C replaces the four gross payments." if net else "Bank A pays B ₹100, B pays A ₹70, B pays C ₹50, C pays A ₹30. Each settles separately."}</desc>
{m}{e}{n_svg}{pos}</svg>'''


def figure(fig_class="fig"):
    return f'''<figure class="{fig_class}" aria-labelledby="fig1-title">
<p class="fig-title" id="fig1-title">Four payments, settled two ways</p>
<div class="fig-panels">
<div class="fig-panel"><p class="fig-sub">Gross: every payment settles on its own</p>{_panel("g", "Gross settlement of four payments", False)}</div>
<div class="fig-panel"><p class="fig-sub">Net: only the difference settles</p>{_panel("n", "Net settlement of the same payments", True)}</div>
</div>
<figcaption>Illustrative example. Gross settlement moves ₹250 in four transfers; net settlement moves ₹20 in one.
<a class="fig-dl" href="#" download>Download SVG</a></figcaption>
<details class="fig-alt"><summary>Text description</summary>
<p>Bank A owes Bank B ₹100. Bank B owes Bank A ₹70 and Bank C ₹50. Bank C owes Bank A ₹30. Settled gross, four transfers move ₹250. Netted, Bank A's position is zero, Bank B owes ₹20 overall and Bank C is owed ₹20, so one transfer of ₹20 settles everything.</p></details>
</figure>'''


def callout():
    return f'''<aside class="callout callout--note" role="note" aria-labelledby="co1">
<p class="callout-label" id="co1"><svg class="ico" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>Changed recently</p>
<p>Cheques no longer wait until the next working day. Under RBI's circular of 13 August 2025, the cheque system moved from batch processing to continuous clearing, with settlement every hour on realisation, from 4 October 2025.{cite(1)}</p>
</aside>'''


def content_section(sidenotes=True):
    n1 = sidenote(1, "Banks hold current accounts with RBI. Moving money between those accounts is what “settlement” means here.") if sidenotes else ""
    n2 = sidenote(2, "Realisation here means the paying bank has confirmed the cheque, or the confirmation window closed without a reply.") if sidenotes else ""
    return f'''<section class="prose" id="settlement" aria-labelledby="settlement-h">
<h2 id="settlement-h">Gross versus net settlement</h2>
<p>Every payment has two parts. The message tells the banks what to do. Settlement then moves the money between the banks themselves, in the accounts they hold at the Reserve Bank of India (RBI).{n1} This is why a customer can see a credit within seconds while the banks settle later.</p>
<p>Gross settlement moves each payment on its own. It removes the risk that one bank's failure strands everyone else's money, but it needs a lot of cash on hand. Net settlement adds up what each bank owes and is owed over a period, then moves only the difference. That saves cash, but money stays in flight until the cycle closes. The cheque system now settles this way every hour, on realisation.{n2}</p>
{figure()}
{rails_table()}
{callout()}
</section>'''


def sources_list():
    items = "\n".join(
        f'<li id="src-{n}"><a href="{u}" rel="noopener noreferrer">{t}</a>. {p}. <span class="src-type">{ty}</span>, accessed 28 September 2026.</li>'
        for n, t, p, u, ty in SOURCES)
    return f'<section class="sources" aria-labelledby="src-h"><h2 id="src-h">Sources</h2><ol>{items}</ol></section>'


def header(brand_mark=""):
    groups = "".join(
        f'<li><details class="nav-group"><summary{" class=\"current\"" if g == "Design" else ""}>{g}</summary><ul>' +
        "".join(f'<li><a href="#"{" aria-current=\"page\"" if l == "Architecture" else ""}>{l}</a></li>' for l in links) +
        "</ul></details></li>" for g, links in NAV)
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
<div class="header-inner">
<a class="brand" href="#">{brand_mark}<span class="brand-name">Indian Banking Ecosystem</span><span class="brand-sub">Complete Knowledge Base</span></a>
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
<nav id="site-nav" class="nav" aria-label="Site"><ul class="nav-groups">{groups}</ul></nav>
<div class="tools">
<label class="search"><span class="visually-hidden">Search</span><svg class="ico" aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" placeholder="Search" aria-keyshortcuts="/"><kbd>/</kbd></label>
<button class="theme-btn" type="button" aria-pressed="false"><svg class="ico" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><span class="theme-label">Dark theme</span></button>
</div></div></header>'''


def footer():
    return f'''<footer class="site-footer"><div class="footer-inner">
<p class="footer-pub">{FOOTER}</p>
<p>Independent reference. Not official documentation of RBI, NPCI or any bank.</p>
<p><a href="#">Sources and methodology</a> <a href="#">Changelog</a></p>
<p class="footer-fresh">Facts on this page last verified 28 September 2026.</p>
</div></footer>'''


BASE_CSS = """
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0}
img,svg{max-width:100%}
.visually-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip{position:absolute;left:-999px;top:0;z-index:100;padding:.75rem 1rem;background:var(--ink);color:var(--bg)}
.skip:focus{left:1rem;top:1rem}
.ico{width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.table-wrap{overflow-x:auto;max-width:100%}
table.data{border-collapse:collapse;width:100%;min-width:600px;font-variant-numeric:tabular-nums}
.fig-panels{display:flex;flex-wrap:wrap;gap:1rem}
.fig-panel{flex:1 1 260px;min-width:0}
.dg{display:block;width:100%;height:auto;max-width:360px;margin-inline:auto}
.dg text{font-size:14px}
.fig-alt summary{cursor:pointer}
.menu-btn{display:none}
@media (max-width:1000px){
 .menu-btn{display:inline-flex}
 .nav{display:none}
 .nav.open{display:block}
}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
"""

BASE_JS = """
(function(){
 var root=document.documentElement, btn=document.querySelector('.theme-btn');
 function set(t){root.dataset.theme=t;btn.setAttribute('aria-pressed',t==='dark');btn.querySelector('.theme-label').textContent=t==='dark'?'Light theme':'Dark theme';}
 set(location.hash==='#dark'?'dark':'light');
 btn.addEventListener('click',function(){set(root.dataset.theme==='dark'?'light':'dark')});
 var mb=document.querySelector('.menu-btn'), nav=document.getElementById('site-nav');
 mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
 document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.focus()}
  if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();document.querySelector('.search input').focus()}
 });
 document.querySelectorAll('.sn-mark').forEach(function(m){m.addEventListener('click',function(){
  var o=m.getAttribute('aria-expanded')!=='true';m.setAttribute('aria-expanded',o);document.getElementById(m.getAttribute('aria-controls')).classList.toggle('open',o)})});
 var groups=document.querySelectorAll('.nav-group');
 groups.forEach(function(d){d.addEventListener('toggle',function(){if(d.open)groups.forEach(function(o){if(o!==d)o.open=false})})});
 document.addEventListener('click',function(e){if(!e.target.closest('.nav-group')&&window.innerWidth>1000)groups.forEach(function(o){o.open=false})});
 document.querySelectorAll('.fig-dl').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault()})});
})();
"""


def page(title_suffix, fonts_href, css, body, js=""):
    return f'''<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title_suffix} | {SITE}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{fonts_href}">
<style>{BASE_CSS}{css}</style>
</head>
<body>
{body}
<script>{BASE_JS}{js}</script>
</body>
</html>'''

BASE_CSS += """
.site-header{position:sticky;top:0;z-index:20;background:var(--bg);border-bottom:1px solid var(--rule)}
.header-inner{max-width:1240px;margin:auto;display:flex;align-items:center;gap:1.5rem;padding:.75rem 1.5rem;min-height:64px}
.brand{display:flex;flex-direction:column;text-decoration:none;color:var(--ink);line-height:1.2}
.brand-name{font-weight:700;font-size:1.0625rem}
.brand-sub{font-size:.8125rem;color:var(--ink-2)}
.nav{flex:1}
.nav-groups{display:flex;gap:.125rem;list-style:none;margin:0;padding:0}
.nav-group{position:relative}
.nav-group summary{list-style:none;cursor:pointer;padding:.5rem .75rem;border-radius:var(--r-sm);font-size:.9375rem;color:var(--ink-2);white-space:nowrap}
.nav-group summary::-webkit-details-marker{display:none}
.nav-group summary::after{content:"";display:inline-block;width:.38em;height:.38em;border-right:1.5px solid;border-bottom:1.5px solid;transform:translateY(-.2em) rotate(45deg);margin-left:.55em}
.nav-group summary:hover,.nav-group[open] summary{color:var(--ink);background:var(--surface)}
.nav-group summary.current{color:var(--ink);box-shadow:inset 0 -2px 0 var(--accent)}
.nav-group ul{position:absolute;top:calc(100% + 6px);left:0;min-width:14rem;list-style:none;margin:0;padding:.5rem;background:var(--bg);border:1px solid var(--rule);border-radius:var(--r-md);box-shadow:var(--shadow-pop);z-index:30}
.nav-group ul a{display:block;padding:.5rem .75rem;color:var(--ink);text-decoration:none;border-radius:var(--r-sm)}
.nav-group ul a:hover{background:var(--surface)}
.nav-group ul a[aria-current]{font-weight:600;color:var(--accent-ink)}
.tools{display:flex;gap:.5rem;align-items:center;margin-left:auto}
.search{display:flex;align-items:center;gap:.5rem;border:1px solid var(--rule-strong);border-radius:var(--r-sm);padding:0 .6rem;height:40px;color:var(--ink-2);background:var(--bg)}
.search input{border:0;background:transparent;font:inherit;font-size:.9375rem;color:var(--ink);width:9rem;outline:none;min-width:0}
.search input::placeholder{color:var(--ink-2)}
.search:focus-within{outline:3px solid var(--focus);outline-offset:1px}
kbd{font:inherit;font-size:.75rem;border:1px solid var(--rule-strong);border-radius:4px;padding:0 .4rem;color:var(--ink-2)}
.theme-btn,.menu-btn{align-items:center;gap:.4rem;height:40px;padding:0 .75rem;border:1px solid var(--rule-strong);border-radius:var(--r-sm);background:var(--bg);color:var(--ink);font:inherit;font-size:.9375rem;cursor:pointer}
.theme-btn{display:inline-flex;white-space:nowrap}
.brand{white-space:nowrap}
.theme-btn:hover,.menu-btn:hover{background:var(--surface)}
.site-footer{border-top:1px solid var(--rule);margin-top:5rem}
.footer-inner{max-width:1240px;margin:auto;padding:2rem 1.5rem 3rem;display:grid;gap:.25rem;color:var(--ink-2);font-size:.9375rem}
.footer-inner p{margin:0}
.footer-inner a{color:var(--ink);margin-right:1.25rem}
.footer-pub{font-weight:600;color:var(--ink)!important}
@media (max-width:1000px){
 .site-header{position:static}
 .header-inner{flex-wrap:wrap;gap:.75rem;padding:.75rem 1rem}
 .menu-btn{order:2;margin-left:auto}
 .tools{order:3;width:100%;margin:0}
 .search{flex:1}.search input{width:100%}
 .nav{order:4;flex-basis:100%}
 .nav-groups{flex-direction:column}
 .nav-group summary{padding:.75rem .5rem}
 .nav-group ul{position:static;box-shadow:none;border:0;padding:0 0 .5rem 1rem;background:transparent}
}
"""
