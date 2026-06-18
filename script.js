/* ============================================================
   JMLFOTO · Web personal Jose Morales
   script.js · Interacciones y animaciones
   ============================================================ */

'use strict';

/* ─── UTILIDADES ────────────────────────────────────────────── */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const onReady = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

/* ─── NAVEGACIÓN ────────────────────────────────────────────── */
const initNav = () => {
  const nav = $('#nav');
  const toggle = $('#nav-toggle');
  const menu = $('#nav-menu');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
      toggle.classList.toggle('is-open', open);
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.classList.remove('is-open');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  const sections = $$('section[id]');
  const links = $$('.nav-link');

  const isHomeLikeNav = [...links].some(link => {
    const href = link.getAttribute('href') || '';
    return href.startsWith('#');
  });

  const markActive = () => {
    if (!sections.length || !links.length || !isHomeLikeNav) return;

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });

    links.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  };

  if (isHomeLikeNav) {
    window.addEventListener('scroll', markActive, { passive: true });
    markActive();
  }
};

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
const initReveal = () => {
  const els = $$('.reveal');
  if (!els.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  const parents = new Map();
  els.forEach(el => {
    const key = el.parentElement;
    if (!parents.has(key)) parents.set(key, []);
    parents.get(key).push(el);
  });

  parents.forEach(group => {
    group.forEach((el, i) => {
      if (!el.dataset.delay) el.dataset.delay = i * 100;
    });
  });

  els.forEach(el => observer.observe(el));
};

/* ─── SMOOTH SCROLL ─────────────────────────────────────────── */
const initSmoothScroll = () => {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (!target) return;

      e.preventDefault();
      const offset = $('#nav')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
};

/* ─── BACK TO TOP ───────────────────────────────────────────── */
const initBackToTop = () => {
  const btn = $('#back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.hidden = window.scrollY < 600;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

/* ─── FORMULARIO CONTACTO ───────────────────────────────────── */
const initForm = () => {
  const form = $('#contacto-form');
  const ok = $('#form-ok');
  if (!form) return;

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const clearErrors = () => {
    form.querySelectorAll('.f-error').forEach(e => e.remove());
    form.querySelectorAll('.has-error').forEach(e => {
      e.classList.remove('has-error');
      e.style.borderBottomColor = '';
    });
  };

  const showError = (field, msg) => {
    const group = field.closest('.form-group');
    if (!group) return;
    group.style.borderBottomColor = '#c0392b';
    group.classList.add('has-error');
    const err = document.createElement('span');
    err.className = 'f-error';
    err.textContent = msg;
    err.style.cssText = `
      display: block;
      font-size: 0.72rem;
      color: #c0392b;
      margin-top: 0.4rem;
      letter-spacing: 0.05em;
    `;
    group.appendChild(err);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const nombre = form.querySelector('#f-nombre');
    const email = form.querySelector('#f-email');
    const mensaje = form.querySelector('#f-mensaje');
    let valid = true;

    if (!nombre.value.trim()) {
      showError(nombre, 'Escribe tu nombre');
      valid = false;
    }
    if (!isEmail(email.value)) {
      showError(email, 'Email no válido');
      valid = false;
    }
    if (mensaje.value.trim().length < 10) {
      showError(mensaje, 'El mensaje es demasiado corto');
      valid = false;
    }

    if (!valid) return;

    const btn = form.querySelector('.btn-enviar');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (res.ok) {
        form.reset();
        if (ok) {
          ok.hidden = false;
          ok.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        alert('Hubo un problema. Inténtalo de nuevo o escríbeme directamente.');
      }
    })
    .catch(() => {
      alert('Sin conexión. Comprueba internet e inténtalo de nuevo.');
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje';
    });
  });
};

/* ─── PARALLAX LIGERO EN HERO ───────────────────────────────── */
const initParallax = () => {
  const hero = $('.hero');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const slides = hero.querySelector('.hero-slides');
  const content = hero.querySelector('.hero-content');
  if (!slides && !content) return;

  let ticking = false;

  const updateParallax = () => {
    const y = window.scrollY;

    if (y < window.innerHeight) {
      if (slides) {
        slides.style.transform = `translateY(${y * 0.18}px) scale(1.02)`;
      }

      if (content) {
        content.style.transform = `translateY(${y * 0.10}px)`;
        content.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.7));
      }
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
};

/* ─── CURSOR LÍNEA ──────────────────────────────────────────── */
const initCursor = () => {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.createElement('div');
  cursor.setAttribute('aria-hidden', 'true');
  cursor.style.cssText = `
    position: fixed;
    width: 1px;
    height: 20px;
    background: #0d0d0d;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: height 0.2s ease, opacity 0.3s ease;
    mix-blend-mode: difference;
    opacity: 0;
  `;
  document.body.appendChild(cursor);

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  $$('a, button, .port-item, .blog-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.height = '40px';
      cursor.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.height = '20px';
      cursor.style.opacity = '1';
    });
  });

  const tick = () => {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = `${cx}px`;
    cursor.style.top = `${cy}px`;
    requestAnimationFrame(tick);
  };
  tick();
};

/* ─── BARRA DE PROGRESO DE LECTURA ─────────────────────────── */
const initProgress = () => {
  const bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 1px;
    width: 0%;
    background: #0d0d0d;
    z-index: 200;
    transition: width 0.1s linear;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
  }, { passive: true });
};

/* ─── LAZY LOAD imágenes con data-src ───────────────────────── */
const initLazyLoad = () => {
  const imgs = $$('img[data-src]');
  if (!imgs.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    },
    { rootMargin: '200px 0px' }
  );

  imgs.forEach(img => obs.observe(img));
};

/* ─── CONTADOR ANIMADO en Sobre mí ─────────────────────────── */
const initCounters = () => {
  const datos = $$('.dato strong');
  if (!datos.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const animateNum = (el, end, suffix, duration) => {
    const start = performance.now();
    const update = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.trim();

          if (text.includes('40+')) animateNum(el, 40, '+', 1200);
          if (text.includes('20+')) animateNum(el, 20, '+', 1200);
          if (text === '3') animateNum(el, 3, '', 1800);

          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.8 }
  );

  datos.forEach(el => obs.observe(el));
};

/* ─── HOVER EN PORTFOLIO: título aparece sobre la imagen ────── */
const initPortHover = () => {
  const items = $$('.port-item');
  if (!items.length) return;

  items.forEach(item => {
    const img = item.querySelector('.port-img');
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    const h3 = item.querySelector('h3');
    overlay.textContent = h3 ? h3.textContent : '';
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      background: rgba(13,13,13,0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.5rem, 3vw, 2.5rem);
      font-weight: 300;
      color: #fafaf8;
      letter-spacing: 0.05em;
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
    `;

    img.style.position = 'relative';
    img.appendChild(overlay);

    item.addEventListener('mouseenter', () => { overlay.style.opacity = '1'; });
    item.addEventListener('mouseleave', () => { overlay.style.opacity = '0'; });
  });
};

/* ─── MENÚ DESPLEGABLE (móvil: tap para abrir/cerrar) ───────── */
const initDropdown = () => {
  const drops = $$('.nav-item-drop');
  if (!drops.length) return;

  drops.forEach(drop => {
    const trigger = drop.querySelector('.nav-link-drop');
    const menu = drop.querySelector('.nav-dropdown');
    const navMenu = $('#nav-menu');
    const toggle = $('#nav-toggle');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
      if (window.innerWidth > 768) return;
      e.preventDefault();
      const open = drop.classList.toggle('drop-open');
      trigger.setAttribute('aria-expanded', open);
    });

    menu.querySelectorAll('.nav-drop-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth > 768) return;
        drop.classList.remove('drop-open');
        trigger.setAttribute('aria-expanded', 'false');
        navMenu?.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle?.classList.remove('is-open');
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) return;
    drops.forEach(drop => {
      if (!drop.contains(e.target)) {
        drop.querySelector('.nav-link-drop')?.setAttribute('aria-expanded', 'false');
      }
    });
  });
};

/* ─── NEWSLETTER (Brevo) ────────────────────────────────────── */
const initNewsletter = () => {
  const form = $('#nl-form');
  const ok = $('#nl-ok');
  const err = $('#nl-err');
  if (!form) return;

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  form.addEventListener('submit', e => {
    const emailField = form.querySelector('#nl-email');

    if (ok) ok.hidden = true;
    if (err) err.hidden = true;

    if (!isEmail(emailField.value)) {
      e.preventDefault();
      emailField.style.color = '#e07070';
      emailField.focus();
      setTimeout(() => emailField.style.color = '', 2000);
    }
  });
};

/* ─── HERO SLIDESHOW ────────────────────────────────────────── */
const initSlideshow = () => {
  const slides = $$('.hero-slide');
  const dots = $$('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let interval = null;

  const goTo = (index) => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');

    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const next = () => goTo(current + 1);

  const start = () => {
    clearInterval(interval);
    interval = setInterval(next, 5500);
  };
  const stop = () => clearInterval(interval);

  start();

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stop();
      goTo(i);
      start();
    });
  });

  let touchX = 0;
  const hero = $('.hero');
  if (hero) {
    hero.addEventListener('touchstart', (e) => {
      touchX = e.touches[0].clientX;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      const diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        stop();
        diff > 0 ? next() : goTo(current - 1);
        start();
      }
    }, { passive: true });
  }
};

/* ─── INIT ──────────────────────────────────────────────────── */
onReady(() => {
  initDropdown();
  initSlideshow();
  initNav();
  initSmoothScroll();
  initReveal();
  initParallax();
  initBackToTop();
  initForm();
  initNewsletter();
  initCursor();
  initProgress();
  initLazyLoad();
  initCounters();
  initPortHover();

  console.log(
    '%c jmlfoto · Jose Morales ',
    'color: #fafaf8; background: #0d0d0d; font-family: serif; font-size: 13px; padding: 4px 8px; letter-spacing: 2px;'
  );
});