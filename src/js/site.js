const WHATSAPP = '2348057857418';

document.documentElement.classList.add('js');

/* ---------- navigation ---------- */

const header = document.querySelector('.site-header');
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');

function setMenu(open) {
  if (!nav || !toggle) return;
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('.icon-open')?.classList.toggle('hidden', open);
  toggle.querySelector('.icon-close')?.classList.toggle('hidden', !open);
  for (const el of document.querySelectorAll('main, .site-footer, .fab')) el.inert = open;
  if (open) nav.querySelector('a')?.focus();
}

toggle?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav?.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav?.classList.contains('is-open')) {
    setMenu(false);
    toggle.focus();
  }
});
matchMedia('(min-width: 1021px)').addEventListener('change', (e) => {
  if (e.matches) setMenu(false);
});

/* ---------- header over dark heroes, floating WhatsApp ---------- */

const darkHero = document.querySelector('[data-dark-hero]');
const fab = document.querySelector('.fab');
const fabBlockers = document.querySelectorAll('form[data-enquiry], .footer-bottom');
const blocking = new Set();
let fabBlocked = false;

function onScroll() {
  const y = window.scrollY;
  if (header && darkHero) {
    const r = darkHero.getBoundingClientRect();
    header.classList.toggle('site-header--over', r.bottom > (header.offsetHeight || 72));
  }
  if (fab) {
    const limit = darkHero ? darkHero.getBoundingClientRect().bottom < window.innerHeight * 0.5 : y > 320;
    fab.classList.toggle('is-visible', limit && !fabBlocked);
  }
}
if (fab && fabBlockers.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.isIntersecting ? blocking.add(e.target) : blocking.delete(e.target);
    fabBlocked = blocking.size > 0;
    onScroll();
  });
  fabBlockers.forEach((el) => io.observe(el));
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

/* ---------- reveal on scroll ---------- */

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

/* ---------- 3D build story ---------- */

const build = document.querySelector('.build');

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function useStatic() {
  if (!build) return;
  build.classList.remove('build--live');
  build.classList.add('build--static');
  build.style.height = '';
  onScroll();
}

const OPT_IN = 'darik-3d';

function startLive() {
  build.classList.remove('build--static', 'can-3d');
  build.classList.add('build--live');
  return import('./hero/index.js')
    .then(({ mountHero }) => {
      const api = mountHero(build);
      if (!api) return useStatic();
      window.darikHero = api;
      build.addEventListener('hero:failed', useStatic, { once: true });
      onScroll();
    })
    .catch((err) => {
      console.error('3D build story could not load', err);
      useStatic();
    });
}

if (build && webglAvailable()) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  let optedIn = false;
  try {
    optedIn = localStorage.getItem(OPT_IN) === '1';
  } catch {}
  if ((!reduce && !saveData) || optedIn) {
    startLive();
  } else {
    build.classList.add('can-3d');
    build.querySelector('[data-build-optin]')?.addEventListener('click', () => {
      try {
        localStorage.setItem(OPT_IN, '1');
      } catch {}
      window.scrollTo(0, 0);
      startLive();
    });
  }
}

document.querySelector('[data-start-build]')?.addEventListener('click', () => {
  if (window.darikHero) window.darikHero.scrollToNote(0);
  else document.querySelector('.build__notes')?.scrollIntoView({ behavior: 'smooth' });
});

/* ---------- lightbox ---------- */

const lightbox = document.querySelector('.lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  const img = lightbox.querySelector('img');
  const caption = lightbox.querySelector('p');
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-zoom]');
    if (!trigger) return;
    e.preventDefault();
    img.src = trigger.dataset.zoom;
    img.alt = trigger.querySelector('img')?.alt || '';
    caption.textContent = trigger.dataset.caption || '';
    lightbox.showModal();
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.closest('.lightbox__close')) lightbox.close();
  });
  lightbox.addEventListener('close', () => img.removeAttribute('src'));
}

/* ---------- enquiry forms ---------- */

function whatsappLink(text) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

document.querySelectorAll('[data-wa-text]').forEach((a) => {
  a.href = whatsappLink(a.dataset.waText);
});

document.querySelectorAll('form[data-enquiry]').forEach((form) => {
  const waButton = form.querySelector('[data-send-whatsapp]');
  waButton?.addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const field = (label, key) => (data.get(key) ? `${label}: ${data.get(key)}` : null);
    const lines = [
      'Hello Darik Homes,',
      '',
      String(data.get('message') || '').trim(),
      '',
      field('Name', 'name'),
      field('Phone', 'phone'),
      field('Email', 'email'),
      field('Interested in', 'interest'),
    ].filter((l) => l !== null);
    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener');
  });
});

const params = new URLSearchParams(location.search);
const interest = params.get('interest');
if (interest) {
  const select = document.querySelector('select[name="interest"]');
  if (select && [...select.options].some((o) => o.value === interest)) select.value = interest;
}

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

