// Paula Schierholt — site scripts
// Progressive enhancement only. The site works without JavaScript
// (defaults to English; images remain viewable inline).

(function () {
  "use strict";

  var root = document.documentElement;

  // Always start at the top on reload (don't restore mid-page scroll) ---------
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash) window.scrollTo(0, 0);

  // Footer year --------------------------------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Language switch ----------------------------------------------------------
  var langButtons = Array.prototype.slice.call(document.querySelectorAll(".lang-btn"));

  function setLang(lang) {
    if (lang !== "de") lang = "en";
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    langButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-set-lang") === lang));
    });
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  if (langButtons.length) {
    var saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) {}
    setLang(saved === "de" ? "de" : "en");
    langButtons.forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-set-lang"));
      });
    });
  }

  // Artwork modal — click a title to show its photos, title and text --------
  var worklistBtns = Array.prototype.slice.call(document.querySelectorAll(".worklist__title"));
  if (worklistBtns.length) {
    var wm = document.createElement("div");
    wm.className = "wmodal";
    wm.setAttribute("aria-hidden", "true");
    wm.setAttribute("role", "dialog");
    wm.setAttribute("aria-modal", "true");
    wm.innerHTML =
      '<button type="button" class="wmodal__close" aria-label="Close">\u00d7</button>' +
      '<div class="wmodal__scroll"><div class="wmodal__inner">' +
        '<div class="wmodal__gallery"></div>' +
        '<div class="wmodal__meta">' +
          '<h3 class="wmodal__title"></h3>' +
          '<p class="wmodal__spec"></p>' +
          '<div class="wmodal__textwrap"></div>' +
        '</div>' +
      '</div></div>';
    document.body.appendChild(wm);

    var wmGallery = wm.querySelector(".wmodal__gallery");
    var wmTitle = wm.querySelector(".wmodal__title");
    var wmSpec = wm.querySelector(".wmodal__spec");
    var wmText = wm.querySelector(".wmodal__textwrap");
    var wmClose = wm.querySelector(".wmodal__close");
    var wmLastFocus = null;

    var READ_MORE =
      '<summary>' +
      '<span class="work__toggle-label work__toggle-label--closed"><span class="lang-en">read more</span><span class="lang-de">Mehr lesen</span></span>' +
      '<span class="work__toggle-label work__toggle-label--open"><span class="lang-en">read less</span><span class="lang-de">Weniger lesen</span></span>' +
      '</summary>';

    function wmOpen(id) {
      var data = document.getElementById(id);
      if (!data) return;
      var imgs = data.querySelectorAll(".work__gallery img");
      wmGallery.innerHTML = "";
      Array.prototype.forEach.call(imgs, function (img) {
        var el = document.createElement("img");
        el.setAttribute("src", img.getAttribute("src"));
        el.setAttribute("alt", img.getAttribute("alt") || "");
        wmGallery.appendChild(el);
      });
      wmGallery.setAttribute("data-count", String(imgs.length));

      wmTitle.textContent = data.getAttribute("data-title") || "";

      var spec = data.querySelector(".work__spec");
      if (spec) { wmSpec.innerHTML = spec.innerHTML; wmSpec.hidden = false; }
      else { wmSpec.innerHTML = ""; wmSpec.hidden = true; }

      wmText.innerHTML = "";
      var desc = data.querySelector(".work__desc");
      if (desc) {
        var det = document.createElement("details");
        det.className = "work__text";
        det.innerHTML = READ_MORE + '<div class="work__prose">' + desc.innerHTML + "</div>";
        wmText.appendChild(det);
      }

      wm.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      wmLastFocus = document.activeElement;
      wmClose.focus();
      wm.scrollTop = 0;
    }
    function wmCloseFn() {
      wm.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (wmLastFocus && wmLastFocus.focus) wmLastFocus.focus();
    }

    worklistBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { wmOpen(btn.getAttribute("data-work")); });
    });
    wm.addEventListener("click", function (e) {
      if (e.target === wm || e.target === wmClose ||
          e.target.classList.contains("wmodal__scroll") ||
          e.target.classList.contains("wmodal__inner")) wmCloseFn();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && wm.getAttribute("aria-hidden") === "false") wmCloseFn();
    });
  }

  // Hide header on scroll down, reveal on scroll up --------------------------
  var header = document.querySelector(".site-header");
  if (header) {
    var lastY = window.pageYOffset || 0;
    var ticking = false;
    function onHeaderScroll() {
      var y = window.pageYOffset || 0;
      if (y > lastY && y > header.offsetHeight) {
        header.classList.add("site-header--hidden");
      } else if (y < lastY) {
        header.classList.remove("site-header--hidden");
      }
      lastY = y <= 0 ? 0 : y;
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(onHeaderScroll); ticking = true; }
    }, { passive: true });
  }

  // Subtle parallax on scroll (respects reduced motion) ---------------------
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (parallaxEls.length && !reduceMotion) {
    var pTicking = false;
    function onParallax() {
      var mid = window.innerHeight / 2;
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var offset = (r.top + r.height / 2) - mid;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.08;
        el.style.transform = "translate3d(0," + (-offset * speed).toFixed(2) + "px, 0)";
      });
      pTicking = false;
    }
    window.addEventListener("scroll", function () {
      if (!pTicking) { requestAnimationFrame(onParallax); pTicking = true; }
    }, { passive: true });
    window.addEventListener("resize", onParallax);
    onParallax();
  }

  // Scrollspy: mark the nav link of the section currently in view -------------
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".site-nav a[href^='#']")
  );
  if (!navLinks.length || !("IntersectionObserver" in window)) return;

  var sections = navLinks
    .map(function (link) { return document.getElementById(link.getAttribute("href").slice(1)); })
    .filter(Boolean);

  function setCurrent(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach(function (section) { observer.observe(section); });
})();
