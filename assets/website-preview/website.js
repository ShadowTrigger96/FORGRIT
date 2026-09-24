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
    "Megújítanám a weboldalamat":"I have a site, but I want to replace it",
    "A jelenlegi oldal elavult, lassú, vagy egyszerűen már nem azt mutatja, amit szeretnél.":"Your current site is outdated, slow, or simply no longer represents the business properly.",
    "Több szolgáltatásom van":"I offer several services",
    "Külön szeretnéd bemutatni a szolgáltatásokat, referenciákat és a fontos információkat.":"You want separate space for services, references and important information.",
    "Egy ajánlatot szeretnék hirdetni":"I want to promote one offer",
    "Külön oldalra van szükséged egy szolgáltatás, akció vagy esemény bemutatásához.":"A service, campaign or offer needs its own focused page.",
    "Mi kerül bele a weboldalba?":"What goes into the website?",
    "Megjelenés":"Design",
    "színek, tipográfia, elrendezés":"colours, typography, layout",
    "Mobilnézet":"Mobile view",
    "telefonon is kényelmes használat":"layout checked separately",
    "Kapcsolat":"Contact",
    "űrlap és e-mailes értesítés":"form and email delivery",
    "SEO alapok":"SEO basics",
    "oldalcímek és keresési leírások":"indexing and page structure",
    "Élesítés":"Launch",
    "domain, tárhely, HTTPS":"domain, hosting, HTTPS",
    "Mini esettanulmány":"Mini case study",
    "01 · A webshop":"01 · The webshop",
    "Kik használják?":"What does it serve?",
    "02 · Fejlesztések":"02 · Development",
    "Milyen fejlesztések készültek?":"What was added?",
    "03 · Folyamatos munka":"03 · Ongoing work",
    "Mi történik az élesítés után?":"What happens after launch?",
    "Gyors árbecslő":"Quick price guide",
    "Mennyibe kerülne a weboldalad?":"How much would your website cost?",
    "Hogyan épüljön fel?":"How should it be structured?",
    "Egyoldalas bemutatkozó honlap":"One long page",
    "Több aloldal":"Multiple pages",
    "Mennyire legyen egyedi a megjelenés?":"How custom should the design be?",
    "Letisztult, visszafogott":"Clean and simple",
    "Egyedi animációk és interakciók":"Custom animations and interactions",
    "Szükséged van egyedi funkciókra?":"Do you need custom functionality or integrations?",
    "Az alapfunkciók elegendők":"Standard features are enough",
    "Igen, vagy még egyeztetnék róla":"Yes / not sure yet",
    "Pontos ajánlatot kérek":"Request an exact quote",
    "Nettó irányár. A tartalom és a funkciók egyeztetése után személyre szabott ajánlatot adok.":"Net guide price. The final quote depends on the exact content and features.",
    "Van már elképzelésed?":"Already have an idea?",
    "Vissza a főoldalra":"Back to homepage",
    "Minden jog fenntartva.":"All rights reserved.",
    "Impresszum":"Imprint",
    "Adatkezelés":"Privacy",
    "Sütikezelés":"Cookies",
    "Bemutatkozó weboldalt, többoldalas céges honlapot vagy egy konkrét ajánlathoz külön oldalt készítek. A tervezéstől az indulásig közvetlenül velem egyeztetsz.":"A company website, business site or dedicated landing page. From planning to launch, you work directly with me.",
    "Példa: Carsystemshop.hu":"Example: Carsystemshop.hu",
    "A weboldal fő részei":"Core website features",
    "Egyedi weboldal":"Custom website",
    "Mobilbarát megjelenés":"Responsive design",
    "Technikai SEO":"Technical SEO",
    "Domain és tárhely":"Domain + hosting",
    "Kapcsolati űrlap":"Contact form",
    "Teljesítmény":"Performance",
    "Böngészőkben tesztelve":"Browser testing"
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
    return window.FORGRITSamples.render(key, compact, currentLang);
  }
  var featureText={
    design:{
      hu:{title:'Megjelenés',text:'A színeket, betűtípusokat és képeket a vállalkozásodhoz választom. Úgy rendezem el a tartalmat, hogy a látogatók könnyen megtalálják a szolgáltatásaidat és az elérhetőségedet.',list:['színek és tipográfia','átlátható oldalfelépítés','visszafogott animációk']},
      en:{title:'Design',text:'I choose colours, typefaces and imagery that suit your business, and arrange the content so visitors can find your services and contact details easily.',list:['colours and typography','desktop layout','motion where it makes sense']}
    },
    mobile:{
      hu:{title:'Mobilnézet',text:'Az oldalt telefonon és számítógépen is ellenőrzöm. Figyelek arra, hogy a szöveg jól olvasható legyen, a menü és a gombok pedig kisebb képernyőn is kényelmesen használhatók maradjanak.',list:['könnyen kezelhető menü','jól megnyomható gombok','telefonon is kényelmes használat']},
      en:{title:'Mobile view',text:'I check the site on phones and computers, with readable text and navigation and buttons that work comfortably on smaller screens.',list:['mobile navigation','comfortable tap targets','responsive layout checked separately']}
    },
    contact:{
      hu:{title:'Kapcsolat',text:'Beállítom a kapcsolatfelvételi űrlapot, és tesztüzenettel ellenőrzöm az e-mailes értesítést. A látogató visszajelzést kap a küldésről, hiba esetén pedig látja, mit kell javítania.',list:['név, e-mail, üzenet mezők','e-mailes értesítés','visszajelzés az üzenet elküldéséről']},
      en:{title:'Contact',text:'I set up the form and email delivery so messages actually arrive. Visitors also get clear feedback after a successful or failed submission.',list:['name, email and message fields','email delivery','submission feedback']}
    },
    seo:{
      hu:{title:'SEO alapok',text:'Beállítom az oldalcímeket, a keresőben megjelenő leírásokat és a webhelytérképet. A Search Console segítségével követheted, hogyan jelenik meg az oldalad a Google találatai között.',list:['oldalcímek és keresési leírások','webhelytérkép','Search Console']},
      en:{title:'SEO basics',text:'Page titles, descriptions, sitemap and Search Console are set up so Google can properly understand and index the site.',list:['title and meta description','sitemap','Search Console']}
    },
    launch:{
      hu:{title:'Élesítés',text:'Összekötöm a domaint a tárhellyel, beállítom a biztonságos HTTPS-kapcsolatot, és közzéteszem az oldalt. Ezután a végleges címen is ellenőrzöm a linkeket, az űrlapot és a megjelenést.',list:['domain és DNS','HTTPS','végső ellenőrzés']},
      en:{title:'Launch',text:'Domain, DNS, HTTPS, hosting and a final check. After launch I also verify that everything works the same way in production.',list:['domain and DNS','HTTPS','final checks']}
    }
  };
  function contactHtml() {
    return '<div class="site-example contact-example">' + sampleHead('FÜGE KÁVÉZÓ',t('Kapcsolat','Contact')) + '<div class="sample-contact-grid"><div><small>' + t('Írj nekünk','Let’s talk') + '</small><h4>' + t('Miben segíthetünk?','How can we help?') + '</h4><p>' + t('Asztalt foglalnál, vagy kérdésed van az étlapról? Írj nekünk, és válaszolunk.','Would you like to book a table or ask about the menu? Send us a message.') + '</p></div><div class="sample-form" aria-label="' + t('Kapcsolati űrlap mintája','Sample contact form') + '"><div>' + t('Név','Name') + '</div><div>' + t('E-mail-cím','Email address') + '</div><div class="sample-message">' + t('Üzenet','Message') + '</div><span class="sample-action">' + t('Üzenet küldése','Send message') + '</span></div></div>' + note() + '</div>';
  }
  function seoHtml() {
    return '<div class="site-example search-example"><div class="sample-search">' + t('reggeli és kávé Győr','breakfast and coffee Győr') + '</div><div class="sample-search-result"><small>fugekave.example</small><h4>' + t('Kávé és reggeli | Füge Kávézó','Coffee and breakfast | Füge Café') + '</h4><p>' + t('Frissen pörkölt kávé, reggeli és péksütemények. Nézd meg az étlapot és a nyitvatartásunkat.','Freshly roasted coffee, breakfast and pastries. Explore the menu and find our opening hours.') + '</p></div>' + rail([t('Oldalcím','Page title'),t('Keresési leírás','Search description'),t('Oldaltérkép','Sitemap')]) + note() + '</div>';
  }
  function launchHtml() {
    return '<div class="site-example launch-example"><div class="launch-head"><b>FÜGE KÁVÉZÓ</b><span>' + t('Átadás előtt','Before handover') + '</span></div><h4>' + t('Az utolsó ellenőrzések.','The final checks.') + '</h4><div class="launch-rows">' + [['Domain / DNS',t('beállítva','configured')],['HTTPS',t('aktív','active')],[t('Kapcsolati űrlap','Contact form'),t('tesztelve','tested')],[t('Mobil és asztali nézet','Mobile and desktop'),t('ellenőrizve','checked')]].map(function (row) { return '<div><span>' + row[0] + '</span><b>✓ ' + row[1] + '</b></div>'; }).join('') + '</div>' + note() + '</div>';
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
    if(key==='mobile'){vp.firstElementChild.setAttribute('tabindex','0');vp.firstElementChild.setAttribute('aria-label',t('Görgethető mobilnézet','Scrollable mobile preview'));}
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
    var text=multi||custom?t('Többoldalas honlap, külön szolgáltatásoldalakkal vagy egyedi megjelenéssel.','For multiple pages, custom design or more detailed content.'):t('Egyoldalas honlap a vállalkozásod vagy egy konkrét ajánlat bemutatására.','A one-page business website or landing page with standard features.');
    if(integration) {
      tier=t('Egyedi projekt','Custom project');price=t('Egyedi árazás','Custom pricing');
      text=t('Az egyedi funkciókat és a más rendszerekkel való összekötést előbb átbeszéljük. Ez alapján készítem el az ajánlatot.','Custom functionality and integrations are discussed separately before preparing a quote.');
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
