/* ============================================================
   WATERBURY AQUARIUM — motion.js
   Dependency-free scroll + ambient motion helpers.
   Companion to wireframe.md / waterbury-aquarium.css
   ============================================================ */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Bubble spawner ----------
     Fill any element classed .bubble-field with rising bubbles.
     Usage: <div class="bubble-field" data-bubbles="14"></div>     */
  if (!reduced) {
    document.querySelectorAll('.bubble-field').forEach(field => {
      const count = Number(field.dataset.bubbles || 12);
      for (let i = 0; i < count; i++) {
        const b = document.createElement('i');
        b.className = 'bubble';
        b.style.setProperty('--x', `${6 + Math.random() * 88}%`);
        b.style.setProperty('--s', `${6 + Math.random() * 14}px`);
        b.style.setProperty('--d', `${7 + Math.random() * 7}s`);
        b.style.setProperty('--delay', `${-Math.random() * 14}s`);
        field.appendChild(b);
      }
    });
  }

  /* ---------- 2. Section reveals ----------
     Add .reveal to any block; it fades/drifts in on first view.   */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- 3. Porthole fallback (no scroll-timeline support) ----------
     Mirrors the CSS `porthole-in-out` keyframes:
     0-45% expand, 45-60% hold full-bleed, 60-100% shrink to card. */
  const supportsScrollTimeline = CSS.supports('animation-timeline: view()');
  const stage = document.querySelector('.porthole-stage');
  const porthole = document.querySelector('.porthole');
  const caption = document.querySelector('.porthole-caption');

  if (!reduced && !supportsScrollTimeline && stage && porthole) {
    const lerp = (a, b, t) => a + (b - a) * t;
    const seg = (p, from, to) => Math.min(1, Math.max(0, (p - from) / (to - from)));

    const render = () => {
      const r = stage.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total)); // 0..1 through stage

      const open = seg(p, 0, 0.45);
      const close = seg(p, 0.6, 1);

      const widthVw = close > 0 ? lerp(100, 52, close) : lerp(40, 100, open);
      const heightVh = close > 0 ? lerp(100, 34, close) : lerp(56, 100, open);
      const radius = close > 0 ? lerp(0, 28, close) : lerp(32, 0, open);

      porthole.style.width = `${widthVw}vw`;
      porthole.style.height = `${heightVh}vh`;
      porthole.style.borderRadius = `${radius}px`;

      if (caption) {
        const cIn = seg(p, 0.45, 0.52);
        const cOut = seg(p, 0.62, 0.72);
        caption.style.opacity = String(Math.max(0, cIn - cOut));
        caption.style.transform = `translateY(${(1 - cIn) * 12 - cOut * 12}px)`;
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { render(); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    render();
  }

  /* ---------- 4. Carousel pager sync ----------
     Markup: <div class="slide-track">…cards…</div>
             <div class="slide-pager"><button class="pager-bubble" …> */
  const track = document.querySelector('.slide-track');
  const pager = document.querySelector('.slide-pager');
  if (track && pager) {
    const cards = [...track.children];
    const dots = [...pager.querySelectorAll('.pager-bubble')];

    const setActive = i => dots.forEach((d, j) =>
      d.setAttribute('aria-current', j === i ? 'true' : 'false'));

    let raf = null;
    track.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0, bestDist = Infinity;
        cards.forEach((c, i) => {
          const cCenter = c.offsetLeft + c.offsetWidth / 2;
          const dist = Math.abs(cCenter - center);
          if (dist < bestDist) { bestDist = dist; best = i; }
        });
        setActive(best);
        raf = null;
      });
    }, { passive: true });

    dots.forEach((d, i) => d.addEventListener('click', () =>
      cards[i].scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })));

    setActive(0);
  }

  /* ---------- 5. Depth gauge (fixed left rail) ----------
     Markup: <nav class="depth-gauge"><button class="pager-bubble"
              data-target="#hero" …> (one per section)               */
  const gauge = document.querySelector('.depth-gauge');
  if (gauge) {
    const dots = [...gauge.querySelectorAll('.pager-bubble')];
    const sections = dots.map(d => document.querySelector(d.dataset.target));

    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const i = sections.indexOf(e.target);
        if (i > -1) dots.forEach((d, j) =>
          d.setAttribute('aria-current', j === i ? 'true' : 'false'));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(s => s && spy.observe(s));

    dots.forEach(d => d.addEventListener('click', () => {
      const t = document.querySelector(d.dataset.target);
      t && t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }));
  }

  /* ---------- 6. Review quote rotator ----------
     Markup: <blockquote class="review-quote" data-quotes='["…","…"]'> */
  const quote = document.querySelector('.review-quote');
  if (quote && quote.dataset.quotes) {
    try {
      const quotes = JSON.parse(quote.dataset.quotes);
      if (quotes.length > 1) {
        let i = 0;
        setInterval(() => {
          i = (i + 1) % quotes.length;
          quote.style.transition = 'opacity .5s ease';
          quote.style.opacity = '0';
          setTimeout(() => {
            quote.textContent = quotes[i];
            quote.style.opacity = '1';
          }, 500);
        }, 6000);
      }
    } catch (e) { /* leave static quote on bad JSON */ }
  }

  /* ---------- 7. Shark mouse parallax (subtle) ---------- */
  const shark = document.querySelector('.shark');
  if (!reduced && shark && window.matchMedia('(pointer: fine)').matches) {
    let tx = 0;
    window.addEventListener('mousemove', e => {
      tx = (e.clientX / window.innerWidth - 0.5) * 12; // ±6px only
    }, { passive: true });
    (function sway() {
      shark.style.marginTop = `${tx * 0.4}px`;
      requestAnimationFrame(sway);
    })();
  }
})();
