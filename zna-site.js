/* ZNA shared behaviour for inner pages: mobile nav + chat widget */
(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  var backdrop = document.getElementById('navBackdrop');
  if (toggle && nav && backdrop) {
    var close = function () {
      nav.classList.remove('open');
      backdrop.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      backdrop.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    backdrop.addEventListener('click', close);
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  }

  /* Chat widget (same n8n webhook as the homepage) */
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
  document.head.appendChild(css);
  import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js').then(function (m) {
    m.createChat({
      webhookUrl: 'https://arslanshahid.app.n8n.cloud/webhook/2553bd94-ae49-4f12-aad7-83d14ff91ef4/chat',
      mode: 'window',
      showWelcomeScreen: false,
      initialMessages: ['Hi there! 👋', 'Welcome to ZNA Digital Accountants. How can we help you today?'],
      i18n: { en: {
        title: 'ZNA Digital Accountants',
        subtitle: "We're here to help with your accounting & bookkeeping.",
        inputPlaceholder: 'Type your message…',
        getStarted: 'New Conversation',
        footer: ''
      } }
    });
  }).catch(function () { /* chat is optional */ });
})();
