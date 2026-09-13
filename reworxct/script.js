document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const mobile = window.matchMedia('(max-width: 760px)');
function setMenu(open) {
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => {
  if (event.target.closest('a') && mobile.matches) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});
mobile.addEventListener('change', () => setMenu(false));

// Scroll is native. Motion only decorates it; it never locks or changes scroll position.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let stopMotion = () => {};

function startMotion() {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const scenes = [...document.querySelectorAll('[data-scroll-scene]')];
  const materials = document.querySelector('.materials');
  const process = document.querySelector('.process-grid');
  const progress = document.querySelector('.scroll-progress');
  const reveals = [...document.querySelectorAll('.reveal')];
  const clamp = value => Math.min(1, Math.max(0, value));
  let frame = 0;
  let active = true;
  let observer;
  let resizeObserver;
  let sizeDirty = true;
  let scrollRange = 1;

  function show(element, immediate = false) {
    if (immediate) element.style.setProperty('--reveal-delay', '0ms');
    element.classList.add('is-visible');
    observer?.unobserve(element);
  }

  function render() {
    frame = 0;
    if (!active || document.hidden) return;

    // Read geometry together before writing any styles.
    const height = window.innerHeight;
    const width = window.innerWidth;
    const scrollY = Math.max(0, window.scrollY);
    if (sizeDirty) {
      scrollRange = Math.max(1, root.scrollHeight - height);
      sizeDirty = false;
    }
    const heroRect = hero.getBoundingClientRect();
    const sceneRects = scenes.map(element => ({ element, rect: element.getBoundingClientRect() }));
    const materialRect = sceneRects.find(scene => scene.element === materials).rect;
    const processRect = process.getBoundingClientRect();
    const exit = clamp(-heroRect.top / Math.max(1, heroRect.height * .8));
    const maxInset = width <= 760 ? 12 : Math.min(40, width * .03);

    progress.style.transform = `scaleX(${clamp(scrollY / scrollRange)})`;
    hero.style.setProperty('--hero-inset', `${(exit * maxInset).toFixed(2)}px`);
    hero.style.setProperty('--hero-shift', `${(exit * 32).toFixed(2)}px`);
    hero.style.setProperty('--hero-scale', (1.02 + exit * .075).toFixed(4));
    hero.style.setProperty('--hero-edge', (.12 + exit * .56).toFixed(3));
    hero.style.setProperty('--title-shift', `${(-exit * 34).toFixed(2)}px`);
    hero.style.setProperty('--title-opacity', (1 - exit * .4).toFixed(3));

    for (const { element, rect } of sceneRects) {
      // The frame opens on arrival and quietly contracts as the scene departs.
      const arrival = clamp((height - rect.top) / (height * .8));
      const departure = clamp((height * .18 - rect.bottom) / (height * .65));
      const openness = arrival * (1 - departure * .65);
      element.style.setProperty('--frame-inset', `${((1 - openness) * maxInset).toFixed(2)}px`);
    }
    const grain = clamp((height - materialRect.top) / (height + materialRect.height));
    materials.style.setProperty('--grain-shift', `${(14 - grain * 28).toFixed(2)}px`);
    const rail = width <= 760
      ? clamp((height * .74 - processRect.top) / Math.max(1, processRect.height))
      : clamp((height * .86 - processRect.top) / (height * .36));
    process.style.setProperty('--rail-progress', rail.toFixed(4));
  }

  function schedule() {
    if (active && !document.hidden && !frame) frame = window.requestAnimationFrame(render);
  }
  function resize() { sizeDirty = true; schedule(); }
  function focus(event) {
    const reveal = event.target.closest('.reveal');
    if (reveal) show(reveal, true);
  }
  function visible() {
    if (document.hidden && frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    } else {
      resize();
    }
  }

  // Observer failure or lack of support must leave the whole page readable.
  if ('IntersectionObserver' in window) {
    try {
      observer = new IntersectionObserver(entries => {
        if (!active) return;
        for (const entry of entries) {
          if (entry.isIntersecting) show(entry.target);
        }
      }, { threshold: 0, rootMargin: '0px 0px -4% 0px' });
      document.querySelectorAll('[data-stagger]').forEach(group => {
        [...group.children].filter(child => child.classList.contains('reveal')).forEach((child, index) => {
          child.style.setProperty('--reveal-delay', `${mobile.matches ? 0 : index * 160}ms`);
        });
      });
      for (const element of reveals) {
        // Restored scroll and anchor loads never start with hidden content above them.
        if (element.getBoundingClientRect().top < window.innerHeight * .96) show(element, true);
        else observer.observe(element);
      }
      root.classList.add('reveal-ready');
    } catch {
      observer?.disconnect();
      root.classList.remove('reveal-ready');
    }
  }

  root.classList.add('motion-ready');
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pageshow', resize);
  document.addEventListener('focusin', focus);
  document.addEventListener('visibilitychange', visible);
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.querySelector('main'));
    resizeObserver.observe(document.body);
  }
  document.fonts?.ready.then(() => { if (active) resize(); });
  schedule();

  return () => {
    active = false;
    if (frame) window.cancelAnimationFrame(frame);
    observer?.disconnect();
    resizeObserver?.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pageshow', resize);
    document.removeEventListener('focusin', focus);
    document.removeEventListener('visibilitychange', visible);
    root.classList.remove('motion-ready', 'reveal-ready');
    for (const element of [hero, ...scenes, process, ...reveals]) {
      for (const name of [...element.style]) {
        if (/^--(hero-|title-|frame-|grain-|rail-|reveal-)/.test(name)) element.style.removeProperty(name);
      }
    }
    progress.style.removeProperty('transform');
  };
}

function applyMotionPreference() {
  stopMotion();
  stopMotion = motionPreference.matches ? () => {} : startMotion();
}
motionPreference.addEventListener('change', applyMotionPreference);
applyMotionPreference();
