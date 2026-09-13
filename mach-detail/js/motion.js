// Measure stationary sections; move only their decoration or a dedicated frame.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 820px)');
const root = document.documentElement;
const scenes = [...document.querySelectorAll('[data-scene]')];
const active = new Set();
const links = [...document.querySelectorAll('#site-menu a')];
const nav = document.querySelector('.nav');
const bar = document.querySelector('.progress-bar');
const toggle = document.querySelector('#motion-toggle');
const clamp = value => Math.max(0, Math.min(1, value));
const properties = ['--scene-line', '--ambient-shift', '--ambient-opacity', '--hero-lift', '--hero-scale', '--ribbon-shift'];
const entrances = new Set();
let paused = false;
let frame = 0;
let observer;
let reveals;
try { paused = sessionStorage.getItem('mach-motion-paused') === 'true'; } catch { /* Storage is optional. */ }
const motionOff = () => paused || reduced.matches;

function paint() {
  frame = 0;
  if (document.hidden || root.classList.contains('gallery-open')) return;
  const viewport = innerHeight;
  const geometry = [...active].map(element => ({ element, box: element.getBoundingClientRect() }));
  const maximum = root.scrollHeight - viewport;
  const current = geometry.filter(({ element, box }) => element.id && box.top < viewport * .5 && box.bottom > viewport * .3).at(-1);
  nav.classList.toggle('is-scrolled', scrollY > 28);
  for (const link of links) {
    if (current && link.hash === '#' + current.element.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  if (motionOff()) return;
  bar.style.setProperty('--scroll', maximum > 0 ? String(clamp(scrollY / maximum)) : '0');
  for (const { element, box } of geometry) {
    const progress = clamp((viewport - box.top) / (viewport + box.height));
    const entrance = clamp((viewport * .88 - box.top) / (viewport * .65));
    element.style.setProperty('--scene-line', entrance.toFixed(3));
    element.style.setProperty('--ambient-opacity', (.5 + Math.sin(progress * Math.PI) * .5).toFixed(3));
    element.style.setProperty('--ribbon-shift', (-progress * (compact.matches ? 65 : 180)).toFixed(1) + 'px');
    if (element.id === 'top' && !compact.matches) {
      const departure = clamp(-box.top / Math.max(box.height, 1));
      element.style.setProperty('--hero-lift', (-departure * 22).toFixed(1) + 'px');
      element.style.setProperty('--hero-scale', (1 - departure * .035).toFixed(4));
      element.style.setProperty('--ambient-shift', (departure * 48).toFixed(1) + 'px');
    }
  }
}
function schedule() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(paint);
}
function clean() {
  cancelAnimationFrame(frame); frame = 0;
  entrances.forEach(animation => animation.cancel()); entrances.clear();
  scenes.forEach(element => properties.forEach(property => element.style.removeProperty(property)));
}
function syncPreference() {
  clean();
  root.classList.toggle('motion-paused', motionOff());
  toggle.hidden = reduced.matches;
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
  schedule();
}
toggle.addEventListener('click', () => {
  paused = !paused;
  try { sessionStorage.setItem('mach-motion-paused', String(paused)); } catch { /* No persistence needed. */ }
  syncPreference();
});

try {
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      }
      schedule();
    }, { rootMargin: '100px 0px' });
    scenes.forEach(element => observer.observe(element));
    reveals = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveals.unobserve(entry.target);
        if (motionOff() || document.hidden || entry.target.contains(document.activeElement) || typeof entry.target.animate !== 'function') continue;
        const siblings = [...entry.target.parentElement.children].filter(element => element.classList.contains('reveal'));
        const delay = compact.matches ? 0 : Math.max(0, Math.min(siblings.indexOf(entry.target), 2)) * 65;
        // Images stay in their own geometry. Only text/card entrances translate.
        const photo = entry.target.matches('figure') || entry.target.querySelector('img');
        const keyframes = photo ? [{ opacity: .65 }, { opacity: 1 }] : [
          { opacity: .6, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ];
        const animation = entry.target.animate(keyframes, { duration: compact.matches ? 360 : 580, delay, easing: 'cubic-bezier(.16,1,.3,1)' });
        entrances.add(animation);
        animation.finished.then(() => entrances.delete(animation), () => entrances.delete(animation));
      }
    }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    document.querySelectorAll('.reveal').forEach(element => reveals.observe(element));
    root.classList.add('motion-ready');
  } else {
    // Content stays visible; scrolling still updates the progress and gradients.
    scenes.forEach(element => active.add(element));
  }
} catch {
  observer?.disconnect(); reveals?.disconnect(); clean();
  root.classList.remove('motion-ready');
}
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });
addEventListener('pageshow', schedule);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(frame); frame = 0;
    entrances.forEach(animation => animation.cancel()); entrances.clear();
  } else schedule();
});
document.addEventListener('focusin', event => {
  // Keyboard targets remain stable during a text/card entrance.
  event.target.closest('.reveal')?.getAnimations?.().forEach(animation => animation.cancel());
});
document.querySelector('#photo-dialog').addEventListener('close', schedule);
reduced.addEventListener('change', syncPreference);
compact.addEventListener('change', () => { clean(); schedule(); });
syncPreference();
