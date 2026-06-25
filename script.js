/* ============================================================
   SANDHYA YADAV PORTFOLIO — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Nav: scroll class + hamburger ───────────────────────── */
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 48);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  /* ── Active nav link on scroll ───────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  function setActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* ── Counter animation ────────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── Intersection Observer ───────────────────────────────── */
  const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -48px 0px' };

  // Reveal animation for general elements
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Service cards with stagger
  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0, 10);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.service-card').forEach(el => cardObs.observe(el));

  // Stat counters
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => statObs.observe(el));

  // Add reveal class to key sections
  const revealTargets = [
    '.about-text', '.about-visual',
    '.pub-item', '.port-card',
    '.testi-card', '.fiverr-card', '.fiverr-text',
    '.yt-card', '.contact-text', '.contact-form',
    '.section-title', '.pub-intro', '.yt-intro', '.services-sub'
  ];
  revealTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        if (el.dataset.delay === undefined) el.style.transitionDelay = (i * 80) + 'ms';
        revealObs.observe(el);
      }
    });
  });

  /* ── Portfolio filter ────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portCards  = document.querySelectorAll('.port-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      portCards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.style.opacity    = match ? '1' : '0';
        card.style.transform  = match ? 'scale(1)' : 'scale(0.92)';
        card.style.pointerEvents = match ? 'auto' : 'none';
        card.style.position   = match ? '' : 'absolute';

        // Small bounce for matching cards
        if (match) {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        }
      });
    });
  });

  /* ── Contact form ────────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      // Validate required fields
      ['name', 'email', 'message'].forEach(id => {
        const field = form.querySelector('#' + id);
        if (!field || !field.value.trim()) {
          field && field.classList.add('error');
          valid = false;
        }
      });

      // Email format
      const emailField = form.querySelector('#email');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        valid = false;
      }

      if (!valid) {
        // Shake the submit button
        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.style.animation = 'none';
        submitBtn.offsetHeight; // reflow
        submitBtn.style.animation = 'shake 0.4s ease';
        return;
      }

      // Simulate submission
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.innerHTML = `
          <div class="form-success" style="display:block; padding:40px; text-align:center;">
            <div style="font-size:2.5rem; margin-bottom:16px;">✅</div>
            <h3 style="font-family:var(--font-display); font-size:1.4rem; color:var(--navy); margin-bottom:8px;">Message sent!</h3>
            <p style="color:var(--slate); font-size:0.92rem;">Thank you for reaching out. I'll get back to you within 24 hours.</p>
          </div>
        `;
      }, 1200);
    });
  }

  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ── Molecule parallax (subtle) ──────────────────────────── */
  const moleculeSvg = document.querySelector('.molecule-svg');
  if (moleculeSvg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      moleculeSvg.style.transform = `translateY(${scrolled * 0.12}px)`;
    }, { passive: true });
  }

  /* ── Add shake keyframe dynamically ─────────────────────── */
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25%       { transform: translateX(-8px); }
      75%       { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(styleSheet);

})();
