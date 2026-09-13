const root = document.documentElement;
const header = document.querySelector('.site-header');
const navigation = document.querySelector('#navigation');
const menuButton = document.querySelector('.nav-toggle');
const mobile = window.matchMedia('(max-width: 900px)');
function setMenu(open) {
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
mobile.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); }
});
document.addEventListener('click', event => {
  if (menuButton.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenu(false);
});

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
function editNote() { result.hidden = true; form.hidden = false; }
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
  document.querySelector('#result-title').focus();
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
root.classList.add('js');
planner.hidden = false;
