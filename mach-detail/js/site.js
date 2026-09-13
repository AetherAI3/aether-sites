const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const menu=document.querySelector('#site-menu'),toggle=document.querySelector('.menu-toggle');
function closeMenu(){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('is-open',open);});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
toggle.hidden=false;document.documentElement.classList.add('menu-ready');

if('IntersectionObserver' in window){
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;if(!reduced.matches)entry.target.animate([{opacity:.3,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});reveal.unobserve(entry.target);}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));
  const navLinks=[...menu.querySelectorAll('a')];
  const spy=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)navLinks.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}),{rootMargin:'-20% 0px -55% 0px'});
  document.querySelectorAll('main section[id]').forEach(section=>spy.observe(section));
}
reduced.addEventListener('change',()=>{if(reduced.matches)document.getAnimations().forEach(animation=>animation.cancel());});
let frame=0;
function paint(){frame=0;const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress-bar').style.setProperty('--scroll',max>0?String(Math.min(1,scrollY/max)):'0');}
function schedule(){if(!frame&&!reduced.matches)frame=requestAnimationFrame(paint);}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});paint();
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.querySelectorAll('.tier').forEach(card=>{let cardFrame=0,x=0,y=0;card.addEventListener('pointermove',e=>{if(reduced.matches)return;const rect=card.getBoundingClientRect();x=e.clientX-rect.left;y=e.clientY-rect.top;if(!cardFrame)cardFrame=requestAnimationFrame(()=>{cardFrame=0;card.style.setProperty('--mx',x+'px');card.style.setProperty('--my',y+'px');});});card.addEventListener('pointerleave',()=>{cancelAnimationFrame(cardFrame);cardFrame=0;card.style.removeProperty('--mx');card.style.removeProperty('--my');});});}

const photos=[...document.querySelectorAll('[data-lightbox]')],figures=[...document.querySelectorAll('.gallery-item')],filterButtons=[...document.querySelectorAll('[data-filter]')];
let filter='all',activePhoto=0,opener=null;
const visiblePhotos=()=>photos.filter(a=>!a.closest('figure').hidden);
filterButtons.forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;figures.forEach(f=>{f.hidden=filter!=='all'&&f.dataset.category!==filter;});filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('#gallery-count').textContent=visiblePhotos().length+' PHOTOS';}));
document.querySelector('.gallery-controls').hidden=false;
const dialog=document.querySelector('#photo-dialog'),image=document.querySelector('#dialog-image'),caption=document.querySelector('#photo-caption');
function showPhoto(index){const visible=visiblePhotos();activePhoto=(index+visible.length)%visible.length;const a=visible[activePhoto],source=a.querySelector('img');image.src=a.href;image.alt=source.alt;image.width=source.width;image.height=source.height;caption.textContent=[...a.closest('figure').querySelector('figcaption').children].map(el=>el.textContent.trim()).join(' — ')+` · ${activePhoto+1} / ${visible.length}`;}
if(typeof dialog.showModal==='function'){
 photos.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();opener=a;showPhoto(visiblePhotos().indexOf(a));dialog.showModal();}));
 document.querySelector('#close-photo').addEventListener('click',()=>dialog.close());
 document.querySelector('#previous-photo').addEventListener('click',()=>showPhoto(activePhoto-1));document.querySelector('#next-photo').addEventListener('click',()=>showPhoto(activePhoto+1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showPhoto(activePhoto+(e.key==='ArrowRight'?1:-1));}});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>opener?.focus());
}
