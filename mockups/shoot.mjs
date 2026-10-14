import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const files = process.argv.slice(2);
const b = await chromium.launch();
for (const f of files) {
  const name = f.replace('.html','');
  for (const theme of ['light','dark']) {
    for (const w of [1440, 390, 360]) {
      const ctx = await b.newContext({ viewport:{width:w,height:w>1000?900:800}, deviceScaleFactor:1, reducedMotion:'reduce' });
      const p = await ctx.newPage();
      await p.goto('file://'+process.cwd()+'/'+f+(theme==='dark'?'#dark':''), {waitUntil:'networkidle'});
      await p.waitForTimeout(400);
      const sw = await p.evaluate(()=>document.documentElement.scrollWidth);
      const over = await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1 && !e.closest('.table-wrap,.micro,.map-scroll,.watermark,.divider')}).slice(0,5).map(e=>e.tagName+'.'+e.className));
      if (w!==360) {
        await p.screenshot({path:`shots/${name}-${w}-${theme}-top.png`});
        await p.screenshot({path:`shots/${name}-${w}-${theme}-full.png`, fullPage:true});
      }
      let axe='';
      if (w===1440) { const r = await new AxeBuilder({page:p}).analyze(); axe = r.violations.filter(v=>['critical','serious'].includes(v.impact)).map(v=>v.id+'('+v.nodes.length+')').join(',')||'none'; }
      console.log(name, theme, w, 'scrollWidth', sw, sw>w?'OVERFLOW':'ok', over.length?JSON.stringify(over):'', axe?'axe serious/critical: '+axe:'');
      await ctx.close();
    }
  }
}
await b.close();
