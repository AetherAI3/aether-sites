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
const nativeScroll = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()') && CSS.supports('animation-timeline: scroll(root)');
root.classList.toggle('native-scroll', nativeScroll);
let paused = false;
let stopMotion = () => {};

function startMotion() {
  const hero = document.querySelector('.hero');
  const scenes = [...document.querySelectorAll('.scene')];
  const panels = [...document.querySelectorAll('.stack-panel')];
  const reveals = [...document.querySelectorAll('.reveal-up')];
  const ambient = [hero, document.querySelector('.ticker')];
  const clamp = value => Math.min(1, Math.max(0, value));
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
    const unpin = height < 690 || panelRects.some(rect => rect.height > height - 140);

    root.classList.toggle('stack-static', unpin);
    if (!nativeScroll) {
      const exit = clamp(scrollY / (height * .6));
      hero.style.setProperty('--hero-scale', (1 - exit * .08).toFixed(4));
      hero.style.setProperty('--hero-radius', `${(6 + exit * 22).toFixed(2)}px`);
      scenes.forEach((scene, index) => {
        const rect = sceneRects[index];
        const progress = clamp((height - rect.top) / Math.max(1, height + rect.height));
        const entry = clamp(progress / .15);
        const leave = clamp((progress - .85) / .15);
        const scale = .9 + entry * .1 - leave * .06;
        const box = scene.querySelector('.sqx');
        box.style.setProperty('--section-scale', scale.toFixed(4));
        box.style.setProperty('--section-radius', `${(6 + (1 - entry) * 6 + leave * 3).toFixed(2)}px`);
      });
    }
    panels.forEach((panel, index) => {
      const next = panelRects[index + 1];
      const covered = next ? clamp((height * .7 - next.top) / Math.max(1, height * .7 - 125)) : 0;
      panel.style.setProperty('--stack-scale', (unpin ? 1 : 1 - covered * .055).toFixed(4));
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
    const decorated = [hero, ...panels, ...scenes.map(scene => scene.querySelector('.sqx'))];
    decorated.forEach(element => {
      for (const property of [...element.style]) {
        if (/^--(hero-|section-|stack-)/.test(property)) element.style.removeProperty(property);
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
