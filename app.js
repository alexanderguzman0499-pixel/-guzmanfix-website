/* ── Header shrink on scroll ── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('header--scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Scroll-to-top ── */
const topBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  topBtn?.classList.toggle('visible', window.scrollY > 400);
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
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
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
    [...dotsContainer.children].forEach((d, i) => d.classList.toggle('active', i === page));
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
})();

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
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

/* ── Scroll progress bar ── */
const progressBar = document.getElementById('scrollProgress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = Math.min(100, pct) + '%';
  }, { passive: true });
}

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

  document.addEventListener('mouseleave', e => {
    if (e.clientY < 60 && !shown) {
      shown = true;
      sessionStorage.setItem('exitShown', '1');
      popup.classList.add('active');
    }
  });

  const close = () => popup.classList.remove('active');
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
  const words = ['flooring', 'plumbing', 'drywall', 'electrical', 'maintenance'];
  let i = words.length - 1;
  setInterval(() => {
    el.classList.add('fade-out');
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove('fade-out');
    }, 320);
  }, 2600);
})();

/* ── Before / After Sliders (supports multiple) ── */
document.querySelectorAll('[data-ba]').forEach(slider => {
  const after  = slider.querySelector('.ba-after');
  const handle = slider.querySelector('.ba-handle');
  let dragging = false;

  function setPos(clientX) {
    const rect = slider.getBoundingClientRect();
    const pct  = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left    = pct + '%';
  }

  handle.addEventListener('mousedown',  e => { dragging = true; e.preventDefault(); });
  window.addEventListener('mouseup',    () => { dragging = false; });
  window.addEventListener('mousemove',  e => { if (dragging) setPos(e.clientX); });

  handle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
  window.addEventListener('touchend',   () => { dragging = false; });
  window.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });

  slider.addEventListener('click', e => setPos(e.clientX));
});

/* ── Cookie consent ── */
(function () {
  const bar = document.getElementById('cookieBar');
  if (!bar || localStorage.getItem('cookieChoice')) return;
  setTimeout(() => bar.classList.add('visible'), 2200);
  function dismiss(choice) {
    localStorage.setItem('cookieChoice', choice);
    bar.classList.remove('visible');
    setTimeout(() => bar.remove(), 500);
  }
  document.getElementById('cookieAccept')?.addEventListener('click', () => dismiss('accepted'));
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
    lbImg.style.opacity = '0';
    lbImg.src = imgs[i].src;
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
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
