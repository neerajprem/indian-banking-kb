"""Book check: every figure title and table caption must be followed by its content on the same page."""
import subprocess,re,html,sys
book=open('dist/__book/index.html').read()
titles=[html.unescape(re.sub(r'<[^>]+>','',t)).strip() for t in re.findall(r'<p class="figure-title"[^>]*>([\s\S]*?)</p>',book)]
titles+=[html.unescape(t).strip() for t in re.findall(r'<p class="table-caption">([^<]*)</p>',book)]
txt=subprocess.run(['pdftotext','-layout',sys.argv[1],'-'],capture_output=True,text=True).stdout.split('\f')
bad=[]
for t in titles:
    key=t[:38]
    for i,p in enumerate(txt,1):
        lines=[l.strip() for l in p.splitlines() if l.strip()]
        if lines and lines[-1].isdigit(): lines=lines[:-1]
        idx=[k for k,l in enumerate(lines) if key in l]
        if idx:
            if idx[0] >= len(lines)-1: bad.append((i,t))
            break
print(f'figures and tables: {len(titles)}; stranded titles: {len(bad)}')
for b in bad: print('  page',b[0],':',b[1])
