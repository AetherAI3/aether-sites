// Scroll owns the motion. No idle animation loop, pinned viewport, or scroll capture.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 820px)');
const scenes = [...document.querySelectorAll('[data-scene]')];
const active = new Set();
const links = [...document.querySelectorAll('#site-menu a')];
const nav = document.querySelector('.nav');
const bar = document.querySelector('.progress-bar');
const clamp = value => Math.max(0, Math.min(1, value));
const properties = ['--scene-line', '--scene-drift', '--photo-shift', '--hero-shift', '--hero-angle', '--ribbon-shift'];
let frame = 0;
let observer;
let reveals;
const entrances = new Set();

function paint() {
  frame = 0;
  if (document.hidden) return;
  const viewport = innerHeight;
  const geometry = [...active].map(element => ({ element, box: element.getBoundingClientRect() }));
  const maximum = document.documentElement.scrollHeight - viewport;
  const focusedSection = document.activeElement.closest?.('section');
  const current = geometry.filter(({ element, box }) => element.id && box.top < viewport * .5 && box.bottom > viewport * .3).at(-1);
  nav.classList.toggle('is-scrolled', scrollY > 28);
  for (const link of links) {
    if (current && link.hash === '#' + current.element.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  if (reduced.matches) return;
  bar.style.setProperty('--scroll', maximum > 0 ? String(clamp(scrollY / maximum)) : '0');
  for (const { element, box } of geometry) {
    const progress = clamp((viewport - box.top) / (viewport + box.height));
    const entrance = clamp((viewport * .88 - box.top) / (viewport * .65));
    element.style.setProperty('--scene-line', entrance.toFixed(3));
    element.style.setProperty('--ribbon-shift', (-progress * (compact.matches ? 110 : 300)).toFixed(1) + 'px');
    if (!compact.matches && element !== focusedSection) {
      element.style.setProperty('--scene-drift', ((progress - .5) * 45).toFixed(1) + 'px');
      element.style.setProperty('--photo-shift', ((progress - .5) * 22).toFixed(1) + 'px');
      if (element.id === 'top') {
        const departure = clamp(-box.top / box.height);
        element.style.setProperty('--hero-shift', (departure * 90).toFixed(1) + 'px');
        element.style.setProperty('--hero-angle', (departure * 2).toFixed(2) + 'deg');
      }
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
        if (reduced.matches || entry.target.contains(document.activeElement)) continue;
        const siblings = [...entry.target.parentElement.children].filter(element => element.classList.contains('reveal'));
        const delay = compact.matches ? 0 : Math.min(siblings.indexOf(entry.target), 2) * 85;
        const animation = entry.target.animate([
          { opacity: .4, transform: `translate3d(0, ${compact.matches ? 20 : 46}px, 0) scale(.985)` },
          { opacity: 1, transform: 'none' }
        ], { duration: compact.matches ? 440 : 760, delay, easing: 'cubic-bezier(.16,1,.3,1)' });
        entrances.add(animation);
        animation.finished.then(() => entrances.delete(animation), () => entrances.delete(animation));
      }
    }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    document.querySelectorAll('.reveal').forEach(element => reveals.observe(element));
    document.documentElement.classList.add('motion-ready');
  } else {
    // All content is visible without observers; basic scroll progress still works.
    scenes.forEach(element => active.add(element));
  }
} catch {
  observer?.disconnect(); reveals?.disconnect(); clean();
  document.documentElement.classList.remove('motion-ready');
}
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule, { passive: true });
addEventListener('pageshow', schedule);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
  else schedule();
});
document.addEventListener('focusin', event => {
  // Keyboard targets are stable and readable even during an entrance.
  event.target.closest('.reveal')?.getAnimations().forEach(animation => animation.cancel());
});
reduced.addEventListener('change', () => { clean(); schedule(); });
compact.addEventListener('change', () => { clean(); schedule(); });
schedule();
