/* =============================================
   GEMSTONE LIBRARY — Section 5
   ============================================= */

function initGemstoneLibrary() {
  const grid = document.getElementById('gemstone-grid');
  if (!grid) return;

  renderGemstones('all');

  // Filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderGemstones(filter);
    });
  });
}

function renderGemstones(filter) {
  const grid = document.getElementById('gemstone-grid');
  if (!grid) return;

  const gems = filter === 'all'
    ? GEMSTONE_DATA
    : GEMSTONE_DATA.filter(g => g.element === filter);

  // Animate out
  grid.style.opacity = '0';
  grid.style.transform = 'translateY(10px)';

  setTimeout(() => {
    grid.innerHTML = gems.map((gem, i) => createGemCard(gem, i)).join('');
    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
    grid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    // Attach click handlers
    grid.querySelectorAll('.gem-card').forEach((card, i) => {
      const gemId = card.dataset.gemId;
      card.addEventListener('click', () => openGemModal(gemId));
      // Stagger entrance animation
      card.style.animationDelay = `${i * 0.05}s`;
    });
  }, 200);
}

function createGemCard(gem, index) {
  const imgContent = gem.image
    ? `<img src="${gem.image}" alt="${gem.name}" class="gem-card-img" loading="lazy" />`
    : `<div class="gem-card-emoji" style="background: linear-gradient(135deg, ${gem.color}22, ${gem.color}08);">
         <span style="filter: drop-shadow(0 0 20px ${gem.color}80)">${gem.emoji}</span>
       </div>`;

  const signs = gem.zodiacSigns.map(s =>
    `<span class="gem-sign-tag">${s}</span>`
  ).join('');

  return `
    <div class="gem-card" data-gem-id="${gem.id}" data-element="${gem.element}" style="animation: fadeInUp 0.5s ease both; animation-delay: ${index * 0.05}s">
      ${imgContent}
      <div class="gem-card-body">
        <h3 class="gem-card-name">${gem.name}</h3>
        <div class="gem-card-color">
          <div class="gem-color-dot" style="background: ${gem.color}; box-shadow: 0 0 6px ${gem.color}80;"></div>
          <span class="gem-color-label">${gem.colorName}</span>
        </div>
        <div class="gem-card-signs">${signs}</div>
        <p class="gem-card-desc">${gem.description.substring(0, 80)}...</p>
        <div style="margin-top:12px; font-size:0.75rem; color:var(--gold-dim); display:flex; align-items:center; gap:6px;">
          <span>🪐</span> <span>${gem.planet}</span>
        </div>
      </div>
    </div>
  `;
}

function openGemModal(gemId) {
  const gem = GEMSTONE_DATA.find(g => g.id === gemId);
  if (!gem) return;

  const overlay = document.getElementById('gem-modal-overlay');
  const content = document.getElementById('modal-content');
  if (!overlay || !content) return;

  const imgContent = gem.image
    ? `<img src="${gem.image}" alt="${gem.name}" style="width:100%;max-width:200px;border-radius:12px;margin-bottom:12px;box-shadow:0 12px 40px rgba(0,0,0,0.5);" />`
    : `<div style="font-size:6rem;margin-bottom:12px;filter:drop-shadow(0 0 20px ${gem.color}80)">${gem.emoji}</div>`;

  const benefits = gem.benefits.map(b => `<li style="margin-bottom:6px;color:var(--white-80);font-size:0.88rem;">✦ ${b}</li>`).join('');
  const signs = gem.zodiacSigns.map(s => `<span class="gem-sign-tag" style="font-size:0.8rem;">${s}</span>`).join('');

  content.innerHTML = `
    <div class="modal-gem-header">
      ${imgContent}
      <div class="modal-gem-name">${gem.name.toUpperCase()}</div>
      <div class="modal-gem-subtitle">Sacred Gemstone of ${gem.planet}</div>
      <div class="gem-card-signs" style="justify-content:center;margin-top:8px;">${signs}</div>
    </div>
    <div class="modal-detail-grid">
      <div class="modal-detail">
        <div class="modal-detail-label">Color</div>
        <div class="modal-detail-value" style="display:flex;align-items:center;gap:8px;">
          <span style="width:12px;height:12px;border-radius:50%;background:${gem.color};display:inline-block;box-shadow:0 0 6px ${gem.color}80;"></span>
          ${gem.colorName}
        </div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Ruling Planet</div>
        <div class="modal-detail-value">🪐 ${gem.planet}</div>
      </div>
      <div class="modal-detail" style="grid-column:1/-1;">
        <div class="modal-detail-label">Description</div>
        <div class="modal-detail-value" style="font-size:0.9rem;line-height:1.6;">${gem.description}</div>
      </div>
      <div class="modal-detail" style="grid-column:1/-1;">
        <div class="modal-detail-label">Benefits</div>
        <ul style="padding:0;list-style:none;margin-top:4px;">${benefits}</ul>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Wearing Instructions</div>
        <div class="modal-detail-value" style="font-size:0.85rem;line-height:1.6;">${gem.wearingInstructions}</div>
      </div>
      <div class="modal-detail">
        <div class="modal-detail-label">Care Instructions</div>
        <div class="modal-detail-value" style="font-size:0.85rem;line-height:1.6;">${gem.careInstructions}</div>
      </div>
    </div>
  `;

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeGemModal() {
  const overlay = document.getElementById('gem-modal-overlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

// Add CSS for fadeInUp animation
const gemStyle = document.createElement('style');
gemStyle.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(gemStyle);
