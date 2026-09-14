// Adapted from AetherAI3/Blackstar carousel.js: visitor-controlled, no autoplay.
(() => {
  const carousel = document.querySelector('.project-carousel');
  if (!carousel) return;
  const stage = carousel.querySelector('.projects');
  const cards = [...stage.querySelectorAll('.project')];
  const choices = [...carousel.querySelectorAll('[data-carousel-index]')];
  if (cards.length < 2 || choices.length !== cards.length) return;
  const status = carousel.querySelector('#style-count');
  const viewToggle = carousel.querySelector('.view-toggle');
  const controls = [...carousel.querySelectorAll('.carousel-controls,.carousel-choices,.carousel-hint')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, grid = false, pointer = null, suppressClickUntil = 0, fitFrame = 0;
  const names = cards.map(card => card.querySelector('h3').textContent.trim());
  const links = cards.map(card => [...card.querySelectorAll('a,button')]);
  const originalTabs = links.map(items => items.map(link => link.getAttribute('tabindex')));

  function show(index, announce = true) {
    const previous = cards[current];
    current = ((index % cards.length) + cards.length) % cards.length;
    if (!grid && previous !== cards[current] && previous.contains(document.activeElement)) {
      choices[current].focus({ preventScroll: true });
    }
    cards.forEach((card, i) => {
      const slot = (i - current + cards.length) % cards.length;
      card.dataset.position = slot === 0 ? 'current' : slot === 1 ? 'next' : slot === cards.length - 1 ? 'previous' : 'back';
      const visible = grid || i === current;
      if (visible) card.removeAttribute('aria-hidden');
      else card.setAttribute('aria-hidden', 'true');
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', names[i] + ', ' + (i + 1) + ' of ' + cards.length);
      links[i].forEach((link, j) => {
        if (!visible) link.tabIndex = -1;
        else if (originalTabs[i][j] === null) link.removeAttribute('tabindex');
        else link.setAttribute('tabindex', originalTabs[i][j]);
      });
      choices[i].setAttribute('aria-pressed', String(i === current));
    });
    if (announce) status.textContent = (current + 1) + ' / ' + cards.length + ' · ' + names[current];
  }
  function fit() {
    fitFrame = 0;
    stage.style.height = grid ? '' : (Math.ceil(Math.max(...cards.map(card => card.offsetHeight))) + 85) + 'px';
  }
  function scheduleFit() { if (!fitFrame) fitFrame = requestAnimationFrame(fit); }
  choices.forEach((button, index) => button.addEventListener('click', () => show(index)));
  carousel.querySelectorAll('[data-carousel-step]').forEach(button => button.addEventListener('click', () => show(current + Number(button.dataset.carouselStep))));
  viewToggle.addEventListener('click', () => {
    grid = !grid;
    carousel.classList.toggle('is-grid', grid);
    carousel.setAttribute('aria-roledescription', grid ? 'collection' : 'carousel');
    viewToggle.setAttribute('aria-pressed', String(grid));
    viewToggle.textContent = grid ? 'Back to carousel' : 'View all styles';
    controls.forEach(control => { control.hidden = grid; });
    show(current, false);
    scheduleFit();
  });
  carousel.addEventListener('keydown', event => {
    if (grid || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target === viewToggle) return;
    const targets = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: cards.length - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    show(targets[event.key]);
  });
  stage.addEventListener('click', event => {
    if (grid) return;
    if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); return; }
    const index = cards.indexOf(event.target.closest('.project'));
    if (index >= 0 && index !== current) {
      event.preventDefault();
      event.stopImmediatePropagation();
      show(index);
    }
  }, true);
  stage.addEventListener('dragstart', event => event.preventDefault());
  stage.addEventListener('pointerdown', event => {
    if (grid || !event.isPrimary || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }, { passive: true });
  window.addEventListener('pointerup', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    pointer = null;
    if (!grid && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      suppressClickUntil = Date.now() + 450;
      show(current + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  window.addEventListener('pointercancel', () => { pointer = null; });
  window.addEventListener('blur', () => { pointer = null; });
  carousel.classList.add('carousel-ready');
  carousel.querySelector('.showcase-toolbar').hidden = false;
  controls.forEach(control => { control.hidden = false; });
  show(0);
  fit();
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(scheduleFit);
    cards.forEach(card => observer.observe(card));
  }
  window.addEventListener('resize', scheduleFit, { passive: true });
  window.addEventListener('load', scheduleFit);
  document.fonts?.ready.then(scheduleFit);
  stage.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.hidden = true; scheduleFit(); });
  });

  // A short sequence plays once when the process enters view.
  const journey = document.querySelector('.journey');
  if (journey && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      if (!reduced.matches) journey.classList.add('journey-playing');
      observer.disconnect();
    }, { threshold: .2 });
    observer.observe(journey);
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) journey?.classList.remove('journey-playing');
  });
})();
