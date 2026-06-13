/* =============================================
   TESTIMONIALS CAROUSEL — Section 10
   ============================================= */

function initTestimonials() {
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (!track || !TESTIMONIALS_DATA.length) return;

  let currentIndex = 0;
  let autoplayInterval;
  let cardsPerView = getCardsPerView();
  const total = TESTIMONIALS_DATA.length;

  // Render cards
  track.innerHTML = TESTIMONIALS_DATA.map((t, i) => `
    <div class="testimonial-card" id="tcard-${i}">
      <div class="test-stars">${'★'.repeat(t.stars)}</div>
      <p class="test-quote">"${t.quote}"</p>
      <div class="test-author">
        <div class="test-avatar">${t.avatar}</div>
        <div>
          <div class="test-author-name">${t.name}</div>
          <div class="test-author-sign">${t.sign}</div>
        </div>
      </div>
    </div>
  `).join('');

  // Create dots
  const maxIndex = Math.max(0, total - cardsPerView);
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('button');
    dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
    dot.id = `cdot-${i}`;
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer?.appendChild(dot);
  }

  function getCardsPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 1;
    return 3;
  }

  function goTo(index) {
    cardsPerView = getCardsPerView();
    const maxIdx = Math.max(0, total - cardsPerView);
    currentIndex = Math.max(0, Math.min(index, maxIdx));

    if (window.innerWidth <= 600) {
      // On mobile, just show active card
      track.querySelectorAll('.testimonial-card').forEach((card, i) => {
        card.style.display = i === currentIndex ? 'block' : 'none';
      });
    } else {
      const cardWidth = track.querySelector('.testimonial-card')?.offsetWidth || 0;
      const gap = 24;
      track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
    }

    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function next() {
    const maxIdx = Math.max(0, total - getCardsPerView());
    goTo(currentIndex < maxIdx ? currentIndex + 1 : 0);
  }

  function prev() {
    const maxIdx = Math.max(0, total - getCardsPerView());
    goTo(currentIndex > 0 ? currentIndex - 1 : maxIdx);
  }

  prevBtn?.addEventListener('click', () => { clearInterval(autoplayInterval); prev(); startAutoplay(); });
  nextBtn?.addEventListener('click', () => { clearInterval(autoplayInterval); next(); startAutoplay(); });

  function startAutoplay() {
    autoplayInterval = setInterval(next, 5000);
  }

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) {
      clearInterval(autoplayInterval);
      dx > 0 ? next() : prev();
      startAutoplay();
    }
  });

  window.addEventListener('resize', () => goTo(currentIndex));
  startAutoplay();
}
