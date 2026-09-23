/* Four original HTML/CSS concepts. Photographs are credited in PHOTO-CREDITS.md. */
(function (global) {
  'use strict';
  const photos = {
    cafe: ['photo-1567880905822-56f8e06fe630', 'Keghan Crossland'],
    architecture: ['photo-1531971589569-0d9370cbe1e5', 'LYCS Architecture'],
    garden: ['photo-1585321273804-d542cc56fcb4', 'Aubrey Odom'],
    clay: ['photo-1422246358533-95dcd3d48961', 'Alex Jones']
  };
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function render(key, compact, lang) {
    const t = (hu, en) => lang === 'en' ? en : hu;
    const img = (id, alt, cls='') => '<img class="bz-photo '+cls+'" src="https://images.unsplash.com/'+photos[id][0]+'?auto=format&amp;fit=crop&amp;w=1100&amp;q=85" alt="'+esc(alt)+'" width="1100" height="825" loading="lazy" decoding="async">';
    const note = '<footer class="bz-note"><span>'+t('Szemléltető minta · kitalált márka','Illustrative concept · fictional brand')+'</span><span>'+t('Fotó','Photo')+': '+photos[{start:'cafe',replace:'architecture',multi:'garden',campaign:'clay'}[key]][1]+'</span></footer>';
    let body;
    if (key === 'start') {
      body = `<header class="bz-head cafe-head"><div class="cafe-brand">füge<span>${t('kávé és reggeli','coffee & breakfast')}</span></div><nav aria-label="${t('Minta menü','Sample navigation')}"><span>${t('Étlap','Menu')}</span><span>${t('Rólunk','Our story')}</span><span>${t('Itt találsz','Find us')}</span></nav><span class="cafe-open">${t('Jó reggelt!','Good morning!')}</span></header>
      <div class="cafe-hero"><div class="cafe-copy"><span class="bz-eyebrow">${t('Egy jó nap itt kezdődik','A good day starts here')}</span><h4>${t('Lassíts le.<br>A kávé<br>már kész.','Take a seat.<br>The coffee<br>is ready.')}</h4><p>${t('Frissen pörkölt kávé, meleg péksüti és reggeli. Helyben, elvitelre, ahogy a napod kívánja.','Freshly roasted coffee, warm pastries and breakfast. Stay a while or take it with you.')}</p><span class="bz-cta">${t('Megnézem az étlapot','Explore the menu')} <span>↗</span></span></div>${img('cafe',t('Természetes fényű kávézó, íves fa pulttal','Sunlit coffee shop with a curved wooden counter'))}</div>
      <div class="cafe-bottom"><div><span class="bz-eyebrow">${t('A pultból ajánljuk','From our counter')}</span><h5>${t('A szokásos mellé<br>valami frisset.','Something fresh<br>with your usual.')}</h5><p>${t('Vajas croissant · szezonális sütemények','Butter croissant · seasonal pastries')}</p></div><div class="cafe-hours"><span class="bz-eyebrow">${t('Nyitvatartás','Opening hours')}</span><dl><div><dt>${t('Hétfő–péntek','Monday–Friday')}</dt><dd>07:30–18:00</dd></div><div><dt>${t('Hétvége','Weekend')}</dt><dd>08:00–16:00</dd></div></dl></div></div>`;
    } else if (key === 'replace') {
      body = `<header class="bz-head arch-head"><b class="arch-brand">METSZET<span>${t('építésziroda','architecture studio')}</span></b><nav><span>${t('Munkák','Projects')}</span><span>${t('Iroda','Studio')}</span><span>${t('Kapcsolat','Contact')} ↗</span></nav></header>
      <div class="arch-intro"><h4>${t('Tér. Anyag. Arány.','Space. Material. Form.')}</h4><p>${t('Épületeket és belső tereket tervezünk.<br>A helyből és az ott élőkből indulunk ki.','We design buildings and interiors.<br>Starting with the place and the people in it.')}</p></div>
      <figure class="arch-project">${img('architecture',t('Kortárs épület üveghomlokzattal, esti fényekben','Contemporary glazed building photographed at dusk'))}<figcaption><span>01 / 03</span><span>${t('Közösségi terek','Spaces to come together')}</span></figcaption></figure>
      <div class="arch-bottom"><div><span class="bz-eyebrow">${t('Tervezési területeink','Our practice')}</span><h5>${t('A részletek<br>is számítanak.','Details make<br>the difference.')}</h5></div><div class="arch-index"><div><span>${t('Lakóépületek','Residential')}</span><span>↗</span></div><div><span>${t('Belsőépítészet','Interiors')}</span><span>↗</span></div><div><span>${t('Közösségi terek','Public spaces')}</span><span>↗</span></div></div></div>`;
    } else if (key === 'multi') {
      body = `<header class="bz-head garden-head"><b class="garden-brand">kertvonal<span>°</span></b><nav><span>${t('Kertek','Gardens')}</span><span>${t('Szolgáltatások','Services')}</span><span>${t('Beszéljünk','Let’s talk')} ↗</span></nav></header>
      <div class="garden-hero"><div><span class="bz-eyebrow">${t('Tervezés · építés · gondozás','Design · build · care')}</span><h4>${t('Jó kint<br>lenni.','Life looks<br>better outside.')}</h4><p>${t('A kertedet a mindennapjaidhoz tervezzük. Segítünk az első ötlettől a rendszeres gondozásig.','A garden designed around your daily life. From the first ideas to ongoing care.')}</p><span class="garden-cta">${t('Helyszíni egyeztetést kérek','Arrange a site visit')} ↗</span></div>${img('garden',t('Kerti ösvény természetes növényzettel','Garden path surrounded by established planting'))}</div>
      <section class="garden-services"><span class="bz-eyebrow">${t('Miben segítünk?','What can we help with?')}</span>${[[t('Kerttervezés','Garden design'),t('Növények, anyagok, térelrendezés.','Planting, materials and layout.')],[t('Kertépítés','Landscaping'),t('A tervtől az első kerti délutánig.','From a plan to your first afternoon outside.')],[t('Kertgondozás','Garden care'),t('Szezonális és rendszeres munkák.','Seasonal work and regular maintenance.')]].map((r,i)=>`<div><small>0${i+1}</small><h5>${r[0]}</h5><p>${r[1]}</p><span>↗</span></div>`).join('')}</section>`;
    } else if (key === 'campaign') {
      body = `<header class="bz-head clay-head"><b class="clay-brand">agyag<span>/ ${t('műhely','studio')}</span></b><nav><span>${t('A foglalkozásról','The workshop')}</span><span>${t('Időpontok','Dates')} ↗</span></nav></header>
      <div class="clay-hero"><div class="clay-copy"><span class="bz-eyebrow">${t('Kerámia workshop · kezdőknek is','Pottery workshop · beginners welcome')}</span><h4>${t('Most a<br>kezedé<br>a főszerep.','Make time.<br>Make<br>something.')}</h4><p>${t('Két óra alkotás, egy marék agyag.<br>Te hozod a kedved, mi az eszközöket.','Two hours of making and a handful of clay.<br>Bring your curiosity. We have the tools.')}</p><span class="bz-cta">${t('Megnézem az alkalmakat','Find a workshop')} <span>↗</span></span><small class="clay-footnote">${t('Nem szükséges előképzettség.','No experience needed.')}</small></div>${img('clay',t('Fazekas agyagot formál a korongon','Potter shaping clay on a wheel'))}</div>
      <div class="clay-details"><div><span>01</span><h5>${t('Kis csoport','Small groups')}</h5><p>${t('Jut idő a kérdéseidre.','Time for your questions.')}</p></div><div><span>02</span><h5>${t('Minden eszközzel','Tools included')}</h5><p>${t('Agyag, eszközök, kötény.','Clay, tools and an apron.')}</p></div><div><span>03</span><h5>${t('A saját tárgyad','Your own piece')}</h5><p>${t('Kiégetjük, hazaviheted.','We fire it. You take it home.')}</p></div></div>`;
    } else { throw new Error('Unknown website sample: '+key); }
    return '<article class="site-example bz bz-'+key+(compact?' bz-compact':'')+'" data-concept="'+key+'">'+body+note+'</article>';
  }
  global.FORGRITSamples = Object.freeze({render, photos});
})(typeof window !== 'undefined' ? window : globalThis);
