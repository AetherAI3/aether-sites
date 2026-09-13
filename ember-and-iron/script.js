const root = document.documentElement;
root.classList.add('js');

// Native links and details remain usable without JavaScript.
const mobile = window.matchMedia('(max-width: 760px)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');
function setMenu(open) {
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? 'Close' : 'Menu';
  scheduleNavigation();
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => { if (event.target.closest('a') && mobile.matches) setMenu(false); });
mobile.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

// Navigation remains accurate when decorative motion is paused or disabled.
const navLinks = [...navigation.querySelectorAll('.nav-link')];
const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
let currentLink = null;
let hoveredLink = null;
let focusedLink = null;
let navFrame = 0;
let navX = '';
let navWidth = '';
function paintNavigation() {
  const link = hoveredLink || focusedLink || currentLink;
  if (!link || !link.offsetWidth) {
    navigation.classList.remove('nav-measured');
    return;
  }
  const x = `${link.offsetLeft}px`;
  const width = `${link.offsetWidth}px`;
  if (x !== navX) { navigation.style.setProperty('--nav-x', x); navX = x; }
  if (width !== navWidth) { navigation.style.setProperty('--nav-width', width); navWidth = width; }
  navigation.classList.add('nav-measured');
}
function updateNavigation() {
  navFrame = 0;
  if (document.hidden) return;
  const positions = navSections.map(section => section.getBoundingClientRect().top);
  let nearest = -Infinity;
  let selected = navLinks[0];
  positions.forEach((top, index) => {
    if (top <= window.innerHeight * .35 && top > nearest) {
      nearest = top;
      selected = navLinks[index];
    }
  });
  if (selected !== currentLink) {
    currentLink = selected;
    navLinks.forEach(link => {
      if (link === currentLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  paintNavigation();
}
function scheduleNavigation() {
  if (!navFrame && !document.hidden) navFrame = window.requestAnimationFrame(updateNavigation);
}
navLinks.forEach(link => link.addEventListener('pointerenter', () => {
  if (finePointer.matches) { hoveredLink = link; paintNavigation(); }
}));
navigation.addEventListener('pointerleave', () => { hoveredLink = null; paintNavigation(); });
navigation.addEventListener('focusin', event => { focusedLink = event.target.closest('.nav-link'); paintNavigation(); });
navigation.addEventListener('focusout', event => { focusedLink = event.relatedTarget?.closest('.nav-link') || null; paintNavigation(); });
window.addEventListener('scroll', scheduleNavigation, { passive: true });
window.addEventListener('resize', scheduleNavigation, { passive: true });
window.addEventListener('pageshow', scheduleNavigation);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && navFrame) { window.cancelAnimationFrame(navFrame); navFrame = 0; }
  else scheduleNavigation();
});
document.fonts?.ready.then(scheduleNavigation);
scheduleNavigation();

const pies = [...document.querySelectorAll('.pie-cell')];
function openPie(pie) {
  for (const other of pies) other.open = other === pie;
}
for (const pie of pies) {
  pie.addEventListener('pointerenter', () => { if (finePointer.matches && !mobile.matches) openPie(pie); });
  // Also enforces exclusive opening in browsers without details[name] support.
  pie.addEventListener('toggle', () => { if (pie.open) pies.forEach(other => { if (other !== pie) other.open = false; }); });
}

const visitDialog = document.querySelector('#visit-dialog');
if (typeof visitDialog.showModal === 'function') {
  document.querySelectorAll('[data-book]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      setMenu(false);
      if (!visitDialog.open) visitDialog.showModal();
    });
  });
  visitDialog.querySelector('.dialog-close').addEventListener('click', () => visitDialog.close());
  visitDialog.querySelector('[data-close-dialog]').addEventListener('click', () => visitDialog.close());
  visitDialog.addEventListener('click', event => {
    if (event.target !== visitDialog) return;
    const rect = visitDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) visitDialog.close();
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
const nativeScroll = typeof CSS !== 'undefined'
  && CSS.supports('animation-timeline: view()')
  && CSS.supports('animation-timeline: scroll(root)')
  && CSS.supports('view-timeline-name: --section-view')
  && CSS.supports('animation-range: cover 0% cover 100%')
  && CSS.supports('animation-range: 0 95svh');
root.classList.toggle('native-scroll', nativeScroll);
let paused = false;
let stopMotion = () => {};

function startMotion() {
  const hero = document.querySelector('.hero');
  const aura = document.querySelector('.hero-aura');
  const scenes = [...document.querySelectorAll('.scene')];
  const panels = [...document.querySelectorAll('.stack-panel')];
  const reveals = [...document.querySelectorAll('.reveal-up')];
  const ambient = [hero, document.querySelector('.ticker')];
  const clamp = value => Math.min(1, Math.max(0, value));
  // Matches the cubic easing used by native scroll timelines.
  const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  let observer;
  let ambientObserver;
  let resizeObserver;
  let frame = 0;
  let active = true;

  function show(element) {
    element.classList.add('in');
    observer?.unobserve(element);
  }
  if ('IntersectionObserver' in window) {
    try {
      observer = new IntersectionObserver(entries => {
        if (!active) return;
        entries.forEach(entry => { if (entry.isIntersecting) show(entry.target); });
      }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
      reveals.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight * .95) show(element);
        else observer.observe(element);
      });
      root.classList.add('reveal-ready');
      ambientObserver = new IntersectionObserver(entries => {
        if (!active) return;
        entries.forEach(entry => entry.target.classList.toggle('ambient-off', !entry.isIntersecting));
      });
      ambient.forEach(element => ambientObserver.observe(element));
    } catch {
      observer?.disconnect();
      ambientObserver?.disconnect();
      root.classList.remove('reveal-ready');
    }
  }

  function render() {
    frame = 0;
    if (!active || document.hidden) return;
    const height = window.innerHeight;
    const scrollY = Math.max(0, window.scrollY);
    const panelRects = panels.map(element => element.getBoundingClientRect());
    const sceneRects = nativeScroll ? [] : scenes.map(element => element.getBoundingClientRect());
    // offsetHeight is untransformed: shrinking a panel must not change the
    // decision about whether its content fits in the viewport.
    const unpin = height < 690 || panels.some(panel => panel.offsetHeight > height - 140);

    root.classList.toggle('stack-static', unpin);
    if (!nativeScroll) {
      const exit = ease(scrollY / (height * .95));
      const heroDepth = mobile.matches ? .06 : .12;
      const entryDepth = mobile.matches ? .04 : .09;
      const leaveDepth = mobile.matches ? .03 : .06;
      hero.style.setProperty('--hero-scale', (1 - exit * heroDepth).toFixed(4));
      hero.style.setProperty('--hero-radius', `${(12 + exit * 26).toFixed(2)}px`);
      aura.style.setProperty('--aura-scale', (1 + exit * .09).toFixed(4));
      aura.style.setProperty('--aura-opacity', (.76 + exit * .24).toFixed(4));
      scenes.forEach((scene, index) => {
        const rect = sceneRects[index];
        const progress = clamp((height - rect.top) / Math.max(1, height + rect.height));
        const entry = ease(progress / .22);
        const leave = ease((progress - .74) / .26);
        const scale = 1 - entryDepth + entry * entryDepth - leave * leaveDepth;
        const box = scene.querySelector('.sqx');
        box.style.setProperty('--section-scale', scale.toFixed(4));
        box.style.setProperty('--section-radius', `${(12 + (1 - entry) * 18 + leave * 20).toFixed(2)}px`);
      });
    }
    panels.forEach((panel, index) => {
      const next = panelRects[index + 1];
      const covered = next ? ease((height * .7 - next.top) / Math.max(1, height * .7 - 128)) : 0;
      panel.style.setProperty('--stack-scale', (unpin ? 1 : 1 - covered * .07).toFixed(4));
      panel.style.setProperty('--stack-radius', `${(12 + (unpin ? 0 : covered * 20)).toFixed(2)}px`);
    });
  }
  function schedule() { if (active && !document.hidden && !frame) frame = window.requestAnimationFrame(render); }
  function focus(event) { const element = event.target.closest('.reveal-up'); if (element) show(element); }
  function visibility() {
    root.classList.toggle('page-hidden', document.hidden);
    if (document.hidden && frame) { window.cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  document.addEventListener('focusin', focus);
  document.addEventListener('visibilitychange', visibility);
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.querySelector('main'));
  }
  document.fonts?.ready.then(() => { if (active) schedule(); });
  schedule();
  return () => {
    active = false;
    if (frame) window.cancelAnimationFrame(frame);
    observer?.disconnect();
    ambientObserver?.disconnect();
    resizeObserver?.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    window.removeEventListener('pageshow', schedule);
    document.removeEventListener('focusin', focus);
    document.removeEventListener('visibilitychange', visibility);
    root.classList.remove('reveal-ready', 'stack-static', 'page-hidden');
    ambient.forEach(element => element.classList.remove('ambient-off'));
    const decorated = [hero, aura, ...panels, ...scenes.map(scene => scene.querySelector('.sqx'))];
    decorated.forEach(element => {
      for (const property of [...element.style]) {
        if (/^--(hero-|aura-|section-|stack-)/.test(property)) element.style.removeProperty(property);
      }
    });
  };
}

function updateMotion() {
  stopMotion();
  const enabled = !paused && !reducedMotion.matches;
  root.classList.toggle('motion-on', enabled);
  root.classList.toggle('motion-paused', !enabled);
  motionButton.disabled = reducedMotion.matches;
  motionButton.innerHTML = reducedMotion.matches ? 'Motion off' : paused ? 'Resume motion <span aria-hidden="true">▷</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';
  motionButton.setAttribute('aria-label', reducedMotion.matches ? 'Motion disabled by system preference' : paused ? 'Resume animations' : 'Pause animations');
  stopMotion = enabled ? startMotion() : () => {};
}
motionButton.hidden = false;
motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
reducedMotion.addEventListener('change', updateMotion);
updateMotion();
