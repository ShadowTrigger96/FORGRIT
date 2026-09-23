import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8765';
const widths = [360,390,430,768,1024,1366,1440,1920];
const report = { cases: [], errors: [], layout: [] };
await mkdir('preview-qa', { recursive:true });
const browser = await chromium.launch();
async function geometry(page, width, state) {
  const bad = await page.evaluate(() => {
    const roots = ['#decisionDemo','#featureViewport','#featureCopy','#caseStage'];
    const issues = [];
    if(document.documentElement.scrollWidth > innerWidth + 2) issues.push('page overflow');
    for(const sel of roots) {
      const el = document.querySelector(sel);
      if(!el || !el.children.length) { issues.push(sel + ': empty'); continue; }
      for(const node of [el,...el.querySelectorAll('*')]) {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        if(!rect.width || !rect.height || style.display === 'none') continue;
        if(node.scrollWidth > node.clientWidth + 3 && ['hidden','clip'].includes(style.overflowX)) issues.push(node.className + ': x-clipped');
        if(node.scrollHeight > node.clientHeight + 3 && ['hidden','clip'].includes(style.overflowY)) issues.push(node.className + ': y-clipped');
      }
    }
    return issues;
  });
  if(bad.length) report.layout.push({ width, state, issues:bad });
}
try {
  for(const width of widths) {
    for(const lang of ['hu','en']) {
      for(const theme of ['light','dark']) {
        const context = await browser.newContext({ viewport:{width,height:900}, reducedMotion:'reduce' });
        await context.addInitScript(({lang,theme}) => { localStorage.setItem('fg-lang',lang); localStorage.setItem('fg-theme',theme); }, {lang,theme});
        const page = await context.newPage();
        page.on('pageerror',e=>report.errors.push({width,lang,theme,error:e.message}));
        page.on('response',r=>{if(r.status()>=400) report.errors.push({width,lang,theme,status:r.status(),url:r.url()});});
        await page.goto(base+'/weboldal-keszites.html',{waitUntil:'networkidle'});
        await page.evaluate(()=>document.fonts.ready);
        assert.equal(await page.locator('html').getAttribute('lang'),lang);
        assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
        for(const key of ['start','replace','multi','campaign']) {
          await page.locator('[data-decision="'+key+'"]').click();
          assert.equal(await page.locator('#decisionDemo').getAttribute('data-view'),key);
          await geometry(page,width,'decision:'+key+':'+lang+':'+theme);
        }
        for(const key of ['design','mobile','contact','seo','launch']) {
          await page.locator('[data-feature="'+key+'"]').click();
          assert.equal(await page.locator('#featureViewport').getAttribute('data-view'),key);
          await geometry(page,width,'feature:'+key+':'+lang+':'+theme);
          if([390,1440].includes(width) && lang==='hu' && ['design','mobile','contact'].includes(key)) {
            await page.locator('#tartalom').screenshot({path:'preview-qa/'+width+'-'+theme+'-'+key+'.png'});
          }
        }
        for(const key of ['base','build','tune']) {
          await page.locator('[data-case="'+key+'"]').click();
          assert.equal(await page.locator('#caseStage').getAttribute('data-view'),key);
        }
        for(const pages of ['one','multi']) for(const visual of ['simple','custom']) for(const integration of ['no','yes']) {
          await page.locator('input[name="pages"][value="'+pages+'"]').check({force:true});
          await page.locator('input[name="visual"][value="'+visual+'"]').check({force:true});
          await page.locator('input[name="integration"][value="'+integration+'"]').check({force:true});
          const tier = await page.locator('#estimateTier').textContent();
          assert.equal(tier,integration==='yes'?(lang==='hu'?'Egyedi projekt':'Custom project'):(pages==='multi'||visual==='custom'?'Business':'Starter'));
        }
        await page.locator('#langToggle').click();
        assert.equal(await page.locator('html').getAttribute('lang'),lang==='hu'?'en':'hu');
        await page.locator('#themeToggle').click();
        assert.equal(await page.locator('html').getAttribute('data-theme'),theme==='light'?'dark':'light');
        if(width<=1100) {
          await page.locator('#mobileToggle').click();
          assert.equal(await page.locator('#mobileToggle').getAttribute('aria-expanded'),'true');
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('#mobileToggle').getAttribute('aria-expanded'),'false');
        }
        report.cases.push({width,lang,theme,decisions:4,features:5,cases:3,estimator:8});
        await context.close();
      }
    }
  }
  const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page = await context.newPage();
  await page.goto(base+'/weboldal-keszites.html');
  for(const sel of ['#decisionDemo','#featureViewport','#featureCopy','#caseStage']) assert.ok((await page.locator(sel).textContent()).trim());
  report.noJS = 'default panels populated';
  await context.close();
} catch(e) { report.failure = e.stack; }
await browser.close();
await writeFile('preview-qa/report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({configurations:report.cases.length,errors:report.errors,layout:report.layout,failure:report.failure},null,2));
if(report.failure || report.errors.length || report.layout.length) process.exitCode=1;
