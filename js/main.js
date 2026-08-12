// Paula Schierholt — site scripts
// Progressive enhancement only. The site works fully without JavaScript.

(function () {
  "use strict";

  // Footer year --------------------------------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Scrollspy: mark the nav link of the section currently in view ------------
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".site-nav a[href^='#']")
  );
  if (!navLinks.length || !("IntersectionObserver" in window)) return;

  var linkFor = {};
  navLinks.forEach(function (link) {
    linkFor[link.getAttribute("href").slice(1)] = link;
  });

  var sections = navLinks
    .map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  function setCurrent(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
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

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
