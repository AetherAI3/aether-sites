const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const menu=document.querySelector('#site-menu'),toggle=document.querySelector('.menu-toggle');
function closeMenu(){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('is-open',open);});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
toggle.hidden=false;document.documentElement.classList.add('menu-ready');

if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.querySelectorAll('.tier').forEach(card=>{let cardFrame=0,x=0,y=0;card.addEventListener('pointermove',e=>{if(reduced.matches||document.documentElement.classList.contains('motion-paused'))return;const rect=card.getBoundingClientRect();x=e.clientX-rect.left;y=e.clientY-rect.top;if(!cardFrame)cardFrame=requestAnimationFrame(()=>{cardFrame=0;card.style.setProperty('--mx',x+'px');card.style.setProperty('--my',y+'px');});});card.addEventListener('pointerleave',()=>{cancelAnimationFrame(cardFrame);cardFrame=0;card.style.removeProperty('--mx');card.style.removeProperty('--my');});});}

const photos=[...document.querySelectorAll('[data-lightbox]')],figures=[...document.querySelectorAll('.gallery-item')],filterButtons=[...document.querySelectorAll('[data-filter]')];
let filter='all',activePhoto=0,opener=null;
const visiblePhotos=()=>photos.filter(a=>!a.closest('figure').hidden);
filterButtons.forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;figures.forEach(f=>{f.hidden=filter!=='all'&&f.dataset.category!==filter;});filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('#gallery-count').textContent=visiblePhotos().length+' PHOTOS';}));
document.querySelector('.gallery-controls').hidden=false;
const dialog = document.querySelector('#photo-dialog');
const media = dialog.querySelector('.dialog-media');
const caption = document.querySelector('#photo-caption');
const status = document.querySelector('#photo-status');
let image = document.querySelector('#dialog-image');
let request = 0;
let cancelLoad = null;

// Decode the actual element that will be displayed. A newer selection (or close)
// invalidates every older load, including an image whose decode finishes late.
async function showPhoto(index) {
  const visible = visiblePhotos();
  if (!visible.length) return;
  const version = ++request;
  cancelLoad?.();
  activePhoto = (index + visible.length) % visible.length;
  const anchor = visible[activePhoto];
  const source = anchor.querySelector('img');
  const next = new Image();
  next.id = 'dialog-image';
  next.alt = source.alt;
  next.width = Number(source.getAttribute('width'));
  next.height = Number(source.getAttribute('height'));
  next.decoding = 'async';
  caption.textContent = [...anchor.closest('figure').querySelector('figcaption').children]
    .map(element => element.textContent.trim()).join(' — ') + ` · ${activePhoto + 1} / ${visible.length}`;
  // Don't show the previous vehicle under the new vehicle's caption.
  image.hidden = true;
  media.setAttribute('aria-busy', 'true');
  status.textContent = 'Loading photo…';
  status.hidden = false;
  let cleanup;
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Photo timed out')), 15000);
      cleanup = () => { clearTimeout(timer); next.onload = null; next.onerror = null; };
      cancelLoad = () => { cleanup(); reject(new Error('Selection changed')); };
      next.onload = () => { cleanup(); resolve(); };
      next.onerror = () => { cleanup(); reject(new Error('Photo unavailable')); };
      next.src = anchor.href;
    });
    if (version !== request || !dialog.open) return;
    if (typeof next.decode === 'function') {
      try { await next.decode(); } catch { if (!next.naturalWidth) throw new Error('Photo unavailable'); }
    }
    if (version !== request || !dialog.open) return;
    image.replaceWith(next);
    image = next;
    status.hidden = true;
  } catch {
    if (version !== request || !dialog.open) return;
    status.textContent = 'This photo couldn’t load. Try another photo or close and reopen it.';
  } finally {
    cleanup?.();
    if (version === request) { media.setAttribute('aria-busy', 'false'); cancelLoad = null; }
  }
}
if (typeof dialog.showModal === 'function') {
  photos.forEach(anchor => anchor.addEventListener('click', event => {
    // Keep native new-tab / modifier-click behavior.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = anchor;
    dialog.showModal();
    document.documentElement.classList.add('gallery-open');
    showPhoto(visiblePhotos().indexOf(anchor));
  }));
  document.querySelector('#close-photo').addEventListener('click', () => dialog.close());
  document.querySelector('#previous-photo').addEventListener('click', () => showPhoto(activePhoto - 1));
  document.querySelector('#next-photo').addEventListener('click', () => showPhoto(activePhoto + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); showPhoto(activePhoto + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    ++request; cancelLoad?.(); cancelLoad = null;
    media.setAttribute('aria-busy', 'false'); status.hidden = true; image.hidden = true;
    document.documentElement.classList.remove('gallery-open');
    opener?.focus({ preventScroll: true });
  });
}
