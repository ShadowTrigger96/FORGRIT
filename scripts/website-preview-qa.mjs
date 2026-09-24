import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8765';
const widths = [360,390,430,768,1024,1366,1440,1920];
const report = { cases: [], errors: [], layout: [] };
await mkdir('preview-qa', { recursive:true });
const browser = await chromium.launch();
try {
  for(const width of widths) for(const lang of ['hu','en']) for(const theme of ['light','dark']) {
    const context = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    await context.addInitScript(({lang,theme})=>{localStorage.setItem('fg-lang',lang);localStorage.setItem('fg-theme',theme);},{lang,theme});
    const page = await context.newPage();
    page.on('pageerror',e=>report.errors.push({width,lang,theme,error:e.message}));
    page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))report.errors.push({width,lang,theme,status:r.status(),url:r.url()});});
    await page.goto(base+'/weboldal-keszites.html',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const result=await page.evaluate(({width,lang,theme})=>{
      const errors=[],layout=[];
      const check=(value,message)=>{if(!value)errors.push(message);};
      const click=selector=>document.querySelector(selector).click();
      function geometry(state){
        check(document.documentElement.scrollWidth<=innerWidth+2,'page overflow');
        for(const id of ['decisionDemo','featureViewport','featureCopy','caseStage']){
          const root=document.getElementById(id);check(root.children.length,id+':empty');
          for(const el of [root,...root.querySelectorAll('*')]){
            // The case container clips an intentionally offset decorative gradient.
            // Its actual children are still included in the content checks below.
            if(el.id==='caseStage')continue;
            const rect=el.getBoundingClientRect(),style=getComputedStyle(el);
            if(!rect.width||!rect.height)continue;
            if(el.scrollWidth>el.clientWidth+3&&['hidden','clip'].includes(style.overflowX))layout.push(state+':'+el.className+':x');
            if(el.scrollHeight>el.clientHeight+3&&['hidden','clip'].includes(style.overflowY))layout.push(state+':'+el.className+':y');
          }
        }
      }
      check(document.documentElement.lang===lang,'initial language');
      check(document.documentElement.dataset.theme===theme,'initial theme');
      check(document.querySelector('link[rel="canonical"]').href==='https://forgrit.hu/weboldal-keszites','production canonical');
      check(!document.querySelector('meta[name="robots"]').content.includes('noindex'),'production indexability');
      check(!/Előnézet|Preview/.test(document.title),'production title');
      for(const key of ['start','replace','multi','campaign']){
        click('[data-decision="'+key+'"]');check(document.querySelector('#decisionDemo').dataset.view===key,'decision '+key);geometry('decision '+key);
      }
      for(const key of ['design','mobile','contact','seo','launch']){
        click('[data-feature="'+key+'"]');check(document.querySelector('#featureViewport').dataset.view===key,'feature '+key);geometry('feature '+key);
        if(key==='mobile'){
          const phone=document.querySelector('#featureViewport .site-example'),rect=phone.getBoundingClientRect();
          check(rect.height/rect.width>=1.85&&rect.height/rect.width<=2,'phone proportions');
          check(phone.scrollWidth<=phone.clientWidth+2,'phone horizontal overflow');
          check(getComputedStyle(phone).overflowY==='auto'&&phone.tabIndex===0,'phone scroll access');
        }
      }
      for(const key of ['base','build','tune']){
        click('[data-case="'+key+'"]');check(document.querySelector('#caseStage').dataset.view===key,'case '+key);geometry('case '+key);
      }
      for(const pages of ['one','multi'])for(const visual of ['simple','custom'])for(const integration of ['no','yes']){
        for(const [name,value] of [['pages',pages],['visual',visual],['integration',integration]])click('input[name="'+name+'"][value="'+value+'"]');
        const expected=integration==='yes'?(lang==='hu'?'Egyedi projekt':'Custom project'):(pages==='multi'||visual==='custom'?'Business':'Starter');
        check(document.querySelector('#estimateTier').textContent===expected,'estimator');
      }
      if(lang==='en')check(document.querySelector('.marquee-item').textContent.includes('Custom website'),'marquee translation');
      if(width<=1100){click('#mobileToggle');check(getComputedStyle(document.body).overflow==='hidden','menu scroll lock');closeMobile();check(document.querySelector('#mobileToggle').getAttribute('aria-expanded')==='false','menu close');}
      toggleLang();check(document.documentElement.lang!==lang,'language switch');toggleLang();
      toggleTheme();check(document.documentElement.dataset.theme!==theme,'theme switch');toggleTheme();
      return {errors,layout:[...new Set(layout)]};
    },{width,lang,theme});
    for(const error of result.errors)report.errors.push({width,lang,theme,error});
    if(result.layout.length)report.layout.push({width,lang,theme,issues:result.layout});
    // Also exercise real pointer interaction on visible labels, not hidden inputs.
    await page.locator('label:has(input[name="pages"][value="one"])').click();
    assert.ok(await page.locator('input[name="pages"][value="one"]').isChecked());
    await page.locator('label:has(input[name="pages"][value="multi"])').click();
    assert.ok(await page.locator('input[name="pages"][value="multi"]').isChecked());
    if([390,1440].includes(width)&&lang==='hu'){
      for(const key of ['design','mobile','contact']){
        await page.locator('[data-feature="'+key+'"]').click();
        await page.locator('#tartalom').screenshot({path:'preview-qa/'+width+'-'+theme+'-'+key+'.png'});
      }
      await page.locator('[data-decision="start"]').click();
      await page.locator('#elso-kerdes').screenshot({path:'preview-qa/'+width+'-'+theme+'-decision.png'});
    }
    report.cases.push({width,lang,theme,decisions:4,features:5,cases:3,estimator:8});
    await context.close();
  }
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(base+'/weboldal-keszites.html');
  for(const sel of ['#decisionDemo','#featureViewport','#featureCopy','#caseStage'])assert.ok((await page.locator(sel).textContent()).trim());
  report.noJS='default panels populated';
  await context.close();
}catch(e){report.failure=e.stack;}
await browser.close();
await writeFile('preview-qa/report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({configurations:report.cases.length,errors:report.errors,layout:report.layout,failure:report.failure},null,2));
if(report.failure||report.errors.length||report.layout.length)process.exitCode=1;
