'use strict';
/* ══ animations.js ══ */

/* Scroll reveal */
(function(){
  const els = document.querySelectorAll('.rv');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el=e.target, d=parseInt(el.dataset.d||0);
        setTimeout(()=>el.classList.add('in'), d);
        io.unobserve(el);
      }
    });
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>io.observe(el));
})();

/* Scroll progress */
(function(){
  const bar=document.getElementById('sp');
  if(!bar)return;
  window.addEventListener('scroll',()=>{
    const p=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
    bar.style.width=Math.min(p,100).toFixed(1)+'%';
  },{passive:true});
})();

/* Particles */
(function(){
  const c=document.getElementById('particles');
  if(!c)return;
  for(let i=0;i<24;i++){
    const p=document.createElement('div');
    p.className='pt';
    const sz=1+Math.random()*2.5;
    p.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;--d:${6+Math.random()*8}s;--dl:${Math.random()*6}s;--tx:${(Math.random()-.5)*80}px;--ty:${-(50+Math.random()*120)}px`;
    c.appendChild(p);
  }
})();

/* Smooth image load */
document.querySelectorAll('img').forEach(img=>{
  img.classList.add('loading');
  const done=()=>{img.classList.remove('loading');img.classList.add('loaded')};
  img.complete?done():img.addEventListener('load',done);
});

/* Gallery lightbox */
document.querySelectorAll('.gslide').forEach(slide=>{
  slide.addEventListener('click',()=>{
    const img=slide.querySelector('img');
    if(!img)return;
    const ov=document.createElement('div'); ov.className='lb-overlay';
    const im=document.createElement('img'); im.src=img.src; im.className='lb-img'; im.alt=img.alt;
    const cl=document.createElement('button'); cl.className='lb-close'; cl.innerHTML='✕';
    ov.appendChild(im); ov.appendChild(cl); document.body.appendChild(ov);
    document.body.style.overflow='hidden';
    const close=()=>{ov.style.opacity='0';ov.style.transition='opacity .2s';setTimeout(()=>{ov.remove();document.body.style.overflow=''},200)};
    cl.addEventListener('click',close);
    ov.addEventListener('click',e=>{if(e.target===ov)close()});
    document.addEventListener('keydown',function k(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',k)}});
  });
});

/* Card 3D tilt */
document.querySelectorAll('.vibe-card').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect();
    const rx=((e.clientY-r.top)/r.height-.5)*8;
    const ry=((e.clientX-r.left)/r.width-.5)*-8;
    c.style.transform=`translateY(-6px) perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  c.addEventListener('mouseleave',()=>c.style.transform='');
});

/* Counter animation */
function animateCount(el){
  const target=parseFloat(el.dataset.count||0);
  const dec=target%1!==0;
  const dur=1600, start=performance.now();
  const ease=t=>1-Math.pow(1-t,3);
  const tick=now=>{
    const p=Math.min((now-start)/dur,1);
    el.textContent=dec?(ease(p)*target).toFixed(1):Math.round(ease(p)*target);
    if(p<1)requestAnimationFrame(tick);
    else el.textContent=dec?target.toFixed(1):target;
  };
  requestAnimationFrame(tick);
}
const cio=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){animateCount(e.target);cio.unobserve(e.target)}});
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));
