(function () {
  'use strict';
  var root = document.documentElement;
  function loadPreference(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; }
  }
  function savePreference(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* Storage is optional. */ }
  }
  var currentLang = loadPreference('fg-lang', 'hu') === 'en' ? 'en' : 'hu';
  var currentTheme = loadPreference('fg-theme', 'light') === 'dark' ? 'dark' : 'light';
  var activeDecision = 'start', activeFeature = 'design', activeCase = 'base';
  var translations = {
    "Mire van szükséged?":"What do you need?",
    "Mit kapsz?":"What is included?",
    "Példa":"Example",
    "Árbecslő":"Price guide",
    "Főoldal":"Home",
    "Weboldal a":"A website built",
    "vállalkozásodhoz":"around your",
    "igazítva":"business",
    "Nézzük meg, mire van szükséged":"Find the right starting point",
    "Ajánlatot kérek":"Request a quote",
    "GÖRGESS":"SCROLL",
    "Első kérdés":"First question",
    "Még nincs weboldalam":"I do not have a website yet",
    "Most indul a vállalkozás, vagy eddig nem volt saját oldalad.":"You are just starting out, or you have not had your own website yet.",
    "Van oldalam, de cserélném":"I have a site, but I want to replace it",
    "A jelenlegi oldal elavult, lassú, vagy egyszerűen már nem azt mutatja, amit szeretnél.":"Your current site is outdated, slow, or simply no longer represents the business properly.",
    "Több szolgáltatásom van":"I offer several services",
    "Külön szeretnéd bemutatni a szolgáltatásokat, referenciákat és a fontos információkat.":"You want separate space for services, references and important information.",
    "Egy dolgot szeretnék hirdetni":"I want to promote one offer",
    "Egy szolgáltatásnak, kampánynak vagy ajánlatnak kell külön, fókuszált oldal.":"A service, campaign or offer needs its own focused page.",
    "Mi kerül bele a weboldalba?":"What goes into the website?",
    "Megjelenés":"Design",
    "színek, tipográfia, elrendezés":"colours, typography, layout",
    "Mobilnézet":"Mobile view",
    "külön ellenőrzött tördelés":"layout checked separately",
    "Kapcsolat":"Contact",
    "űrlap és e-mail küldés":"form and email delivery",
    "SEO alapok":"SEO basics",
    "indexelés és oldalszerkezet":"indexing and page structure",
    "Élesítés":"Launch",
    "domain, tárhely, HTTPS":"domain, hosting, HTTPS",
    "Mini esettanulmány":"Mini case study",
    "01 · A webshop":"01 · The webshop",
    "Mit szolgál ki?":"What does it serve?",
    "02 · Fejlesztések":"02 · Development",
    "Milyen feladatok kerültek bele?":"What was added?",
    "03 · Folyamatos munka":"03 · Ongoing work",
    "Mi történik az élesítés után?":"What happens after launch?",
    "Gyors árbecslő":"Quick price guide",
    "Melyik kategóriába eshet a projekt?":"Which category might your project fit?",
    "Hogyan épüljön fel?":"How should it be structured?",
    "Egy hosszabb oldal":"One long page",
    "Több aloldal":"Multiple pages",
    "Mennyire legyen egyedi a megjelenés?":"How custom should the design be?",
    "Letisztult, visszafogott":"Clean and simple",
    "Egyedi animációk és interakciók":"Custom animations and interactions",
    "Kell egyedi működés vagy integráció?":"Do you need custom functionality or integrations?",
    "Alap funkciók elegendők":"Standard features are enough",
    "Igen / még nem tudom":"Yes / not sure yet",
    "Pontos ajánlatot kérek":"Request an exact quote",
    "Nettó irányár. A végleges ár a pontos tartalom és funkciók alapján készül.":"Net guide price. The final quote depends on the exact content and features.",
    "Van már elképzelésed?":"Already have an idea?",
    "Vissza a főoldalra":"Back to homepage",
    "Minden jog fenntartva.":"All rights reserved.",
    "Impresszum":"Imprint",
    "Adatkezelés":"Privacy",
    "Sütikezelés":"Cookies",
    "Bemutatkozó oldal, céges weboldal vagy külön landing page. A tervezéstől az élesítésig közvetlenül velem egyeztetsz.":"A company website, business site or dedicated landing page. From planning to launch, you work directly with me.",
    "Példa: Carsystemshop.hu":"Example: Carsystemshop.hu",
    "A weboldal fő részei":"Core website features",
    "Egyedi weboldal":"Custom website",
    "Reszponzív design":"Responsive design",
    "Technikai SEO":"Technical SEO",
    "Domain + tárhely":"Domain + hosting",
    "Kapcsolati űrlap":"Contact form",
    "Teljesítmény":"Performance",
    "Böngészőteszt":"Browser testing"
  };
  function t(hu, en) { return currentLang === 'en' ? en : hu; }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch];
    });
  }
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var originalText = [];
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    var node = walker.currentNode;
    if (node.parentElement && node.parentElement.closest('script,style,[data-live-preview]')) continue;
    var raw = node.nodeValue, key = raw.trim();
    if (translations[key]) originalText.push({node:node, original:raw, key:key});
  }
  function updateContent(element, key, markup, animate) {
    if (element.dataset.view === key && element.dataset.lang === currentLang) return;
    element.classList.remove('demo-swap');
    element.innerHTML = markup;
    element.dataset.view = key;
    element.dataset.lang = currentLang;
    if (animate && !reduceMotion.matches) {
      void element.offsetWidth;
      element.classList.add('demo-swap');
    }
  }
  function selectButton(selector, attr, key) {
    document.querySelectorAll(selector).forEach(function (button) {
      var selected = button.getAttribute(attr) === key;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  function photo(file, alt) {
    return '<img src="assets/webshop/' + file + '.webp" alt="' + escapeHTML(alt) + '" loading="lazy" decoding="async" width="640" height="480">';
  }
  function note() { return '<div class="sample-note">' + t('Szemléltető minta','Illustrative example') + '</div>'; }
  function sampleHead(brand, nav) { return '<div class="sample-head"><b>' + brand + '</b><span>' + nav + '</span></div>'; }
  function rail(items) {
    return '<div class="sample-rail">' + items.map(function (x,i) {
      return '<div><b>0' + (i+1) + '</b><span>' + x + '</span></div>';
    }).join('') + '</div>';
  }
  function websiteSample(key, compact) {
    var body='', brand='', nav='';
    if (key==='replace') {
      brand='FORMA DESIGN';
      nav=t('Munkák · Rólunk · Kapcsolat','Projects · About · Contact');
      body='<div class="sample-split sample-reverse">' + photo('armchair',t('Világos fotel egy berendezett szobában','Light armchair in a furnished room')) +
        '<div><small>' + t('Lakberendezés · Referenciák','Interior design · Selected projects') + '</small><h4>' + t('Belső terek, átgondolva.','Interiors, thoughtfully designed.') + '</h4><p>' +
        t('Nézd meg az elkészült munkáinkat, és ismerd meg, hogyan dolgozunk.','Explore our completed projects and find out how we work.') + '</p><span class="sample-action">' + t('Munkáink','Our projects') + '</span></div></div>' +
        '<div class="sample-projects">' + photo('interior',t('Lakberendezési részlet','Interior detail')) + photo('lamp',t('Világítási részlet','Lighting detail')) + '<div><b>' + t('Egy helyen minden fontos.','All the essentials in one place.') + '</b><span>' + t('Munkák, szolgáltatások és kapcsolatfelvétel.','Projects, services and a way to get in touch.') + '</span></div></div>';
    } else if (key==='multi') {
      brand='LUMEN STÚDIÓ';
      nav=t('Tervezés · Kivitelezés · Kapcsolat','Planning · Installation · Contact');
      body='<div class="sample-service-hero"><div><small>' + t('Világítástervezés','Lighting design') + '</small><h4>' + t('Minden helyiséghez a megfelelő fény.','The right light for every room.') + '</h4><p>' + t('Felmérés, tervezés és kivitelezés. Ismerd meg a szolgáltatásainkat.','Survey, design and installation. Find out what each service includes.') + '</p></div>' + photo('lamp',t('Asztali lámpa','Desk lamp')) + '</div>' +
        '<div class="sample-services">' + [[t('Felmérés','Survey'),t('A helyszín és az igények megismerése.','Understanding the space and your needs.')],[t('Tervezés','Design'),t('Lámpák, elhelyezés és fények.','Fixtures, placement and lighting.')],[t('Kivitelezés','Installation'),t('Egyeztetés és megvalósítás.','Coordination and installation.')]].map(function (item) {
          return '<div><b>' + item[0] + '</b><span>' + item[1] + '</span><i>' + t('Részletek','Details') + ' →</i></div>';
        }).join('') + '</div>';
    } else if (key==='campaign') {
      brand='AGYAG MŰHELY';
      nav=t('Kerámiafoglalkozás','Ceramics workshop');
      body='<div class="sample-campaign">' + photo('vase',t('Kézzel készített kerámia váza','Handmade ceramic vase')) + '<div><small>' + t('Kezdőknek is','Beginners welcome') + '</small><h4>' + t('Készítsd el az első kerámiádat.','Make your first piece of pottery.') + '</h4><p>' + t('Kiscsoportos foglalkozás, ahol megmutatjuk az alapokat. Az anyagot és az eszközöket mi adjuk.','A small-group workshop covering the basics. Materials and tools are provided.') + '</p><span class="sample-action">' + t('Jelentkezem','Book a place') + '</span></div></div>' + rail([t('Kezdőknek','For beginners'),t('Kis csoport','Small groups'),t('Eszközökkel','Tools included')]);
    } else {
      brand='BORÓKA STÚDIÓ';
      nav=t('Szolgáltatások · Munkák · Kapcsolat','Services · Projects · Contact');
      body='<div class="sample-split"><div><small>' + t('Lakberendezés · Győr','Interior design · Győr') + '</small><h4>' + t('Otthon, ami hozzád igazodik.','A home designed around you.') + '</h4><p>' + t('Az első alaprajztól a bútorok és színek kiválasztásáig segítünk megtervezni az otthonodat.','From the first floor plan to choosing furniture and colours, we help you plan your home.') + '</p><span class="sample-action">' + t('Konzultációt kérek','Book a consultation') + '</span></div>' + photo('interior',t('Lámpa és növény egy világos szobában','Lamp and plant in a bright room')) + '</div>' + rail([t('Tértervezés','Space planning'),t('3D látványterv','3D visualisation'),t('Anyagok és színek','Materials & colours')]);
    }
    return '<div class="site-example example-' + key + (compact?' compact-example':'') + '">' + sampleHead(brand,nav) + body + note() + '</div>';
  }
  var featureText={
    design:{
      hu:{title:'Megjelenés',text:'A színeket, betűket, képeket és az elrendezést a vállalkozáshoz igazítom. Nem egy kész sablont húzok rá minden oldalra.',list:['színek és tipográfia','desktop elrendezés','animációk, ha indokolt']},
      en:{title:'Design',text:'Colours, typography, imagery and layout are matched to the business. I do not put the same ready-made template on every site.',list:['colours and typography','desktop layout','motion where it makes sense']}
    },
    mobile:{
      hu:{title:'Mobilnézet',text:'Telefonon külön átnézem az oldalt. A menü, a gombok és a tördelés nem marad desktop méreten.',list:['mobil menü','kényelmes gombméret','külön ellenőrzött tördelés']},
      en:{title:'Mobile view',text:'The site is checked separately on a phone. Navigation, buttons and layout are adjusted instead of simply shrinking the desktop version.',list:['mobile navigation','comfortable tap targets','responsive layout checked separately']}
    },
    contact:{
      hu:{title:'Kapcsolat',text:'Beállítom az űrlapot és az e-mail küldést, hogy az üzenet tényleg megérkezzen. A látogató sikeres vagy hibás küldésnél is kap visszajelzést.',list:['név, e-mail, üzenet mezők','e-mail továbbítás','küldési visszajelzés']},
      en:{title:'Contact',text:'I set up the form and email delivery so messages actually arrive. Visitors also get clear feedback after a successful or failed submission.',list:['name, email and message fields','email delivery','submission feedback']}
    },
    seo:{
      hu:{title:'SEO alapok',text:'Beállítom az oldalcímeket, leírásokat, sitemapet és a Search Console-t. Ezek az alapok kellenek ahhoz, hogy a Google rendesen lássa az oldalt.',list:['title és meta leírás','sitemap','Search Console']},
      en:{title:'SEO basics',text:'Page titles, descriptions, sitemap and Search Console are set up so Google can properly understand and index the site.',list:['title and meta description','sitemap','Search Console']}
    },
    launch:{
      hu:{title:'Élesítés',text:'Domain, DNS, HTTPS, tárhely és egy végső ellenőrzés. Élesítés után is megnézem, hogy minden ugyanúgy működik-e.',list:['domain és DNS','HTTPS','végső ellenőrzés']},
      en:{title:'Launch',text:'Domain, DNS, HTTPS, hosting and a final check. After launch I also verify that everything works the same way in production.',list:['domain and DNS','HTTPS','final checks']}
    }
  };
  function contactHtml() {
    return '<div class="site-example contact-example">' + sampleHead('BORÓKA STÚDIÓ',t('Kapcsolat','Contact')) + '<div class="sample-contact-grid"><div><small>' + t('Beszéljük át','Let’s talk') + '</small><h4>' + t('Miben segíthetünk?','How can we help?') + '</h4><p>' + t('Írj pár mondatot az elképzelésedről, és felvesszük veled a kapcsolatot.','Tell us a little about your plans and we will get back to you.') + '</p></div><div class="sample-form" aria-label="' + t('Kapcsolati űrlap mintája','Sample contact form') + '"><div>' + t('Név','Name') + '</div><div>' + t('E-mail-cím','Email address') + '</div><div class="sample-message">' + t('Üzenet','Message') + '</div><span class="sample-action">' + t('Üzenet küldése','Send message') + '</span></div></div>' + note() + '</div>';
  }
  function seoHtml() {
    return '<div class="site-example search-example"><div class="sample-search">' + t('lakberendező Győr','interior designer Győr') + '</div><div class="sample-search-result"><small>borokastudio.example</small><h4>' + t('Lakberendezés Győrben | Boróka Stúdió','Interior design in Győr | Boróka Studio') + '</h4><p>' + t('Lakberendezési tervezés, 3D látványterv és személyes konzultáció Győrben. Ismerd meg a munkáinkat.','Interior planning, 3D visualisation and personal consultation in Győr. Explore our work.') + '</p></div>' + rail([t('Oldalcím','Page title'),t('Keresési leírás','Search description'),t('Oldaltérkép','Sitemap')]) + note() + '</div>';
  }
  function launchHtml() {
    return '<div class="site-example launch-example"><div class="launch-head"><b>BORÓKA STÚDIÓ</b><span>' + t('Átadás előtt','Before handover') + '</span></div><h4>' + t('Az utolsó ellenőrzések.','The final checks.') + '</h4><div class="launch-rows">' + [['Domain / DNS',t('beállítva','configured')],['HTTPS',t('aktív','active')],[t('Kapcsolati űrlap','Contact form'),t('tesztelve','tested')],[t('Mobil és asztali nézet','Mobile and desktop'),t('ellenőrizve','checked')]].map(function (row) { return '<div><span>' + row[0] + '</span><b>✓ ' + row[1] + '</b></div>'; }).join('') + '</div>' + note() + '</div>';
  }
  function renderDecision(key, animate) {
    activeDecision=key;
    updateContent(document.getElementById('decisionDemo'),key,websiteSample(key,false),animate);
    selectButton('.decision-card','data-decision',key);
    requestAnimationFrame(updateProgress);
  }
  function renderFeature(key, animate) {
    activeFeature=key;
    var f=featureText[key][currentLang];
    var vp=document.getElementById('featureViewport');
    vp.className='feature-viewport '+(key==='mobile'?'phone-mode':key+'-mode');
    var markup=key==='contact'?contactHtml():key==='seo'?seoHtml():key==='launch'?launchHtml():websiteSample('start',key==='design');
    updateContent(vp,key,markup,false);
    updateContent(document.getElementById('featureCopy'),key,'<h3>'+f.title+'</h3><p>'+f.text+'</p><ul>'+f.list.map(function (x) { return '<li>'+x+'</li>'; }).join('')+'</ul>',animate);
    selectButton('.feature-tab','data-feature',key);
    requestAnimationFrame(updateProgress);
  }
  var cases={
    base:{
      hu:{title:'Carsystemshop.hu – B2B/B2C webshop',text:'A Carsystemshop.hu lakossági és üzleti vásárlókat is kiszolgál. A széles kínálatban is fontos, hogy a keresett termék könnyen megtalálható és gyorsan megrendelhető legyen.',visual:'image',image:'cs%20portfolio.png'},
      en:{title:'Carsystemshop.hu – B2B/B2C webshop',text:'The store serves both retail and business customers. Even with many products, browsing and ordering still need to stay simple.',visual:'image',image:'cs%20portfolio.png'}
    },
    build:{
      hu:{title:'Fejlesztések a működő webshopon',text:'A napi használat során felmerülő igényekhez igazodnak a fejlesztések: a bankkártyás fizetéstől az akciók kezeléséig.',visual:'development'},
      en:{title:'Development on the live webshop',text:'During daily use, several custom needs came up, such as card payment, promotion handling and smaller improvements.',visual:'development'}
    },
    tune:{
      hu:{title:'Folyamatos karbantartás',text:'A webshop az indulás után is rendszeres figyelmet igényel: új termékek kerülnek fel, változnak az akciók, és időnként a működésen is igazítani kell.',visual:'maintenance'},
      en:{title:'Ongoing maintenance',text:'New products, promotions and smaller changes come up regularly, so the webshop needs ongoing maintenance.',visual:'maintenance'}
    }
  };
  function renderCase(key, animate) {
    activeCase=key;
    selectButton('.case-tab','data-case',key);
    var lang=currentLang, d=cases[key][lang], visual='';
    if(d.visual==='image') {
      visual='<div class="case-shop-image"><img src="'+d.image+'" alt="Carsystemshop project visual" loading="lazy" decoding="async"></div>';
    } else if(d.visual==='development') {
      visual='<div class="case-dashboard"><div class="case-dashboard-top"><b>Carsystemshop</b><span>'+t('Webshop funkciók','Development areas')+'</span></div><div class="case-dashboard-grid">'+
        '<div class="dash-card"><span class="dash-icon">▣</span><div><b>K&H</b><small>'+t('bankkártyás fizetés','card payment')+'</small></div><i class="dash-state on"></i></div>'+
        '<div class="dash-card"><span class="dash-icon">%</span><div><b>'+t('Akciók','Promotions')+'</b><small>'+t('szabályok és időzítés','rules and scheduling')+'</small></div><i class="dash-state"></i></div>'+
        '<div class="dash-card"><span class="dash-icon">≡</span><div><b>'+t('Árkezelés','Pricing')+'</b><small>'+t('egyedi logika','custom logic')+'</small></div><i class="dash-state on"></i></div>'+
        '<div class="dash-card"><span class="dash-icon">↗</span><div><b>Webshop</b><small>'+t('folyamatos fejlesztés','ongoing improvements')+'</small></div><i class="dash-state on"></i></div></div></div>';
    } else {
      visual='<div class="case-maintenance"><div class="case-maintenance-top"><b>Carsystemshop</b><span>'+t('Karbantartás','Ongoing updates')+'</span></div><div class="case-maintenance-grid"><div><span class="maint-icon">+</span><b>'+t('Új termékek','New products')+'</b></div><div><span class="maint-icon">↻</span><b>'+t('Tartalmi frissítések','Content updates')+'</b></div><div><span class="maint-icon">%</span><b>'+t('Akciók','Promotions')+'</b></div><div><span class="maint-icon">⚙</span><b>'+t('Karbantartás','Maintenance')+'</b></div></div></div>';
    }
    updateContent(document.getElementById('caseStage'),key,'<h3>'+d.title+'</h3><p>'+d.text+'</p><a class="case-shop-link" href="https://carsystemshop.hu/" target="_blank" rel="noopener">'+t('Webshop megnyitása ↗','Open webshop ↗')+'</a>'+visual,animate);
    requestAnimationFrame(updateProgress);
  }
  function updateEstimate() {
    var multi=document.querySelector('input[name="pages"]:checked').value==='multi';
    var custom=document.querySelector('input[name="visual"]:checked').value==='custom';
    var integration=document.querySelector('input[name="integration"]:checked').value==='yes';
    var tier=multi||custom?'Business':'Starter';
    var price=multi||custom?t('349.000 Ft <span class="suffix">-tól</span>','from HUF 349,000'):t('249.000 Ft <span class="suffix">-tól</span>','from HUF 249,000');
    var text=multi||custom?t('Több aloldalhoz, egyedi megjelenéshez vagy összetettebb tartalomhoz.','For multiple pages, custom design or more detailed content.'):t('Egyoldalas bemutatkozó vagy landing oldal, alapfunkciókkal.','A one-page business website or landing page with standard features.');
    if(integration) {
      tier=t('Egyedi projekt','Custom project');price=t('Egyedi árazás','Custom pricing');
      text=t('Az egyedi működést és az integrációkat külön egyeztetjük, ezek alapján készül az ajánlat.','Custom functionality and integrations are discussed separately before preparing a quote.');
    }
    document.getElementById('estimateTier').textContent=tier;
    document.getElementById('estimatePrice').innerHTML=price;
    document.getElementById('estimateText').textContent=text;
    document.querySelector('.estimate-result').setAttribute('data-badge',t('Becsült kategória','Estimated category'));
  }
  function applyTheme(theme) {
    currentTheme=theme;root.dataset.theme=theme;savePreference('fg-theme',theme);
    document.querySelectorAll('.icon-sun').forEach(function(e){e.style.display=theme==='light'?'block':'none';});
    document.querySelectorAll('.icon-moon').forEach(function(e){e.style.display=theme==='dark'?'block':'none';});
    document.querySelectorAll('#themeToggle,#mobileThemeToggle').forEach(function(e){e.setAttribute('aria-label',t('Téma váltása','Change colour theme'));});
  }
  window.toggleTheme=function(){applyTheme(currentTheme==='light'?'dark':'light');};
  function applyLang(lang, animate) {
    currentLang=lang;root.lang=lang;savePreference('fg-lang',lang);
    originalText.forEach(function(item){item.node.nodeValue=lang==='hu'?item.original:item.original.match(/^\s*/)[0]+translations[item.key]+item.original.match(/\s*$/)[0];});
    document.querySelectorAll('.lang-toggle').forEach(function(e){e.textContent=lang==='hu'?'EN':'HU';});
    document.title=t('Weboldal készítés | FORGRIT - Előnézet','Website development | FORGRIT - Preview');
    renderDecision(activeDecision,animate);renderFeature(activeFeature,animate);renderCase(activeCase,animate);updateEstimate();applyTheme(currentTheme);
  }
  window.toggleLang=function(){applyLang(currentLang==='hu'?'en':'hu',true);};
  var menuButton=document.getElementById('mobileToggle'),menu=document.getElementById('mobileMenu');
  window.closeMobile=function(){menu.classList.remove('open');document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');menuButton.innerHTML='&#9776;';};
  menuButton.addEventListener('click',function(){
    if(menu.classList.contains('open')){window.closeMobile();return;}
    menu.classList.add('open');document.body.classList.add('menu-open');menuButton.setAttribute('aria-expanded','true');menuButton.innerHTML='&#10005;';
  });
  document.addEventListener('keydown',function(event){if(event.key==='Escape'&&menu.classList.contains('open')){window.closeMobile();menuButton.focus();}});
  document.getElementById('themeToggle').addEventListener('click',window.toggleTheme);
  document.getElementById('langToggle').addEventListener('click',window.toggleLang);
  document.getElementById('y').textContent=new Date().getFullYear();
  document.querySelectorAll('.decision-card').forEach(function(e){e.addEventListener('click',function(){renderDecision(e.dataset.decision,true);});});
  document.querySelectorAll('.feature-tab').forEach(function(e){e.addEventListener('click',function(){renderFeature(e.dataset.feature,true);});});
  document.querySelectorAll('.case-tab').forEach(function(e){e.addEventListener('click',function(){renderCase(e.dataset.case,true);});});
  document.querySelectorAll('.estimator-form input').forEach(function(e){e.addEventListener('change',updateEstimate);});
  var progressBar=document.getElementById('scrollProgress'),navbar=document.getElementById('navbar');
  function updateProgress(){
    var doc=document.scrollingElement||root,max=Math.max(0,doc.scrollHeight-window.innerHeight);
    progressBar.style.transform='scaleX('+(max?Math.min(1,Math.max(0,doc.scrollTop/max)):0)+')';
    navbar.classList.toggle('scrolled',window.scrollY>50);
  }
  var ticking=false;
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(function(){updateProgress();ticking=false;});}},{passive:true});
  window.addEventListener('resize',function(){updateProgress();if(window.innerWidth>1100)window.closeMobile();},{passive:true});
  window.addEventListener('load',updateProgress,{once:true});
  document.querySelectorAll('img').forEach(function(img){img.addEventListener('load',updateProgress,{once:true});});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',updateProgress,{passive:true});
  var revealNodes=document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
  if('IntersectionObserver' in window&&!reduceMotion.matches){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}});},{threshold:.06});
    revealNodes.forEach(function(e){observer.observe(e);});
  }else revealNodes.forEach(function(e){e.classList.add('visible');});
  var glow=document.getElementById('cursorGlow');
  if(window.matchMedia('(pointer:fine)').matches&&!reduceMotion.matches){
    document.addEventListener('pointermove',function(event){glow.style.left=event.clientX+'px';glow.style.top=event.clientY+'px';},{passive:true});
  }else glow.style.display='none';
  applyLang(currentLang,false);updateProgress();
})();
