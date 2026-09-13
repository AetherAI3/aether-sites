/* ============================================================
   MACH//DETAIL — SCROLL-DRIVEN INTERACTIONS
   Zero dependencies. All effects degrade gracefully.
   ============================================================ */

(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     1 · SCROLL PROGRESS BAR
     Native CSS scroll-timeline where supported, rAF fallback.
     ---------------------------------------------------------- */
  const bar = document.querySelector(".progress-bar");
  if (bar && !CSS.supports("animation-timeline: scroll()")) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--scroll", max > 0 ? (scrollY / max).toFixed(4) : 0);
      ticking = false;
    };
    addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  } else if (bar) {
    /* Progressive enhancement: hand the work to the compositor */
    bar.style.animation = "mdProgress linear both";
    bar.style.animationTimeline = "scroll(root)";
    const sheet = document.createElement("style");
    sheet.textContent = "@keyframes mdProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }";
    document.head.appendChild(sheet);
  }

  /* ----------------------------------------------------------
     2 · REVEAL ON SCROLL — staggered via --i custom property
     ---------------------------------------------------------- */
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        revealIO.unobserve(e.target);
      }
    }
  }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });

  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (!el.style.getPropertyValue("--i")) el.style.setProperty("--i", i % 4);
    revealIO.observe(el);
  });

  /* ----------------------------------------------------------
     3 · HERO PARALLAX — media drifts up slower than the page
     ---------------------------------------------------------- */
  const heroMedia = document.querySelector(".hero__media");
  if (heroMedia && !prefersReduced) {
    let ticking = false;
    const drift = () => {
      const y = Math.min(scrollY, innerHeight);
      heroMedia.style.transform = `translate3d(0, ${y * 0.32}px, 0)`;
      ticking = false;
    };
    addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(drift); ticking = true; }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     4 · SHOP IMAGE PARALLAX (subtle, bidirectional)
     ---------------------------------------------------------- */
  const shopImg = document.querySelector(".shop img");
  if (shopImg && !prefersReduced) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let ticking = false;
      const drift = () => {
        const r = e.target.parentElement.getBoundingClientRect();
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -0.5 → 0.5
        shopImg.style.transform = `translate3d(0, ${p * -34}px, 0)`;
        ticking = false;
      };
      const onScroll = () => { if (!ticking) { requestAnimationFrame(drift); ticking = true; } };
      addEventListener("scroll", onScroll, { passive: true });
      drift();
    });
    io.observe(shopImg.parentElement);
  }

  /* ----------------------------------------------------------
     5 · SCROLL-SPY — nav link highlights current section
     ---------------------------------------------------------- */
  const links = [...document.querySelectorAll(".nav__links a[href^='#']")];
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((l) => l.classList.toggle("is-active", l.hash === "#" + e.target.id));
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));

  /* ----------------------------------------------------------
     6 · GLASS CARD TILT — pointer-driven, capped at ±4deg
     ---------------------------------------------------------- */
  if (!prefersReduced && matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".tier").forEach((card) => {
      card.addEventListener("pointermove", (ev) => {
        const r = card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${y * -4}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  /* ----------------------------------------------------------
     7 · ANIMATED COUNTERS — .stat strong[data-count]
     ---------------------------------------------------------- */
  const countIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const t0 = performance.now();
      const dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

  /* ----------------------------------------------------------
     8 · TERMINAL BOOT SEQUENCE — lines cascade on first view
     ---------------------------------------------------------- */
  const term = document.querySelector(".terminal__body");
  if (term) {
    const lines = term.querySelectorAll(".ln");
    const bootIO = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      lines.forEach((ln, i) => setTimeout(() => ln.classList.add("is-on"), 240 * i + 200));
      bootIO.disconnect();
    }, { threshold: 0.35 });
    bootIO.observe(term);
  }
})();
