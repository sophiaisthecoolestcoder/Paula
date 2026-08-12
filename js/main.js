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

  // Lightbox for artwork images ----------------------------------------------
  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".work__figure img"));
  if (thumbs.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("aria-hidden", "true");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Close">×</button>' +
      '<img class="lightbox__img" alt="" />';
    document.body.appendChild(box);

    var boxImg = box.querySelector(".lightbox__img");
    var closeBtn = box.querySelector(".lightbox__close");
    var lastFocused = null;

    function openBox(src, alt) {
      boxImg.setAttribute("src", src);
      boxImg.setAttribute("alt", alt || "");
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

    thumbs.forEach(function (img) {
      img.setAttribute("role", "button");
      img.setAttribute("tabindex", "0");
      img.addEventListener("click", function () {
        openBox(img.currentSrc || img.src, img.getAttribute("alt"));
      });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openBox(img.currentSrc || img.src, img.getAttribute("alt"));
        }
      });
    });

    box.addEventListener("click", function (e) {
      if (e.target === box || e.target === closeBtn) closeBox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.getAttribute("aria-hidden") === "false") closeBox();
    });
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
