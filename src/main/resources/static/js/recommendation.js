/* =============================================
   RECOMMENDATION ENGINE — Sections 6, 7, 8, 9
   ============================================= */

let recommendationHistory = [];

async function initRecommendationForm() {
  const form = document.getElementById('rec-form');
  const dobInput = document.getElementById('rec-dob');
  const zodiacInput = document.getElementById('rec-zodiac');

  if (!form) return;

  // Auto-fill zodiac from DOB
  if (dobInput) {
    dobInput.addEventListener('change', async () => {
      try {
        const zodiac = await api.calculateZodiac(dobInput.value);
        if (zodiac && zodiacInput) {
          zodiacInput.value = `${zodiac.symbol} ${zodiac.name}`;
          zodiacInput.style.borderColor = zodiac.wheelColor + '80';
          zodiacInput.style.color = zodiac.wheelColor;
        }
      } catch (e) {}
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit();
  });
}

async function handleFormSubmit() {
  const name = document.getElementById('rec-name')?.value?.trim();
  const email = document.getElementById('rec-email')?.value?.trim();
  const dob = document.getElementById('rec-dob')?.value;
  const purpose = document.getElementById('rec-purpose')?.value;

  // Validation
  const errors = [];
  if (!name) errors.push('rec-name');
  if (!email || !email.includes('@')) errors.push('rec-email');
  if (!dob) errors.push('rec-dob');
  if (!purpose) errors.push('rec-purpose');

  if (errors.length > 0) {
    errors.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.borderColor = 'rgba(239,68,68,0.6)';
        el.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
        setTimeout(() => {
          el.style.borderColor = '';
          el.style.boxShadow = '';
        }, 2000);
      }
    });
    return;
  }

  // Show loading
  showLoadingOverlay();

  try {
    const response = await api.createRecommendation({ name, email, dob, purpose });
    
    // We also need the full gemstone object and zodiac object for rendering
    const zodiac = ZODIAC_DATA.find(z => z.name === response.zodiacName);
    const gemstone = GEMSTONE_DATA.find(g => g.id === response.gemstoneId);
    
    if (zodiac && gemstone) {
      recommendationHistory.unshift(response);
      showRecommendationResult(name, zodiac, gemstone, response.scores, purpose);
      renderHistory();
      
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  } catch (err) {
    console.error(err);
    alert('Failed to generate recommendation. Please try again.');
  } finally {
    hideLoadingOverlay();
  }
}

function showLoadingOverlay() {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-text">Reading the stars...</div>
      <div style="font-size:0.78rem;color:rgba(255,255,255,0.3);margin-top:4px;letter-spacing:1px;">Aligning cosmic energies</div>
    `;
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'none';
}

function showRecommendationResult(name, zodiac, gemstone, scores, purpose) {
  const resultSection = document.getElementById('result-section');
  const resultContent = document.getElementById('result-content');
  const resultGreeting = document.getElementById('result-user-greeting');
  const matchSection = document.getElementById('match-score-section');

  if (!resultSection || !resultContent) return;

  resultSection.classList.remove('hidden');
  matchSection?.classList.remove('hidden');

  if (resultGreeting) {
    resultGreeting.textContent = `✦ ${name}, the cosmos has chosen your sacred stone ✦`;
  }

  const purposeLabels = {
    career: 'Career Growth', wealth: 'Wealth & Prosperity',
    education: 'Education', relationships: 'Relationships',
    health: 'Health & Healing', confidence: 'Confidence & Power',
  };

  const imgContent = gemstone.image
    ? `<img src="${gemstone.image}" alt="${gemstone.name}" class="result-gem-image" />`
    : `<div class="result-gem-emoji">${gemstone.emoji}</div>`;

  const benefits = gemstone.benefits.map(b =>
    `<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;">
       <span style="color:var(--gold);margin-top:2px;flex-shrink:0;">✦</span>
       <span style="font-size:0.9rem;color:var(--white-80);">${b}</span>
     </div>`
  ).join('');

  resultContent.innerHTML = `
    <div class="result-gem-panel">
      ${imgContent}
      <div class="result-gem-name">${gemstone.name.toUpperCase()}</div>
      <div style="font-size:0.85rem;color:var(--white-60);margin:8px 0 16px;">Recommended for ${zodiac.symbol} ${zodiac.name}</div>
      <div class="result-match-badge">✦ ${scores.overall}% Cosmic Match</div>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--glass-border);font-size:0.82rem;color:var(--white-40);">
        <div style="margin-bottom:6px;">🪐 Planet: <strong style="color:var(--white-70)">${gemstone.planet}</strong></div>
        <div>🎨 Color: <strong style="color:var(--white-70)">${gemstone.colorName}</strong></div>
      </div>
      <div class="result-actions" style="margin-top:24px;flex-direction:column;">
        <button class="btn btn-primary btn-full" id="download-report-btn" onclick="downloadReport()">
          <span>📄</span> Download My Report
        </button>
        <button class="btn btn-secondary btn-full" onclick="document.getElementById('recommendation-form').scrollIntoView({behavior:'smooth'})">
          ✦ New Reading
        </button>
      </div>
    </div>
    <div class="result-details-panel">
      <div class="result-card">
        <div class="result-card-label">✦ Purpose of Reading</div>
        <div class="result-card-value" style="font-family:var(--font-accent);font-size:1.2rem;">
          ${purposeLabels[purpose] || purpose}
        </div>
      </div>
      <div class="result-card">
        <div class="result-card-label">✦ About Your Stone</div>
        <div class="result-card-value">${gemstone.description}</div>
      </div>
      <div class="result-card">
        <div class="result-card-label">✦ Sacred Benefits</div>
        <div>${benefits}</div>
      </div>
      <div class="result-card">
        <div class="result-card-label">✦ Wearing Instructions</div>
        <div class="result-card-value">${gemstone.wearingInstructions}</div>
      </div>
      <div class="result-card">
        <div class="result-card-label">✦ Care & Cleansing</div>
        <div class="result-card-value">${gemstone.careInstructions}</div>
      </div>
      <div class="result-card">
        <div class="result-card-label">✦ Suitable For</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;">
          ${gemstone.zodiacSigns.map(s => `<span class="gem-sign-tag" style="font-size:0.82rem;">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  renderMatchScore(scores);
}

function renderMatchScore(scores) {
  const section = document.getElementById('match-score-section');
  const content = document.getElementById('match-score-content');
  if (!section || !content) return;

  content.innerHTML = `
    <div class="score-circle-wrap">
      <div class="score-circle">
        <svg class="score-svg" width="180" height="180" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#8a6e1a"/>
              <stop offset="100%" style="stop-color:#f5d76e"/>
            </linearGradient>
          </defs>
          <circle class="score-track" cx="90" cy="90" r="80"/>
          <circle class="score-fill" id="score-fill-circle" cx="90" cy="90" r="80"/>
        </svg>
        <div class="score-number-wrap">
          <span class="score-number" id="score-number">0%</span>
          <span class="score-label">Match</span>
        </div>
      </div>
      <div class="score-title">Cosmic Compatibility</div>
    </div>
    <div class="score-breakdown">
      <div class="score-breakdown-title">Why This Gemstone?</div>
      <div class="score-factor">
        <div class="factor-header">
          <span class="factor-label">♈ Zodiac Sign Match</span>
          <span class="factor-score">${scores.zodiacMatch}%</span>
        </div>
        <div class="factor-bar"><div class="factor-fill" id="factor-zodiac" style="width:0%"></div></div>
      </div>
      <div class="score-factor">
        <div class="factor-header">
          <span class="factor-label">${getElementEmoji(scores)} Element Alignment</span>
          <span class="factor-score">${scores.elementMatch}%</span>
        </div>
        <div class="factor-bar"><div class="factor-fill" id="factor-element" style="width:0%"></div></div>
      </div>
      <div class="score-factor">
        <div class="factor-header">
          <span class="factor-label">✦ Purpose Compatibility</span>
          <span class="factor-score">${scores.purposeMatch}%</span>
        </div>
        <div class="factor-bar"><div class="factor-fill" id="factor-purpose" style="width:0%"></div></div>
      </div>
    </div>
  `;

  setTimeout(() => animateScores(scores), 400);
}

function getElementEmoji(scores) {
  return scores.elementMatch >= 90 ? '🔥' : scores.elementMatch >= 80 ? '🌿' : '💧';
}

function animateScores(scores) {
  const circle = document.getElementById('score-fill-circle');
  const numEl = document.getElementById('score-number');
  const circumference = 2 * Math.PI * 80;

  if (circle) {
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    const offset = circumference * (1 - scores.overall / 100);
    setTimeout(() => { circle.style.strokeDashoffset = offset; }, 50);
  }

  if (numEl) {
    let start = 0;
    const end = scores.overall;
    const duration = 1500;
    const step = (end / duration) * 16;
    const counter = setInterval(() => {
      start = Math.min(start + step, end);
      numEl.textContent = Math.round(start) + '%';
      if (start >= end) clearInterval(counter);
    }, 16);
  }

  setTimeout(() => {
    const fz = document.getElementById('factor-zodiac');
    const fe = document.getElementById('factor-element');
    const fp = document.getElementById('factor-purpose');
    if (fz) fz.style.width = scores.zodiacMatch + '%';
    if (fe) fe.style.width = scores.elementMatch + '%';
    if (fp) fp.style.width = scores.purposeMatch + '%';
  }, 300);
}

async function renderHistory() {
  const timeline = document.getElementById('history-timeline');
  const emptyEl = document.getElementById('history-empty');
  if (!timeline) return;

  try {
    recommendationHistory = await api.getRecommendations();
  } catch (err) {
    console.error(err);
  }

  if (recommendationHistory.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  const purposeLabels = {
    career: 'Career Growth 💼', wealth: 'Wealth 💰',
    education: 'Education 📚', relationships: 'Relationships 💞',
    health: 'Health 🌿', confidence: 'Confidence 🦁',
  };

  const gemEmojiMap = {};
  GEMSTONE_DATA.forEach(g => { gemEmojiMap[g.id] = g.emoji; });

  const cards = recommendationHistory.slice(0, 8).map(rec => {
    const d = new Date(rec.date);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    return `
      <div class="history-card">
        <div class="history-date">
          <div class="history-day">${day}</div>
          <div class="history-month">${month}</div>
        </div>
        <div class="history-info">
          <div class="history-zodiac">${rec.zodiacSymbol} ${rec.zodiacName}</div>
          <div class="history-gem-name">${rec.gemstoneName}</div>
          <div class="history-purpose">${purposeLabels[rec.purpose] || rec.purpose}</div>
        </div>
        <div class="history-gem-icon">${gemEmojiMap[rec.gemstoneId] || '💎'}</div>
      </div>
    `;
  }).join('');

  timeline.innerHTML = `
    <div class="history-empty" id="history-empty" style="display:none;"></div>
    ${cards}
  `;
}

async function downloadReport() {
  const name = document.getElementById('rec-name')?.value || 'Seeker';
  const dob = document.getElementById('rec-dob')?.value || '';
  const purpose = document.getElementById('rec-purpose')?.value || '';
  
  if (!dob) return;
  
  try {
      const zodiac = await api.calculateZodiac(dob);
      if (!zodiac) return;
      
      // Look up existing recommendation in history
      const rec = recommendationHistory.find(r => r.name === name && r.dob === dob && r.purpose === purpose);
      if (!rec) return;
      
      const gemstone = GEMSTONE_DATA.find(g => g.id === rec.gemstoneId);
      if (!gemstone) return;

      const purposeLabels = {
        career: 'Career Growth', wealth: 'Wealth & Prosperity',
        education: 'Education', relationships: 'Relationships',
        health: 'Health & Healing', confidence: 'Confidence & Power',
      };

      const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const reportContent = `
    ╔══════════════════════════════════════════════════╗
    ║           ✦ G E M S O U L  R E P O R T ✦        ║
    ╚══════════════════════════════════════════════════╝

    Prepared for: ${name}
    Date: ${now}
    Zodiac Sign: ${zodiac.symbol} ${zodiac.name} (${zodiac.dateRange})
    Element: ${zodiac.element} | Planet: ${zodiac.planet}
    Purpose: ${purposeLabels[purpose] || purpose}

    ══════════════════════════════════════════════════

    YOUR SACRED GEMSTONE: ${gemstone.name.toUpperCase()}

    Color: ${gemstone.colorName}
    Planet: ${gemstone.planet}
    Cosmic Match Score: ${rec.scores.overall}%
      • Zodiac Match: ${rec.scores.zodiacMatch}%
      • Element Match: ${rec.scores.elementMatch}%
      • Purpose Match: ${rec.scores.purposeMatch}%

    ══════════════════════════════════════════════════

    ABOUT YOUR STONE
    ${gemstone.description}

    SACRED BENEFITS
    ${gemstone.benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}

    WEARING INSTRUCTIONS
    ${gemstone.wearingInstructions}

    CARE & CLEANSING
    ${gemstone.careInstructions}

    ══════════════════════════════════════════════════
    ✦ GemSoul — Aligning cosmic energy with sacred wisdom ✦
    www.gemsoul.com
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GemSoul_Report_${name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  } catch (err) {
      console.error(err);
  }
}
