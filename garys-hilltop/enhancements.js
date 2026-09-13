/* Adapted from the supplied visual kit. No scroll listeners.
   Optional effects fail open and share reduced-motion / pause controls. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const button = document.querySelector('.motion-toggle');
  const header = document.querySelector('.site-header');
  const reveals = [...document.querySelectorAll('.gh-reveal')];
  const ambient = [...document.querySelectorAll('.gh-hero__panel, .gh-cta')];
  const counters = [...document.querySelectorAll('.gh-count')];
  const hasIO = 'IntersectionObserver' in window;
  const done = new Set();
  const counterFrames = new Map();
  const observers = [];
  let paused = false, enabled = false, pointerFrame = 0, activeCard = null, px = 0, py = 0;

  function finishCounter(el) {
    const id = counterFrames.get(el);
    if (id) cancelAnimationFrame(id);
    counterFrames.delete(el);
    el.textContent = el.dataset.to;
    done.add(el);
  }
  function showAll() {
    root.classList.remove('gh-reveal-ready');
    reveals.forEach(el => el.classList.add('in'));
  }
  function stopPointer() {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    activeCard = null;
  }
  function count(el) {
    if (done.has(el)) return;
    done.add(el);
    const raw = el.dataset.to;
    const target = Number(raw);
    if (!Number.isFinite(target)) return;
    const decimals = (raw.split('.')[1] || '').length;
    let start = null;
    const step = time => {
      if (!enabled || document.hidden) { finishCounter(el); return; }
      if (start === null) start = time;
      const progress = Math.min(1, (time - start) / 750);
      el.textContent = (target * (1 - (1 - progress) ** 3)).toFixed(decimals);
      if (progress < 1) counterFrames.set(el, requestAnimationFrame(step));
      else finishCounter(el);
    };
    counterFrames.set(el, requestAnimationFrame(step));
  }
  function configure() {
    observers.forEach(observer => observer.disconnect());
    observers.length = 0;
    root.classList.remove('gh-reveal-ready');
    stopPointer();
    for (const el of counterFrames.keys()) finishCounter(el);
    enabled = !paused && !reduced.matches;
    root.classList.toggle('motion-on', enabled);
    root.classList.toggle('motion-paused', !enabled);
    root.classList.toggle('gh-spotlights', enabled && fine.matches);
    button.disabled = reduced.matches;
    button.textContent = reduced.matches ? 'Reduced motion enabled' : paused ? 'Enable motion' : 'Reduce motion';
    button.setAttribute('aria-pressed', String(!enabled));
    ambient.forEach(el => el.classList.add('ambient-off'));
    if (!enabled || !hasIO) {
      showAll();
      counters.forEach(finishCounter);
      return;
    }
    try {
      const revealIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          revealIO.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -4% 0px' });
      observers.push(revealIO);
      reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * .96) el.classList.add('in');
        else revealIO.observe(el);
      });
      // Enable hidden states only after construction and observe() have succeeded.
      root.classList.add('gh-reveal-ready');
      const ambientIO = new IntersectionObserver(entries => entries.forEach(entry => {
        entry.target.classList.toggle('ambient-off', !entry.isIntersecting);
      }), { threshold: 0 });
      observers.push(ambientIO);
      ambient.forEach(el => ambientIO.observe(el));
      const countIO = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { countIO.unobserve(entry.target); count(entry.target); }
      }), { threshold: .35 });
      observers.push(countIO);
      counters.filter(el => !done.has(el)).forEach(el => countIO.observe(el));
    } catch {
      observers.forEach(observer => observer.disconnect());
      showAll();
      counters.forEach(finishCounter);
    }
  }

  document.addEventListener('focusin', event => {
    const el = event.target.closest('.gh-reveal');
    if (el) el.classList.add('in');
  });
  document.addEventListener('pointermove', event => {
    if (!enabled || !fine.matches || event.pointerType === 'touch' || document.hidden) return;
    activeCard = event.target.closest('.gh-card');
    if (!activeCard) { stopPointer(); return; }
    px = event.clientX; py = event.clientY;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (!activeCard || !enabled) return;
      const rect = activeCard.getBoundingClientRect();
      activeCard.style.setProperty('--mx', (px - rect.left) + 'px');
      activeCard.style.setProperty('--my', (py - rect.top) + 'px');
    });
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    root.classList.toggle('page-hidden', document.hidden);
    if (document.hidden) {
      stopPointer();
      for (const el of counterFrames.keys()) finishCounter(el);
    }
  });
  button.addEventListener('click', () => { paused = !paused; configure(); });
  reduced.addEventListener('change', configure);
  fine.addEventListener('change', configure);

  // Header state and section navigation remain available with effects paused.
  if (hasIO) {
    try {
      const sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none';
      document.body.prepend(sentinel);
      const headerIO = new IntersectionObserver(entries => {
        header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
      });
      headerIO.observe(sentinel);
      const links = [...document.querySelectorAll('#navigation a')];
      const sections = [document.querySelector('#top'), ...links.map(link => document.querySelector(link.getAttribute('href')))];
      const visible = new Set();
      const navIO = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        const current = [...visible].sort((a,b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
        if (!current) return;
        links.forEach(link => {
          if (link.getAttribute('href') === '#' + current.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
      sections.forEach(el => navIO.observe(el));
    } catch { header.classList.add('is-scrolled'); }
  } else header.classList.add('is-scrolled');
  function headerOffset() { root.style.setProperty('--header-height', header.getBoundingClientRect().height + 'px'); }
  if ('ResizeObserver' in window) new ResizeObserver(headerOffset).observe(header);
  else window.addEventListener('resize', headerOffset, { passive: true });
  document.fonts?.ready.then(headerOffset);
  headerOffset();
  button.hidden = false;
  configure();
})();
