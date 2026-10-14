import { chromium } from 'playwright'; import AxeBuilder from '@axe-core/playwright';
const b=await chromium.launch(); const c=await b.newContext({viewport:{width:+(process.argv[4]||1440),height:900}}); const p=await c.newPage();
await p.goto('file://'+process.cwd()+'/'+process.argv[2]+(process.argv[3]||''),{waitUntil:'networkidle'});
const r=await new AxeBuilder({page:p}).analyze();
for(const v of r.violations.filter(v=>['critical','serious'].includes(v.impact))) for(const n of v.nodes) console.log(v.id, n.target.join(' '), n.any?.[0]?.message?.slice(0,140));
await b.close();
