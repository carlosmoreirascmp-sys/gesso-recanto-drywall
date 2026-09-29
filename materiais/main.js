window.dataLayer = window.dataLayer || [];

document.querySelectorAll('[data-cta]').forEach(function (link) {
  link.addEventListener('click', function () {
    window.dataLayer.push({
      event: 'whatsapp_click',
      cta_position: link.getAttribute('data-cta')
    });
  });
});
