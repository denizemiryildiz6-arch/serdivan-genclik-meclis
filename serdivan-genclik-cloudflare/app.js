const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
const dockMenu=document.querySelector('.dock-menu');
function setMenu(open){menu?.setAttribute('aria-expanded',String(open));menu?.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç');dockMenu?.setAttribute('aria-expanded',String(open));dockMenu?.classList.toggle('active',open);nav?.classList.toggle('open',open)}
menu?.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
dockMenu?.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
nav?.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){setMenu(false);(window.innerWidth<=740?dockMenu:menu)?.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('header')&&!e.target.closest('.mobile-dock'))setMenu(false)});
const filters=[...document.querySelectorAll('[data-filter]')];
const cards=[...document.querySelectorAll('[data-category]')];
const search=document.querySelector('#news-search');
let selectedFilter='all';
function filterNews(){const query=(search?.value||'').trim().toLocaleLowerCase('tr');let count=0;cards.forEach(card=>{const match=(selectedFilter==='all'||card.dataset.category===selectedFilter)&&card.textContent.toLocaleLowerCase('tr').includes(query);card.hidden=!match;if(match){count++;card.classList.remove('is-pending')}});const status=document.querySelector('#filter-status');if(status)status.textContent=`${count} çalışma gösteriliyor.`;const empty=document.querySelector('#no-results');if(empty)empty.hidden=count!==0;}
filters.forEach(button=>button.addEventListener('click',()=>{selectedFilter=button.dataset.filter;filters.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});filterNews()}));
search?.addEventListener('input',filterNews);
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window&&!reducedMotion.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('is-pending');observer.unobserve(entry.target)}}),{threshold:.06});document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('is-pending');observer.observe(el)});}
const carousel=document.querySelector('.news-carousel');
if(carousel){
 const slides=[...carousel.querySelectorAll('.news-slide')];const dots=[...carousel.querySelectorAll('[data-slide]')];const progress=carousel.querySelector('.slide-progress');const pause=carousel.querySelector('.slide-pause');let index=0;let timer;let paused=reducedMotion.matches;let hovering=false;let focused=false;
 function stop(){clearInterval(timer);progress.classList.remove('running');}
 function play(){stop();pause.textContent=paused?'Oynat':'Duraklat';pause.setAttribute('aria-label',paused?'Otomatik geçişi başlat':'Otomatik geçişi durdur');if(paused||hovering||focused||document.hidden)return;progress.getBoundingClientRect();progress.classList.add('running');timer=setInterval(()=>show(index+1,false),7000);}
 function show(next,restart=true){index=(next+slides.length)%slides.length;slides.forEach((slide,i)=>{const current=i===index;slide.classList.toggle('current',current);slide.inert=!current;slide.setAttribute('aria-hidden',String(!current));});dots.forEach((dot,i)=>{dot.classList.toggle('active',i===index);dot.setAttribute('aria-pressed',String(i===index))});if(restart)play();}
 dots.forEach(dot=>dot.addEventListener('click',()=>show(Number(dot.dataset.slide))));carousel.querySelector('.slide-next').addEventListener('click',()=>show(index+1));carousel.querySelector('.slide-prev').addEventListener('click',()=>show(index-1));pause.addEventListener('click',()=>{paused=!paused;play()});
 carousel.addEventListener('mouseenter',()=>{hovering=true;stop()});carousel.addEventListener('mouseleave',()=>{hovering=false;play()});carousel.addEventListener('focusin',()=>{focused=true;stop()});carousel.addEventListener('focusout',e=>{if(!carousel.contains(e.relatedTarget)){focused=false;play()}});document.addEventListener('visibilitychange',play);reducedMotion.addEventListener('change',()=>{paused=reducedMotion.matches;play()});
 let touchX=0;let touchY=0;carousel.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;touchY=e.changedTouches[0].clientY},{passive:true});carousel.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;const dy=e.changedTouches[0].clientY-touchY;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))show(index+(dx<0?1:-1))},{passive:true});play();
}
function updateDock(){const home=location.pathname.endsWith('/')||location.pathname.endsWith('/index.html');document.querySelectorAll('.mobile-dock a').forEach(a=>{const href=a.getAttribute('href');const active=home&&(location.hash?href.endsWith(location.hash):href==='index.html');a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}window.addEventListener('hashchange',updateDock);updateDock();
