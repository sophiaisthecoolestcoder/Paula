/* Paula wallpaper — picks the right video for the viewport and swaps on rotate.
   Why JS instead of <source media="...">: browsers evaluate <source> media
   queries once, when the element is first parsed. They do NOT re-evaluate on
   resize or device rotation, so a pure-HTML art-directed <video> gets stuck on
   whichever orientation happened to be active at load. */
(function () {
  var v = document.querySelector('[data-paula]');
  if (!v) return;

  // NB: don't "normalise" an empty base into "/" - that would make every URL
  // site-root-absolute and break both file:// and any sub-directory deploy.
  var base = v.getAttribute('data-base') || '';
  if (base && base.slice(-1) !== '/') base += '/';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn = navigator.connection || {};
  var thrifty = conn.saveData === true || /^(slow-)?2g$/.test(conn.effectiveType || '');
  var current = null;

  function pick() {
    var portrait = window.innerHeight > window.innerWidth;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var longEdge = Math.max(window.innerWidth, window.innerHeight) * dpr;
    if (portrait) return longEdge > 1500 ? 'paula-portrait-1920' : 'paula-portrait-1280';
    if (longEdge > 2200) return 'paula-landscape-1440';
    if (longEdge > 1500) return 'paula-landscape-1080';
    return 'paula-landscape-720';
  }

  function apply() {
    var name = pick();
    if (name === current) return;
    var wasAt = v.currentTime || 0;      // loop is seamless, so resuming mid-way is invisible
    current = name;
    v.poster = base + (name.indexOf('portrait') > -1 ? 'poster-port.jpg' : 'poster-land.jpg');
    if (reduce || thrifty) { v.removeAttribute('src'); v.load(); return; }
    v.innerHTML =
      '<source src="' + base + name + '.webm" type="video/webm">' +
      '<source src="' + base + name + '.mp4"  type="video/mp4">';
    v.load();
    v.addEventListener('error', function () {
      console.warn('[paula] could not load ' + base + name + ' - check data-base');
    }, true);
    v.addEventListener('loadedmetadata', function once () {
      v.removeEventListener('loadedmetadata', once);
      if (wasAt && isFinite(v.duration)) v.currentTime = wasAt % v.duration;
      if (onScreen) play();
    });
  }

  function play() {
    var p = v.play();
    if (p && p.catch) p.catch(function () {});   // autoplay blocked -> poster stays
  }

  // Mobile browsers change the viewport HEIGHT whenever the address bar
  // collapses or expands during a scroll. Re-picking on that swapped the video
  // between the 1280 and 1920 files mid-scroll and reloaded it, which is a
  // visible stall. Only a change of width or orientation is a reason to switch.
  var t;
  var lastW = window.innerWidth;
  var lastPortrait = window.innerHeight > window.innerWidth;
  function debounced() {
    clearTimeout(t);
    t = setTimeout(function () {
      var w = window.innerWidth, portrait = window.innerHeight > w;
      if (w === lastW && portrait === lastPortrait) return;
      lastW = w; lastPortrait = portrait;
      apply();
    }, 250);
  }
  window.addEventListener('resize', debounced);
  window.addEventListener('orientationchange', debounced);

  // Decode only while the cover is on screen. A looping video decoding behind
  // the rest of the page costs every scroll frame on a phone, for nothing.
  var onScreen = true;
  var coverObserver = null;   // kept referenced so it is never collected
  if ('IntersectionObserver' in window) {
    coverObserver = new IntersectionObserver(function (entries) {
      onScreen = entries[entries.length - 1].isIntersecting;
      if (!v.currentSrc && !v.querySelector('source')) return;
      if (onScreen) play(); else v.pause();
    });
    coverObserver.observe(v.parentNode);
  }
  apply();
})();
