/* ===== You & Me Salon — Interactions + GSAP ScrollTrigger ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navbar scroll effect --- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile nav --- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  const openMobile = () => {
    mobileNav.classList.add('open');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeMobile = () => {
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMobile);
  mobileClose.addEventListener('click', closeMobile);
  mobileOverlay.addEventListener('click', closeMobile);
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobile));

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  /* --- IntersectionObserver reveal (fallback if GSAP not loaded) --- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* --- Stagger delays --- */
  document.querySelectorAll('.services-grid, .testimonial-track, .showcase-grid, .values-grid, .team-grid').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.12}s`;
    });
  });

  /* --- Counter animation --- */
  const statEls = document.querySelectorAll('.hero-stat h3');
  let statsCounted = false;
  const animateCount = (el) => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    let current = 0;
    const increment = target / (1800 / 16);
    const tick = () => {
      current += increment;
      if (current >= target) { el.textContent = target + suffix; return; }
      el.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(tick);
    };
    tick();
  };
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statEls.forEach(animateCount);
        }
      });
    }, { threshold: 0.5 }).observe(statsSection);
  }

  /* --- Parallax blob --- */
  const blob = document.querySelector('.hero-blob');
  if (blob) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      blob.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  /* --- Contact form handler --- */
  const form = document.getElementById('enquiryForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = '✓ Enquiry Sent!';
      btn.style.background = '#6b8f6b';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send Enquiry →';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  /* ==============================================
     GSAP ScrollTrigger — enhanced animations
     ============================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    /* --- Parallax background images --- */
    document.querySelectorAll('[data-parallax-speed]').forEach(bg => {
      const speed = parseFloat(bg.dataset.parallaxSpeed) || 0.3;
      gsap.to(bg, {
        yPercent: speed * 30,
        ease: 'none',
        scrollTrigger: {
          trigger: bg.closest('.parallax-section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    /* --- data-gsap="fade-up" elements --- */
    document.querySelectorAll('[data-gsap="fade-up"]').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    /* --- Hero entrance --- */
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image-frame');
    if (heroContent && heroImage) {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(heroContent, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' })
        .fromTo(heroImage, { opacity: 0, x: 60, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.7')
        .fromTo('.hero-stats', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3');
    }

    /* --- Service cards stagger --- */
    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60, rotateX: 5 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' }
        }
      );
    });

    /* --- Service detail alternating slide --- */
    gsap.utils.toArray('.service-detail').forEach((detail) => {
      const img = detail.querySelector('.service-detail-image');
      const content = detail.querySelector('.service-detail-content');
      if (img && content) {
        gsap.fromTo(img, { opacity: 0, x: -60 },
          { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: detail, start: 'top 75%' } });
        gsap.fromTo(content, { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: 1, delay: 0.2, ease: 'power3.out', scrollTrigger: { trigger: detail, start: 'top 75%' } });
      }
    });

    /* --- Testimonial cards --- */
    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, delay: i * 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 85%' }
        }
      );
    });

    /* --- Gallery items --- */
    gsap.utils.toArray('.showcase-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.7, delay: i * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 85%' }
        }
      );
    });

    /* --- Team cards --- */
    gsap.utils.toArray('.team-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, delay: i * 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' }
        }
      );
    });

    /* --- Value cards --- */
    gsap.utils.toArray('.value-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40, rotateY: 8 },
        {
          opacity: 1, y: 0, rotateY: 0, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' }
        }
      );
    });

    /* --- Contact info cards stagger --- */
    gsap.utils.toArray('.contact-info-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.6, delay: i * 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 88%' }
        }
      );
    });

    /* --- CTA banner scale-in --- */
    const ctaBanner = document.querySelector('.cta-banner .container');
    if (ctaBanner) {
      gsap.fromTo(ctaBanner,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: ctaBanner, start: 'top 80%' }
        }
      );
    }

    /* --- Parallax on hero image (subtle float) --- */
    if (heroImage) {
      gsap.to(heroImage, {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    /* --- Page hero title parallax --- */
    const pageHeroH1 = document.querySelector('.page-hero h1');
    if (pageHeroH1) {
      gsap.to(pageHeroH1, {
        y: -30,
        opacity: 0.6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.page-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

});
