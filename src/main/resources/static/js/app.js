/* =============================================
   APP MAIN — Initializes all modules
   ============================================= */

// Add section animation CSS immediately (before DOMContentLoaded)
const appStyle = document.createElement('style');
appStyle.textContent = `
  .section {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .section.section-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .hero {
    opacity: 1 !important;
    transform: none !important;
  }
  /* Cursor sparkle */
  .sparkle-dot {
    position: fixed; pointer-events: none; z-index: 9998;
    width: 6px; height: 6px; border-radius: 50%;
    background: radial-gradient(circle, #f5d76e, #c9a227);
    transform: translate(-50%, -50%) scale(1);
    animation: sparkleFade 0.6s ease forwards;
  }
  @keyframes sparkleFade {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -80%) scale(0.2); }
  }
  /* Smooth image load for static hero */
  #hero-gem-img { opacity: 0; transition: opacity 0.6s ease; }
  #hero-gem-img.loaded { opacity: 1; }
  
  /* Make sure other images don't get hidden */
  img.dynamic-loaded { animation: fadeIn 0.4s ease forwards; }
`;
document.head.appendChild(appStyle);

document.addEventListener('DOMContentLoaded', () => {
  dismissPreloader();
  initNavbar();
  initConstellationCanvas();
  initZodiacCalculator();
  initZodiacWheel();
  loadData();
  initRecommendationForm();
  initTestimonials();
  initModalHandlers();
  initScrollAnimations();
  initFooterStars();
  initImageLazyLoad();
  initCursorSparkle();
  renderHistory();
});

/* ---------- Preloader ---------- */
function dismissPreloader() {
  const preloader = document.getElementById('page-preloader');
  if (!preloader) return;
  // Wait for fonts + a minimum brand moment
  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    setTimeout(() => preloader.remove(), 500);
  }, 900);
}

/* ---------- Navbar scroll effect ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!navbar) return;

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks?.classList.toggle('open');
    document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
  });

  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Constellation Hero Canvas ---------- */
function initConstellationCanvas() {
  new ConstellationCanvas('constellationCanvas', {
    starCount: 160,
    maxDist: 110,
    speed: 0.25,
  });
}

/* ---------- Footer Stars ---------- */
function initFooterStars() {
  new FooterStars('footerStarsCanvas');
}

/* ---------- Modal Handlers ---------- */
function initModalHandlers() {
  const closeBtn = document.getElementById('modal-close');
  const overlay = document.getElementById('gem-modal-overlay');
  closeBtn?.addEventListener('click', closeGemModal);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeGemModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeGemModal();
  });
}

/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
  // Timeline step reveal
  const steps = document.querySelectorAll('.timeline-step');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
      }
    });
  }, { threshold: 0.15 });
  steps.forEach(step => stepObserver.observe(step));

  // Section fade-in reveal
  const sections = document.querySelectorAll('.section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });
  sections.forEach(s => sectionObserver.observe(s));

  // Hero parallax on scroll
  const heroImg = document.getElementById('hero-gem-img');
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (heroImg && scrolled < window.innerHeight) {
      heroImg.style.transform = `translateY(${scrolled * 0.07}px)`;
    }
    if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.03}px)`;
    }
  }, { passive: true });

  // KPI number animation when admin charts scroll into view
  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('kpi-animate');
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.kpi-card').forEach(c => kpiObserver.observe(c));
}

/* ---------- Image Lazy-Load with Fade ---------- */
function initImageLazyLoad() {
  const heroImg = document.getElementById('hero-gem-img');
  if (heroImg) {
    if (heroImg.complete) {
      heroImg.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
      heroImg.addEventListener('error', () => heroImg.classList.add('loaded'));
    }
  }
}

/* ---------- Cursor Sparkle Effect (desktop only) ---------- */
function initCursorSparkle() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
  let lastSparkle = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkle < 80) return; // throttle
    lastSparkle = now;
    const dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    // Random size & color variation
    const size = Math.random() * 5 + 3;
    const hue = Math.random() > 0.5 ? '#f5d76e' : '#c9a227';
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.background = `radial-gradient(circle, white, ${hue})`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  });
}
