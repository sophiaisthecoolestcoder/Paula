// Paula Schierholt — site scripts
// Progressive enhancement only. The site works without JavaScript
// (defaults to English; images remain viewable inline).

(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReducedMotion = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Always start at the top on reload (don't restore mid-page scroll) ---------
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash) window.scrollTo(0, 0);

  // Icons --------------------------------------------------------------------
  // One family: 24-unit grid, stroke 1.25 CSS px at every size (non-scaling),
  // fill none, currentColor, round caps and joins. Five paths, no library.
  // Stroke weight is never scaled with the icon — see docs/DESIGN-SYSTEM.md §7.
  // ONE rendered size for every arrow and control on the site. Not a scale.
  // An earlier build used 14 / 18 / 20 as an "optical size scale"; in the modal
  // that put a 20px prev/next directly beside a 14px disclosure chevron, 43%
  // apart, which is precisely what reads as inconsistent. Consistency here
  // means one number.
  var ICON_SIZE = 18;

  var ICON = {
    prev: "M15 5l-7 7 7 7",
    next: "M9 5l7 7-7 7",
    down: "M5 9l7 7 7-7",
    close: "M6 6l12 12M18 6L6 18",
    menu: "M5 8.5h14M5 15.5h14"
  };

  function icon(name, extraClass) {
    return '<svg class="icon' + (extraClass ? " " + extraClass : "") + '"' +
           ' viewBox="0 0 24 24" width="' + ICON_SIZE + '" height="' + ICON_SIZE + '"' +
           ' aria-hidden="true" focusable="false"><path d="' + ICON[name] + '"/></svg>';
  }

  // Accessible names have to carry both languages, and aria-label cannot.
  // A visually hidden span can, and the CSS language toggle handles it.
  function label(en, de) {
    return '<span class="vh"><span class="lang-en">' + en + '</span>' +
           '<span class="lang-de">' + de + '</span></span>';
  }

  // Footer year --------------------------------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Language switch ----------------------------------------------------------
  var langButtons = Array.prototype.slice.call(document.querySelectorAll(".lang-btn"));

  // Apply a language to the document. Deliberately does NOT write to storage.
  function applyLang(lang) {
    if (lang !== "de") lang = "en";
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    langButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-set-lang") === lang));
    });
  }

  // Remember the choice only when the visitor actively makes one. Writing on
  // page load would place a value on the device that nobody asked for; the
  // "strictly necessary" exemption in § 25 Abs. 2 Nr. 2 TDDDG only covers
  // storage needed for a service the user has explicitly requested.
  function chooseLang(lang) {
    applyLang(lang);
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  if (langButtons.length) {
    var saved = null;
    try { saved = localStorage.getItem("lang"); } catch (e) {}
    applyLang(saved === "de" ? "de" : "en");
    langButtons.forEach(function (b) {
      b.addEventListener("click", function () {
        chooseLang(b.getAttribute("data-set-lang"));
      });
    });
  }

  // Header wordmark — revealed once the cover has left the view ---------------
  // Hidden with opacity + visibility only. Both keep the grid column at full
  // width, so the centre column (and therefore .site-nav) stays centred on the
  // viewport in both states. Anything that collapses the column would shift
  // the nav sideways when the name appears.
  // Scoped to pages that have a cover; the legal pages keep it visible.
  var brand = document.querySelector(".site-title");
  var coverEl = document.querySelector(".cover");

  if (brand && coverEl && "IntersectionObserver" in window) {
    var setBrandHidden = function (hidden) {
      brand.classList.toggle("site-title--hidden", hidden);
      // visibility:hidden already removes it from the tab order and the
      // accessibility tree; these make that explicit and survive a future
      // change to the hiding mechanism.
      if (hidden) {
        brand.setAttribute("tabindex", "-1");
        brand.setAttribute("aria-hidden", "true");
      } else {
        brand.removeAttribute("tabindex");
        brand.removeAttribute("aria-hidden");
      }
    };

    // Suppress the transition for the first frame so the page does not open
    // with the wordmark fading out.
    brand.classList.add("site-title--instant");
    setBrandHidden(true);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        brand.classList.remove("site-title--instant");
      });
    });

    // Keep a reference. An IntersectionObserver with no strong reference can be
    // collected even while it has an observation target — it then fires once
    // and never again, and the wordmark stops responding to scroll.
    var coverObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        setBrandHidden(entry.intersectionRatio > 0.25);
      });
    }, { threshold: [0, 0.25, 1] });
    coverObserver.observe(coverEl);
  }

  // Artwork modal — click a title to show its photos, title and text --------
  var worklistBtns = Array.prototype.slice.call(document.querySelectorAll(".worklist__title"));
  if (worklistBtns.length) {
    // Ordered ids so prev/next can move between artworks inside the modal.
    var workIds = worklistBtns.map(function (b) { return b.getAttribute("data-work"); });
    var wmIndex = 0;
    var wm = document.createElement("div");
    wm.className = "wmodal";
    wm.setAttribute("aria-hidden", "true");
    wm.setAttribute("role", "dialog");
    wm.setAttribute("aria-modal", "true");
    // Focus target on open. Focusing the dialog itself rather than its close
    // button is the standard pattern: the dialog is announced as a whole, and
    // a programmatically focused tabindex="-1" container does not match
    // :focus-visible, so no focus ring is painted on a control the visitor
    // never chose. Tab then reaches the close button first, as it should.
    wm.setAttribute("tabindex", "-1");
    wm.innerHTML =
      '<button type="button" class="control wmodal__close">' +
        icon("close") + label("Close", "Schließen") +
      '</button>' +
      '<div class="wmodal__scroll"><div class="wmodal__inner">' +
        '<div class="wmodal__gallery"></div>' +
        '<div class="wmodal__meta">' +
          '<h3 class="wmodal__title"></h3>' +
          '<p class="wmodal__spec"></p>' +
          '<div class="wmodal__pager">' +
            '<button type="button" class="control wmodal__prev">' +
              icon("prev") + label("Previous artwork", "Vorheriges Werk") +
            '</button>' +
            '<span class="wmodal__count"></span>' +
            '<button type="button" class="control wmodal__next">' +
              icon("next") + label("Next artwork", "Nächstes Werk") +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="wmodal__textwrap"></div>' +
      '</div></div>';
    document.body.appendChild(wm);

    var wmGallery = wm.querySelector(".wmodal__gallery");
    var wmTitle = wm.querySelector(".wmodal__title");
    var wmSpec = wm.querySelector(".wmodal__spec");
    var wmText = wm.querySelector(".wmodal__textwrap");
    var wmClose = wm.querySelector(".wmodal__close");
    var wmPager = wm.querySelector(".wmodal__pager");
    var wmPrev = wm.querySelector(".wmodal__prev");
    var wmNext = wm.querySelector(".wmodal__next");
    var wmCount = wm.querySelector(".wmodal__count");
    var wmScroll = wm.querySelector(".wmodal__scroll");
    var wmLastFocus = null;

    // Only offer prev/next when there is more than one artwork.
    if (workIds.length < 2) wmPager.hidden = true;

    // A button + region rather than <details>: a closed <details> does not
    // render its content, so its opening cannot be transitioned portably.
    var PROSE_ID = "wmodal-prose";

    // The reveal and the scroll are ONE motion, started on the same frame as
    // the click.
    //
    // Three faults were fixed here in turn. First the scroll fired 90ms into
    // the height animation and moved the modal 233px while it was still
    // growing — two animations fighting. Sequencing it behind `transitionend`
    // cured the fight but introduced a ~0.7s dead pause. Slaving it to the
    // unfold with a per-frame rAF loop removed the pause but read
    // getBoundingClientRect() twice AND wrote scrollTop on every frame, while
    // the panel's height was itself animating: a forced synchronous layout per
    // frame — layout thrashing, and the remaining stutter.
    //
    // The fix is to READ NOTHING INSIDE THE LOOP. The panel's final height is
    // known before it starts growing (the content's scrollHeight), so the
    // target scroll position can be computed once, up front. The loop then
    // only writes, stepping scrollTop along the SAME curve and duration as the
    // CSS unfold, so the two stay locked together without ever measuring.
    var REVEAL_MS = 700;
    var REVEAL_EASE = [0.16, 1, 0.3, 1];   // must match the CSS transition

    // Exact cubic-bezier(p1x, p1y, p2x, p2y) evaluation, so the scroll follows
    // the identical curve to the height. Newton-Raphson, falling back to
    // bisection — the standard solve, kept short.
    function bezier(p1x, p1y, p2x, p2y) {
      function A(a, b) { return 1 - 3 * b + 3 * a; }
      function B(a, b) { return 3 * b - 6 * a; }
      function C(a) { return 3 * a; }
      function calc(t, a, b) { return ((A(a, b) * t + B(a, b)) * t + C(a)) * t; }
      function slope(t, a, b) { return 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a); }
      return function (x) {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        var t = x;
        for (var i = 0; i < 8; i++) {
          var d = slope(t, p1x, p2x);
          if (d === 0) break;
          var err = calc(t, p1x, p2x) - x;
          if (Math.abs(err) < 1e-5) break;
          t -= err / d;
        }
        t = Math.max(0, Math.min(1, t));
        return calc(t, p1y, p2y);
      };
    }
    var easeReveal = bezier(REVEAL_EASE[0], REVEAL_EASE[1], REVEAL_EASE[2], REVEAL_EASE[3]);

    function followReveal(reveal) {
      // The one and only measurement, taken before the panel starts growing.
      var inner = reveal.firstElementChild;
      var grows = inner ? inner.scrollHeight : 0;
      var modalBox = wm.getBoundingClientRect();
      var revealBox = reveal.getBoundingClientRect();
      // Where the panel's bottom edge will sit once it has finished opening.
      var endsAt = revealBox.bottom + grows - modalBox.bottom + 24;   // + air below
      var from = wm.scrollTop;
      var max = wm.scrollHeight + grows - wm.clientHeight;
      var to = Math.min(from + Math.max(0, endsAt), Math.max(from, max));
      if (to <= from) return;

      if (prefersReducedMotion) { wm.scrollTop = to; return; }

      var previous = wm.style.scrollBehavior;
      wm.style.scrollBehavior = "auto";   // or every write queues its own animation
      var started = null;
      function step(now) {
        if (started === null) started = now;
        var p = Math.min(1, (now - started) / REVEAL_MS);
        wm.scrollTop = from + (to - from) * easeReveal(p);   // write only, never read
        if (p < 1) requestAnimationFrame(step);
        else wm.style.scrollBehavior = previous;
      }
      requestAnimationFrame(step);
    }

    // Publish the rendered extent of the photographs as --gallery-w.
    //
    // This used to be called synchronously straight after the images were
    // inserted, with a `load` listener added ONLY for images that were not yet
    // complete. Cached images are complete on insertion, so they got no
    // listener — and the synchronous call could run before the browser had
    // laid the new <img> elements out, measuring 0 and REMOVING --gallery-w.
    // The prose then fell back to its narrow default. It made the width depend
    // on cache state and navigation order: whichever artwork you opened second
    // rendered narrow, which is why Deepfake Diaries looked untouched while
    // Fiction — identical markup, identical image dimensions — did not.
    //
    // Now the measurement never runs before layout, and a ResizeObserver keeps
    // it true afterwards regardless of how the images arrive. A measurement
    // that reads 0 is discarded rather than published, so a bad frame can
    // never clear a good value.
    function measureGallery() {
      var imgs = wmGallery.querySelectorAll("img");
      var left = Infinity, right = -Infinity;
      Array.prototype.forEach.call(imgs, function (im) {
        var b = im.getBoundingClientRect();
        if (b.width > 0) { left = Math.min(left, b.left); right = Math.max(right, b.right); }
      });
      if (right > left) wm.style.setProperty("--gallery-w", (right - left) + "px");
      // else: leave the last good value in place — never clear it on a 0 read.
    }

    // Always measure after layout has settled, never in the same tick as the
    // DOM write that created the images.
    function measureGalleryDeferred() {
      requestAnimationFrame(function () { requestAnimationFrame(measureGallery); });
    }

    // Tracks the real rendered extent however the images arrive — cached,
    // late-loading, or resized by a viewport change.
    var galleryObserver = null;
    if (typeof ResizeObserver === "function") {
      galleryObserver = new ResizeObserver(measureGallery);
      galleryObserver.observe(wmGallery);
    }

    // Populate the modal with one artwork (no show/focus side effects).
    function wmFill(id) {
      var data = document.getElementById(id);
      if (!data) return;
      wmIndex = workIds.indexOf(id);
      var imgs = data.querySelectorAll(".work__gallery img");
      wmGallery.innerHTML = "";
      Array.prototype.forEach.call(imgs, function (img) {
        var el = document.createElement("img");
        el.setAttribute("src", img.getAttribute("src"));
        el.setAttribute("alt", img.getAttribute("alt") || "");
        wmGallery.appendChild(el);
      });
      wmGallery.setAttribute("data-count", String(imgs.length));

      var title = data.getAttribute("data-title") || "";
      var hasDesc = !!data.querySelector(".work__desc");
      if (hasDesc) {
        // The title IS the disclosure. Only when there is something to disclose;
        // a work without a description keeps a plain, non-interactive heading.
        wmTitle.innerHTML =
          '<button type="button" class="wmodal__toggle" aria-expanded="false"' +
          ' aria-controls="' + PROSE_ID + '"></button>';
        wmTitle.firstChild.textContent = title;
      } else {
        wmTitle.textContent = title;
      }
      wmCount.textContent = (wmIndex + 1) + " / " + workIds.length;
      // The prose width is a proportion of the photographs, so it has to know
      // how wide they actually render (which depends on their aspect ratio and
      // on 60vh, not on the container). Published as --gallery-w; the CSS
      // clamps it into a readable band. See docs/DESIGN-SYSTEM.md §4.
      Array.prototype.forEach.call(wmGallery.querySelectorAll("img"), function (im) {
        if (im.complete) return;
        im.addEventListener("load", measureGalleryDeferred, { once: true });
      });
      measureGalleryDeferred();

      var spec = data.querySelector(".work__spec");
      if (spec) { wmSpec.innerHTML = spec.innerHTML; wmSpec.hidden = false; }
      else { wmSpec.innerHTML = ""; wmSpec.hidden = true; }

      wmText.innerHTML = "";
      wm.classList.remove("is-expanded");
      var desc = data.querySelector(".work__desc");
      if (desc) {
        var det = document.createElement("div");
        det.className = "work__text";
        det.innerHTML =
          '<div class="work__reveal" id="' + PROSE_ID + '">' +
            '<div class="work__prose prose">' + desc.innerHTML + '</div>' +
          '</div>';
        wmText.appendChild(det);

        var toggle = wmTitle.querySelector(".wmodal__toggle");
        var reveal = det.querySelector(".work__reveal");
        toggle.addEventListener("click", function () {
          var open = det.classList.toggle("is-open");
          wm.classList.toggle("is-expanded", open);
          toggle.setAttribute("aria-expanded", String(open));
          if (open) followReveal(reveal);
        });
      }

      wm.scrollTop = 0;
      if (wmScroll) wmScroll.scrollTop = 0;
    }

    // Everything outside the dialog is made inert while it is open.
    // role="dialog" + aria-modal does not, on its own, contain Tab.
    var pageRegions = Array.prototype.slice.call(
      document.querySelectorAll(".site-header, .site-main, .site-footer")
    );
    function setPageInert(on) {
      pageRegions.forEach(function (el) {
        if (on) { el.setAttribute("inert", ""); el.setAttribute("aria-hidden", "true"); }
        else { el.removeAttribute("inert"); el.removeAttribute("aria-hidden"); }
      });
    }

    function wmOpen(id) {
      wmLastFocus = document.activeElement;
      wmFill(id);
      wm.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setPageInert(true);
      wm.focus();
    }
    function wmGo(delta) {
      if (workIds.length < 2) return;
      var i = (wmIndex + delta + workIds.length) % workIds.length;
      wmFill(workIds[i]);
    }
    function wmCloseFn() {
      wm.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      setPageInert(false);
      if (wmLastFocus && wmLastFocus.focus) wmLastFocus.focus();
    }

    // Fallback focus trap for browsers without `inert`.
    function trapTab(e) {
      var focusable = wm.querySelectorAll(
        'button:not([hidden]), [href], [tabindex]:not([tabindex="-1"])'
      );
      var list = Array.prototype.filter.call(focusable, function (el) {
        return !el.closest("[hidden]") && el.getClientRects().length > 0;
      });
      if (!list.length) return;
      var first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    worklistBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { wmOpen(btn.getAttribute("data-work")); });
    });
    wmClose.addEventListener("click", function (e) { e.stopPropagation(); wmCloseFn(); });
    wmPrev.addEventListener("click", function (e) { e.stopPropagation(); wmGo(-1); });
    wmNext.addEventListener("click", function (e) { e.stopPropagation(); wmGo(1); });

    // Click anywhere that is not content closes. Previously some empty space
    // closed and other, identical-looking empty space did not.
    wm.addEventListener("click", function (e) {
      if (e.target.closest("img, button, a, .work__prose, .wmodal__title, .wmodal__spec, .wmodal__count")) return;
      wmCloseFn();
    });

    var gTicking = false;
    window.addEventListener("resize", function () {
      if (wm.getAttribute("aria-hidden") !== "false" || gTicking) return;
      gTicking = true;
      requestAnimationFrame(function () { measureGallery(); gTicking = false; });
    });

    document.addEventListener("keydown", function (e) {
      if (wm.getAttribute("aria-hidden") !== "false") return;
      if (e.key === "Escape") wmCloseFn();
      else if (e.key === "ArrowLeft") wmGo(-1);
      else if (e.key === "ArrowRight") wmGo(1);
      else if (e.key === "Tab") trapTab(e);
    });
  }

  // Hide header on scroll down, reveal on scroll up --------------------------
  var header = document.querySelector(".site-header");
  if (header) {
    // Mobile menu — R9. Below 60rem the nav folds into a drop-down behind one
    // control in the top-right corner (see the header block in style.css).
    // A disclosure, not a dialog: focus stays on the toggle and the page stays
    // live. Escape, choosing a link, tapping outside, or tabbing out of the
    // header closes it.
    var navToggle = header.querySelector(".nav-toggle");
    var siteNav = header.querySelector(".site-nav");
    var menuOpen = false;
    var setMenu = function (open) {
      if (open === menuOpen) return;
      menuOpen = open;
      header.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      // The panel hangs below the bar, so a hidden bar would strand it.
      if (open) header.classList.remove("site-header--hidden");
    };
    if (navToggle && siteNav) {
      navToggle.insertAdjacentHTML("afterbegin", icon("menu", "icon--menu") + icon("close", "icon--close"));
      navToggle.addEventListener("click", function () { setMenu(!menuOpen); });
      siteNav.addEventListener("click", function (e) {
        if (e.target.closest("a")) setMenu(false);
      });
      // A tap outside only dismisses. It is decided on pointerdown: by the time
      // the click arrives, the tap has already moved focus out of the header,
      // which closes the menu — so a click-time check found it closed and let
      // the tap through to whatever sat under the veil (it opened an artwork).
      // The click belonging to that tap is swallowed. Every pointerdown decides
      // afresh, and a tap that turns into a scroll cancels.
      var swallowClick = false;
      document.addEventListener("pointerdown", function (e) {
        swallowClick = menuOpen && !header.contains(e.target);
        if (swallowClick) setMenu(false);
      }, true);
      document.addEventListener("pointercancel", function () { swallowClick = false; }, true);
      document.addEventListener("click", function (e) {
        if (!swallowClick) return;
        swallowClick = false;
        e.preventDefault();
        e.stopPropagation();
      }, true);
      document.addEventListener("keydown", function (e) {
        // preventScroll: focusing a control inside the sticky header can
        // otherwise scroll the page underneath it.
        if (menuOpen && e.key === "Escape") { setMenu(false); navToggle.focus({ preventScroll: true }); }
      });
      header.addEventListener("focusout", function (e) {
        if (menuOpen && e.relatedTarget && !header.contains(e.relatedTarget)) setMenu(false);
      });
      var narrow = window.matchMedia("(max-width: 60rem)");
      var onBreakpoint = function () { if (!narrow.matches) setMenu(false); };
      if (narrow.addEventListener) narrow.addEventListener("change", onBreakpoint);
      else if (narrow.addListener) narrow.addListener(onBreakpoint);
    }

    // Direction changes smaller than this are ignored. On a phone, momentum
    // scrolling and the rubber-band at either end of the page produce 1–3px
    // reversals, which made the header flicker in and out.
    var HEADER_DELTA = 8;
    var lastY = window.pageYOffset || 0;
    var ticking = false;
    function onHeaderScroll() {
      ticking = false;
      var y = window.pageYOffset || 0;
      var maxY = document.documentElement.scrollHeight - window.innerHeight;
      if (y < 0 || y > maxY) return;                       // overscroll bounce
      if (menuOpen || y <= header.offsetHeight) {
        header.classList.remove("site-header--hidden");
      } else if (Math.abs(y - lastY) < HEADER_DELTA) {
        return;                                            // keep accumulating
      } else if (y > lastY) {
        header.classList.add("site-header--hidden");
      } else {
        header.classList.remove("site-header--hidden");
      }
      lastY = y;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(onHeaderScroll); ticking = true; }
    }, { passive: true });
  }

  // Subtle parallax on scroll (respects reduced motion) ---------------------
  var reduceMotion = prefersReducedMotion;
  // Not on touch devices — R9. A phone scrolls on the compositor, and a
  // transform written from a scroll event always lands a frame behind it, so
  // the portrait and the cover name juddered instead of drifting. The Touch
  // block in style.css turns scroll snapping off under the same query.
  var touchOnly = window.matchMedia
    && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (parallaxEls.length && !reduceMotion && !touchOnly) {
    var pTicking = false;
    // The travel is capped. Uncapped, an element far from the viewport centre
    // drifts 70-100px out of its own box — which, once the section rhythm was
    // tightened, let the About portrait slide down over the ARTWORK label.
    // 24px is under both the label gap above (36px) and the section gap below
    // (72px), so the effect stays visible and can never collide.
    var PARALLAX_MAX = 24;
    function onParallax() {
      var mid = window.innerHeight / 2;
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var offset = (r.top + r.height / 2) - mid;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.08;
        var shift = Math.max(-PARALLAX_MAX, Math.min(PARALLAX_MAX, -offset * speed));
        el.style.transform = "translate3d(0," + shift.toFixed(2) + "px, 0)";
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
