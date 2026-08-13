(() => {
  'use strict';

  /* ---------- Nav: scrolled shadow + mobile menu ---------- */
  const nav = document.getElementById('siteNav');
  const burger = document.getElementById('navBurger');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('mobile-open');
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  document.querySelectorAll('.nav-mobile a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Case study chart draw-in ---------- */
  const caseCard = document.querySelector('.case-card');
  if (caseCard) {
    const caseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          caseObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    caseObserver.observe(caseCard);
  }

  /* ---------- Count-up numbers ---------- */
  const countEls = document.querySelectorAll('.count');

  function formatNumber(value, decimals) {
    if (decimals > 0) return value.toFixed(decimals);
    return Math.round(value).toString();
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 3000; /* slightly slower count-up for better perception */
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * eased;
      el.textContent = `${prefix}${formatNumber(current, decimals)}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${prefix}${formatNumber(target, decimals)}${suffix}`;
      }
    }
    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  countEls.forEach(el => countObserver.observe(el));

  /* ---------- Video: click to play inline, same tab ---------- */
  const YOUTUBE_ID = '11tgHWHT_Wk';
  const YOUTUBE_START = 2; // seconds, from the shared link (&t=2s)

  const videoBlock = document.getElementById('videoBlock');
  const playBtn = document.getElementById('playBtn');
  const videoGrid = document.getElementById('videoGrid');

  function playInline() {
    const frame = document.createElement('div');
    frame.className = 'video-frame';
    frame.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${YOUTUBE_ID}?start=${YOUTUBE_START}&autoplay=1&rel=0&modestbranding=1"
        title="Mojo Dojo case studies"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>`;
    videoBlock.innerHTML = '';
    videoBlock.appendChild(frame);
    videoBlock.style.cursor = 'default';
  }

  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playInline();
  });
  videoGrid.addEventListener('click', playInline);
  videoGrid.setAttribute('role', 'button');
  videoGrid.setAttribute('tabindex', '0');
  videoGrid.setAttribute('aria-label', 'Play Mojo Dojo case study reel');
  videoGrid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playInline();
    }
  });
})();
