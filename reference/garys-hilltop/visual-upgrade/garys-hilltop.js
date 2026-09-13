/* Gary's Hilltop Auto Repair - progressive enhancement layer
   Dependency-free. Everything degrades gracefully:
   - no JS              -> content fully visible, CSS still styles the page
   - reduced motion     -> reveals skipped, no count-up, no spotlight
   - no IntersectionObserver -> everything shown immediately
   Load with: <script defer src="garys-hilltop.js"></script> */
(function () {
  "use strict";

  var d = document;
  d.documentElement.classList.add("gh-js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* 1. Scroll reveals - IntersectionObserver, one-shot per element.
        No scroll event listeners anywhere. */
  var revealEls = Array.prototype.slice.call(d.querySelectorAll(".gh-reveal"));
  if (reduceMotion || !hasIO) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealIO.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* 2. Header state - a 1px sentinel at the top of the page tells the header
        when the page has scrolled, so no scroll listener is needed. */
  var header = d.querySelector(".gh-header");
  if (header && hasIO) {
    var sentinel = d.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none";
    d.body.insertBefore(sentinel, d.body.firstChild);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }, { rootMargin: "-1px 0px 0px 0px", threshold: 0 }).observe(sentinel);
  }

  /* 3. Pointer spotlight on cards - writes --mx / --my CSS variables,
        rAF-throttled, pointer-fine devices only. */
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var rafId = null, px = 0, py = 0, activeCard = null;
    var applySpotlight = function () {
      rafId = null;
      if (!activeCard) return;
      var r = activeCard.getBoundingClientRect();
      activeCard.style.setProperty("--mx", (px - r.left) + "px");
      activeCard.style.setProperty("--my", (py - r.top) + "px");
    };
    d.addEventListener("pointermove", function (e) {
      var t = e.target && e.target.closest ? e.target.closest(".gh-card") : null;
      if (!t) { activeCard = null; return; }
      px = e.clientX; py = e.clientY; activeCard = t;
      if (!rafId) rafId = window.requestAnimationFrame(applySpotlight);
    }, { passive: true });
  }

  /* 4. Count-up numbers - <b class="gh-count" data-to="5.0">5.0</b> */
  var counters = Array.prototype.slice.call(d.querySelectorAll(".gh-count"));
  if (counters.length && hasIO && !reduceMotion) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countIO.unobserve(entry.target);
        var el = entry.target;
        var raw = el.getAttribute("data-to") || "0";
        var to = parseFloat(raw);
        var decimals = (raw.split(".")[1] || "").length;
        var duration = 900;
        var start = null;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (to * eased).toFixed(decimals);
          if (p < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countIO.observe(el); });
  }
})();
