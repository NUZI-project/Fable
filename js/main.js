'use strict';
/* ══ main.js ══ */

/* Loader */
(function(){
  const lo=document.getElementById('loader');
  if(!lo)return;
  const hide=()=>{
    lo.classList.add('out');
    document.body.classList.add('loaded');
    setTimeout(()=>{lo.classList.add('gone'); initHero();},520);
  };
  document.readyState==='complete'?setTimeout(hide,1800):window.addEventListener('load',()=>setTimeout(hide,1800));
})();

function initHero(){
  document.querySelectorAll('#top .rv').forEach(el=>{
    const d=parseInt(el.dataset.d||0);
    setTimeout(()=>el.classList.add('in'),d+200);
  });
}

/* Cursor */
(function(){
  const c=document.getElementById('cur'), r=document.getElementById('cur-ring');
  if(!c||!r)return;
  if(window.matchMedia('(pointer:coarse)').matches){c.remove();r.remove();return;}
  let mx=0,my=0,fx=0,fy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;c.style.left=mx+'px';c.style.top=my+'px'});
  (function loop(){fx+=(mx-fx)*.1;fy+=(my-fy)*.1;r.style.left=fx+'px';r.style.top=fy+'px';requestAnimationFrame(loop)})();
  document.querySelectorAll('a,button,.gslide,.feat-card,.vibe-card,.rcard,.mi').forEach(el=>{
    el.addEventListener('mouseenter',()=>{c.style.width='14px';c.style.height='14px';r.style.width='52px';r.style.height='52px';r.style.borderColor='var(--gold)'});
    el.addEventListener('mouseleave',()=>{c.style.width='8px';c.style.height='8px';r.style.width='32px';r.style.height='32px';r.style.borderColor='var(--gold)'});
  });
  document.addEventListener('mouseleave',()=>{c.style.opacity='0';r.style.opacity='0'});
  document.addEventListener('mouseenter',()=>{c.style.opacity='1';r.style.opacity='.5'});
})();

/* Navbar */
(function(){
  const nav=document.getElementById('nav');
  if(!nav)return;
  let lastY=0;
  const update=()=>{
    const y=window.scrollY;
    nav.classList.toggle('scrolled',y>60);
    if(y>300){
      nav.style.transform=y>lastY+4?'translateY(-100%)':'translateY(0)';
    } else nav.style.transform='translateY(0)';
    lastY=y;
  };
  window.addEventListener('scroll',update,{passive:true}); update();

  nav.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const t=document.querySelector(a.getAttribute('href'));
      if(!t)return; e.preventDefault();
      window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-nav.offsetHeight-16,behavior:'smooth'});
      document.getElementById('navMobile').classList.remove('open');
      document.getElementById('burger').classList.remove('open');
    });
  });
})();

/* Burger */
(function(){
  const btn=document.getElementById('burger'), m=document.getElementById('navMobile');
  if(!btn||!m)return;
  btn.addEventListener('click',()=>{btn.classList.toggle('open');m.classList.toggle('open')});
})();

/* Menu tabs */
(function(){
  document.querySelectorAll('.mtab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.mtab').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.menu-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      const panel=document.getElementById('tab-'+btn.dataset.tab);
      if(panel){
        panel.classList.add('active');
        // re-trigger reveal for newly visible items
        panel.querySelectorAll('.rv:not(.in)').forEach(el=>{
          const d=parseInt(el.dataset.d||0);
          setTimeout(()=>el.classList.add('in'),d);
        });
      }
    });
  });
})();

/* Universal slider */
function makeSlider({trackId,prevId,nextId,dotsId,slideClass}){
  const track=document.getElementById(trackId);
  const dotsWrap=document.getElementById(dotsId);
  const prev=document.getElementById(prevId), next=document.getElementById(nextId);
  if(!track)return;
  const slides=()=>track.querySelectorAll(slideClass);
  let cur=0;

  function buildDots(){
    if(!dotsWrap)return;
    dotsWrap.innerHTML='';
    slides().forEach((_,i)=>{
      const d=document.createElement('button');
      d.className='db'+(i===0?' on':'');
      d.setAttribute('aria-label','Slide '+(i+1));
      d.addEventListener('click',()=>goto(i));
      dotsWrap.appendChild(d);
    });
  }
  buildDots();

  function updateDots(i){
    if(!dotsWrap)return;
    dotsWrap.querySelectorAll('.db').forEach((d,j)=>d.classList.toggle('on',j===i));
  }

  function goto(i){
    const all=slides(); if(!all.length)return;
    cur=Math.max(0,Math.min(i,all.length-1));
    track.scrollTo({left:all[cur].offsetLeft-(track.clientWidth*.04),behavior:'smooth'});
    updateDots(cur);
  }

  if(prev)prev.addEventListener('click',()=>goto(cur-1));
  if(next)next.addEventListener('click',()=>goto(cur+1));

  let st;
  track.addEventListener('scroll',()=>{
    clearTimeout(st);
    st=setTimeout(()=>{
      const all=slides(); if(!all.length)return;
      let mn=Infinity,ci=0;
      all.forEach((s,i)=>{const d=Math.abs(s.offsetLeft-track.scrollLeft);if(d<mn){mn=d;ci=i}});
      cur=ci; updateDots(cur);
    },80);
  },{passive:true});

  /* Drag */
  let down=false,sx=0,sl=0;
  track.addEventListener('mousedown',e=>{down=true;sx=e.pageX-track.offsetLeft;sl=track.scrollLeft});
  track.addEventListener('mouseleave',()=>down=false);
  track.addEventListener('mouseup',()=>down=false);
  track.addEventListener('mousemove',e=>{if(!down)return;e.preventDefault();track.scrollLeft=sl-(e.pageX-track.offsetLeft-sx)*1.4});

  /* Touch */
  let tx=0;
  track.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
  track.addEventListener('touchend',e=>{
    const diff=tx-e.changedTouches[0].clientX;
    if(Math.abs(diff)>48)goto(diff>0?cur+1:cur-1);
  });
}

makeSlider({trackId:'gTrack',prevId:'gPrev',nextId:'gNext',dotsId:'gDots',slideClass:'.gslide'});
makeSlider({trackId:'rTrack',prevId:'rPrev',nextId:'rNext',dotsId:'rDots',slideClass:'.rcard'});
makeSlider({trackId:'featuredTrack',prevId:null,nextId:null,dotsId:null,slideClass:'.feat-card'});

/* Floating WA */
(function(){
  const wa=document.getElementById('fwa');
  if(!wa)return;
  window.addEventListener('scroll',()=>wa.classList.toggle('show',window.scrollY>400),{passive:true});
})();

/* Active nav highlight */
(function(){
  const secs=document.querySelectorAll('section[id]');
  const links=document.querySelectorAll('.nav-links a');
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        links.forEach(l=>{l.style.color='';if(l.getAttribute('href')==='#'+e.target.id)l.style.color='var(--gold)'});
      }
    });
  },{threshold:.4,rootMargin:'-80px 0px -40% 0px'});
  secs.forEach(s=>io.observe(s));
})();
