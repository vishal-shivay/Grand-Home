/* ═══════════════════════════════════════════════════════════════
   GRAND HOME CONSTRUCTION LTD — Main JavaScript
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ──────────────────────────────────────────────────
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('loaded'), 1800);
    });
  }

  // ── AOS INIT ────────────────────────────────────────────────
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  // ── NAVBAR SCROLL ──────────────────────────────────────────
  const nav = document.getElementById('mainNav');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ── ACTIVE NAV LINK ────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ── COUNTER ANIMATION ──────────────────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (counters.length) {
    const countUp = (el) => {
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // ── TESTIMONIAL SLIDER ────────────────────────────────────
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if (track) {
    const cards = track.querySelectorAll('.testi-card');
    let current = 0;
    let perView = window.innerWidth >= 992 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const total = cards.length;
    const maxIndex = total - perView;

    // Build dots
    if (dotsContainer) {
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('div');
        dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    const updateDots = () => {
      document.querySelectorAll('.testi-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    };

    const goTo = (idx) => {
      current = Math.max(0, Math.min(idx, maxIndex));
      const cardW = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardW}px)`;
      updateDots();
    };

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    // Auto-slide
    let autoSlide = setInterval(() => goTo(current + 1 > maxIndex ? 0 : current + 1), 5000);
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => goTo(current + 1 > maxIndex ? 0 : current + 1), 5000);
    });

    window.addEventListener('resize', () => {
      perView = window.innerWidth >= 992 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      goTo(0);
    });
  }

  // ── PROJECT FILTER ──────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      masonryItems.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.display = 'block';
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            if (item.style.opacity === '0') item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // ── CONTACT FORM ────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const origText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
      btn.disabled = true;
      setTimeout(() => {
        contactForm.innerHTML = `
          <div class="form-success show text-center py-4">
            <div style="width:72px;height:72px;background:linear-gradient(135deg,#C9933A,#e0aa55);
              border-radius:50%;display:flex;align-items:center;justify-content:center;
              margin:0 auto 20px;font-size:2rem;color:#0e1829">
              <i class="fas fa-check"></i>
            </div>
            <h3 style="font-family:'Playfair Display',serif;color:#1B2A4A;margin-bottom:12px">
              Message Sent!
            </h3>
            <p style="color:#667;margin-bottom:24px">
              Thank you for reaching out. Our team will contact you within 24 hours.
            </p>
            <a href="index.html" class="btn btn-gold">Return Home</a>
          </div>
        `;
      }, 2000);
    });
  }

  // ── GSAP HERO ANIMATION ─────────────────────────────────────
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax
    const heroBg = document.querySelector('.hero-img');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          scrub: 1
        }
      });
    }
  }

  // ── SMOOTH ANCHOR SCROLL ───────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── SERVICE CARD TILT ──────────────────────────────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
