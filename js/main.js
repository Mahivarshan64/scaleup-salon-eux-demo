/* ============================================================
   SCALEUP UNISEX SALON — MAIN JS
   Complete animation & interaction system
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. PAGE LOAD SEQUENCE — Hero clip-up reveal
  ---------------------------------------------------------- */
  const heroLines = document.querySelectorAll('.hero-line span');
  if (heroLines.length) {
    heroLines.forEach((span, i) => {
      setTimeout(() => {
        span.style.transform = 'translateY(0)';
      }, 300 + i * 120);
    });

    // Gold divider draws after headline finishes
    const divider = document.querySelector('.hero-divider');
    if (divider) {
      setTimeout(() => {
        divider.style.width = '100px';
      }, 300 + heroLines.length * 120 + 200);
    }
  }

  /* Inner page hero reveal */
  const pageHeroSpan = document.querySelector('.page-hero h1 span, .gallery-hero h1 span, .about-hero h1 span, .contact-hero h1 span');
  if (pageHeroSpan) {
    requestAnimationFrame(() => {
      setTimeout(() => pageHeroSpan.classList.add('revealed'), 200);
    });
  }

  /* ----------------------------------------------------------
     2. NAV SCROLL STATE
  ---------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ----------------------------------------------------------
     3. NAV ACTIVE STATE
  ---------------------------------------------------------- */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentFile ||
      (currentFile === '' && href === 'index.html') ||
      (currentFile === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     4. MOBILE MENU
  ---------------------------------------------------------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     5. MARQUEE — clone for infinite loop
  ---------------------------------------------------------- */
  document.querySelectorAll('.marquee-track, .marquee-track-reverse').forEach(track => {
    const clone = track.innerHTML;
    track.innerHTML = clone + clone;
  });

  /* ----------------------------------------------------------
     6. SCROLL REVEALS — IntersectionObserver
  ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '-60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     7. WORD-BY-WORD REVEAL (specialty headline)
  ---------------------------------------------------------- */
  const specialtyLines = document.querySelectorAll('.specialty-headline-line span');
  specialtyLines.forEach(line => {
    const words = line.textContent.trim().split(/\s+/);
    line.innerHTML = words.map(w =>
      `<span class="word-outer" style="display:inline-block;overflow:hidden;vertical-align:bottom">` +
      `<span class="word-inner" style="display:inline-block;transform:translateY(100%);transition:transform 0.6s cubic-bezier(0.16,1,0.3,1)">${w}&nbsp;</span>` +
      `</span>`
    ).join('');
  });

  const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const inners = entry.target.querySelectorAll('.word-inner');
        inners.forEach((inner, i) => {
          setTimeout(() => {
            inner.style.transform = 'translateY(0)';
          }, i * 40);
        });
        wordObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const specialtyHeadline = document.querySelector('.specialty-headline');
  if (specialtyHeadline) wordObserver.observe(specialtyHeadline);

  /* ----------------------------------------------------------
     8. STATS COUNT-UP (easeOutExpo)
  ---------------------------------------------------------- */
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function countUp(el, target, duration) {
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(target * easeOutExpo(progress));
      el.textContent = value + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + (el.dataset.suffix || '');
    }
    requestAnimationFrame(step);
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target, parseInt(entry.target.dataset.count), 2000);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

  /* ----------------------------------------------------------
     9. VERTICAL ACCORDION (services preview)
  ---------------------------------------------------------- */
  const serviceRows = document.querySelectorAll('.service-row');

  serviceRows.forEach(row => {
    const header = row.querySelector('.service-row-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');
      serviceRows.forEach(r => r.classList.remove('open'));
      if (!isOpen) row.classList.add('open');
    });
  });

  // Auto-open first row on desktop
  if (window.innerWidth > 768 && serviceRows.length > 0) {
    serviceRows[0].classList.add('open');
  }

  // On mobile, expand all service rows (no collapse)
  function handleMobileServices() {
    if (window.innerWidth <= 768) {
      serviceRows.forEach(row => {
        const body = row.querySelector('.service-row-body');
        if (body) {
          body.style.maxHeight = 'none';
          body.style.overflow = 'visible';
        }
      });
    } else {
      serviceRows.forEach(row => {
        const body = row.querySelector('.service-row-body');
        if (body && !row.classList.contains('open')) {
          body.style.maxHeight = '';
          body.style.overflow = '';
        }
      });
    }
  }

  handleMobileServices();
  window.addEventListener('resize', handleMobileServices);

  /* ----------------------------------------------------------
     10. GALLERY FILTER (gallery page)
  ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.ge-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('ge-ghost');
        } else {
          item.classList.add('ge-ghost');
        }
      });
    });
  });

  /* About page hero image parallax */
  const aboutHeroImg = document.querySelector('.about-hero-image');
  let aboutTicking = false;

  if (aboutHeroImg) {
    const wrap = aboutHeroImg.parentElement;
    window.addEventListener('scroll', () => {
      if (!aboutTicking) {
        requestAnimationFrame(() => {
          if (!wrap) return;
          const rect = wrap.getBoundingClientRect();
          if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
            const offset = (window.scrollY - (wrap.offsetTop || 0)) * 0.25;
            aboutHeroImg.style.transform = `translateY(${offset}px)`;
          }
          aboutTicking = false;
        });
        aboutTicking = true;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     12. CONTACT FORM SUBMIT
  ---------------------------------------------------------- */
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = bookingForm.querySelector('.form-submit');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      btn.style.letterSpacing = '0.15em';

      // Replace this timeout with an actual fetch() to your backend
      setTimeout(() => {
        btn.textContent = 'Request Received!';
        btn.style.background = 'var(--burgundy)';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.style.letterSpacing = '';
          btn.disabled = false;
          bookingForm.reset();
        }, 3500);
      }, 1500);
    });
  }

  /* ----------------------------------------------------------
     13. SMOOTH ANCHOR SCROLL
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     15. TESTIMONIALS CAROUSEL (fan layout, 5 cards, nav arrows)
  ---------------------------------------------------------- */
  (function initTestimonialsStack() {
    const scene = document.querySelector('.tstack-scene');
    if (!scene) return;

    const cards = Array.from(scene.querySelectorAll('.tstack-card'));
    if (cards.length < 2) return;

    let active = Math.floor(cards.length / 2);
    let revealed = false;

    const xMul = () => window.innerWidth <= 480 ? 0.42 : window.innerWidth <= 768 ? 0.58 : 1;

    // Transform config by relative position from active card (-2 to +2)
    const POS = {
      '-2': { x: -420, y: 20, rz: -16, sc: 0.72, op: 0    },
      '-1': { x: -200, y: 10, rz: -11, sc: 0.88, op: 0.88 },
       '0': { x:    0, y:  0, rz:   0, sc: 1.00, op: 1    },
       '1': { x:  200, y: 10, rz:  11, sc: 0.88, op: 0.88 },
       '2': { x:  420, y: 20, rz:  16, sc: 0.72, op: 0    },
    };

    function applyCard(card, cfg, mul, withTransition) {
      card.style.transition = withTransition
        ? 'transform 0.65s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease'
        : 'none';
      card.style.transform =
        `translateX(calc(-50% + ${(cfg.x * mul).toFixed(1)}px)) ` +
        `translateY(${cfg.y}px) rotateZ(${cfg.rz}deg) scale(${cfg.sc})`;
      card.style.opacity = cfg.op;
    }

    function setInitial() {
      const n = cards.length - 1;
      cards.forEach((card, i) => {
        const offset = i - active;
        card.style.transition = 'none';
        card.style.zIndex = n - Math.abs(offset);
        card.style.transform =
          `translateX(-50%) translateY(${Math.abs(offset) * 6}px) rotateZ(${offset * 0.8}deg) scale(${0.92 - Math.abs(offset) * 0.04})`;
        card.style.opacity = 0;
      });
    }

    function render(withTransition) {
      const mul = xMul();
      const dots = scene.querySelectorAll('.tstack-dot');
      cards.forEach((card, i) => {
        const pos = Math.max(-2, Math.min(2, i - active));
        const cfg = POS[pos.toString()];
        card.style.zIndex = 10 - Math.abs(i - active);
        applyCard(card, cfg, mul, withTransition);
      });
      dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
    }

    setInitial();

    // Reveal on scroll entry
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !revealed) {
        revealed = true;
        setTimeout(() => render(true), 100);
      }
    }, { threshold: 0.15 }).observe(scene);

    // Navigation
    const prevBtn = scene.querySelector('.tstack-prev');
    const nextBtn = scene.querySelector('.tstack-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (active > 0) { active--; render(true); }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (active < cards.length - 1) { active++; render(true); }
      });
    }

    scene.querySelectorAll('.tstack-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => { active = i; render(true); });
    });

    window.addEventListener('resize', () => { if (revealed) render(false); }, { passive: true });
  }());

  /* ----------------------------------------------------------
     14. STAGGER REVEAL for child elements
  ---------------------------------------------------------- */
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll(':scope > *');
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.07}s`;
          child.classList.add('visible');
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '-40px 0px' });

  document.querySelectorAll('.stagger-parent').forEach(el => staggerObserver.observe(el));

});
