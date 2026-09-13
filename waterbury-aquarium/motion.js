/* Progressive enhancement. Content, contact links and native details work without JS. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (menu && nav) {
    root.classList.add('nav-enhanced');
    menu.hidden = false;
    const setMenu = open => { menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); };
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
    });
    document.addEventListener('click', event => { if (!header.contains(event.target)) setMenu(false); });
    const mobile = matchMedia('(max-width: 800px)');
    mobile.addEventListener('change', () => setMenu(false));
  }

  // Category filters never imply current availability or species compatibility.
  const toolbar = document.querySelector('.catalog-toolbar');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  const catalogStatus = document.querySelector('#catalog-status');
  const filterCatalog = value => {
    if (!filterButtons.some(button => button.dataset.filter === value)) return;
    let count = 0;
    cards.forEach(card => {
      card.hidden = value !== 'all' && !card.dataset.category.split(' ').includes(value);
      card.classList.add('is-in');
      if (!card.hidden) count++;
    });
    filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    catalogStatus.textContent = `${count} ${count === 1 ? 'category' : 'categories'} to explore`;
  };
  if (toolbar && cards.length) {
    toolbar.hidden = false;
    filterButtons.forEach(button => button.addEventListener('click', () => filterCatalog(button.dataset.filter)));
  }

  // Optional agent interface uses the same visible category action.
  if (document.modelContext?.registerTool) {
    const lifecycle = new AbortController();
    const categoryValues = filterButtons.map(button => button.dataset.filter);
    try {
      Promise.resolve(document.modelContext.registerTool({
        name: 'filter_aquarium_categories',
        title: 'Filter aquarium shop categories',
        description: 'Show categories in this illustrative shop guide. Does not check live inventory or reserve livestock.',
        inputSchema: { type: 'object', properties: { category: { type: 'string', enum: categoryValues } }, required: ['category'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          if (!input || typeof input !== 'object' || Object.keys(input).length !== 1 || !categoryValues.includes(input.category)) throw new Error('Choose a supported shop category.');
          filterCatalog(input.category);
          return { category: input.category, visibleCategories: cards.filter(card => !card.hidden).map(card => card.querySelector('h3').textContent), liveInventory: false };
        }
      }, { signal: lifecycle.signal })).catch(() => {});
      window.addEventListener('pagehide', event => { if (!event.persisted) lifecycle.abort(); });
    } catch { /* Optional API: ordinary controls remain available. */ }
  }

  // A local checklist, not a reservation or message to the shop.
  const planner = document.querySelector('#planner-form');
  let currentList = '';
  if (planner) {
    const output = document.querySelector('#visit-list');
    const list = document.querySelector('#plan-items');
    const status = document.querySelector('#copy-status');
    const fallback = document.querySelector('#copy-fallback');
    planner.querySelector('[type="submit"]').hidden = false;
    planner.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(planner);
      const interests = data.getAll('interest');
      const items = data.get('project') === 'new'
        ? ['Bring the planned tank dimensions and a photo or sketch of the space.', 'Ask about a suitable tank, stand, filtration and the steps needed before adding livestock.']
        : ['Bring tank dimensions, equipment details, recent water-test results and a photo.', 'List all current fish, shrimp and other residents before discussing additions.'];
      if (interests.includes('plants')) items.push('Ask which available plants suit your lighting, substrate and maintenance plans.');
      if (interests.includes('shrimp')) items.push('Ask which shrimp, if any, suit your water conditions and current tankmates.');
      if (interests.includes('hardscape')) items.push('Bring layout dimensions; ask about available rocks and driftwood, preparation and water suitability.');
      if (!interests.length) items.push('Talk through your goals and ask what is available for your setup.');
      items.push('Call (203) 757-3832 to confirm stock, prices and hours before the trip.');
      list.replaceChildren(...items.map(item => { const li = document.createElement('li'); li.textContent = item; return li; }));
      currentList = `Waterbury Aquarium — my visit list\n406 Watertown Ave, Waterbury, CT\n\n${items.map(item => `• ${item}`).join('\n')}`;
      status.textContent = '';
      fallback.hidden = true;
      output.hidden = false;
      output.focus({ preventScroll: true });
      output.scrollIntoView({ behavior: root.classList.contains('motion-off') ? 'auto' : 'smooth', block: 'nearest' });
    });
    document.querySelector('#copy-plan').addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(currentList);
        status.textContent = 'Visit list copied. Nothing has been sent to the shop.';
      } catch {
        fallback.value = currentList;
        fallback.hidden = false;
        fallback.focus();
        fallback.select();
        status.textContent = 'Select and copy the list below. Nothing has been sent to the shop.';
      }
    });
  }

  // Make decorative content deterministic and lightweight.
  document.querySelectorAll('.bubble-field').forEach(field => {
    const count = Math.min(12, Math.max(0, Number(field.dataset.bubbles) || 0));
    for (let i = 0; i < count; i++) {
      const bubble = document.createElement('i');
      bubble.className = 'bubble';
      bubble.style.setProperty('--x', `${12 + (i * 23) % 76}%`);
      bubble.style.setProperty('--s', `${5 + (i * 3) % 8}px`);
      bubble.style.setProperty('--d', `${10 + i % 6}s`);
      bubble.style.setProperty('--delay', `${-i * 1.7}s`);
      field.append(bubble);
    }
  });

  const motionButton = document.querySelector('#motion-toggle');
  let manuallyPaused = false;
  let revealObserver;
  const revealTargets = [...document.querySelectorAll('.reveal')];
  const exposeAll = () => {
    revealObserver?.disconnect();
    revealTargets.forEach(target => target.classList.add('is-in'));
    root.classList.remove('motion-ready');
  };
  const updateMotion = () => {
    const off = reduce.matches || manuallyPaused;
    root.classList.toggle('motion-off', off);
    if (off) exposeAll();
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', String(off));
      motionButton.textContent = reduce.matches ? 'Reduced motion enabled' : off ? 'Resume motion' : 'Pause motion';
      motionButton.disabled = reduce.matches;
    }
  };
  if (motionButton) {
    motionButton.hidden = false;
    motionButton.addEventListener('click', () => { manuallyPaused = !manuallyPaused; updateMotion(); });
  }
  reduce.addEventListener('change', updateMotion);
  updateMotion();

  if ('IntersectionObserver' in window) {
    try {
      const headerObserver = new IntersectionObserver(entries => {
        header?.classList.toggle('is-scrolled', !entries[0].isIntersecting);
      });
      const sentinel = document.querySelector('#top-sentinel');
      if (sentinel) headerObserver.observe(sentinel);
      const art = document.querySelector('.hero-art');
      const ambientObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('ambient-paused', !entry.isIntersecting)));
      if (art) ambientObserver.observe(art);
      if (!reduce.matches) {
        revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-in'); revealObserver.unobserve(entry.target); }
        }), { threshold: 0, rootMargin: '0px 0px -24px 0px' });
        revealTargets.forEach((target, index) => {
          target.style.setProperty('--i', String(index % 3));
          // Visible content is never briefly hidden during initialization.
          if (target.getBoundingClientRect().top < innerHeight) target.classList.add('is-in');
          else revealObserver.observe(target);
        });
        root.classList.add('motion-ready');
      }
    } catch { exposeAll(); header?.classList.add('is-scrolled'); }
  } else header?.classList.add('is-scrolled');
  document.addEventListener('focusin', event => event.target.closest('.reveal')?.classList.add('is-in'));
  const syncVisibility = () => root.classList.toggle('tab-hidden', document.hidden);
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
  if (header && 'ResizeObserver' in window) {
    new ResizeObserver(() => root.style.setProperty('--header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`)).observe(header);
  }
})();
