const root = document.documentElement;
root.classList.add('js');
const header = document.querySelector('.site-header');
const navigation = document.querySelector('#navigation');
const menuButton = document.querySelector('.nav-toggle');
const mobile = window.matchMedia('(max-width: 760px)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
const diagnostic = document.querySelector('.diagnostic-scene');
const figure = document.querySelector('.terminal-figure');
const lines = [...document.querySelectorAll('.term-line')];
const reveals = [...document.querySelectorAll('.reveal-item')];
const navLinks = [...navigation.querySelectorAll('a')];
const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
const nativeScroll = typeof CSS !== 'undefined'
  && CSS.supports('animation-timeline: view()')
  && CSS.supports('view-timeline-name: --hero-view')
  && CSS.supports('animation-range: contain 0% contain 100%')
  && CSS.supports('animation-range: cover 18% cover 26%');
root.classList.toggle('native-scroll', nativeScroll);
const clamp = n => Math.min(1, Math.max(0, n));
const ease = n => n * n * (3 - 2 * n);
let frame = 0;
let paused = false;
let motion = false;
let revealObserver;
let ambientObserver;
let currentNav = null;

function setMenu(open) {
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
mobile.addEventListener('change', () => { setMenu(false); schedule(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
});

function render() {
  frame = 0;
  if (document.hidden) return;
  // Measure stable wrappers first. No animation changes the measured layout.
  const height = window.innerHeight;
  const positions = navSections.map(section => section.getBoundingClientRect().top);
  const heroRect = motion ? hero.getBoundingClientRect() : null;
  const diagnosticRect = motion && !nativeScroll ? diagnostic.getBoundingClientRect() : null;
  const canPin = motion && window.innerWidth >= 960 && height >= 780 && heroContent.scrollHeight + 24 <= height;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
  let selected = null;
  let closest = -Infinity;
  positions.forEach((top, index) => { if (top <= height * .35 && top > closest) { selected = navLinks[index]; closest = top; } });
  if (selected !== currentNav) {
    currentNav = selected;
    navLinks.forEach(link => { if (link === selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }
  if (root.classList.contains('can-pin') !== canPin) {
    root.classList.toggle('can-pin', canPin);
    schedule(); // Re-measure once after the layout changes between pinned/static.
    return;
  }
  if (!motion || nativeScroll) return;
  const progress = canPin ? clamp(-heroRect.top / Math.max(1, heroRect.height - height)) : 0;
  hero.style.setProperty('--photo-scale', (1.1 - progress * .1).toFixed(4));
  hero.style.setProperty('--frame-scale', (1 - ease(progress) * .04).toFixed(4));
  hero.style.setProperty('--frame-radius', `${(ease(progress) * 24).toFixed(2)}px`);
  hero.style.setProperty('--vignette', (.55 + progress * .4).toFixed(4));
  const terminalProgress = clamp((height - diagnosticRect.top) / Math.max(1, height + diagnosticRect.height));
  lines.forEach((line, index) => {
    const start = .18 + index * .08;
    const typed = mobile.matches ? 1 : Math.floor(clamp((terminalProgress - start) / .08) * 22) / 22;
    line.style.setProperty('--clip', `${((1 - typed) * 100).toFixed(2)}%`);
    line.style.setProperty('--ok-opacity', mobile.matches ? '1' : clamp((terminalProgress - start - .08) / .03).toFixed(3));
  });
  figure.style.setProperty('--figure-y', mobile.matches ? '0px' : `${(24 - terminalProgress * 48).toFixed(2)}px`);
}
function schedule() { if (!frame && !document.hidden) frame = window.requestAnimationFrame(render); }
window.addEventListener('scroll', schedule, { passive:true });
window.addEventListener('resize', schedule, { passive:true });
window.addEventListener('pageshow', schedule);
document.addEventListener('visibilitychange', () => {
  root.classList.toggle('page-hidden', document.hidden);
  if (document.hidden && frame) { window.cancelAnimationFrame(frame); frame = 0; }
  else schedule();
});
document.addEventListener('focusin', event => {
  const item = event.target.closest('.reveal-item');
  if (item) { item.classList.add('in'); revealObserver?.unobserve(item); }
});
if ('ResizeObserver' in window) {
  const resizeObserver = new ResizeObserver(schedule);
  resizeObserver.observe(document.querySelector('main'));
  resizeObserver.observe(heroContent);
}
document.fonts?.ready.then(schedule);

function updateMotion() {
  revealObserver?.disconnect(); ambientObserver?.disconnect();
  root.classList.remove('reveal-ready');
  document.querySelector('.ticker').classList.remove('ambient-off');
  [hero, figure, ...lines].forEach(element => {
    for (const name of [...element.style]) if (/^--(photo-|frame-|vignette|figure-|clip|ok-)/.test(name)) element.style.removeProperty(name);
  });
  motion = !paused && !reduce.matches;
  root.classList.toggle('motion-on', motion);
  root.classList.toggle('motion-paused', !motion);
  motionButton.disabled = reduce.matches;
  motionButton.textContent = reduce.matches ? 'Motion off' : paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
  motionButton.setAttribute('aria-label', reduce.matches ? 'Motion disabled by system preference' : paused ? 'Resume animations' : 'Pause animations');
  if (motion && 'IntersectionObserver' in window) {
    try {
      if (!nativeScroll) {
        revealObserver = new IntersectionObserver(entries => {
          if (!motion) return;
          entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); } });
        }, { threshold:0, rootMargin:'0px 0px -4% 0px' });
        reveals.forEach((item, index) => {
          item.style.setProperty('--delay', mobile.matches ? '0ms' : `${index % 3 * 65}ms`);
          if (item.getBoundingClientRect().top < window.innerHeight * .96) item.classList.add('in');
          else revealObserver.observe(item);
        });
        root.classList.add('reveal-ready');
      }
      ambientObserver = new IntersectionObserver(entries => {
        if (motion) entries.forEach(entry => entry.target.classList.toggle('ambient-off', !entry.isIntersecting));
      });
      ambientObserver.observe(document.querySelector('.ticker'));
    } catch { revealObserver?.disconnect(); ambientObserver?.disconnect(); root.classList.remove('reveal-ready'); }
  }
  schedule();
}
motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
reduce.addEventListener('change', updateMotion);
motionButton.hidden = false;
updateMotion();

// The planner prepares a local note. Only the visitor's click can place a call.
const form = document.querySelector('#service-form');
const vehicle = document.querySelector('#vehicle');
const service = document.querySelector('#service');
const date = document.querySelector('#preferred-date');
const notes = document.querySelector('#notes');
const result = document.querySelector('#request-result');
const summary = document.querySelector('#request-summary');
const copyStatus = document.querySelector('#copy-status');
const today = new Date();
date.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
function editNote() { result.hidden = true; form.hidden = false; schedule(); }
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  service.value = link.getAttribute('data-service'); editNote();
}));
form.addEventListener('submit', event => {
  event.preventDefault();
  vehicle.setCustomValidity(vehicle.value.trim() ? '' : 'Enter the year, make and model.');
  if (!form.reportValidity()) return;
  const content = ["Service note for Gary's Hilltop Auto Repair", '', `Vehicle: ${vehicle.value.trim()}`, `Service: ${service.value}`];
  if (date.value) content.push(`Preferred day: ${date.value} (to be confirmed)`);
  if (notes.value.trim()) content.push('', `Notes: ${notes.value.trim()}`);
  content.push('', 'Call (860) 482-4030 to request an appointment.');
  summary.value = content.join('\n');
  form.hidden = true; result.hidden = false; copyStatus.textContent = '';
  document.querySelector('#result-title').focus(); schedule();
});
vehicle.addEventListener('input', () => vehicle.setCustomValidity(''));
document.querySelector('#edit-note').addEventListener('click', () => { editNote(); vehicle.focus(); });
document.querySelector('#copy-note').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(summary.value); copyStatus.textContent = 'Service note copied.';
  } catch {
    summary.focus(); summary.select(); copyStatus.textContent = 'Select and copy the note above.';
  }
});
form.hidden = false;
