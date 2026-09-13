// A local pickup-list preview. No order endpoint, payment collection or claimed reservation.
const ITEMS = Object.freeze({
  beef: 'Beef empanada', chicken: 'Chicken empanada', pork: 'Pork empanada',
  bbq: 'BBQ chicken empanada', reuben: 'Reuben empanada', apple: 'Apple pie empanada',
  'potato-beef': 'Beef potato filler', 'potato-chicken': 'Chicken potato filler',
  'potato-pork': 'Pork potato filler', 'potato-shepherd': "Shepherd's pie potato filler",
});
const STORAGE_KEY = 'empanadas-togo:bag:v1';
const MAX_PER_ITEM = 20;
const MAX_BAG = 60;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const dialog = $('#bag-dialog');
const form = $('#pickup-form');
const status = $('#status');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let bag = Object.create(null);
let statusTimer;
let lastTrigger;
let storageAvailable = true;

try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (stored?.version === 1 && stored.items && typeof stored.items === 'object') {
    let remaining = MAX_BAG;
    for (const id of Object.keys(ITEMS)) {
      const qty = stored.items[id];
      if (Number.isInteger(qty) && qty > 0 && remaining > 0) {
        bag[id] = Math.min(qty, MAX_PER_ITEM, remaining);
        remaining -= bag[id];
      }
    }
  }
} catch { storageAvailable = false; }

function count() { return Object.values(bag).reduce((sum, qty) => sum + qty, 0); }
function announce(message) {
  clearTimeout(statusTimer);
  status.textContent = message;
  status.classList.add('visible');
  statusTimer = setTimeout(() => status.classList.remove('visible'), 2600);
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({version: 1, items: bag})); }
  catch { storageAvailable = false; }
}
function invalidateDraft() { $('#draft-result').hidden = true; $('#draft-text').value = ''; $('#copy-status').textContent = ''; }
function renderBag() {
  const total = count();
  $$('[data-bag-count]').forEach(el => { el.textContent = total; });
  $$('[data-open-bag]').forEach(el => el.setAttribute('aria-label', `Review your bag, ${total} ${total === 1 ? 'item' : 'items'}`));
  $('#empty-bag').hidden = total > 0;
  $('#filled-bag').hidden = total === 0;
  const list = $('#bag-items');
  const nodes = [];
  for (const [id, qty] of Object.entries(bag)) {
    const li = document.createElement('li'); li.className = 'bag-item';
    const label = document.createElement('span'); label.textContent = ITEMS[id];
    const controls = document.createElement('div'); controls.className = 'quantity';
    const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−';
    minus.dataset.change = id; minus.dataset.delta = '-1';
    minus.setAttribute('aria-label', qty === 1 ? `Remove ${ITEMS[id]}` : `Decrease ${ITEMS[id]} quantity`);
    const output = document.createElement('output'); output.textContent = qty;
    output.setAttribute('aria-label', `${ITEMS[id]} quantity`);
    const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+';
    plus.dataset.change = id; plus.dataset.delta = '1';
    plus.setAttribute('aria-label', `Increase ${ITEMS[id]} quantity`);
    plus.disabled = qty >= MAX_PER_ITEM || total >= MAX_BAG;
    controls.append(minus, output, plus); li.append(label, controls); nodes.push(li);
  }
  list.replaceChildren(...nodes);
}
function changeItem(id, delta) {
  if (!Object.hasOwn(ITEMS, id)) return;
  if (delta > 0 && ((bag[id] || 0) >= MAX_PER_ITEM || count() >= MAX_BAG)) {
    announce(`This pickup list allows ${MAX_PER_ITEM} of each item and ${MAX_BAG} items total.`); return;
  }
  bag[id] = (bag[id] || 0) + delta;
  if (bag[id] <= 0) delete bag[id];
  save(); invalidateDraft(); renderBag();
}
$$('[data-add]').forEach(button => button.addEventListener('click', () => {
  const before = count(); changeItem(button.dataset.add, 1);
  if (count() > before) announce(`${ITEMS[button.dataset.add]} added.${storageAvailable ? '' : ' Saved for this visit only.'}`);
}));
$('#bag-items').addEventListener('click', event => {
  const button = event.target.closest('button[data-change]');
  if (!button) return;
  const {change: id, delta} = button.dataset;
  changeItem(id, Number(delta));
  const next = $(`[data-change="${id}"][data-delta="${delta}"]:not(:disabled)`) || $(`[data-change="${id}"]:not(:disabled)`) || $('#bag-items button') || $('[data-close-bag]');
  next.focus();
});
$$('[data-open-bag]').forEach(button => button.addEventListener('click', () => {
  lastTrigger = button; if (!dialog.open) dialog.showModal();
}));
function closeBag() { dialog.close(); lastTrigger?.focus({preventScroll: true}); }
$('[data-close-bag]').addEventListener('click', closeBag);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeBag();
});
dialog.addEventListener('close', () => { lastTrigger?.focus({preventScroll: true}); });
$('[data-browse-menu]').addEventListener('click', () => {
  dialog.close(); $('#menu').scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth'});
  $('.menu-frame summary').focus({preventScroll: true});
});
form.addEventListener('input', invalidateDraft);
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!count()) return;
  const name = $('#pickup-name').value.trim();
  const notes = $('#pickup-notes').value.trim();
  const lines = ["Empanada's — The place TOGO", 'PICKUP LIST — NOT SENT', '511 W Main St, Meriden, CT', ''];
  if (name) lines.push(`Name: ${name}`, '');
  for (const [id, qty] of Object.entries(bag)) lines.push(`${qty} × ${ITEMS[id]}`);
  if (notes) lines.push('', `Notes: ${notes}`);
  lines.push('', 'Ask at the counter for current availability, ingredients and final prices.', 'This is a personal list, not a confirmed order. No payment has been taken.');
  $('#draft-text').value = lines.join('\n');
  $('#draft-result').hidden = false;
  $('#draft-title').focus();
});
$('#copy-list').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('#draft-text').value); $('#copy-status').textContent = 'Copied. Bring your list to the counter.'; }
  catch { $('#draft-text').focus(); $('#draft-text').select(); $('#copy-status').textContent = 'Your list is selected. Use your device’s Copy command, or save the text file.'; }
});
$('#download-list').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([$('#draft-text').value], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'empanadas-pickup-list.txt';
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('#copy-status').textContent = 'Your text file is ready to save.';
});
renderBag();

// One scheduled paint per scroll, no perpetual loop, no scroll hijacking.
const hero = $('.hero-stage');
const heroFrame = $('.hero-frame');
const frames = $$('.menu-frame');
const flavorType = $('[data-scroll-type]');
let framePending = false;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
function paintMotion() {
  framePending = false;
  if (reduced.matches) {
    heroFrame.style.removeProperty('transform'); flavorType.style.removeProperty('transform');
    document.documentElement.style.setProperty('--page-progress', '0');
    frames.forEach(frame => { frame.style.setProperty('--frame-shift','0px'); frame.style.setProperty('--frame-progress','1'); });
    return;
  }
  const vh = window.innerHeight;
  const rect = hero.getBoundingClientRect();
  const progress = clamp(-rect.top / Math.max(rect.height, 1));
  heroFrame.style.transform = `scale(${1 - progress * .035})`;
  const pageProgress = clamp(window.scrollY / Math.max(document.documentElement.scrollHeight - vh, 1));
  document.documentElement.style.setProperty('--page-progress', pageProgress.toFixed(3));
  flavorType.style.transform = `translateX(${-2 - clamp((vh - $('.flavor-line').getBoundingClientRect().top) / vh) * 9}%)`;
  frames.forEach(frame => {
    const r = frame.getBoundingClientRect();
    const focus = clamp((vh - r.top) / (vh * .7));
    frame.style.setProperty('--frame-progress', focus.toFixed(3));
    frame.style.setProperty('--frame-shift', `${(1-focus)*9}px`);
  });
}
function schedulePaint() { if (!framePending) { framePending = true; requestAnimationFrame(paintMotion); } }
addEventListener('scroll', schedulePaint, {passive:true});
addEventListener('resize', schedulePaint, {passive:true});
reduced.addEventListener('change', schedulePaint);
frames.forEach(frame => frame.addEventListener('toggle', schedulePaint));
if ('ResizeObserver' in window) new ResizeObserver(schedulePaint).observe(document.body);
schedulePaint();
