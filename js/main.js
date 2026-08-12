// Paula Schierholt — site scripts
// Minimal foundation. Extend as the design is defined.

(function () {
  "use strict";

  // Keep the footer year current.
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
