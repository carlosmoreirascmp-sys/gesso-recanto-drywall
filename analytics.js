// Shared GA4 measurement. Keep the imported LP event names stable in Google Ads.
(function () {
  'use strict';
  if (window.__gessoMeasurementInitialized) return;
  window.__gessoMeasurementInitialized = true;

  var path = window.location.pathname;
  var host = window.location.hostname;
  var lp = /^materiaiscompletosdrywall\./.test(host) || /^\/materiais(?:-drywall|\/|$)/.test(path)
    ? 'lp_materiais_drywall'
    : /^obra-drywall\./.test(host) || /^\/drywall(?:\/|$)/.test(path)
      ? 'lp_obra_drywall'
      : /^gessos\./.test(host) || /^\/gessos?(?:\/|$)/.test(path)
        ? 'lp_gesso' : 'lp_principal';
  var debug = new URLSearchParams(window.location.search).has('ga_debug');

  function send(name, details) {
    if (typeof window.gtag !== 'function') return;
    var params = Object.assign({ send_to: 'G-TDSTXCR8LR', lp_name: lp, page_path: path }, details);
    if (debug) params.debug_mode = true;
    window.gtag('event', name + '_' + lp, params);
  }

  function typeOf(url) {
    if (/^(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)$/i.test(url.hostname)) return 'click_whatsapp';
    if (url.protocol === 'tel:') return 'click_phone';
    if (/^(maps\.google\.com|maps\.app\.goo\.gl)$/i.test(url.hostname) ||
        (/(^|\.)google\.[a-z.]+$/i.test(url.hostname) && /^\/maps(?:\/|$)/.test(url.pathname)) ||
        (url.hostname === 'goo.gl' && /^\/maps(?:\/|$)/.test(url.pathname))) return 'click_maps';
    if (url.origin === window.location.origin && /^\/(drywall|gesso|materiais-drywall)\/?$/.test(url.pathname) && url.pathname !== path) return 'click_service_page';
    return null;
  }

  var lastLink = null;
  var lastClickAt = 0;
  function onLink(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var url;
    try { url = new URL(link.href, window.location.href); } catch (_) { return; }
    var type = typeOf(url);
    if (!type) return;
    var now = Date.now();
    if (lastLink === link && now - lastClickAt < 400) return;
    lastLink = link;
    lastClickAt = now;
    var links = Array.from(document.querySelectorAll('a[href]')).filter(function (item) {
      try { return typeOf(new URL(item.href, window.location.href)) === type; } catch (_) { return false; }
    });
    var params = {
      cta_location: link.dataset.cta || link.dataset.location || type + '_' + (links.indexOf(link) + 1),
      link_domain: url.hostname,
      lead_intent: link.dataset.message || undefined,
      transport_type: 'beacon'
    };
    // No WhatsApp message text or phone number is copied into event parameters.
    if (type === 'click_service_page') params.destination_path = url.pathname;
    send(type, params);
  }
  document.addEventListener('click', onLink);
  document.addEventListener('auxclick', onLink);

  var sentScroll = {};
  var scheduled = false;
  function checkScroll() {
    scheduled = false;
    var height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    if (height <= window.innerHeight) return;
    var reached = (window.scrollY + window.innerHeight) / height * 100;
    [50, 90].forEach(function (percent) {
      if (!sentScroll[percent] && reached >= percent) {
        sentScroll[percent] = true;
        send('scroll_' + percent, { percent_scrolled: percent });
      }
    });
  }
  function scheduleScroll() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(checkScroll);
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll);
  window.addEventListener('load', scheduleScroll);
  scheduleScroll();

  document.addEventListener('toggle', function (event) {
    var details = event.target;
    if (details.tagName !== 'DETAILS' || !details.open || details.closest('header,nav')) return;
    var summary = details.querySelector('summary');
    if (summary) send('faq_open', { question: summary.textContent.trim().slice(0, 100) });
  }, true);

  var played = new WeakSet();
  document.addEventListener('play', function (event) {
    var video = event.target;
    if (video.tagName !== 'VIDEO' || video.autoplay || video.loop || played.has(video)) return;
    played.add(video);
    var mediaPath;
    try { mediaPath = new URL(video.currentSrc || video.src, window.location.href).pathname; } catch (_) { return; }
    send('video_start', { media_name: mediaPath.split('/').pop() });
  }, true);
})();
