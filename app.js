/* ── Focus trap utility ── */
const _trapMap = new Map();
function trapFocus(el) {
  const sel = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
  const prev = document.activeElement;
  function handler(e) {
    if (e.key !== 'Tab') return;
    const els = [...el.querySelectorAll(sel)];
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  _trapMap.set(el, { handler, prev });
  el.addEventListener('keydown', handler);
  el.querySelector(sel)?.focus();
}
function releaseFocus(el) {
  const entry = _trapMap.get(el);
  if (!entry) return;
  el.removeEventListener('keydown', entry.handler);
  entry.prev?.focus();
  _trapMap.delete(el);
}

/* ── Global error boundary ── */
window.onerror = (msg, src, line) => { console.error(`[GRS] JS error: ${msg} (${src}:${line})`); };
window.addEventListener('unhandledrejection', e => { console.error('[GRS] Unhandled promise:', e.reason); });

/* ── Language system ── */
const LANG_KEY = 'grs-lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'en';

const T = {
  en: {
    'nav.services':   'Services',
    'nav.work':       'Work',
    'nav.pricing':    'Pricing',
    'nav.estimate':   'Estimate',
    'nav.emergency':  'Emergency',
    'nav.getEstimate':'Get Estimate',
    'hero.pill':      "Tampa Bay's Trusted Handyman",
    'hero.desc':      'Apartment turns, punch lists, preventative maintenance, and home repairs. Professional results—without the hassle.',
    'hero.cta1':      'Get Free Estimate',
    'form.h2':        'Get a quick estimate',
    'form.desc':      "Tell us what you need and we'll reply with next steps.",
    'form.submit':    'Get My Free Estimate →',
    'quoter.badge':   'Estimate Tool',
    'quoter.h2':      'Instant Price Estimate',
    'quoter.desc':    'Select your service and scope to get a price range based on current 2026 Tampa Bay market rates.',
    'quoter.step1':   'Step 1 — What service do you need?',
    'quoter.step2':   'Step 2 — What is the scope of the work?',
    'quoter.back1':   '← Change service',
    'quoter.back2':   '← Change scope',
    'quoter.disclaimer': 'Estimate based on 2026 Tampa Bay market rates. Final price may vary based on materials, access, and site conditions.',
    'quoter.callBtn': '📞 Call for Exact Quote',
    'quoter.formBtn': 'Request Free Estimate →',
  },
  es: {
    'nav.services':   'Servicios',
    'nav.work':       'Trabajos',
    'nav.pricing':    'Precios',
    'nav.estimate':   'Estimado',
    'nav.emergency':  'Emergencia',
    'nav.getEstimate':'Cotizar Gratis',
    'hero.pill':      'El Handyman de Confianza en Tampa Bay',
    'hero.desc':      'Apartment turns, punch lists, mantenimiento preventivo y reparaciones del hogar. Resultados profesionales—sin complicaciones.',
    'hero.cta1':      'Obtener Estimado Gratis',
    'form.h2':        'Obtén un estimado rápido',
    'form.desc':      'Cuéntanos qué necesitas y te respondemos con los próximos pasos.',
    'form.submit':    'Enviar Mi Solicitud →',
    'quoter.badge':   'Herramienta de Estimados',
    'quoter.h2':      'Estimado de Precio Instantáneo',
    'quoter.desc':    'Selecciona el servicio y el alcance para ver un rango de precios basado en las tarifas actuales del mercado de Tampa Bay 2026.',
    'quoter.step1':   'Paso 1 — ¿Qué servicio necesitas?',
    'quoter.step2':   'Paso 2 — ¿Cuál es el alcance del trabajo?',
    'quoter.back1':   '← Cambiar servicio',
    'quoter.back2':   '← Cambiar alcance',
    'quoter.disclaimer': 'Estimado basado en tarifas del mercado de Tampa Bay 2026. El precio final puede variar según materiales, acceso y condición del área.',
    'quoter.callBtn': '📞 Llamar para cotización exacta',
    'quoter.formBtn': 'Solicitar estimado gratis →',
  }
};

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (T[lang][key]) el.textContent = T[lang][key];
  });
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'en' ? 'ES' : 'EN';
  if (typeof rebuildQuoter === 'function') rebuildQuoter();
  if (typeof rebuildRotator === 'function') rebuildRotator();
}

document.getElementById('langToggle')?.addEventListener('click', () => {
  applyLang(currentLang === 'en' ? 'es' : 'en');
});

if (currentLang === 'es') applyLang('es');

/* ── Google Consent Mode — update when already accepted ── */
(function () {
  if (localStorage.getItem('cookieChoice') === 'accepted' && typeof gtag === 'function') {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'analytics_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted'
    });
  }
})();

/* ── Scroll handler (consolidated) ── */
const progressBar = document.getElementById('scrollProgress');
const header = document.querySelector('.header');
const topBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (header) header.classList.toggle('header--scrolled', scrollY > 60);
  topBtn?.classList.toggle('visible', scrollY > 400);
  if (progressBar) {
    const pct = scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = Math.min(100, pct) + '%';
  }
}, { passive: true });
topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Scroll reveal (Intersection Observer) ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');
hamburger?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('show');
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.classList.toggle('open', open);
});
mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('show');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

/* ── Gallery Carousel ── */
(function () {
  const track          = document.getElementById('carouselTrack');
  const dotsContainer  = document.getElementById('carouselDots');
  if (!track || !dotsContainer) return;

  const slides = [...track.querySelectorAll('.carousel__slide')];
  const total  = slides.length;
  let current  = 0;
  let perView  = getPerView();
  let autoTimer;

  function getPerView() {
    return window.innerWidth < 700 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  function maxIdx() { return Math.max(0, total - perView); }

  const MAX_VISIBLE_DOTS = 7;

  function buildDots() {
    dotsContainer.innerHTML = '';
    const pages = Math.ceil(total / perView);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => { stopAuto(); goTo(i * perView); startAuto(); });
      dotsContainer.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    const page = Math.round(current / perView);
    const pages = Math.ceil(total / perView);
    const dots = [...dotsContainer.children];
    if (pages <= MAX_VISIBLE_DOTS) {
      dots.forEach((d, i) => { d.style.display = ''; d.classList.toggle('active', i === page); });
    } else {
      const half = Math.floor(MAX_VISIBLE_DOTS / 2);
      let start = Math.max(0, page - half);
      const end = Math.min(pages, start + MAX_VISIBLE_DOTS);
      start = Math.max(0, end - MAX_VISIBLE_DOTS);
      dots.forEach((d, i) => {
        d.style.display = (i >= start && i < end) ? '' : 'none';
        d.classList.toggle('active', i === page);
      });
    }
  }

  function goTo(n) {
    current = Math.max(0, Math.min(n, maxIdx()));
    track.style.transform = `translateX(-${(100 / perView) * current}%)`;
    updateDots();
  }

  function next() { goTo(current >= maxIdx() ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? maxIdx() : current - 1); }
  function startAuto() { clearInterval(autoTimer); autoTimer = setInterval(next, 4200); }
  function stopAuto()  { clearInterval(autoTimer); }

  document.getElementById('prevBtn')?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  document.getElementById('nextBtn')?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
  });

  window.addEventListener('resize', () => {
    const nv = getPerView();
    if (nv !== perView) { perView = nv; buildDots(); goTo(0); }
  });

  buildDots();
  startAuto();

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });
})();

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── Animated counters ── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const isInt = Number.isInteger(target);
  const duration = 1800;
  const start = performance.now();
  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = target * ease;
    el.textContent = isInt ? Math.floor(val) : val.toFixed(1);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = isInt ? target : target.toFixed(1);
  };
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── Year ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Splash screen ── */
(function () {
  const splash = document.getElementById('splash');
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 600);
  }, 1700);
})();

/* ── Cursor glow ── */
(function () {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

/* ── Exit intent popup ── */
(function () {
  const popup = document.getElementById('exitPopup');
  if (!popup) return;
  let shown = sessionStorage.getItem('exitShown');

  function showPopup() {
    if (shown) return;
    shown = true;
    sessionStorage.setItem('exitShown', '1');
    popup.classList.add('active');
    trapFocus(popup);
  }

  // Desktop: mouse leave top of page
  document.addEventListener('mouseleave', e => {
    if (e.clientY < 60) showPopup();
  });

  // Mobile: scroll up after scrolling down
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (!shown && current < lastScrollY && current > 400) showPopup();
    lastScrollY = current;
  }, { passive: true });

  const close = () => {
    popup.classList.remove('active');
    releaseFocus(popup);
  };
  document.getElementById('exitClose')?.addEventListener('click', close);
  popup.addEventListener('click', e => { if (e.target === popup) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  popup.querySelector('form')?.addEventListener('submit', () => setTimeout(close, 600));
})();

/* ── Floating estimate CTA ── */
(function () {
  const btn  = document.getElementById('floatEstimate');
  const form = document.getElementById('estimate');
  if (!btn || !form) return;
  new IntersectionObserver(([e]) => btn.classList.toggle('visible', !e.isIntersecting)).observe(form);
})();

/* ── Hero rotating word ── */
(function () {
  const el = document.getElementById('heroRotate');
  if (!el) return;
  const wordMap = {
    en: ['flooring', 'plumbing', 'drywall', 'electrical', 'maintenance'],
    es: ['pisos', 'plomería', 'drywall', 'eléctrico', 'mantenimiento']
  };
  let timer;
  let i = 0;

  window.rebuildRotator = function () {
    clearInterval(timer);
    const words = wordMap[currentLang] || wordMap.en;
    i = words.length - 1;
    timer = setInterval(() => {
      el.classList.add('fade-out');
      setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove('fade-out');
      }, 320);
    }, 2600);
  };

  rebuildRotator();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer);
    else rebuildRotator();
  });
})();

/* ── Before / After Sliders (single global listeners) ── */
(function () {
  const sliders = [...document.querySelectorAll('[data-ba]')];
  if (!sliders.length) return;

  let active = null;

  function setPos(slider, clientX) {
    const after  = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    const rect   = slider.getBoundingClientRect();
    const pct    = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    after.style.clipPath  = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left     = pct + '%';
  }

  sliders.forEach(slider => {
    const handle = slider.querySelector('.ba-handle');
    handle.addEventListener('mousedown',  e => { active = slider; e.preventDefault(); });
    handle.addEventListener('touchstart', () => { active = slider; }, { passive: true });
    slider.addEventListener('click',      e => setPos(slider, e.clientX));
  });

  window.addEventListener('mouseup',   () => { active = null; });
  window.addEventListener('mousemove', e => { if (active) setPos(active, e.clientX); });
  window.addEventListener('touchend',  () => { active = null; });
  window.addEventListener('touchmove', e => {
    if (active) setPos(active, e.touches[0].clientX);
  }, { passive: true });
})();

/* ── Cookie consent ── */
(function () {
  const bar = document.getElementById('cookieBar');
  if (!bar || localStorage.getItem('cookieChoice')) return;
  setTimeout(() => bar.classList.add('visible'), 2200);

  function dismiss(choice) {
    localStorage.setItem('cookieChoice', choice);
    bar.classList.remove('visible');
    setTimeout(() => bar.remove(), 500);
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'ad_storage':         choice === 'accepted' ? 'granted' : 'denied',
        'analytics_storage':  choice === 'accepted' ? 'granted' : 'denied',
        'ad_user_data':       choice === 'accepted' ? 'granted' : 'denied',
        'ad_personalization': choice === 'accepted' ? 'granted' : 'denied'
      });
    }
  }
  document.getElementById('cookieAccept')?.addEventListener('click',  () => dismiss('accepted'));
  document.getElementById('cookieDecline')?.addEventListener('click', () => dismiss('declined'));
})();

/* ── Gallery Lightbox ── */
(function () {
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  if (!lb || !lbImg) return;

  const imgs = [...document.querySelectorAll('.carousel__slide img')];
  let idx = 0;

  function open(i) {
    idx = i;
    lbImg.onload = null;
    lbImg.style.opacity = '0';
    lbImg.src = imgs[i].src;
    lbImg.alt = imgs[i].alt;
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    trapFocus(lb);
  }
  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    releaseFocus(lb);
  }
  function prev() { open((idx - 1 + imgs.length) % imgs.length); }
  function next() { open((idx + 1) % imgs.length); }

  imgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => open(i));
  });

  document.getElementById('lbClose')?.addEventListener('click', close);
  document.getElementById('lbPrev')?.addEventListener('click', prev);
  document.getElementById('lbNext')?.addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
})();

/* ── Interactive Price Quoter ── */
(function () {
  const widget = document.getElementById('quoter-widget');
  if (!widget) return;

  const allServices = {
    en: [
      { icon: '🪵', name: 'Flooring',       desc: 'LVP, laminate, tile, hardwood',
        scopes: [
          { icon: '📐', label: 'Small',  sub: 'Up to 200 sq ft', range: '$400 – $800' },
          { icon: '🏠', label: 'Medium', sub: '200 – 500 sq ft', range: '$800 – $1,800' },
          { icon: '🏢', label: 'Large',  sub: '500+ sq ft',      range: '$1,800 – $4,000' }
        ]
      },
      { icon: '🧱', name: 'Drywall',        desc: 'Repair, patches, texture',
        scopes: [
          { icon: '🔧', label: 'Small',  sub: 'Patches / small holes',   range: '$150 – $350' },
          { icon: '🏠', label: 'Medium', sub: 'Section or water damage', range: '$350 – $900' },
          { icon: '🏢', label: 'Large',  sub: 'Full room or multiple',   range: '$900 – $2,200' }
        ]
      },
      { icon: '🚿', name: 'Plumbing',       desc: 'Faucets, toilets, pipes',
        scopes: [
          { icon: '🔧', label: 'Small',  sub: 'Simple repair',         range: '$150 – $350' },
          { icon: '🏠', label: 'Medium', sub: 'Fixture replacement',   range: '$350 – $700' },
          { icon: '🏢', label: 'Large',  sub: 'Multiple fixtures',     range: '$700 – $1,600' }
        ]
      },
      { icon: '⚡', name: 'Electrical',     desc: 'Outlets, fans, fixtures',
        scopes: [
          { icon: '🔌', label: 'Small',  sub: '1 – 2 outlets or switches',    range: '$100 – $300' },
          { icon: '💡', label: 'Medium', sub: 'Fan or multiple light fixtures', range: '$300 – $700' },
          { icon: '🏢', label: 'Large',  sub: 'Panel or multiple circuits',    range: '$700 – $1,800' }
        ]
      },
      { icon: '🎨', name: 'Painting',       desc: 'Interior rooms',
        scopes: [
          { icon: '🖌️', label: 'Small',  sub: '1 room',        range: '$350 – $700' },
          { icon: '🏠', label: 'Medium', sub: '2 – 3 rooms',   range: '$700 – $1,800' },
          { icon: '🏢', label: 'Large',  sub: 'Full interior', range: '$1,800 – $5,000' }
        ]
      },
      { icon: '🏗️', name: 'Apartment Turn', desc: 'Make-ready, punch list',
        scopes: [
          { icon: '🛏️', label: 'Small',  sub: 'Studio / 1 bedroom', range: '$500 – $1,000' },
          { icon: '🏠', label: 'Medium', sub: '2 bedrooms',          range: '$1,000 – $2,000' },
          { icon: '🏢', label: 'Large',  sub: '3+ beds or rehab',    range: '$2,000 – $5,000' }
        ]
      },
      { icon: '🚪', name: 'Doors',          desc: 'Installation & hardware',
        scopes: [
          { icon: '🔑', label: 'Small',  sub: 'Lock / adjustment',   range: '$100 – $250' },
          { icon: '🚪', label: 'Medium', sub: 'Single door install', range: '$250 – $600' },
          { icon: '🏢', label: 'Large',  sub: 'Multiple doors',      range: '$600 – $1,500' }
        ]
      },
      { icon: '🔨', name: 'Maintenance',    desc: 'General repairs',
        scopes: [
          { icon: '⏱️', label: 'Small',  sub: '1 – 2 hour tasks',  range: '$100 – $250' },
          { icon: '🕐', label: 'Medium', sub: 'Half-day work',      range: '$250 – $550' },
          { icon: '📅', label: 'Large',  sub: 'Full-day project',   range: '$550 – $1,200' }
        ]
      }
    ],
    es: [
      { icon: '🪵', name: 'Pisos',          desc: 'LVP, laminado, porcelana',
        scopes: [
          { icon: '📐', label: 'Pequeño', sub: 'Hasta 200 sq ft', range: '$400 – $800' },
          { icon: '🏠', label: 'Mediano', sub: '200 – 500 sq ft', range: '$800 – $1,800' },
          { icon: '🏢', label: 'Grande',  sub: '500+ sq ft',      range: '$1,800 – $4,000' }
        ]
      },
      { icon: '🧱', name: 'Drywall',        desc: 'Reparación, parches, textura',
        scopes: [
          { icon: '🔧', label: 'Pequeño', sub: 'Parches / hoyos',        range: '$150 – $350' },
          { icon: '🏠', label: 'Mediano', sub: 'Sección o daño de agua', range: '$350 – $900' },
          { icon: '🏢', label: 'Grande',  sub: 'Cuarto completo',        range: '$900 – $2,200' }
        ]
      },
      { icon: '🚿', name: 'Plomería',       desc: 'Grifos, inodoros, tuberías',
        scopes: [
          { icon: '🔧', label: 'Pequeño', sub: 'Reparación simple',       range: '$150 – $350' },
          { icon: '🏠', label: 'Mediano', sub: 'Reemplazo de accesorios', range: '$350 – $700' },
          { icon: '🏢', label: 'Grande',  sub: 'Múltiples accesorios',    range: '$700 – $1,600' }
        ]
      },
      { icon: '⚡', name: 'Eléctrico',      desc: 'Tomas, abanicos, lámparas',
        scopes: [
          { icon: '🔌', label: 'Pequeño', sub: '1 – 2 salidas o switches',    range: '$100 – $300' },
          { icon: '💡', label: 'Mediano', sub: 'Abanico o varias lámparas',   range: '$300 – $700' },
          { icon: '🏢', label: 'Grande',  sub: 'Panel o circuitos múltiples', range: '$700 – $1,800' }
        ]
      },
      { icon: '🎨', name: 'Pintura',        desc: 'Interior de habitaciones',
        scopes: [
          { icon: '🖌️', label: 'Pequeño', sub: '1 habitación',      range: '$350 – $700' },
          { icon: '🏠', label: 'Mediano', sub: '2 – 3 habitaciones', range: '$700 – $1,800' },
          { icon: '🏢', label: 'Grande',  sub: 'Casa completa',      range: '$1,800 – $5,000' }
        ]
      },
      { icon: '🏗️', name: 'Apartment Turn', desc: 'Make-ready, punch list',
        scopes: [
          { icon: '🛏️', label: 'Pequeño', sub: 'Estudio / 1 cuarto', range: '$500 – $1,000' },
          { icon: '🏠', label: 'Mediano', sub: '2 cuartos',           range: '$1,000 – $2,000' },
          { icon: '🏢', label: 'Grande',  sub: '3+ cuartos o rehab', range: '$2,000 – $5,000' }
        ]
      },
      { icon: '🚪', name: 'Puertas',        desc: 'Instalación y herrajes',
        scopes: [
          { icon: '🔑', label: 'Pequeño', sub: 'Cerradura / ajuste',      range: '$100 – $250' },
          { icon: '🚪', label: 'Mediano', sub: 'Instalación de 1 puerta', range: '$250 – $600' },
          { icon: '🏢', label: 'Grande',  sub: 'Múltiples puertas',       range: '$600 – $1,500' }
        ]
      },
      { icon: '🔨', name: 'Mantenimiento',  desc: 'Reparaciones generales',
        scopes: [
          { icon: '⏱️', label: 'Pequeño', sub: '1 – 2 horas',        range: '$100 – $250' },
          { icon: '🕐', label: 'Mediano', sub: 'Medio día de trabajo', range: '$250 – $550' },
          { icon: '📅', label: 'Grande',  sub: 'Día completo',        range: '$550 – $1,200' }
        ]
      }
    ]
  };

  const step1 = document.getElementById('qStep1');
  const step2 = document.getElementById('qStep2');
  const step3 = document.getElementById('qStep3');
  const svcGrid   = document.getElementById('qServices');
  const scopeGrid = document.getElementById('qScopes');
  const qRange    = document.getElementById('qRange');
  const qSvcName  = document.getElementById('qServiceName');

  let selectedIdx = null;

  function show(el)  { el.classList.remove('quoter__hidden'); }
  function hide(el)  { el.classList.add('quoter__hidden'); }

  function getServices() { return allServices[currentLang] || allServices.en; }

  function buildServices() {
    svcGrid.innerHTML = '';
    getServices().forEach((s, i) => {
      const btn = document.createElement('button');
      btn.className = 'quoter__card';
      btn.setAttribute('aria-label', s.name);
      btn.innerHTML = `<div class="quoter__card-icon">${s.icon}</div><div class="quoter__card-name">${s.name}</div><div class="quoter__card-desc">${s.desc}</div>`;
      btn.addEventListener('click', () => { selectedIdx = i; selectService(i); });
      svcGrid.appendChild(btn);
    });
  }

  function selectService(i) {
    buildScopes(getServices()[i]);
    hide(step1);
    show(step2);
    step2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function buildScopes(svc) {
    scopeGrid.innerHTML = '';
    svc.scopes.forEach(sc => {
      const btn = document.createElement('button');
      btn.className = 'quoter__card quoter__card--scope';
      btn.setAttribute('aria-label', sc.label);
      btn.innerHTML = `<div class="quoter__card-icon">${sc.icon}</div><div class="quoter__card-name">${sc.label}</div><div class="quoter__card-desc">${sc.sub}</div>`;
      btn.addEventListener('click', () => showResult(svc, sc));
      scopeGrid.appendChild(btn);
    });
  }

  function showResult(svc, scope) {
    qSvcName.textContent = `${svc.icon} ${svc.name} · ${scope.label}`;
    qRange.textContent = scope.range;
    hide(step2);
    show(step3);
    step3.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('qBack1')?.addEventListener('click', () => { hide(step2); show(step1); });
  document.getElementById('qBack2')?.addEventListener('click', () => { hide(step3); show(step2); });

  window.rebuildQuoter = function () {
    buildServices();
    hide(step2); hide(step3); show(step1);
  };

  buildServices();
})();

/* ── Google Ads conversion tracking — calls & WhatsApp ── */
(function () {
  const ADS_CONVERSION = 'AW-18051795712/ysqKCKCthLIcEICW4p9D';

  function fireConversion(label) {
    if (typeof gtag !== 'function') return;
    gtag('event', 'conversion', { send_to: ADS_CONVERSION, event_label: label });
  }

  document.querySelectorAll('a[href^="tel:"]').forEach(a => {
    a.addEventListener('click', () => fireConversion('phone_click'));
  });

  document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
    a.addEventListener('click', () => fireConversion('whatsapp_click'));
  });
})();
