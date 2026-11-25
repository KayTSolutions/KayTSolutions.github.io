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

// Email links open a small panel: copy the address, or write in Gmail, Outlook or the mail app.
(function () {
  var links = document.querySelectorAll('a[href^="mailto:"]');
  if (!links.length || !window.HTMLDialogElement) return;

  var dlg = document.createElement('dialog');
  dlg.className = 'mail-dialog';
  dlg.innerHTML =
    '<form method="dialog" class="mail-close"><button aria-label="Close">×</button></form>' +
    '<h2>Email me</h2>' +
    '<p class="mail-addr"></p>' +
    '<div class="mail-actions">' +
      '<button type="button" class="btn primary mail-copy">Copy address</button>' +
      '<a class="btn ghost mail-gmail" target="_blank" rel="noopener">Write in Gmail</a>' +
      '<a class="btn ghost mail-outlook" target="_blank" rel="noopener">Write in Outlook</a>' +
      '<a class="btn ghost mail-app">Open my email app</a>' +
    '</div>';
  document.body.appendChild(dlg);

  var copyBtn = dlg.querySelector('.mail-copy');
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var href = a.getAttribute('href');
      var addr = href.slice(7).split('?')[0];
      var subject = (href.match(/[?&]subject=([^&]*)/) || [])[1] || '';
      var subj = decodeURIComponent(subject);
      dlg.querySelector('h2').textContent = subj.indexOf('Consultation') === 0 ? 'Book a free consultation' : 'Email me';
      dlg.querySelector('.mail-addr').textContent = addr;
      dlg.querySelector('.mail-gmail').href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + addr + '&su=' + subject;
      dlg.querySelector('.mail-outlook').href = 'https://outlook.live.com/mail/0/deeplink/compose?to=' + addr + '&subject=' + subject;
      dlg.querySelector('.mail-app').href = href;
      copyBtn.textContent = 'Copy address';
      copyBtn.onclick = function () {
        var done = function () { copyBtn.textContent = 'Copied'; };
        if (navigator.clipboard) navigator.clipboard.writeText(addr).then(done, function () { selectAddr(); });
        else selectAddr();
      };
      dlg.showModal();
    });
  });

  function selectAddr() {
    var r = document.createRange(); r.selectNodeContents(dlg.querySelector('.mail-addr'));
    var s = getSelection(); s.removeAllRanges(); s.addRange(r);
    copyBtn.textContent = 'Press Ctrl+C to copy';
  }
})();
