/*
 * ZNA cookie consent
 * - Google Analytics (G-RH70SK2784) is NOT loaded until the visitor accepts.
 * - The choice is remembered in localStorage for 12 months, then asked again.
 * - Any element with data-cookie-settings reopens the banner (used in the footer).
 * Include on every page:  <script src="cookie-consent.js" defer></script>
 */
(function () {
  'use strict';

  var GA_ID = 'G-RH70SK2784';
  var KEY = 'zna_cookie_consent';
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
  var banner = null;

  function readChoice() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && raw.t && Date.now() - raw.t < MAX_AGE_MS && (raw.v === 'accepted' || raw.v === 'rejected')) {
        return raw.v;
      }
    } catch (e) {}
    return null;
  }

  function saveChoice(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }

  function loadAnalytics() {
    window['ga-disable-' + GA_ID] = false;
    if (window.__znaGaLoaded) return;
    window.__znaGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function removeAnalytics() {
    window['ga-disable-' + GA_ID] = true;
    var host = location.hostname;
    var parts = host.split('.');
    var root = parts.length > 2 ? parts.slice(-2).join('.') : host;
    var domains = ['', host, '.' + host, root, '.' + root];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        domains.forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  function injectStyles() {
    if (document.getElementById('zna-cookie-css')) return;
    var css = document.createElement('style');
    css.id = 'zna-cookie-css';
    css.textContent =
      '.zna-cookie{position:fixed;left:16px;bottom:16px;z-index:200;width:min(440px,calc(100% - 32px));' +
      'background:#fff;color:#0B1F3F;border:1px solid #D9E0EA;border-radius:10px;padding:20px 22px;' +
      'box-shadow:0 24px 48px -20px rgba(11,31,63,.45);font-family:"Public Sans",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;' +
      'font-size:15px;line-height:1.5}' +
      '.zna-cookie h2{margin:0 0 6px;font-family:"Source Serif 4",Georgia,serif;font-weight:600;font-size:1.1rem}' +
      '.zna-cookie p{margin:0 0 10px;color:#40506A}' +
      '.zna-cookie a{color:#08605C}' +
      '.zna-cookie-actions{display:flex;gap:10px;margin-top:14px}' +
      '.zna-cookie button{flex:1;font:inherit;font-weight:600;font-size:15px;padding:12px 14px;border-radius:6px;' +
      'border:2px solid transparent;cursor:pointer;color:#fff}' +
      '.zna-cookie .zna-accept{background:#0B7A75}.zna-cookie .zna-accept:hover{background:#08605C}' +
      '.zna-cookie .zna-reject{background:#0B1F3F}.zna-cookie .zna-reject:hover{background:#08172F}' +
      '.zna-cookie button:focus-visible{outline:3px solid #E0A526;outline-offset:3px}' +
      '.zna-cookie .zna-small{font-size:13.5px}' +
      '@media (max-width:520px){.zna-cookie{left:12px;right:12px;bottom:12px;width:auto;padding:16px 16px 14px;font-size:14.5px}' +
      '.zna-cookie h2{font-size:1.02rem}.zna-cookie-actions{margin-top:10px}.zna-cookie button{font-size:14.5px;padding:11px 8px}}';
    document.head.appendChild(css);
  }

  function hideBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }

  function choose(v) {
    saveChoice(v);
    if (v === 'accepted') loadAnalytics(); else removeAnalytics();
    hideBanner();
  }

  function showBanner() {
    if (banner) return;
    injectStyles();
    banner = document.createElement('div');
    banner.className = 'zna-cookie';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'zna-cookie-title');
    banner.innerHTML =
      '<h2 id="zna-cookie-title">Cookies on this site</h2>' +
      '<p>We use Google Analytics cookies to see which pages are useful. They stay off unless you accept.</p>' +
      '<p class="zna-small">The chat window also saves a session ID so a conversation can continue. <a href="privacy.html">Privacy Policy</a></p>' +
      '<div class="zna-cookie-actions">' +
      '<button type="button" class="zna-accept">Accept analytics</button>' +
      '<button type="button" class="zna-reject">Reject analytics</button>' +
      '</div>';
    banner.querySelector('.zna-accept').addEventListener('click', function () { choose('accepted'); });
    banner.querySelector('.zna-reject').addEventListener('click', function () { choose('rejected'); });
    document.body.appendChild(banner);
  }

  function init() {
    var choice = readChoice();
    if (choice === 'accepted') loadAnalytics();
    else if (choice === null) showBanner();
    document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    });
  }

  window.znaCookieSettings = showBanner;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
