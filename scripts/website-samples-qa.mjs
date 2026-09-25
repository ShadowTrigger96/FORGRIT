import { chromium, request } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8765';
const keys = ['start','replace','multi','campaign'];
const ids = ['photo-1567880905822-56f8e06fe630','photo-1531971589569-0d9370cbe1e5','photo-1585321273804-d542cc56fcb4','photo-1422246358533-95dcd3d48961'];
const report = { photos:[], views:[], errors:[] };
await mkdir('preview-qa/photos',{recursive:true});
const api=await request.newContext();
const buffers=new Map();
for(let i=0;i<ids.length;i++) {
  const url='https://images.unsplash.com/'+ids[i]+'?auto=format&fit=crop&w=1100&q=85';
  try {
    const response=await api.get(url,{timeout:45000});
    const bytes=await response.body();
    assert.equal(response.status(),200,'Photo status: '+keys[i]);
    assert.ok(response.headers()['content-type'].startsWith('image/'),'Photo MIME: '+keys[i]);
    assert.ok(bytes.length>5000,'Photo unexpectedly small: '+keys[i]);
    buffers.set(ids[i],bytes);
    await writeFile('preview-qa/photos/'+keys[i]+'.jpg',bytes);
    report.photos.push({key:keys[i],url,status:response.status(),bytes:bytes.length});
  } catch(e) { report.errors.push({photo:keys[i],error:String(e)}); }
}
await api.dispose();
const browser=await chromium.launch();
try {
  for(const width of [390,1440]) for(const theme of ['light','dark']) {
    const ctx=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
    await ctx.addInitScript(theme=>{localStorage.setItem('fg-lang','hu');localStorage.setItem('fg-theme',theme);},theme);
    // Reuse verified image bytes across screenshot cases, avoiding repeated external downloads.
    await ctx.route('https://images.unsplash.com/**',async route=>{
      const id=ids.find(x=>route.request().url().includes(x));
      if(id&&buffers.has(id))await route.fulfill({status:200,contentType:'image/jpeg',body:buffers.get(id)});
      else await route.continue();
    });
    const page=await ctx.newPage();
    page.on('pageerror',e=>report.errors.push({width,theme,error:e.message}));
    await page.goto(base+'/weboldal-keszites.html',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    for(const key of keys) {
      await page.locator('[data-decision="'+key+'"]').click();
      await page.locator('#decisionDemo').scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>Array.from(document.querySelectorAll('#decisionDemo img')).every(i=>i.complete&&i.naturalWidth>0));
      assert.equal(await page.locator('#decisionDemo [data-concept]').getAttribute('data-concept'),key);
      const layout=await page.locator('#decisionDemo').evaluate(el=>{
        const out=[];
        for(const child of [el,...el.querySelectorAll('*')]) {
          const s=getComputedStyle(child),r=child.getBoundingClientRect();
          if(!r.width||!r.height)continue;
          if(child.scrollWidth>child.clientWidth+3&&['hidden','clip'].includes(s.overflowX))out.push(child.className+':x');
          if(child.scrollHeight>child.clientHeight+3&&['hidden','clip'].includes(s.overflowY))out.push(child.className+':y');
        }
        return out;
      });
      if(layout.length)report.errors.push({width,theme,key,layout});
      await page.locator('#elso-kerdes').screenshot({path:'preview-qa/'+width+'-'+theme+'-sample-'+key+'.png'});
      await page.locator('#decisionDemo .bz').screenshot({path:'preview-qa/'+width+'-'+theme+'-concept-'+key+'.png'});
      report.views.push({width,theme,key,imageLoaded:true});
    }
    await page.locator('[data-feature="mobile"]').click();
    await page.locator('#featureViewport').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('#featureViewport img')).every(i=>i.complete&&i.naturalWidth>0));
    await page.locator('#tartalom').screenshot({path:'preview-qa/'+width+'-'+theme+'-new-mobile-feature.png'});
    await ctx.close();
  }
} catch(e) { report.errors.push({error:e.stack}); }
await browser.close();
await writeFile('preview-qa/samples-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(report.errors.length)process.exitCode=1;
