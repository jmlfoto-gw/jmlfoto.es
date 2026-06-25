/* ============================================================
   i18n.js — Sistema de traducción trilingüe · jmlfoto.es
   ES · FR · EN
   ============================================================ */

(function () {
  'use strict';

  const LANGS       = ['es', 'fr', 'en'];
  const DEFAULT     = 'es';
  const STORAGE_KEY = 'jml-lang';

  /* ── 1. Detectar idioma inicial ─────────────────────────── */
  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGS.includes(stored)) return stored;
    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    if (browser === 'fr') return 'fr';
    if (browser === 'en') return 'en';
    return DEFAULT;
  }

  /* ── 2. Acceso a claves anidadas "a.b.c" ────────────────── */
  function getVal(obj, key) {
    return key.split('.').reduce(
      (acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj
    );
  }

  /* ── 3. Aplicar traducciones al DOM ─────────────────────── */
  function applyTranslations(lang) {
    const t = window.JML_TRANSLATIONS && window.JML_TRANSLATIONS[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = getVal(t, el.dataset.i18n);
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const val = getVal(t, el.dataset.i18nHtml);
      if (val !== undefined) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const val = getVal(t, el.dataset.i18nPlaceholder);
      if (val !== undefined) el.placeholder = val;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const val = getVal(t, el.dataset.i18nAria);
      if (val !== undefined) el.setAttribute('aria-label', val);
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const val = getVal(t, el.dataset.i18nAlt);
      if (val !== undefined) el.alt = val;
    });
  }

  /* ── 4. Actualizar botones activos ──────────────────────── */
  function updateSwitcher(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('lang-btn--active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  /* ── 5. Cambiar idioma ──────────────────────────────────── */
  function setLang(lang) {
    if (!LANGS.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    applyTranslations(lang);
    updateSwitcher(lang);
    document.dispatchEvent(new CustomEvent('jml:langchange', { detail: { lang } }));
  }

  /* ── 6. Construir e inyectar el selector ────────────────── */
  function buildSwitcher() {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;

    /* Si ya existen botones (HTML estático), solo conectar eventos */
    if (navMenu.querySelector('.lang-btn')) {
      navMenu.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLang(btn.dataset.lang));
      });
      return;
    }

    const li = document.createElement('li');
    li.className = 'lang-switcher';
    li.setAttribute('aria-label', 'Seleccionar idioma');
    /* Usamos <a> en lugar de <button> para evitar estilos del SO en Safari/Chrome */
    li.innerHTML =
      '<a class="lang-btn" data-lang="es" role="button" aria-pressed="false" title="Español" href="#" tabindex="0">ES</a>' +
      '<span class="lang-sep" aria-hidden="true">·</span>' +
      '<a class="lang-btn" data-lang="fr" role="button" aria-pressed="false" title="Français" href="#" tabindex="0">FR</a>' +
      '<span class="lang-sep" aria-hidden="true">·</span>' +
      '<a class="lang-btn" data-lang="en" role="button" aria-pressed="false" title="English" href="#" tabindex="0">EN</a>';

    /* Añadir al final — después de "Contacto" */
    navMenu.appendChild(li);

    li.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setLang(btn.dataset.lang);
      });
    });
  }

  /* ── 7. Init ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    buildSwitcher();
    setLang(detectLang());
  });

  window.JML_I18N = { setLang, detectLang };

})();
