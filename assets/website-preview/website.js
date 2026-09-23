(function () {
  'use strict';
  var root = document.documentElement;
  function loadPreference(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; }
  }
  function savePreference(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* The page also works without storage. */ }
  }
  var currentLang = loadPreference('fg-lang', 'hu') === 'en' ? 'en' : 'hu';
  var currentTheme = loadPreference('fg-theme', 'light') === 'dark' ? 'dark' : 'light';
  var activeDecision = 'start', activeFeature = 'design', activeCase = 'base';
  var translations = {
  "Mire van sz\u00fcks\u00e9ged?": "What do you need?",
  "Mit kapsz?": "What is included?",
  "P\u00e9lda": "Example",
  "\u00c1rbecsl\u0151": "Price guide",
  "F\u0151oldal": "Home",
  "Weboldal a": "A website built",
  "v\u00e1llalkoz\u00e1sodhoz": "around your",
  "igaz\u00edtva": "business",
  "Bemutatkoz\u00f3 oldal, c\u00e9ges weboldal vagy k\u00fcl\u00f6n landing page. A tervez\u00e9st\u0151l az \u00e9les\u00edt\u00e9sig egy helyen kezelj\u00fck a projektet.": "A company website, business site or a dedicated landing page. From planning to launch, the project stays in one place.",
  "N\u00e9zz\u00fck meg, mire van sz\u00fcks\u00e9ged": "Find the right starting point",
  "Aj\u00e1nlatot k\u00e9rek": "Request a quote",
  "G\u00d6RGESS": "SCROLL",
  "Els\u0151 k\u00e9rd\u00e9s": "First question",
  "V\u00e1laszd ki azt a helyzetet, amelyik a legk\u00f6zelebb \u00e1ll hozz\u00e1d. A minta r\u00f6gt\u00f6n mutat egy \u00e9sszer\u0171 kiindul\u00e1si ir\u00e1nyt.": "Choose the situation closest to yours. The preview immediately shows a sensible starting point.",
  "M\u00e9g nincs weboldalam": "I do not have a website yet",
  "Most indul a v\u00e1llalkoz\u00e1s, vagy eddig nem volt saj\u00e1t oldalad.": "You are just starting out, or you have not had your own website yet.",
  "Van oldalam, de cser\u00e9ln\u00e9m": "I have a site, but I want to replace it",
  "A jelenlegi oldal elavult, lass\u00fa, vagy egyszer\u0171en m\u00e1r nem azt mutatja, amit szeretn\u00e9l.": "Your current site is outdated, slow, or simply no longer represents the business properly.",
  "T\u00f6bb szolg\u00e1ltat\u00e1som van": "I offer several services",
  "K\u00fcl\u00f6n szeretn\u00e9d bemutatni a szolg\u00e1ltat\u00e1sokat, referenci\u00e1kat \u00e9s a fontos inform\u00e1ci\u00f3kat.": "You want separate space for services, references and important information.",
  "Egy dolgot szeretn\u00e9k hirdetni": "I want to promote one offer",
  "Egy szolg\u00e1ltat\u00e1snak, kamp\u00e1nynak vagy aj\u00e1nlatnak kell k\u00fcl\u00f6n, f\u00f3kusz\u00e1lt oldal.": "A service, campaign or offer needs its own focused page.",
  "Mutasd a javaslatot \u2192": "Show the suggestion \u2192",
  "Nem csak egy HTML f\u00e1jl": "More than an HTML file",
  "Mi ker\u00fcl bele a weboldalba?": "What goes into the website?",
  "Ugyanannak a projektnek t\u00f6bb r\u00e9sze van. Kattints v\u00e9gig rajtuk, a minta megmutatja, mire gondolok.": "A website project has several parts. Click through them and the demo will show what each one means.",
  "Megjelen\u00e9s": "Design",
  "sz\u00ednek, tipogr\u00e1fia, elrendez\u00e9s": "colours, typography, layout",
  "Mobiln\u00e9zet": "Mobile view",
  "k\u00fcl\u00f6n ellen\u0151rz\u00f6tt t\u00f6rdel\u00e9s": "layout checked separately",
  "Kapcsolat": "Contact",
  "\u0171rlap \u00e9s e-mail k\u00fcld\u00e9s": "form and email delivery",
  "SEO alapok": "SEO basics",
  "indexel\u00e9s \u00e9s oldalszerkezet": "indexing and page structure",
  "\u00c9les\u00edt\u00e9s": "Launch",
  "domain, t\u00e1rhely, HTTPS": "domain, hosting, HTTPS",
  "Mini esettanulm\u00e1ny": "Mini case study",
  "Carsystemshop.hu \u2013 egy m\u0171k\u00f6d\u0151 webshop a h\u00e1tt\u00e9rben": "Carsystemshop.hu \u2013 a real webshop behind the scenes",
  "Itt nem egy fikt\u00edv mint\u00e1t l\u00e1tsz. A Carsystemshop egy val\u00f3s B2B/B2C webshop, amelyen t\u00f6bb fejleszt\u00e9si \u00e9s \u00fczemeltet\u00e9si feladat is \u00f6ssze\u00e9r.": "This is not a fictional demo. Carsystemshop is a real B2B/B2C webshop where development and day-to-day operation meet.",
  "01 \u00b7 A webshop": "01 \u00b7 The webshop",
  "Mit szolg\u00e1l ki?": "What does it serve?",
  "02 \u00b7 Fejleszt\u00e9sek": "02 \u00b7 Development",
  "Milyen feladatok ker\u00fcltek bele?": "What was added?",
  "03 \u00b7 Folyamatos munka": "03 \u00b7 Ongoing work",
  "Mi t\u00f6rt\u00e9nik az \u00e9les\u00edt\u00e9s ut\u00e1n?": "What happens after launch?",
  "Folyamat": "Process",
  "\u00cdgy k\u00e9sz\u00fcl el": "How it gets built",
  "A r\u00e9szleteket mindig a projekthez igaz\u00edtjuk, de a f\u0151 l\u00e9p\u00e9sek ugyanazok.": "The details depend on the project, but the main steps stay the same.",
  "Felm\u00e9r\u00e9s": "Discovery",
  "\u00c1tbesz\u00e9lj\u00fck, mit kell tudnia az oldalnak, milyen tartalom van m\u00e1r meg, \u00e9s mi hi\u00e1nyzik.": "We go through what the site needs to do, what content already exists and what is still missing.",
  "Tervez\u00e9s": "Design",
  "\u00d6ssze\u00e1ll a strukt\u00fara \u00e9s a vizu\u00e1lis ir\u00e1ny. Itt d\u0151l el, hogyan \u00e9p\u00fcl fel az oldal.": "The structure and visual direction are defined. This is where the site takes shape.",
  "Fejleszt\u00e9s \u00e9s teszt": "Development and testing",
  "Elk\u00e9sz\u00fcl a desktop \u00e9s mobil v\u00e1ltozat, az \u0171rlapok, integr\u00e1ci\u00f3k \u00e9s a sz\u00fcks\u00e9ges technikai be\u00e1ll\u00edt\u00e1sok.": "Desktop and mobile layouts, forms, integrations and the required technical setup are built and tested.",
  "Felker\u00fcl a saj\u00e1t domainre, ellen\u0151rizz\u00fck az indexel\u00e9st, \u00e9s \u00e1tadom a k\u00e9sz oldalt.": "The site goes live on your domain, indexing is checked and the finished site is handed over.",
  "Gyors \u00e1rbecsl\u0151": "Quick price guide",
  "Melyik kateg\u00f3ri\u00e1ba eshet a projekt?": "Which category might your project fit?",
  "Nem aj\u00e1nlatot sz\u00e1mol, csak seg\u00edt eld\u00f6nteni, melyik kiindul\u00e1si csomagot \u00e9rdemes megn\u00e9zni.": "This is not an automatic quote. It simply helps identify the most relevant starting package.",
  "Hogyan \u00e9p\u00fclj\u00f6n fel?": "How should it be structured?",
  "Egy hosszabb oldal": "One long page",
  "T\u00f6bb aloldal": "Multiple pages",
  "Mennyire legyen egyedi a megjelen\u00e9s?": "How custom should the design be?",
  "Letisztult, visszafogott": "Clean and simple",
  "Egyedi anim\u00e1ci\u00f3k \u00e9s interakci\u00f3k": "Custom animations and interactions",
  "Kell egyedi m\u0171k\u00f6d\u00e9s vagy integr\u00e1ci\u00f3?": "Do you need custom functionality or integrations?",
  "Alap funkci\u00f3k elegend\u0151k": "Standard features are enough",
  "Igen / m\u00e9g nem tudom": "Yes / not sure yet",
  "Pontos aj\u00e1nlatot k\u00e9rek": "Request an exact quote",
  "Nett\u00f3 ir\u00e1ny\u00e1r. A v\u00e9gleges \u00e1r a pontos tartalom \u00e9s funkci\u00f3k alapj\u00e1n k\u00e9sz\u00fcl.": "Net guide price. The final quote depends on the exact content and features.",
  "Van m\u00e1r elk\u00e9pzel\u00e9sed?": "Already have an idea?",
  "\u00cdrd le r\u00f6viden, mire van sz\u00fcks\u00e9ged. Nem kell technikai specifik\u00e1ci\u00f3val k\u00e9sz\u00fcln\u00f6d.": "Tell me briefly what you need. You do not need to prepare a technical specification.",
  "Vissza a f\u0151oldalra": "Back to homepage",
  "Minden jog fenntartva.": "All rights reserved.",
  "Impresszum": "Imprint",
  "Adatkezel\u00e9s": "Privacy",
  "S\u00fctikezel\u00e9s": "Cookies",
  "Bemutatkoz\u00f3 oldal, c\u00e9ges weboldal vagy k\u00fcl\u00f6n landing page. A tervez\u00e9st\u0151l az \u00e9les\u00edt\u00e9sig k\u00f6zvetlen\u00fcl velem egyeztetsz.": "A company website, business site or dedicated landing page. From planning to launch, you work directly with me.",
  "V\u00e1laszd ki, melyik \u00e1ll hozz\u00e1d a legk\u00f6zelebb. Jobb oldalon r\u00f6gt\u00f6n mutatom, milyen oldalb\u00f3l induln\u00e9k.": "Choose the situation closest to yours. On the right I will immediately show the kind of site I would start from.",
  "Kattints v\u00e9gig a r\u00e9szeken. A jobb oldali n\u00e9zet mindig azt mutatja, mir\u0151l van sz\u00f3.": "Click through the sections. The view on the right changes to show exactly what each part means.",
  "A Carsystemshopon nem csak a megjelen\u00e9ssel foglalkozom. A webshop m\u0171k\u00f6d\u00e9s\u00e9hez kapcsol\u00f3d\u00f3 fejleszt\u00e9sek \u00e9s napi m\u00f3dos\u00edt\u00e1sok is ide tartoznak.": "On Carsystemshop, the work goes beyond appearance. Development and day-to-day changes required by the live webshop are part of the job as well.",
  "P\u00e9lda: Carsystemshop.hu": "Example: Carsystemshop.hu",
  "A weboldal f\u0151 r\u00e9szei": "Core website features"
};
  function t(hu, en) { return currentLang === 'en' ? en : hu; }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var originalText = [];
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    var node = walker.currentNode;
    if (node.parentElement && node.parentElement.closest('script,style,[data-live-preview]')) continue;
    var raw = node.nodeValue, key = raw.trim();
    if (translations[key]) originalText.push({ node: node, original: raw, key: key });
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
  function note() {
    return '<div class="sample-note">' + t('Szeml\u00e9ltet\u0151 minta', 'Illustrative example') + '</div>';
  }
  function sampleHead(brand, nav) {
    return '<div class="sample-head"><b>' + brand + '</b><span>' + nav + '</span></div>';
  }
  function rail(items) {
    return '<div class="sample-rail">' + items.map(function (x, i) {
      return '<div><b>0' + (i + 1) + '</b><span>' + x + '</span></div>';
    }).join('') + '</div>';
  }
  function websiteSample(key, compact) {
    var body = '', brand = '', nav = '';
    if (key === 'replace') {
      brand = 'FORMA DESIGN';
      nav = t('Munk\u00e1k \u00b7 R\u00f3lunk \u00b7 Kapcsolat', 'Projects \u00b7 About \u00b7 Contact');
      body = '<div class="sample-split sample-reverse">' + photo('armchair', t('Vil\u00e1gos fotel egy berendezett szob\u00e1ban', 'Light armchair in a furnished room')) +
        '<div><small>' + t('Lakberendez\u00e9s \u00b7 Referenci\u00e1k', 'Interior design \u00b7 Selected projects') + '</small><h4>' + t('Bels\u0151 terek, \u00e1tgondolva.', 'Interiors, thoughtfully designed.') + '</h4><p>' +
        t('N\u00e9zd meg az elk\u00e9sz\u00fclt munk\u00e1inkat, \u00e9s ismerd meg, hogyan dolgozunk.', 'Explore our completed projects and find out how we work.') + '</p><span class="sample-action">' + t('Munk\u00e1ink', 'Our projects') + '</span></div></div>' +
        '<div class="sample-projects">' + photo('interior', t('Lakberendez\u00e9si r\u00e9szlet', 'Interior detail')) + photo('lamp', t('Vil\u00e1g\u00edt\u00e1si r\u00e9szlet', 'Lighting detail')) + '<div><b>' + t('Egy helyen minden fontos.', 'All the essentials in one place.') + '</b><span>' + t('Munk\u00e1k, szolg\u00e1ltat\u00e1sok \u00e9s kapcsolatfelv\u00e9tel.', 'Projects, services and a way to get in touch.') + '</span></div></div>';
    } else if (key === 'multi') {
      brand = 'LUMEN ST\u00daDI\u00d3';
      nav = t('Tervez\u00e9s \u00b7 Kivitelez\u00e9s \u00b7 Kapcsolat', 'Planning \u00b7 Installation \u00b7 Contact');
      body = '<div class="sample-service-hero"><div><small>' + t('Vil\u00e1g\u00edt\u00e1stervez\u00e9s', 'Lighting design') + '</small><h4>' + t('Minden helyis\u00e9ghez a megfelel\u0151 f\u00e9ny.', 'The right light for every room.') + '</h4><p>' + t('Felm\u00e9r\u00e9s, tervez\u00e9s \u00e9s kivitelez\u00e9s. Ismerd meg a szolg\u00e1ltat\u00e1sainkat.', 'Survey, design and installation. Find out what each service includes.') + '</p></div>' + photo('lamp', t('Asztali l\u00e1mpa', 'Desk lamp')) + '</div>' +
        '<div class="sample-services">' + [[t('Felm\u00e9r\u00e9s', 'Survey'),t('A helysz\u00edn \u00e9s az ig\u00e9nyek megismer\u00e9se.', 'Understanding the space and your needs.')],[t('Tervez\u00e9s', 'Design'),t('L\u00e1mp\u00e1k, elhelyez\u00e9s \u00e9s f\u00e9nyek.', 'Fixtures, placement and lighting.')],[t('Kivitelez\u00e9s', 'Installation'),t('Egyeztet\u00e9s \u00e9s megval\u00f3s\u00edt\u00e1s.', 'Coordination and installation.')]].map(function (item) {
          return '<div><b>' + item[0] + '</b><span>' + item[1] + '</span><i>' + t('R\u00e9szletek', 'Details') + ' \u2192</i></div>';
        }).join('') + '</div>';
    } else if (key === 'campaign') {
      brand = 'AGYAG M\u0170HELY';
      nav = t('Ker\u00e1miafoglalkoz\u00e1s', 'Ceramics workshop');
      body = '<div class="sample-campaign">' + photo('vase', t('K\u00e9zzel k\u00e9sz\u00edtett ker\u00e1mia v\u00e1za', 'Handmade ceramic vase')) + '<div><small>' + t('Kezd\u0151knek is', 'Beginners welcome') + '</small><h4>' + t('K\u00e9sz\u00edtsd el az els\u0151 ker\u00e1mi\u00e1dat.', 'Make your first piece of pottery.') + '</h4><p>' + t('Kiscsoportos foglalkoz\u00e1s, ahol megmutatjuk az alapokat. Az anyagot \u00e9s az eszk\u00f6z\u00f6ket mi adjuk.', 'A small-group workshop covering the basics. Materials and tools are provided.') + '</p><span class="sample-action">' + t('Jelentkezem', 'Book a place') + '</span></div></div>' + rail([t('Kezd\u0151knek', 'For beginners'),t('Kis csoport', 'Small groups'),t('Eszk\u00f6z\u00f6kkel', 'Tools included')]);
    } else {
      brand = 'BOR\u00d3KA ST\u00daDI\u00d3';
      nav = t('Szolg\u00e1ltat\u00e1sok \u00b7 Munk\u00e1k \u00b7 Kapcsolat', 'Services \u00b7 Projects \u00b7 Contact');
      body = '<div class="sample-split"><div><small>' + t('Lakberendez\u00e9s \u00b7 Gy\u0151r', 'Interior design \u00b7 Gy\u0151r') + '</small><h4>' + t('Otthon, ami hozz\u00e1d igazodik.', 'A home designed around you.') + '</h4><p>' + t('Az els\u0151 alaprajzt\u00f3l a b\u00fatorok \u00e9s sz\u00ednek kiv\u00e1laszt\u00e1s\u00e1ig seg\u00edt\u00fcnk megtervezni az otthonodat.', 'From the first floor plan to choosing furniture and colours, we help you plan your home.') + '</p><span class="sample-action">' + t('Konzult\u00e1ci\u00f3t k\u00e9rek', 'Book a consultation') + '</span></div>' + photo('interior', t('L\u00e1mpa \u00e9s n\u00f6v\u00e9ny egy vil\u00e1gos szob\u00e1ban', 'Lamp and plant in a bright room')) + '</div>' + rail([t('T\u00e9rtervez\u00e9s', 'Space planning'),t('3D l\u00e1tv\u00e1nyterv', '3D visualisation'),t('Anyagok \u00e9s sz\u00ednek', 'Materials & colours')]);
    }
    return '<div class="site-example example-' + key + (compact ? ' compact-example' : '') + '">' + sampleHead(brand, nav) + body + note() + '</div>';
  }
  var featureText = {
  "design": {
    "hu": {
      "title": "Megjelen\u00e9s",
      "text": "A sz\u00edneket, bet\u0171ket, k\u00e9peket \u00e9s az elrendez\u00e9st a v\u00e1llalkoz\u00e1shoz igaz\u00edtom. Nem egy k\u00e9sz sablont h\u00fazok r\u00e1 minden oldalra.",
      "list": ["sz\u00ednek \u00e9s tipogr\u00e1fia", "desktop elrendez\u00e9s", "anim\u00e1ci\u00f3k, ha indokolt"]
    },
    "en": {
      "title": "Design",
      "text": "Colours, typography, imagery and layout are matched to the business. I do not put the same ready-made template on every site.",
      "list": ["colours and typography", "desktop layout", "motion where it makes sense"]
    }
  },
  "mobile": {
    "hu": {
      "title": "Mobiln\u00e9zet",
      "text": "Telefonon k\u00fcl\u00f6n \u00e1tn\u00e9zem az oldalt. A men\u00fc, a gombok \u00e9s a t\u00f6rdel\u00e9s nem marad desktop m\u00e9reten.",
      "list": ["mobil men\u00fc", "k\u00e9nyelmes gombm\u00e9ret", "k\u00fcl\u00f6n ellen\u0151rz\u00f6tt t\u00f6rdel\u00e9s"]
    },
    "en": {
      "title": "Mobile view",
      "text": "The site is checked separately on a phone. Navigation, buttons and layout are adjusted instead of simply shrinking the desktop version.",
      "list": ["mobile navigation", "comfortable tap targets", "responsive layout checked separately"]
    }
  },
  "contact": {
    "hu": {
      "title": "Kapcsolat",
      "text": "Be\u00e1ll\u00edtom az \u0171rlapot \u00e9s az e-mail k\u00fcld\u00e9st, hogy az \u00fczenet t\u00e9nyleg meg\u00e9rkezzen. A l\u00e1togat\u00f3 sikeres vagy hib\u00e1s k\u00fcld\u00e9sn\u00e9l is kap visszajelz\u00e9st.",
      "list": ["n\u00e9v, e-mail, \u00fczenet mez\u0151k", "e-mail tov\u00e1bb\u00edt\u00e1s", "k\u00fcld\u00e9si visszajelz\u00e9s"]
    },
    "en": {
      "title": "Contact",
      "text": "I set up the form and email delivery so messages actually arrive. Visitors also get clear feedback after a successful or failed submission.",
      "list": ["name, email and message fields", "email delivery", "submission feedback"]
    }
  },
  "seo": {
    "hu": {
      "title": "SEO alapok",
      "text": "Be\u00e1ll\u00edtom az oldalc\u00edmeket, le\u00edr\u00e1sokat, sitemapet \u00e9s a Search Console-t. Ezek az alapok kellenek ahhoz, hogy a Google rendesen l\u00e1ssa az oldalt.",
      "list": ["title \u00e9s meta le\u00edr\u00e1s", "sitemap", "Search Console"]
    },
    "en": {
      "title": "SEO basics",
      "text": "Page titles, descriptions, sitemap and Search Console are set up so Google can properly understand and index the site.",
      "list": ["title and meta description", "sitemap", "Search Console"]
    }
  },
  "launch": {
    "hu": {
      "title": "\u00c9les\u00edt\u00e9s",
      "text": "Domain, DNS, HTTPS, t\u00e1rhely \u00e9s egy v\u00e9gs\u0151 ellen\u0151rz\u00e9s. \u00c9les\u00edt\u00e9s ut\u00e1n is megn\u00e9zem, hogy minden ugyan\u00fagy m\u0171k\u00f6dik-e.",
      "list": ["domain \u00e9s DNS", "HTTPS", "v\u00e9gs\u0151 ellen\u0151rz\u00e9s"]
    },
    "en": {
      "title": "Launch",
      "text": "Domain, DNS, HTTPS, hosting and a final check. After launch I also verify that everything works the same way in production.",
      "list": ["domain and DNS", "HTTPS", "final checks"]
    }
  }
};
  function contactHtml() {
    return '<div class="site-example contact-example">' + sampleHead('BOR\u00d3KA ST\u00daDI\u00d3', t('Kapcsolat', 'Contact')) + '<div class="sample-contact-grid"><div><small>' + t('Besz\u00e9lj\u00fck \u00e1t', 'Let\u2019s talk') + '</small><h4>' + t('Miben seg\u00edthet\u00fcnk?', 'How can we help?') + '</h4><p>' + t('\u00cdrj p\u00e1r mondatot az elk\u00e9pzel\u00e9sedr\u0151l, \u00e9s felvessz\u00fck veled a kapcsolatot.', 'Tell us a little about your plans and we will get back to you.') + '</p></div><div class="sample-form" aria-label="' + t('Kapcsolati \u0171rlap mint\u00e1ja', 'Sample contact form') + '"><div>' + t('N\u00e9v', 'Name') + '</div><div>' + t('E-mail-c\u00edm', 'Email address') + '</div><div class="sample-message">' + t('\u00dczenet', 'Message') + '</div><span class="sample-action">' + t('\u00dczenet k\u00fcld\u00e9se', 'Send message') + '</span></div></div>' + note() + '</div>';
  }
  function seoHtml() {
    return '<div class="site-example search-example"><div class="sample-search">' + t('lakberendez\u0151 Gy\u0151r', 'interior designer Gy\u0151r') + '</div><div class="sample-search-result"><small>borokastudio.example</small><h4>' + t('Lakberendez\u00e9s Gy\u0151rben | Bor\u00f3ka St\u00fadi\u00f3', 'Interior design in Gy\u0151r | Bor\u00f3ka Studio') + '</h4><p>' + t('Lakberendez\u00e9si tervez\u00e9s, 3D l\u00e1tv\u00e1nyterv \u00e9s szem\u00e9lyes konzult\u00e1ci\u00f3 Gy\u0151rben. Ismerd meg a munk\u00e1inkat.', 'Interior planning, 3D visualisation and personal consultation in Gy\u0151r. Explore our work.') + '</p></div>' + rail([t('Oldalc\u00edm', 'Page title'),t('Keres\u00e9si le\u00edr\u00e1s', 'Search description'),t('Oldalt\u00e9rk\u00e9p', 'Sitemap')]) + note() + '</div>';
  }
  function launchHtml() {
    return '<div class="site-example launch-example"><div class="launch-head"><b>BOR\u00d3KA ST\u00daDI\u00d3</b><span>' + t('\u00c1tad\u00e1s el\u0151tt', 'Before handover') + '</span></div><h4>' + t('Az utols\u00f3 ellen\u0151rz\u00e9sek.', 'The final checks.') + '</h4><div class="launch-rows">' + [['Domain / DNS',t('be\u00e1ll\u00edtva', 'configured')],['HTTPS',t('akt\u00edv', 'active')],[t('Kapcsolati \u0171rlap', 'Contact form'),t('tesztelve', 'tested')],[t('Mobil \u00e9s asztali n\u00e9zet', 'Mobile and desktop'),t('ellen\u0151rizve', 'checked')]].map(function (row) { return '<div><span>' + row[0] + '</span><b>\u2713 ' + row[1] + '</b></div>'; }).join('') + '</div>' + note() + '</div>';
  }
  function renderDecision(key, animate) {
    activeDecision = key;
    updateContent(document.getElementById('decisionDemo'), key, websiteSample(key, false), animate);
    selectButton('.decision-card', 'data-decision', key);
    requestAnimationFrame(updateProgress);
  }
  function renderFeature(key, animate) {
    activeFeature = key;
    var f = featureText[key][currentLang];
    var vp = document.getElementById('featureViewport');
    vp.className = 'feature-viewport ' + (key === 'mobile' ? 'phone-mode' : key + '-mode');
    var markup = key === 'contact' ? contactHtml() : key === 'seo' ? seoHtml() : key === 'launch' ? launchHtml() : websiteSample('start', key === 'design');
    updateContent(vp, key, markup, false);
    updateContent(document.getElementById('featureCopy'), key, '<h3>' + f.title + '</h3><p>' + f.text + '</p><ul>' + f.list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>', animate);
    selectButton('.feature-tab', 'data-feature', key);
    requestAnimationFrame(updateProgress);
  }
    var cases={
    base:{
      hu:{
        title:'Carsystemshop.hu – B2B/B2C webshop',
        text:'A Carsystemshop.hu lakossági és üzleti vásárlókat is kiszolgál. A széles kínálatban is fontos, hogy a keresett termék könnyen megtalálható és gyorsan megrendelhető legyen.',
        visual:'image',
        image:'cs%20portfolio.png'
      },
      en:{
        title:'Carsystemshop.hu – B2B/B2C webshop',
        text:'The store serves both retail and business customers. Even with many products, browsing and ordering still need to stay simple.',
        visual:'image',
        image:'cs%20portfolio.png'
      }
    },
    build:{
      hu:{
        title:'Fejlesztések a működő webshopon',
        text:'A napi használat során felmerülő igényekhez igazodnak a fejlesztések: a bankkártyás fizetéstől az akciók kezeléséig.',
        visual:'development'
      },
      en:{
        title:'Development on the live webshop',
        text:'During daily use, several custom needs came up, such as card payment, promotion handling and smaller improvements.',
        visual:'development'
      }
    },
    tune:{
      hu:{
        title:'Folyamatos karbantartás',
        text:'A webshop az indulás után is rendszeres figyelmet igényel: új termékek kerülnek fel, változnak az akciók, és időnként a működésen is igazítani kell.',
        visual:'maintenance'
      },
      en:{
        title:'Ongoing maintenance',
        text:'New products, promotions and smaller changes come up regularly, so the webshop needs ongoing maintenance.',
        visual:'maintenance'
      }
    }
  };

  function renderCase(key, animate){
    activeCase=key;
    selectButton('.case-tab', 'data-case', key);
    var lang=currentLang==='hu'?'hu':'en',d=cases[key][lang],visual='';
    if(d.visual==='image'){
      visual='<div class="case-shop-image"><img src="'+d.image+'" alt="Carsystemshop project visual" loading="lazy" decoding="async"></div>';
    }else if(d.visual==='development'){
      visual='<div class="case-dashboard"><div class="case-dashboard-top"><b>Carsystemshop</b><span>'+(lang==='hu'?'Webshop funkciók':'Development areas')+'</span></div>'+
        '<div class="case-dashboard-grid">'+
          '<div class="dash-card"><span class="dash-icon">▣</span><div><b>K&H</b><small>'+(lang==='hu'?'bankkártyás fizetés':'card payment')+'</small></div><i class="dash-state on"></i></div>'+
          '<div class="dash-card"><span class="dash-icon">%</span><div><b>'+(lang==='hu'?'Akciók':'Promotions')+'</b><small>'+(lang==='hu'?'szabályok és időzítés':'rules and scheduling')+'</small></div><i class="dash-state"></i></div>'+
          '<div class="dash-card"><span class="dash-icon">≡</span><div><b>'+(lang==='hu'?'Árkezelés':'Pricing')+'</b><small>'+(lang==='hu'?'egyedi logika':'custom logic')+'</small></div><i class="dash-state on"></i></div>'+
          '<div class="dash-card"><span class="dash-icon">↗</span><div><b>'+(lang==='hu'?'Webshop':'Webshop')+'</b><small>'+(lang==='hu'?'folyamatos fejlesztés':'ongoing improvements')+'</small></div><i class="dash-state on"></i></div>'+
        '</div></div>';
    }else{
      visual='<div class="case-maintenance"><div class="case-maintenance-top"><b>Carsystemshop</b><span>'+(lang==='hu'?'Karbantartás':'Ongoing updates')+'</span></div><div class="case-maintenance-grid"><div><span class="maint-icon">+</span><b>'+(lang==='hu'?'Új termékek':'New products')+'</b></div><div><span class="maint-icon">↻</span><b>'+(lang==='hu'?'Tartalmi frissítések':'Content updates')+'</b></div><div><span class="maint-icon">%</span><b>'+(lang==='hu'?'Akciók':'Promotions')+'</b></div><div><span class="maint-icon">⚙</span><b>'+(lang==='hu'?'Karbantartás':'Maintenance')+'</b></div></div></div>';
    }
    var stage=document.getElementById('caseStage');
    updateContent(stage, key, '<h3>'+d.title+'</h3><p>'+d.text+'</p><a class="case-shop-link" href="https://carsystemshop.hu/" target="_blank" rel="noopener">'+(lang==='hu'?'Webshop megnyitása ↗':'Open webshop ↗')+'</a>'+visual, animate);
    requestAnimationFrame(updateProgress);
  }
  function updateEstimate() {
    var multi = document.querySelector('input[name="pages"]:checked').value === 'multi';
    var custom = document.querySelector('input[name="visual"]:checked').value === 'custom';
    var integration = document.querySelector('input[name="integration"]:checked').value === 'yes';
    var tier = multi || custom ? 'Business' : 'Starter';
    var price = multi || custom ? t('349.000 Ft <span class="suffix">-t\u00f3l</span>', 'from HUF 349,000') : t('249.000 Ft <span class="suffix">-t\u00f3l</span>', 'from HUF 249,000');
    var text = multi || custom ? t('T\u00f6bb aloldalhoz, egyedi megjelen\u00e9shez vagy \u00f6sszetettebb tartalomhoz.', 'For multiple pages, custom design or more detailed content.') : t('Egyoldalas bemutatkoz\u00f3 vagy landing oldal, alapfunkci\u00f3kkal.', 'A one-page business website or landing page with standard features.');
    if (integration) { tier = t('Egyedi projekt', 'Custom project'); price = t('Egyedi \u00e1raz\u00e1s', 'Custom pricing'); text = t('Az egyedi m\u0171k\u00f6d\u00e9st \u00e9s az integr\u00e1ci\u00f3kat k\u00fcl\u00f6n egyeztetj\u00fck, ezek alapj\u00e1n k\u00e9sz\u00fcl az aj\u00e1nlat.', 'Custom functionality and integrations are discussed separately before preparing a quote.'); }
    document.getElementById('estimateTier').textContent = tier;
    document.getElementById('estimatePrice').innerHTML = price;
    document.getElementById('estimateText').textContent = text;
    document.querySelector('.estimate-result').setAttribute('data-badge', t('Becs\u00fclt kateg\u00f3ria', 'Estimated category'));
  }
  function applyTheme(theme) {
    currentTheme = theme;
    root.dataset.theme = theme;
    savePreference('fg-theme', theme);
    document.querySelectorAll('.icon-sun').forEach(function (e) { e.style.display = theme === 'light' ? 'block' : 'none'; });
    document.querySelectorAll('.icon-moon').forEach(function (e) { e.style.display = theme === 'dark' ? 'block' : 'none'; });
    document.querySelectorAll('#themeToggle,#mobileThemeToggle').forEach(function (e) { e.setAttribute('aria-label', t('T\u00e9ma v\u00e1lt\u00e1sa', 'Change colour theme')); });
  }
  window.toggleTheme = function () { applyTheme(currentTheme === 'light' ? 'dark' : 'light'); };
  function applyLang(lang, animate) {
    currentLang = lang;
    root.lang = lang;
    savePreference('fg-lang', lang);
    originalText.forEach(function (item) { item.node.nodeValue = lang === 'hu' ? item.original : item.original.match(/^\s*/)[0] + translations[item.key] + item.original.match(/\s*$/)[0]; });
    document.querySelectorAll('.lang-toggle').forEach(function (e) { e.textContent = lang === 'hu' ? 'EN' : 'HU'; });
    document.title = t('Weboldal k\u00e9sz\u00edt\u00e9s | FORGRIT - El\u0151n\u00e9zet', 'Website development | FORGRIT - Preview');
    renderDecision(activeDecision, animate);
    renderFeature(activeFeature, animate);
    renderCase(activeCase, animate);
    updateEstimate();
    applyTheme(currentTheme);
  }
  window.toggleLang = function () { applyLang(currentLang === 'hu' ? 'en' : 'hu', true); };
  var menuButton = document.getElementById('mobileToggle');
  var menu = document.getElementById('mobileMenu');
  window.closeMobile = function () {
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = '&#9776;';
  };
  menuButton.addEventListener('click', function () {
    if (menu.classList.contains('open')) { window.closeMobile(); return; }
    menu.classList.add('open');
    document.body.classList.add('menu-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.innerHTML = '&#10005;';
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('open')) { window.closeMobile(); menuButton.focus(); }
  });
  document.getElementById('themeToggle').addEventListener('click', window.toggleTheme);
  document.getElementById('langToggle').addEventListener('click', window.toggleLang);
  document.getElementById('y').textContent = new Date().getFullYear();
  document.querySelectorAll('.decision-card').forEach(function (e) { e.addEventListener('click', function () { renderDecision(e.dataset.decision, true); }); });
  document.querySelectorAll('.feature-tab').forEach(function (e) { e.addEventListener('click', function () { renderFeature(e.dataset.feature, true); }); });
  document.querySelectorAll('.case-tab').forEach(function (e) { e.addEventListener('click', function () { renderCase(e.dataset.case, true); }); });
  document.querySelectorAll('.estimator-form input').forEach(function (e) { e.addEventListener('change', updateEstimate); });
  var progressBar = document.getElementById('scrollProgress');
  var navbar = document.getElementById('navbar');
  function updateProgress() {
    var doc = document.scrollingElement || root;
    var max = Math.max(0, doc.scrollHeight - window.innerHeight);
    progressBar.style.transform = 'scaleX(' + (max ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0) + ')';
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  var ticking = false;
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { updateProgress(); ticking = false; }); } }, { passive: true });
  window.addEventListener('resize', function () { updateProgress(); if (window.innerWidth > 1100) window.closeMobile(); }, { passive: true });
  window.addEventListener('load', updateProgress, { once: true });
  document.querySelectorAll('img').forEach(function (img) { img.addEventListener('load', updateProgress, { once: true }); });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', updateProgress, { passive: true });
  var revealNodes = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    var observer = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }); }, { threshold: 0.06 });
    revealNodes.forEach(function (e) { observer.observe(e); });
  } else revealNodes.forEach(function (e) { e.classList.add('visible'); });
  var glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(pointer:fine)').matches && !reduceMotion.matches) {
    document.addEventListener('pointermove', function (event) { glow.style.left = event.clientX + 'px'; glow.style.top = event.clientY + 'px'; }, { passive: true });
  } else glow.style.display = 'none';
  applyLang(currentLang, false);
  updateProgress();
})();
