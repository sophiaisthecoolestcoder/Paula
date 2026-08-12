// Paula Schierholt — site scripts
// Progressive enhancement only. The site works without JavaScript
// (defaults to English; images remain viewable inline).

(function () {
  "use strict";

  var root = document.documentElement;

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

  // Lightbox for artwork images (with prev/next) -----------------------------
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".work__figure img"));
  if (thumbs.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("aria-hidden", "true");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML =
      '<button type="button" class="lightbox__nav lightbox__prev" aria-label="Previous image">‹</button>' +
      '<img class="lightbox__img" alt="" />' +
      '<button type="button" class="lightbox__nav lightbox__next" aria-label="Next image">›</button>' +
      '<button type="button" class="lightbox__close" aria-label="Close">×</button>';
    document.body.appendChild(box);

    var boxImg = box.querySelector(".lightbox__img");
    var closeBtn = box.querySelector(".lightbox__close");
    var prevBtn = box.querySelector(".lightbox__prev");
    var nextBtn = box.querySelector(".lightbox__next");
    var lastFocused = null;

    // Group images by their work — prev/next stays within a single work.
    var group = [];   // current work's images
    var current = 0;

    function show(i) {
      current = (i + group.length) % group.length;
      var img = group[current];
      boxImg.setAttribute("src", img.currentSrc || img.src);
      boxImg.setAttribute("alt", img.getAttribute("alt") || "");
    }
    function openBox(imgs, i) {
      group = imgs;
      var multi = group.length > 1;
      prevBtn.style.display = multi ? "" : "none";
      nextBtn.style.display = multi ? "" : "none";
      show(i);
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lastFocused = document.activeElement;
      closeBtn.focus();
    }
    function closeBox() {
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      boxImg.setAttribute("src", "");
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    Array.prototype.slice.call(document.querySelectorAll(".work")).forEach(function (work) {
      var imgs = Array.prototype.slice.call(work.querySelectorAll(".work__figure img"));
      imgs.forEach(function (img, i) {
        img.setAttribute("role", "button");
        img.setAttribute("tabindex", "0");
        img.addEventListener("click", function () { openBox(imgs, i); });
        img.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBox(imgs, i); }
        });
      });
    });

    prevBtn.addEventListener("click", function (e) { e.stopPropagation(); show(current - 1); });
    nextBtn.addEventListener("click", function (e) { e.stopPropagation(); show(current + 1); });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target === closeBtn) closeBox();
    });
    document.addEventListener("keydown", function (e) {
      if (box.getAttribute("aria-hidden") !== "false") return;
      if (e.key === "Escape") closeBox();
      else if (e.key === "ArrowLeft" && group.length > 1) show(current - 1);
      else if (e.key === "ArrowRight" && group.length > 1) show(current + 1);
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
