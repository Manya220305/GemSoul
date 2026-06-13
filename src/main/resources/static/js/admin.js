/* =============================================
   ADMIN DASHBOARD JS
   Charts, tables, tabs, and data management
   ============================================= */

// Chart instances (vanilla canvas — no Chart.js dependency)
const adminCharts = {};

document.addEventListener('DOMContentLoaded', () => {
  initAdminClock();
  initAdminTabs();
  loadAdminData();
  
  // Wait for GEMSTONE_DATA to load if it's async
  setTimeout(() => renderGemCatalog(), 500); 
});

/* ---------- Clock ---------- */
function initAdminClock() {
  const el = document.getElementById('admin-time');
  if (!el) return;
  const update = () => {
    el.textContent = new Date().toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };
  update();
  setInterval(update, 30000);
}

/* ---------- Tabs ---------- */
function initAdminTabs() {
  const links = document.querySelectorAll('.sidebar-link');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      const tabEl = document.getElementById(`tab-content-${tab}`);
      if (tabEl) {
        tabEl.classList.add('active');
        if (tab === 'analytics') renderAnalyticsCharts();
      }
    });
  });
}

/* ---------- Load & display all admin data ---------- */
async function loadAdminData() {
  try {
    const [stats, recs] = await Promise.all([
      api.getAdminStats(),
      api.getRecommendations()
    ]);

    updateKPIs(stats, recs);
    renderTrendChart(recs);
    renderPurposeChart(recs);
    renderZodiacChart(stats);
    renderGemChart(stats);
    renderRecommendationsTable(recs);
    renderAnalyticsCharts(stats, recs);
    renderGemLeaderboard(stats);

    const weekKey = getAdminISOWeek(new Date());
    document.getElementById('sb-total').textContent = stats.totalRecs || 0;
    document.getElementById('sb-week').textContent = stats.weeklyRecs?.[weekKey] || 0;
  } catch (e) {
    console.error('Failed to load admin data', e);
  }
}

function updateKPIs(stats, recs) {
  const weekKey = getAdminISOWeek(new Date());
  const weekCount = stats.weeklyRecs?.[weekKey] || 0;
  const total = stats.totalRecs || 0;

  let topGem = '—', topGemCount = 0;
  if (stats.gemCounts) {
    Object.entries(stats.gemCounts).forEach(([name, count]) => {
      if (count > topGemCount) { topGem = name; topGemCount = count; }
    });
  }

  let topZodiac = '—', topZodiacCount = 0;
  if (stats.zodiacCounts) {
    Object.entries(stats.zodiacCounts).forEach(([name, count]) => {
      if (count > topZodiacCount) { topZodiac = name; topZodiacCount = count; }
    });
  }

  animateCount('kpi-total-val', total);
  animateCount('kpi-week-val', weekCount);
  document.getElementById('kpi-gem-val').textContent = topGem;
  document.getElementById('kpi-zodiac-val').textContent = topZodiac;
  document.getElementById('kpi-total-trend').textContent = `+${weekCount} this week`;
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 30);
}

/* ---------- TREND CHART (line) ---------- */
function renderTrendChart(recs) {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = 200;

  const labels = [];
  const values = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    values.push(recs.filter(r => r.date.startsWith(key)).length);
  }

  drawLineChart(ctx, canvas.width, canvas.height, labels, values, '#c9a227');
}

function drawLineChart(ctx, w, h, labels, values, color) {
  ctx.clearRect(0, 0, w, h);
  const padL = 40, padR = 16, padT = 16, padB = 36;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const maxVal = Math.max(...values, 1);

  for (let i = 0; i <= 4; i++) {
    const y = padT + (chartH * (1 - i / 4));
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal * i / 4), padL - 6, y + 4);
  }

  const pts = values.map((v, i) => ({
    x: padL + (i / (labels.length - 1)) * chartW,
    y: padT + chartH * (1 - v / maxVal),
  }));

  ctx.beginPath();
  ctx.moveTo(pts[0].x, padT + chartH);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, padT + chartH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
  grad.addColorStop(0, `${color}30`);
  grad.addColorStop(1, `${color}00`);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#0a1428';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  labels.forEach((label, i) => {
    const x = padL + (i / (labels.length - 1)) * chartW;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, h - 8);
  });
}

/* ---------- PURPOSE CHART (donut) ---------- */
function renderPurposeChart(recs) {
  const canvas = document.getElementById('purposeChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = 200;

  const labels = ['Career', 'Wealth', 'Education', 'Love', 'Health', 'Confidence'];
  const keys = ['career', 'wealth', 'education', 'relationships', 'health', 'confidence'];
  const colors = ['#c9a227', '#16a34a', '#3b82f6', '#ec4899', '#22d3ee', '#7c3aed'];
  const values = keys.map(k => recs.filter(r => r.purpose === k).length);
  const total = values.reduce((a, b) => a + b, 0) || 1;

  drawDonutChart(ctx, canvas.width, canvas.height, labels, values, colors, total);
}

function drawDonutChart(ctx, w, h, labels, values, colors, total) {
  ctx.clearRect(0, 0, w, h);
  const cx = w * 0.38, cy = h / 2;
  const outerR = Math.min(cx, cy) * 0.85;
  const innerR = outerR * 0.6;

  let startAngle = -Math.PI / 2;
  values.forEach((val, i) => {
    if (val === 0) return;
    const slice = (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#050a18';
    ctx.fill();
    startAngle += slice;
  });

  ctx.fillStyle = 'rgba(201,162,39,0.9)';
  ctx.font = `bold 18px 'Cinzel', serif`;
  ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy + 6);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('readings', cx, cy + 20);

  const legendX = w * 0.68;
  let legendY = cy - (labels.length * 16) / 2;
  labels.forEach((label, i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(legendX, legendY - 7, 10, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${label} (${values[i]})`, legendX + 14, legendY + 3);
    legendY += 20;
  });
}

/* ---------- ZODIAC CHART (horizontal bars) ---------- */
function renderZodiacChart(stats) {
  const canvas = document.getElementById('zodiacChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = 260;

  const counts = stats.zodiacCounts || {};
  const signs = ZODIAC_DATA.map(z => z.name);
  const values = signs.map(s => counts[s] || 0);
  const colors = ZODIAC_DATA.map(z => z.wheelColor);

  drawBarChart(ctx, canvas.width, canvas.height, signs, values, colors);
}

function drawBarChart(ctx, w, h, labels, values, colors) {
  ctx.clearRect(0, 0, w, h);
  const padL = 80, padR = 16, padT = 12, padB = 12;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const maxVal = Math.max(...values, 1);
  const barH = Math.floor(chartH / labels.length) - 4;

  labels.forEach((label, i) => {
    const y = padT + i * (chartH / labels.length);
    const barWidth = (values[i] / maxVal) * chartW;

    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(padL, y + 1, chartW, barH);

    if (barWidth > 0) {
      const grad = ctx.createLinearGradient(padL, 0, padL + barWidth, 0);
      grad.addColorStop(0, colors[i] + '99');
      grad.addColorStop(1, colors[i]);
      ctx.fillStyle = grad;
      ctx.fillRect(padL, y + 1, barWidth, barH);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(label, padL - 6, y + barH / 2 + 4);

    ctx.fillStyle = values[i] > 0 ? colors[i] : 'rgba(255,255,255,0.2)';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(values[i], padL + barWidth + 4, y + barH / 2 + 4);
  });
}

/* ---------- GEMSTONE CHART (horizontal bars) ---------- */
function renderGemChart(stats) {
  const canvas = document.getElementById('gemChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = 260;

  const counts = stats.gemCounts || {};
  const names = GEMSTONE_DATA.map(g => g.name);
  const values = names.map(n => counts[n] || 0);
  const colors = GEMSTONE_DATA.map(g => g.color);

  drawBarChart(ctx, canvas.width, canvas.height, names, values, colors);
}

/* ---------- ANALYTICS CHARTS ---------- */
async function renderAnalyticsCharts(statsParam, recsParam) {
  let stats = statsParam;
  let recs = recsParam;
  if (!stats || !recs) {
      try {
          stats = await api.getAdminStats();
          recs = await api.getRecommendations();
      } catch(e) { console.error(e); return; }
  }

  renderElementChart(recs);
  renderScoreChart(recs);
  renderGemLeaderboard(stats);
}

function renderElementChart(recs) {
  const canvas = document.getElementById('elementChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = 260;

  const elementMap = {};
  recs.forEach(r => {
    const zodiac = ZODIAC_DATA.find(z => z.name === r.zodiacName);
    if (zodiac) elementMap[zodiac.element] = (elementMap[zodiac.element] || 0) + 1;
  });

  const labels = ['Fire', 'Earth', 'Air', 'Water'];
  const values = labels.map(e => elementMap[e] || 0);
  const colors = ['#e53e3e', '#38a169', '#63b3ed', '#4299e1'];
  const total = values.reduce((a, b) => a + b, 0) || 1;

  drawDonutChart(ctx, canvas.width, canvas.height, labels, values, colors, total);
}

function renderScoreChart(recs) {
  const canvas = document.getElementById('scoreChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = 260;

  const buckets = { '60-70': 0, '71-80': 0, '81-90': 0, '91-100': 0 };
  recs.forEach(r => {
    if (!r.scores) return;
    const s = r.scores.overall;
    if (s <= 70) buckets['60-70']++;
    else if (s <= 80) buckets['71-80']++;
    else if (s <= 90) buckets['81-90']++;
    else buckets['91-100']++;
  });

  const labels = Object.keys(buckets);
  const values = Object.values(buckets);
  const colors = ['#4299e1', '#c9a227', '#16a34a', '#f5d76e'];

  drawBarChart(ctx, canvas.width, canvas.height, labels, values, colors);
}

function renderGemLeaderboard(stats) {
  const container = document.getElementById('gem-leaderboard');
  if (!container) return;

  const counts = stats.gemCounts || {};
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = sorted[0]?.[1] || 1;

  if (!sorted.length) {
    container.innerHTML = '<div style="text-align:center;padding:32px;color:var(--white-40);">No data yet.</div>';
    return;
  }

  container.innerHTML = sorted.map(([name, count], i) => {
    const gem = GEMSTONE_DATA.find(g => g.name === name) || {};
    const pct = Math.round((count / max) * 100);
    return `
      <div class="gem-lb-row">
        <div class="gem-lb-rank">${i + 1}</div>
        <div class="gem-lb-info">
          <div class="gem-lb-name">${gem.emoji || '💎'} ${name}</div>
          <div class="gem-lb-bar-wrap">
            <div class="gem-lb-bar" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="gem-lb-count">${count}</div>
      </div>
    `;
  }).join('');
}

/* ---------- Recommendations Table ---------- */
function renderRecommendationsTable(recs) {
  const tbody = document.getElementById('rec-table-body');
  if (!tbody) return;

  if (!recs || !recs.length) {
    tbody.innerHTML = `<tr class="rec-empty-row"><td colspan="7">No recommendations yet. Visit the public site to generate readings.</td></tr>`;
    return;
  }

  const purposeLabels = {
    career: 'Career', wealth: 'Wealth',
    education: 'Education', relationships: 'Relationships',
    health: 'Health', confidence: 'Confidence',
  };

  tbody.innerHTML = recs.map((rec, i) => {
    const date = new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `
      <tr>
        <td style="color:var(--white-40);">${recs.length - i}</td>
        <td><strong>${rec.name || '—'}</strong></td>
        <td><span class="rec-badge rec-badge-zodiac">${rec.zodiacSymbol || ''} ${rec.zodiacName || '—'}</span></td>
        <td><span class="rec-badge rec-badge-gem">${rec.gemstoneName || '—'}</span></td>
        <td><span class="rec-badge rec-badge-purpose">${purposeLabels[rec.purpose] || rec.purpose || '—'}</span></td>
        <td><span class="rec-score">${rec.scores?.overall ?? '—'}%</span></td>
        <td style="color:var(--white-40);">${date}</td>
      </tr>
    `;
  }).join('');
}

/* ---------- Gemstone Catalog ---------- */
function renderGemCatalog() {
  const grid = document.getElementById('admin-gem-grid');
  if (!grid) return;

  if (GEMSTONE_DATA.length === 0) {
      setTimeout(() => renderGemCatalog(), 500); // Retry if not loaded yet
      return;
  }

  grid.innerHTML = GEMSTONE_DATA.map(gem => {
    const signs = gem.zodiacSigns.map(s => `<span class="gem-sign-tag" style="font-size:0.7rem;">${s}</span>`).join('');
    return `
      <div class="admin-gem-item">
        <div class="admin-gem-emoji">${gem.emoji}</div>
        <div class="admin-gem-name">${gem.name}</div>
        <div class="admin-gem-meta">
          <div>🪐 ${gem.planet}</div>
          <div style="display:flex;align-items:center;gap:6px;justify-content:center;margin-top:4px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${gem.color};display:inline-block;"></span>
            ${gem.colorName}
          </div>
        </div>
        <div class="admin-gem-signs">${signs}</div>
      </div>
    `;
  }).join('');
}

/* ---------- Demo Data Generator (Disabled/Mocked in Full Stack) ---------- */
function generateDemoData() {
  alert('Demo data generation is disabled in the full-stack version. Please insert data manually or use API tests.');
}

function clearAllData() {
  alert('Clear all data is disabled in the full-stack version to prevent accidental deletion.');
}

function getAdminISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return `${d.getUTCFullYear()}-W${Math.ceil((((d - yearStart) / 86400000) + 1) / 7)}`;
}
