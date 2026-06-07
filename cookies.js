/**
 * jmlfoto · Gestión de cookies y consentimiento
 * Google Analytics 4: G-N0SML98Z05
 * Cumple RGPD / LOPDGDD
 */

(function () {
  'use strict';

  const GA_ID        = 'G-N0SML98Z05';
  const COOKIE_KEY   = 'jmlfoto_cookies';
  const COOKIE_DAYS  = 365;

  /* ── Utilidades de cookie ─────────────────────────────────── */
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  }

  function getCookie(name) {
    return document.cookie.split('; ').reduce((acc, part) => {
      const [k, v] = part.split('=');
      return k === name ? decodeURIComponent(v) : acc;
    }, null);
  }

  /* ── Google Analytics ─────────────────────────────────────── */
  function loadGA() {
    if (document.getElementById('ga-script')) return; // ya cargado
    const s = document.createElement('script');
    s.id    = 'ga-script';
    s.async = true;
    s.src   = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function disableGA() {
    window[`ga-disable-${GA_ID}`] = true;
    // Eliminar cookies de GA si existían
    ['_ga', `_ga_${GA_ID.replace('G-', '')}`].forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${location.hostname}`;
    });
  }

  /* ── Aplicar preferencia guardada ─────────────────────────── */
  function applyConsent(value) {
    if (value === 'accepted') {
      loadGA();
    } else {
      disableGA();
    }
  }

  /* ── Banner ───────────────────────────────────────────────── */
  function createBanner() {
    const banner = document.createElement('div');
    banner.id        = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML = `
      <div class="cb-inner">
        <div class="cb-text">
          <p class="cb-title">Cookies</p>
          <p class="cb-desc">
            Usamos cookies propias (técnicas, necesarias) y de terceros (Google Analytics)
            para analizar el tráfico de forma anónima y mejorar la web.
            Puedes consultar nuestra
            <a href="privacidad.html#cookies">política de privacidad</a>.
          </p>
        </div>
        <div class="cb-actions">
          <button id="cb-accept" class="cb-btn cb-btn--pri">Aceptar</button>
          <button id="cb-reject" class="cb-btn cb-btn--close" aria-label="Cerrar sin aceptar">✕</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Forzar reflow para que la transición funcione
    requestAnimationFrame(() => {
      requestAnimationFrame(() => banner.classList.add('cb-visible'));
    });

    document.getElementById('cb-accept').addEventListener('click', () => {
      saveAndClose(banner, 'accepted');
    });

    document.getElementById('cb-reject').addEventListener('click', () => {
      saveAndClose(banner, 'rejected');
    });
  }

  function saveAndClose(banner, value) {
    setCookie(COOKIE_KEY, value, COOKIE_DAYS);
    applyConsent(value);
    banner.classList.remove('cb-visible');
    banner.classList.add('cb-hiding');
    setTimeout(() => banner.remove(), 500);
  }

  /* ── Estilos del banner ───────────────────────────────────── */
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background: rgba(13, 13, 13, 0.97);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-top: 1px solid rgba(255,255,255,0.08);
        transform: translateY(100%);
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform;
      }

      #cookie-banner.cb-visible  { transform: translateY(0); }
      #cookie-banner.cb-hiding   { transform: translateY(100%); transition-duration: 0.4s; }

      .cb-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1.5rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        flex-wrap: wrap;
      }

      .cb-text { flex: 1; min-width: 200px; }

      .cb-title {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 1.1rem;
        font-weight: 300;
        color: #fafaf8;
        letter-spacing: 0.03em;
        margin-bottom: 0.35rem;
      }

      .cb-desc {
        font-family: 'DM Sans', system-ui, sans-serif;
        font-size: 0.8rem;
        font-weight: 300;
        color: rgba(255,255,255,0.3);
        line-height: 1.6;
        margin: 0;
      }

      .cb-desc a {
        color: rgba(255,255,255,0.65);
        border-bottom: 1px solid rgba(255,255,255,0.2);
        text-decoration: none;
        transition: color 0.2s ease, border-color 0.2s ease;
      }

      .cb-desc a:hover {
        color: #fafaf8;
        border-color: rgba(255,255,255,0.5);
      }

      .cb-actions {
        display: flex;
        gap: 0.8rem;
        flex-shrink: 0;
        flex-wrap: wrap;
      }

      .cb-btn {
        font-family: 'DM Sans', system-ui, sans-serif;
        font-size: 0.72rem;
        font-weight: 400;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 0.7rem 1.5rem;
        border-radius: 1px;
        cursor: pointer;
        transition: all 0.25s ease;
        white-space: nowrap;
        border: none;
      }

      .cb-btn--pri {
        background: #fafaf8;
        color: #0d0d0d;
      }

      .cb-btn--pri:hover {
        background: #d8d8d4;
      }

      .cb-btn--close {

        color: rgba(255,255,255,0.3);
        border: none;
        padding: 0.5rem 0.6rem;
        font-size: 0.9rem;
        letter-spacing: 0;
        line-height: 1;
      }

      .cb-btn--close:hover {
        color: rgba(255,255,255,0.7);
      }

      @media (max-width: 600px) {
        .cb-inner {
          padding: 1.2rem 1.4rem;
          gap: 1.2rem;
        }
        .cb-actions {
          width: 100%;
          justify-content: flex-end;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    const saved = getCookie(COOKIE_KEY);

    if (saved) {
      // Ya hay preferencia guardada: aplicar sin mostrar banner
      applyConsent(saved);
    } else {
      // Primera visita: inyectar estilos y mostrar banner
      injectStyles();
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBanner);
      } else {
        createBanner();
      }
    }
  }

  init();

})();
