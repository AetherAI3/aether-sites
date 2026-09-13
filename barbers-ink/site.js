/* The planner is deliberately local: it never sends, books or stores a request. */
(() => {
  'use strict';
  const root = document.documentElement;
  const controller = new AbortController();
  const listen = (target, event, callback, options = {}) => target.addEventListener(event, callback, { ...options, signal: controller.signal });
  const appointment = document.querySelector('#appointment-form');
  const question = document.querySelector('#question-form');
  const date = document.querySelector('#preferred-date');
  const result = document.querySelector('#draft-result');
  const draft = document.querySelector('#draft-text');
  const status = document.querySelector('#form-status');
  const dateParts = () => Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(p => [p.type, p.value]));
  const today = () => { const p = dateParts(); return `${p.year}-${p.month}-${p.day}`; };
  const prettyDate = value => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00Z`));
  date.min = today();
  let activeMode = 'appointment';
  let draftRevision = 0;
  function invalidateDraft() {
    draftRevision += 1;
    result.hidden = true;
    draft.value = '';
    status.textContent = '';
    document.querySelector('#copy-status').textContent = '';
  }
  function updateSummary() {
    const values = new FormData(appointment);
    document.querySelector('#summary-service').textContent = activeMode === 'question' ? 'A question for the shop' : values.get('service');
    document.querySelector('#summary-date').textContent = activeMode === 'question' ? 'Prepare your question below' : date.value ? prettyDate(date.value) : 'Choose a preferred date';
    document.querySelector('#summary-time').textContent = activeMode === 'question' ? 'Call for a reply' : values.get('time') ? `${values.get('time')} · Eastern Time` : 'Choose a preferred time';
  }
  function clearErrors(form) {
    form.querySelectorAll('.error').forEach(el => { el.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  }
  function fieldError(input, errorId, message) {
    input.setAttribute('aria-invalid', 'true');
    document.getElementById(errorId).textContent = message;
    return input;
  }
  listen(appointment, 'input', () => { invalidateDraft(); updateSummary(); });
  listen(question, 'input', invalidateDraft);
  document.querySelectorAll('[data-mode]').forEach(button => listen(button, 'click', () => {
    activeMode = button.dataset.mode;
    document.querySelectorAll('[data-mode]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    appointment.hidden = activeMode !== 'appointment';
    question.hidden = activeMode !== 'question';
    invalidateDraft(); updateSummary();
  }));
  document.querySelectorAll('[data-service]').forEach(link => listen(link, 'click', () => {
    document.querySelector('[data-mode="appointment"]').click();
    const radio = [...appointment.elements.service].find(input => input.value === link.dataset.service);
    if (radio) radio.checked = true;
    invalidateDraft(); updateSummary();
  }));
  [appointment, question].forEach(form => listen(form, 'submit', event => {
    event.preventDefault();
    invalidateDraft(); clearErrors(form);
    const fields = form.elements;
    const isAppointment = form === appointment;
    const errors = [];
    if (isAppointment) {
      date.min = today();
      if (!date.value || date.validity.badInput || date.value < date.min) errors.push(fieldError(date, 'date-error', 'Choose today or a future date.'));
      if (!new FormData(form).get('time')) {
        document.querySelector('#time-error').textContent = 'Choose a preferred time, or select Flexible.';
        const first = form.querySelector('input[name="time"]');
        first.setAttribute('aria-invalid', 'true'); errors.push(first);
      }
    }
    const nameId = isAppointment ? 'name-error' : 'question-name-error';
    const emailId = isAppointment ? 'email-error' : 'question-email-error';
    if (!fields.name.value.trim()) errors.push(fieldError(fields.name, nameId, 'Enter your name for the draft.'));
    if (fields.email.value && !fields.email.validity.valid) errors.push(fieldError(fields.email, emailId, 'Enter a valid email, or leave it blank.'));
    if (!isAppointment && !fields.question.value.trim()) errors.push(fieldError(fields.question, 'question-text-error', 'Write your question for the shop.'));
    if (errors.length) { status.textContent = `Please check ${errors.length === 1 ? 'the highlighted field' : 'the highlighted fields'}.`; errors[0].focus(); return; }
    const values = new FormData(form);
    const lines = [`Hi Barber’s Ink, my name is ${fields.name.value.trim()}.`];
    if (isAppointment) lines.push(`I’d like to arrange a ${String(values.get('service')).toLowerCase()}.`, `Preferred date: ${prettyDate(date.value)}.`, `Preferred time: ${values.get('time')} (Eastern Time).`, 'Could you let me know your availability, price and appointment length?');
    else lines.push(fields.question.value.trim());
    if (fields.email.value.trim()) lines.push(`Email: ${fields.email.value.trim()}`);
    if (isAppointment && fields.phone.value.trim()) lines.push(`Phone: ${fields.phone.value.trim()}`);
    draft.value = lines.join('\n\n');
    document.querySelector('#draft-title').textContent = isAppointment ? 'Your request is ready to copy.' : 'Your question is ready to copy.';
    document.querySelector('label[for="draft-text"]').textContent = isAppointment ? 'Your request' : 'Your question';
    result.hidden = false;
    status.textContent = 'Draft created. Nothing has been sent or booked.';
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  }));
  listen(document.querySelector('#copy-draft'), 'click', async () => {
    const copyStatus = document.querySelector('#copy-status');
    const revision = draftRevision;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draft.value);
      if (revision === draftRevision) copyStatus.textContent = 'Copied. Paste it into your conversation with the shop.';
    } catch {
      if (revision !== draftRevision) return;
      draft.focus(); draft.select();
      copyStatus.textContent = 'Copy isn’t available in this browser. Your draft is selected so you can copy it manually.';
    }
  });
  // One passive, event-driven frame update. No timers, scroll hijacking or form transforms.
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const desktopQuery = matchMedia('(min-width: 768px)');
  const hero = document.querySelector('[data-contract]');
  const heroScene = document.querySelector('.hero');
  const shop = document.querySelector('[data-expand]');
  const shopScene = document.querySelector('.shop-section');
  const drift = document.querySelector('[data-drift]');
  const toggle = document.querySelector('#motion-toggle');
  let frame = 0;
  let paused = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  function paint() {
    frame = 0;
    const enabled = desktopQuery.matches && !motionQuery.matches && !paused;
    root.classList.toggle('motion-ready', enabled);
    if (!enabled) { [hero, shop, drift].forEach(el => { el.style.removeProperty('transform'); }); return; }
    const height = window.innerHeight;
    const heroBounds = heroScene.getBoundingClientRect();
    const departure = clamp((90 - heroBounds.top) / heroBounds.height);
    const shopBounds = shopScene.getBoundingClientRect();
    const arrival = clamp((height - shopBounds.top - 90) / (height * .7));
    hero.style.transform = `scale(${(1 - departure * .16).toFixed(4)})`;
    shop.style.transform = `scale(${(.8 + arrival * .2).toFixed(4)})`;
    const band = drift.parentElement.getBoundingClientRect();
    const progress = clamp((height - band.top) / (height + band.height));
    drift.style.transform = `translateX(${((progress - .5) * -60).toFixed(1)}px) scale(${(.93 + progress * .07).toFixed(4)})`;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  toggle.hidden = false;
  listen(toggle, 'click', () => {
    paused = !paused;
    root.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
    schedule();
  });
  listen(window, 'scroll', schedule, { passive: true });
  listen(window, 'resize', schedule, { passive: true });
  listen(window, 'pageshow', schedule);
  listen(motionQuery, 'change', schedule);
  listen(desktopQuery, 'change', schedule);
  listen(window, 'pagehide', event => {
    if (event.persisted) return;
    controller.abort(); if (frame) cancelAnimationFrame(frame);
  });
  document.querySelectorAll('.planner-controls').forEach(fieldset => { fieldset.disabled = false; });
  updateSummary(); schedule();
})();
