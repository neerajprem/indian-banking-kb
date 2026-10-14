// Behaviour checks axe cannot see: works without JavaScript, keyboard operation, theme persistence, no flash.
import { chromium } from 'playwright';
import { startServer, BASE } from './lib.mjs';
import fs from 'node:fs';
const railCount = (fs.readFileSync('src/data/rails.yaml', 'utf8').match(/^- \{ id:/gm) || []).length;
const server = await startServer(['--headers']);
const browser = await chromium.launch();
const results = []; const check = (name, ok, detail = '') => { results.push({ check: name, ok, detail }); console.log(`${ok ? 'ok  ' : 'FAIL'} ${name} ${detail}`); };

const PART = process.env.PART || 'all'; // 'core' = sections 1-2, 'drill' = section 3
if (PART !== 'drill') {
// 1. JavaScript disabled: content readable, menu falls back to the footer directory, JS-only controls hidden.
{
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/payment-rails/');
  check('no-JS: article text renders', (await p.locator('.prose p').first().innerText()).length > 50);
  check('no-JS: menu link targets footer directory', (await p.getAttribute('[data-drawer-open]', 'href')) === '#footer-nav' && (await p.locator('#footer-nav a').count()) > 5);
  check('no-JS: JS-only controls hidden', !(await p.locator('.search-btn').isVisible()) && !(await p.locator('.theme-btn').isVisible()));
  check('no-JS: compare table shows every rail', (await p.locator('.compare thead th[data-rail]:visible').count()) === railCount, `${railCount} rails`);
  await p.goto(BASE + '/styleguide/');
  check('no-JS: explainer shows every step', (await p.locator('.step-body:visible').count()) === 7);
  await ctx.close();
}
// 2. Keyboard: drawer traps and restores focus; search opens with "/", arrows move, Escape closes.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/payment-rails/', { waitUntil: 'networkidle' });
  await p.focus('[data-drawer-open]'); await p.keyboard.press('Enter');
  check('drawer opens as modal', await p.locator('[data-drawer]').evaluate((d) => d.open && d.matches(':modal')));
  let inside = true;
  for (let i = 0; i < 25; i++) { await p.keyboard.press('Tab'); inside &&= await p.evaluate(() => !!document.activeElement?.closest('[data-drawer]') || document.activeElement === document.body); }
  check('drawer keeps focus inside while open (25 tabs)', inside);
  await p.keyboard.press('Escape');
  check('Escape closes drawer and returns focus to Menu', !(await p.locator('[data-drawer]').evaluate((d) => d.open)) && (await p.evaluate(() => document.activeElement?.hasAttribute('data-drawer-open'))));
  await p.setViewportSize({ width: 1280, height: 900 });
  await p.keyboard.press('/');
  check('"/" opens search with the input focused', await p.evaluate(() => document.activeElement?.id === 'q'));
  await p.keyboard.type('cheque'); await p.waitForTimeout(700);
  const n = await p.locator('[data-search-results] a').count();
  await p.keyboard.press('ArrowDown');
  check('search returns results and ArrowDown selects the first', n > 0 && (await p.locator('[data-search-results] a[aria-selected="true"]').count()) === 1, `${n} results`);
  await p.keyboard.press('Escape');
  check('Escape closes search', !(await p.locator('[data-search]').evaluate((d) => d.open)));
  // Desktop menus open with Enter and close with Escape, returning focus to the summary.
  await p.focus('.nav-group summary'); await p.keyboard.press('Enter');
  const opened = await p.locator('.nav-group').first().evaluate((d) => d.open);
  await p.keyboard.press('Escape');
  check('nav menu opens with Enter and closes with Escape', opened && !(await p.locator('.nav-group').first().evaluate((d) => d.open)) && (await p.evaluate(() => document.activeElement?.tagName === 'SUMMARY')));
  // Theme persists across pages and is applied before first paint.
  await p.click('[data-theme-toggle]');
  await p.goto(BASE + '/technologies/messaging/');
  check('dark theme persists across navigation', (await p.evaluate(() => document.documentElement.dataset.theme)) === 'dark');
  const html = await (await p.request.get(BASE + '/technologies/messaging/')).text();
  const head = html.slice(0, html.indexOf('</head>'));
  check('theme script is inline in <head>, before the body paints (no flash)', head.includes("localStorage.getItem('theme')"));
  // Build-vs-buy scorer: keyboard operable and updates its verdict.
  await p.goto(BASE + '/build-vs-buy/', { waitUntil: 'networkidle' });
  const before = (await p.textContent('[data-verdict]')).trim();
  for (const f of ['diff', 'talent', 'control', 'scale']) { await p.focus(`input[name="bb-${f}"]:checked`); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight'); }
  const after = (await p.textContent('[data-verdict]')).trim();
  check('build-vs-buy scorer responds to the keyboard', before === 'Leaning: hybrid' && after === 'Leaning: build', `${before} -> ${after}`);
  // Glossary tooltip is exposed on focus.
  await p.goto(BASE + '/payment-rails/', { waitUntil: 'networkidle' });
  await p.focus('.gl-term');
  check('glossary tooltip shows on keyboard focus', await p.locator('.gl-term:focus + .gl-tip').isVisible());
  await ctx.close();
}
}
// 3. Drill-down: every topic card opens its page and the back link returns to the list, with and without JavaScript.
const DRILL_JS = process.env.DRILL_JS ? [process.env.DRILL_JS === '1'] : [true, false];
const DRILL_SECTIONS = process.env.DRILL_SECTION ? [process.env.DRILL_SECTION] : ['architecture', 'technologies'];
if (PART !== 'core') for (const js of DRILL_JS) {
  for (const section of DRILL_SECTIONS) {
    // Reduced motion switches off view transitions, whose overlay briefly takes pointer events; this test checks navigation, not animation.
    const ctx = await browser.newContext({ javaScriptEnabled: js, reducedMotion: process.env.DRILL_MOTION ? 'no-preference' : 'reduce' });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/${section}/`);
    const cards = await p.$$eval('[data-topic-card]', (as) => as.map((a) => ({ href: a.getAttribute('href'), title: a.querySelector('.t').textContent.trim() })));
    let ok = cards.length > 0, bad = [];
    for (const c of cards) {
      await p.goto(`${BASE}/${section}/`);
      await p.click(`[data-topic-card][href="${c.href}"]`);
      await p.waitForURL(`**${c.href}`);
      const h1 = (await p.textContent('h1')).trim();
      await p.click('.back-link');
      await p.waitForURL(`**/${section}/`);
      if (h1 !== c.title) { ok = false; bad.push(c.href); }
    }
    check(`drill-down ${section} (${js ? 'JS' : 'no JS'}): every card opens its page and returns`, ok, `${cards.length} cards${bad.length ? '; mismatched: ' + bad.join(', ') : ''}`);
    await ctx.close();
  }
}
await browser.close(); server.kill();
console.table(results);
process.exit(results.every((r) => r.ok) ? 0 : 1);
