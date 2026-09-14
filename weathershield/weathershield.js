/* Progressive enhancement. Native scrolling and usable HTML remain the baseline. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactLayout = window.matchMedia('(max-width: 850px)');
  const body = document.body;
  const header = $('#site-header');
  const nav = $('#site-nav');
  const menu = $('.menu-toggle');

  const closeMenu = (restoreFocus = false) => {
    const wasOpen = menu.getAttribute('aria-expanded') === 'true';
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    if (restoreFocus && wasOpen) menu.focus();
  };
  menu.addEventListener('click', () => {
    const next = menu.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', next);
    menu.setAttribute('aria-expanded', String(next));
    body.classList.toggle('menu-open', next);
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu(true);
  });
  document.addEventListener('focusin', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  compactLayout.addEventListener('change', event => {
    if (!event.matches) closeMenu();
  });
  menu.hidden = false;
  body.classList.add('js-nav');

  // A failed image never swaps to unrelated photography.
  $$('.media-frame img').forEach(img => {
    const frame = img.closest('.media-frame');
    const check = () => frame.classList.toggle('is-unavailable', !img.naturalWidth);
    img.addEventListener('load', check);
    img.addEventListener('error', check);
    if (img.complete) check();
  });

  // Local project planner: no network request or browser persistence.
  const form = $('#project-form');
  const result = $('#draft-result');
  const draftText = $('#draft-text');
  const draftStatus = $('#draft-status');
  const serviceInputs = [...form.querySelectorAll('input[name="service"]')];
  const showEditor = () => {
    result.hidden = true;
    form.hidden = false;
    draftStatus.textContent = '';
  };
  $$('[data-topic]').forEach(link => link.addEventListener('click', () => {
    showEditor();
    const choice = serviceInputs.find(input => input.value === link.dataset.topic);
    if (choice) choice.checked = true;
  }));
  $$('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target?.tagName === 'DETAILS') target.open = true;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const town = $('#project-town').value.trim();
    const details = $('#project-details').value.trim();
    if (!town || !details) {
      const field = !town ? $('#project-town') : $('#project-details');
      field.setCustomValidity('Please add a few words before continuing.');
      field.reportValidity();
      field.focus();
      return;
    }
    const service = serviceInputs.find(input => input.checked)?.value || 'Not sure yet';
    draftText.value = [
      'PROJECT NOTES — WEATHERSHIELD',
      '',
      'Work: ' + service,
      'Property town: ' + town,
      'Preferred timing: ' + $('#project-timing').value,
      '',
      'What I have noticed:',
      details,
      '',
      'Please confirm availability and the appropriate next step.',
      '',
      'Prepared locally. This note has not been sent and does not book an appointment.'
    ].join('\n');
    form.hidden = true;
    result.hidden = false;
    draftStatus.textContent = '';
    $('#draft-title').focus({ preventScroll: true });
  });
  [$('#project-town'), $('#project-details')].forEach(field => {
    field.addEventListener('input', () => field.setCustomValidity(''));
  });
  $('#edit-notes').addEventListener('click', () => {
    showEditor();
    $('#project-details').focus({ preventScroll: true });
  });
  $('#copy-notes').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draftText.value);
      draftStatus.textContent = 'Copied. You can paste these notes into your message.';
    } catch {
      draftText.focus();
      draftText.select();
      draftStatus.textContent = 'Your notes are selected. Use your device’s Copy command.';
    }
  });
  $('#download-notes').addEventListener('click', () => {
    try {
      const blob = new Blob([draftText.value + '\n'], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'weathershield-project-notes.txt';
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      draftStatus.textContent = 'Download requested. No notes have been sent to the contractor.';
    } catch {
      draftStatus.textContent = 'The download could not start. Use Copy notes instead.';
    }
  });
  form.querySelector('button[type="submit"]').disabled = false;

  // Filter the actual figures; only visible figures participate in the lightbox.
  const filters = $$('.gallery-filters button');
  const cards = $$('.project-card');
  const grid = $('.project-grid');
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => {
      card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter);
    });
    grid.classList.toggle('is-filtered', filter !== 'all');
    const count = cards.filter(card => !card.hidden).length;
    $('#gallery-status').textContent = count + (count === 1 ? ' photograph shown.' : ' photographs shown.');
  }));
  $('.gallery-filters').hidden = false;

  const dialog = $('#photo-dialog');
  const image = $('#photo-image');
  let galleryLinks = [];
  let imageIndex = 0;
  let returnFocus = null;
  const showPhoto = () => {
    const link = galleryLinks[imageIndex];
    if (!link) return;
    const source = link.querySelector('img');
    $('#photo-title').textContent = link.dataset.caption;
    $('#photo-description').textContent = link.dataset.description;
    $('#photo-counter').textContent = String(imageIndex + 1).padStart(2, '0') + ' / ' + String(galleryLinks.length).padStart(2, '0');
    $('#photo-error').hidden = true;
    image.hidden = false;
    image.alt = source.alt;
    image.src = link.href;
    const single = galleryLinks.length < 2;
    $('#previous-photo').disabled = single;
    $('#next-photo').disabled = single;
  };
  const changePhoto = delta => {
    if (!galleryLinks.length) return;
    imageIndex = (imageIndex + delta + galleryLinks.length) % galleryLinks.length;
    showPhoto();
  };
  const restorePhotoState = () => {
    body.classList.remove('modal-open', 'photo-open');
    image.removeAttribute('src');
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  };
  if (typeof dialog.showModal === 'function') {
    $$('[data-gallery]').forEach(link => link.addEventListener('click', event => {
      // Keep modified click and the native image link available.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      galleryLinks = $$('[data-gallery]').filter(item => !item.closest('.project-card').hidden);
      imageIndex = galleryLinks.indexOf(link);
      returnFocus = link;
      showPhoto();
      dialog.showModal();
      body.classList.add('modal-open', 'photo-open');
      $('#close-photo').focus({ preventScroll: true });
    }));
    $('#close-photo').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', restorePhotoState);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    $('#previous-photo').addEventListener('click', () => changePhoto(-1));
    $('#next-photo').addEventListener('click', () => changePhoto(1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    image.addEventListener('error', () => {
      if (!dialog.open || !image.getAttribute('src')) return;
      image.hidden = true;
      $('#photo-error').hidden = false;
    });
    image.addEventListener('load', () => {
      image.hidden = false;
      $('#photo-error').hidden = true;
    });
  }

  // One scheduled frame per scroll/resize burst. No continuous render loop.
  const hero = $('.hero');
  const heroPhoto = $('.hero-photo');
  const progress = $('.reading-progress');
  let frameId = 0;
  const paintScroll = () => {
    frameId = 0;
    const scrollY = window.scrollY;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
    progress.style.transform = 'scaleX(' + ratio + ')';
    header.classList.toggle('scrolled', scrollY > 12);
    if (reducedMotion.matches || window.innerWidth <= 600) {
      heroPhoto.style.transform = '';
    } else {
      const top = hero.getBoundingClientRect().top;
      const travel = Math.max(-32, Math.min(32, -top * 0.08));
      heroPhoto.style.transform = 'translate3d(0,' + travel.toFixed(2) + 'px,0)';
    }
  };
  const scheduleScroll = () => {
    if (!frameId) frameId = window.requestAnimationFrame(paintScroll);
  };
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  window.addEventListener('load', scheduleScroll, { once: true });
  paintScroll();

  // Elements are visible by default; animations never gate access to content.
  const revealAnimations = new Set();
  let revealObserver;
  if ('IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        revealObserver.unobserve(entry.target);
        if (reducedMotion.matches || entry.target.contains(document.activeElement)) return;
        const animation = entry.target.animate([
          { opacity: .3, transform: 'translateY(22px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 650, easing: 'cubic-bezier(.18,.7,.25,1)' });
        revealAnimations.add(animation);
        animation.finished.then(() => revealAnimations.delete(animation), () => revealAnimations.delete(animation));
      });
    }, { threshold: 0.08 });
    $$('[data-reveal]').forEach(element => revealObserver.observe(element));
    document.addEventListener('focusin', event => {
      const target = event.target.closest('[data-reveal]');
      if (!target) return;
      revealObserver.unobserve(target);
      target.getAnimations().forEach(animation => animation.cancel());
    });
  }
  if ('IntersectionObserver' in window) {
    const projectObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => body.classList.toggle('project-visible', entry.isIntersecting));
    }, { threshold: 0 });
    projectObserver.observe($('#project'));
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      revealAnimations.forEach(animation => animation.cancel());
      revealAnimations.clear();
    }
    scheduleScroll();
  });
})();
