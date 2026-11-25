// Ticking timer on the hero board (the time-tracking card is "live").
(function () {
  var el = document.getElementById('timer');
  if (!el) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var secs = 3 * 3600 + 42 * 60 + 17;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function draw() {
    el.textContent = pad(Math.floor(secs / 3600)) + ':' + pad(Math.floor(secs / 60) % 60) + ':' + pad(secs % 60);
  }
  if (!reduce) setInterval(function () { secs++; draw(); }, 1000);
})();

// Hide art pictures that aren't uploaded yet; hide the whole section if none are.
(function () {
  var strip = document.getElementById('art-strip');
  if (!strip) return;
  var imgs = strip.querySelectorAll('img');
  var pending = imgs.length, loaded = 0;
  function settle() {
    if (--pending === 0 && loaded === 0) document.getElementById('offclock').hidden = true;
  }
  imgs.forEach(function (img) {
    function ok() { loaded++; settle(); }
    function bad() { img.closest('figure').remove(); settle(); }
    if (img.complete) { img.naturalWidth ? ok() : bad(); }
    else { img.addEventListener('load', ok); img.addEventListener('error', bad); }
    img.loading = 'eager';
  });
})();

// Hide the CV button until the PDF is uploaded.
(function () {
  var btn = document.getElementById('cv-btn');
  if (!btn || location.protocol === 'file:') return;
  fetch(btn.getAttribute('href'), { method: 'HEAD' })
    .then(function (r) { if (!r.ok) btn.remove(); })
    .catch(function () { btn.remove(); });
})();
