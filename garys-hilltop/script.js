const root = document.documentElement;
const header = document.querySelector('.site-header');
const navigation = document.querySelector('#navigation');
const menuButton = document.querySelector('.nav-toggle');
const mobile = window.matchMedia('(max-width: 900px)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
const hero = document.querySelector('.hero');
const reveals = [...document.querySelectorAll('.reveal-item')];
const navLinks = [...navigation.querySelectorAll('a')];
const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
const nativeScroll = typeof CSS !== 'undefined'
  && CSS.supports('animation-timeline: view()')
  && CSS.supports('view-timeline-name: --hero-view')
  && CSS.supports('animation-range: exit 0% exit 100%');
root.classList.toggle('native-scroll', nativeScroll);
const clamp = n => Math.min(1, Math.max(0, n));
let frame = 0;
let paused = false;
let motion = false;
let revealObserver;
let currentNav = null;

function setMenu(open) {
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
mobile.addEventListener('change', () => { setMenu(false); schedule(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false); menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (menuButton.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenu(false);
});

// One scheduled frame per scroll/resize batch. The measured hero wrapper never
// changes size in response to motion, so forward and reverse scrolling are stable.
function render() {
  frame = 0;
  if (document.hidden) return;
  const height = window.innerHeight;
  const headerHeight = header.getBoundingClientRect().height;
  const positions = navSections.map(section => section.getBoundingClientRect().top);
  const rect = motion && !nativeScroll ? hero.getBoundingClientRect() : null;
  root.style.setProperty('--header-height', headerHeight + 'px');
  let selected = null;
  let closest = -Infinity;
  positions.forEach((top, index) => {
    if (top <= height * .35 && top > closest) { selected = navLinks[index]; closest = top; }
  });
  if (selected !== currentNav) {
    currentNav = selected;
    navLinks.forEach(link => {
      if (link === selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  if (rect) {
    const progress = clamp(-rect.top / Math.max(1, rect.height));
    hero.style.setProperty('--hero-scale', (1 - progress * .015).toFixed(4));
    hero.style.setProperty('--hero-radius', (24 + progress * 8).toFixed(2) + 'px');
    hero.style.setProperty('--glow-y', (progress * 28).toFixed(2) + 'px');
  }
}
function schedule() { if (!frame && !document.hidden) frame = window.requestAnimationFrame(render); }
window.addEventListener('scroll', schedule, { passive:true });
window.addEventListener('resize', schedule, { passive:true });
window.addEventListener('pageshow', schedule);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && frame) { window.cancelAnimationFrame(frame); frame = 0; }
  else schedule();
});
document.addEventListener('focusin', event => {
  const item = event.target.closest('.reveal-item');
  if (item) { item.classList.add('in'); revealObserver?.unobserve(item); }
});
if ('ResizeObserver' in window) {
  const observer = new ResizeObserver(schedule);
  observer.observe(document.querySelector('main'));
  observer.observe(header);
}
document.fonts?.ready.then(schedule);

function updateMotion() {
  revealObserver?.disconnect();
  root.classList.remove('reveal-ready');
  ['--hero-scale','--hero-radius','--glow-y'].forEach(name => hero.style.removeProperty(name));
  motion = !paused && !reduce.matches;
  root.classList.toggle('motion-on', motion);
  root.classList.toggle('motion-paused', !motion);
  motionButton.disabled = reduce.matches;
  motionButton.textContent = reduce.matches ? 'Reduced motion enabled' : paused ? 'Enable motion' : 'Reduce motion';
  motionButton.setAttribute('aria-pressed', String(!motion));
  if (motion && !nativeScroll && 'IntersectionObserver' in window) {
    try {
      revealObserver = new IntersectionObserver(entries => {
        if (!motion) return;
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
        });
      }, { threshold:0, rootMargin:'0px 0px -4% 0px' });
      reveals.forEach((item, index) => {
        item.style.setProperty('--delay', mobile.matches ? '0ms' : (index % 3 * 45) + 'ms');
        if (item.getBoundingClientRect().top < window.innerHeight * .96) item.classList.add('in');
        else revealObserver.observe(item);
      });
      root.classList.add('reveal-ready');
    } catch { revealObserver?.disconnect(); root.classList.remove('reveal-ready'); }
  }
  schedule();
}
motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
reduce.addEventListener('change', updateMotion);

// An optional local note, separate from the phone appointment flow.
const planner = document.querySelector('#service-note');
const form = document.querySelector('#service-form');
const vehicle = document.querySelector('#vehicle');
const service = document.querySelector('#service');
const date = document.querySelector('#preferred-date');
const notes = document.querySelector('#notes');
const result = document.querySelector('#request-result');
const summary = document.querySelector('#request-summary');
const copyStatus = document.querySelector('#copy-status');
const today = new Date();
date.min = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
function editNote() { result.hidden = true; form.hidden = false; schedule(); }
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  service.value = link.getAttribute('data-service');
  planner.open = true;
  editNote();
}));
form.addEventListener('submit', event => {
  event.preventDefault();
  vehicle.setCustomValidity(vehicle.value.trim() ? '' : 'Enter the year, make and model.');
  if (!form.reportValidity()) return;
  const content = ["Service note for Gary's Hilltop Auto Repair", '', 'Vehicle: ' + vehicle.value.trim(), 'Service: ' + service.value];
  if (date.value) content.push('Preferred day: ' + date.value + ' (to be confirmed)');
  if (notes.value.trim()) content.push('', 'Notes: ' + notes.value.trim());
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
planner.addEventListener('toggle', schedule);
root.classList.add('js');
planner.hidden = false;
motionButton.hidden = false;
updateMotion();
