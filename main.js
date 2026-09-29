// GA4: um fluxo para as três LPs; eventos separados pelo sufixo da página.
(function () {
  var host = window.location.hostname;
  var lp = host.indexOf('materiaiscompletosdrywall.') === 0 || window.location.pathname.indexOf('/materiais') === 0
    ? 'lp_materiais_drywall'
    : host.indexOf('obra-drywall.') === 0
      ? 'lp_obra_drywall'
      : 'lp_gesso';
  var debug = new URLSearchParams(window.location.search).has('ga_debug');

  function sendEvent(name, details) {
    if (typeof window.gtag !== 'function') return;
    var parameters = Object.assign({ lp_name: lp }, details);
    if (debug) parameters.debug_mode = true;
    window.gtag('event', name + '_' + lp, parameters);
  }

  function linkType(url) {
    if (/^(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)$/i.test(url.hostname)) return 'click_whatsapp';
    if (url.hostname === 'maps.google.com' ||
        (/(^|\.)google\.[a-z.]+$/i.test(url.hostname) && url.pathname.indexOf('/maps') === 0) ||
        (url.hostname === 'goo.gl' && url.pathname.indexOf('/maps') === 0)) return 'click_maps';
    return null;
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var url;
    try { url = new URL(link.href); } catch (_) { return; }
    var type = linkType(url);
    if (!type) return;
    var matchingLinks = Array.from(document.querySelectorAll('a[href]')).filter(function (item) {
      try { return linkType(new URL(item.href)) === type; } catch (_) { return false; }
    });
    sendEvent(type, {
      cta_location: link.dataset.cta || link.dataset.location || (type + '_' + (matchingLinks.indexOf(link) + 1)),
      link_domain: url.hostname,
      lead_intent: link.dataset.message || undefined
    });
  });

  var sent50 = false;
  var sent90 = false;
  var scheduled = false;

  function checkScroll() {
    scheduled = false;
    var height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    if (!height) return;
    var reached = (window.scrollY + window.innerHeight) / height * 100;
    if (!sent50 && reached >= 50) {
      sent50 = true;
      sendEvent('scroll_50', { percent_scrolled: 50 });
    }
    if (!sent90 && reached >= 90) {
      sent90 = true;
      sendEvent('scroll_90', { percent_scrolled: 90 });
    }
  }

  function scheduleScrollCheck() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(checkScroll);
  }

  window.addEventListener('scroll', scheduleScrollCheck, { passive: true });
  window.addEventListener('resize', scheduleScrollCheck);
  window.addEventListener('load', scheduleScrollCheck);
  scheduleScrollCheck();
})();
