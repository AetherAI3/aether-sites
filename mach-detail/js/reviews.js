// Manual cinematic transitions. All reviews remain readable without JavaScript.
const carousel = document.querySelector('#review-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('[data-review]')];
  const selectors = [...carousel.querySelectorAll('[data-review-select]')];
  const stage = carousel.querySelector('.review-stage');
  const announcement = carousel.querySelector('#review-announcement');
  const count = carousel.querySelector('.review-count');
  let active = 0;
  let gesture = null;

  function select(index, announce = true) {
    const next = (index + slides.length) % slides.length;
    // A keyboard or swipe change must not strand focus inside an inert slide.
    if (slides[active].contains(document.activeElement) && next !== active) {
      selectors[next].focus({ preventScroll: true });
    }
    active = next;
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle('is-active', selected);
      slide.inert = !selected;
      slide.setAttribute('aria-hidden', String(!selected));
      slide.querySelectorAll('a').forEach(link => { link.tabIndex = selected ? 0 : -1; });
      selectors[i].setAttribute('aria-pressed', String(selected));
    });
    count.textContent = `${active + 1} / ${slides.length}`;
    if (announce) announcement.textContent = `${slides[active].dataset.review}. 5 out of 5 stars. Review ${active + 1} of ${slides.length}.`;
  }

  slides.forEach((slide, i) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
  });
  carousel.setAttribute('aria-roledescription', 'carousel');
  selectors.forEach((button, i) => button.addEventListener('click', () => select(i)));
  carousel.querySelectorAll('[data-review-step]').forEach(button => {
    button.addEventListener('click', () => select(active + Number(button.dataset.reviewStep)));
  });
  carousel.addEventListener('keydown', event => {
    const keys = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in keys) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    select(keys[event.key]);
  });

  // Vertical scrolling and pinch zoom remain native. Only deliberate horizontal
  // touch/pen gestures change a review; clicking the Google links stays normal.
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || !event.isPrimary || event.target.closest('a, button')) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) select(active + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => { gesture = null; });
  stage.addEventListener('pointerleave', () => { gesture = null; });

  select(0, false);
  carousel.classList.add('reviews-ready');
  carousel.querySelector('.review-controls').hidden = false;
}
