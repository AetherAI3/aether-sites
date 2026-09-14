(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('contact-status');
  const submit = form.querySelector('[type=submit]');
  const style = form.elements.style;
  const name = form.elements.name;
  const message = form.elements.message;
  const idleLabel = submit.innerHTML;
  let sending = false;
  const allowedStyles = new Set([...style.options].map(option => option.value));
  document.querySelectorAll('[data-select-style]').forEach(link => link.addEventListener('click', () => {
    if (allowedStyles.has(link.dataset.selectStyle)) style.value = link.dataset.selectStyle;
    // Preserve the native anchor jump, then give keyboard users a useful start.
    requestAnimationFrame(() => name.focus({ preventScroll: true }));
  }));
  function validate() {
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
    message.setCustomValidity(message.value.trim().length >= 10 ? '' : 'Please tell us a little more (at least 10 characters).');
  }
  name.addEventListener('input', validate);
  message.addEventListener('input', validate);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    validate();
    if (!form.reportValidity()) return;
    sending = true;
    const payload = Object.fromEntries(new FormData(form).entries());
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    submit.textContent = 'Sending…';
    status.dataset.state = 'sending';
    status.textContent = 'Sending your inquiry…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 18000);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (response.status === 429) {
        status.dataset.state = 'error';
        status.textContent = 'You’ve reached today’s inquiry limit. Your details are still here. You can email aetherai@aethersystems.net directly.';
      } else if (response.ok && data?.ok === true && typeof data.id === 'string' && data.id.length > 0) {
        status.dataset.state = 'success';
        status.textContent = 'Thanks — your inquiry is saved. We’ll reply by email to talk through your site.';
        // Keep edits made during submission; clear only the exact submitted draft.
        const unchanged = Object.entries(payload).every(([key, value]) => form.elements.namedItem(key)?.value === value);
        if (unchanged) form.reset();
      } else {
        status.dataset.state = 'error';
        status.textContent = 'We couldn’t confirm your inquiry was saved. Your details are still here. Please try again or email aetherai@aethersystems.net.';
      }
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'We couldn’t confirm your inquiry was saved. Your details are still here. Check your connection or email aetherai@aethersystems.net.';
    } finally {
      clearTimeout(timer);
      sending = false;
      submit.disabled = false;
      submit.innerHTML = idleLabel;
      form.removeAttribute('aria-busy');
      status.focus({ preventScroll: true });
    }
  });
})();
