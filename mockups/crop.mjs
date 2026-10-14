import { chromium } from 'playwright';
// usage: node crop.mjs file width theme selector out
const [f,w,theme,sel,out]=process.argv.slice(2);
const b=await chromium.launch(); const c=await b.newContext({viewport:{width:+w,height:900},reducedMotion:'reduce'}); const p=await c.newPage();
await p.goto('file://'+process.cwd()+'/'+f+(theme==='dark'?'#dark':''),{waitUntil:'networkidle'}); await p.waitForTimeout(300);
if(process.argv[7]) await p.evaluate(s=>eval(s), process.argv[7]);
await p.waitForTimeout(300);
await p.locator(sel).first().screenshot({path:'shots/'+out+'.png'}); await b.close();
