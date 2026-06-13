/* =============================================
   ZODIAC CALCULATOR — Section 2
   ============================================= */

function initZodiacCalculator() {
  const dobInput = document.getElementById('zodiac-dob');
  const calcBtn = document.getElementById('calc-zodiac-btn');
  const resultCard = document.getElementById('zodiac-result-card');

  if (!dobInput || !calcBtn || !resultCard) return;

  // Live calculation as user types
  dobInput.addEventListener('change', () => {
    if (dobInput.value) triggerZodiacCalc();
  });

  calcBtn.addEventListener('click', () => {
    if (!dobInput.value) {
      dobInput.classList.add('shake');
      dobInput.addEventListener('animationend', () => dobInput.classList.remove('shake'), { once: true });
      return;
    }
    triggerZodiacCalc();
  });

  async function triggerZodiacCalc() {
    try {
      const zodiac = await api.calculateZodiac(dobInput.value);
      if (!zodiac) return;

      // Animate out first
      resultCard.style.opacity = '0';
      resultCard.style.transform = 'scale(0.95)';

      setTimeout(() => {
        renderZodiacResult(zodiac, resultCard);
        resultCard.style.opacity = '1';
        resultCard.style.transform = 'scale(1)';
      }, 200);
    } catch (e) {
      console.error(e);
    }
  }

  // Add CSS for shake animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
    .shake { animation: shake 0.4s ease; border-color: rgba(239,68,68,0.6) !important; }
    .zodiac-result-card { transition: opacity 0.2s ease, transform 0.2s ease; }
  `;
  document.head.appendChild(style);
}

function renderZodiacResult(zodiac, container) {
  const colorDots = zodiac.luckyColors.map(c =>
    `<div class="color-dot" style="background:${c}; box-shadow: 0 0 8px ${c}80;"></div>`
  ).join('');

  const traitChips = zodiac.traits.map(t =>
    `<span class="trait-chip">${t}</span>`
  ).join('');

  container.classList.add('zodiac-filled');
  container.innerHTML = `
    <div>
      <div class="zc-symbol">${zodiac.symbol}</div>
      <div class="zc-name">${zodiac.name.toUpperCase()}</div>
      <div class="zc-date-range">${zodiac.dateRange}</div>
      <div class="zc-tags">
        <span class="zc-tag tag-element">${zodiac.elementEmoji} ${zodiac.element}</span>
        <span class="zc-tag tag-planet">🪐 ${zodiac.planet}</span>
      </div>
      <div class="zc-traits-title">Personality Traits</div>
      <div class="zc-traits">${traitChips}</div>
      <div class="zc-traits-title">Lucky Colors</div>
      <div class="zc-lucky-colors">
        <span class="lucky-label">✦</span>
        ${colorDots}
      </div>
    </div>
  `;

  // Also sync with recommendation form if open
  const recDobInput = document.getElementById('rec-dob');
  const recZodiacInput = document.getElementById('rec-zodiac');
  if (recZodiacInput && !recDobInput?.value) {
    recZodiacInput.value = `${zodiac.symbol} ${zodiac.name}`;
  }
}
