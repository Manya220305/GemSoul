/* =============================================
   INTERACTIVE ZODIAC WHEEL — Section 4
   ============================================= */

class ZodiacWheel {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.setupSize();
    this.selectedIndex = -1;
    this.hoveredIndex = -1;
    this.rotation = 0;
    this.animating = false;
    this.segmentAngle = (2 * Math.PI) / 12;

    this.setupEvents();
    this.draw();
    this.animate();

    // Responsive resize
    window.addEventListener('resize', () => {
      this.setupSize();
      this.draw();
    });
  }

  setupSize() {
    const container = this.canvas.parentElement;
    const size = Math.min(container ? container.offsetWidth : 500, 500);
    this.canvas.width = size;
    this.canvas.height = size;
    this.W = size;
    this.H = size;
    this.cx = size / 2;
    this.cy = size / 2;
    this.outerR = size * 0.46;
    this.innerR = size * 0.28;
    this.centerR = size * 0.13;
  }

  getSegmentForPoint(x, y) {
    const dx = x - this.cx;
    const dy = y - this.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.centerR || dist > this.outerR) return -1;

    let angle = Math.atan2(dy, dx) - this.rotation;
    angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const idx = Math.floor(angle / this.segmentAngle);
    return idx < 12 ? idx : -1;
  }

  setupEvents() {
    const rect = () => this.canvas.getBoundingClientRect();

    this.canvas.addEventListener('mousemove', (e) => {
      const r = rect();
      const scaleX = this.canvas.width / r.width;
      const scaleY = this.canvas.height / r.height;
      const x = (e.clientX - r.left) * scaleX;
      const y = (e.clientY - r.top) * scaleY;
      const prev = this.hoveredIndex;
      this.hoveredIndex = this.getSegmentForPoint(x, y);
      if (prev !== this.hoveredIndex) this.draw();
      this.canvas.style.cursor = this.hoveredIndex >= 0 ? 'pointer' : 'default';
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredIndex = -1;
      this.canvas.style.cursor = 'default';
      this.draw();
    });

    this.canvas.addEventListener('click', (e) => {
      const r = rect();
      const scaleX = this.canvas.width / r.width;
      const scaleY = this.canvas.height / r.height;
      const x = (e.clientX - r.left) * scaleX;
      const y = (e.clientY - r.top) * scaleY;
      const idx = this.getSegmentForPoint(x, y);
      if (idx >= 0) {
        this.selectedIndex = idx;
        this.draw();
        this.showInfo(idx);
      }
    });

    // Touch support
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      const r = rect();
      const scaleX = this.canvas.width / r.width;
      const scaleY = this.canvas.height / r.height;
      const x = (touch.clientX - r.left) * scaleX;
      const y = (touch.clientY - r.top) * scaleY;
      const idx = this.getSegmentForPoint(x, y);
      if (idx >= 0) {
        this.selectedIndex = idx;
        this.draw();
        this.showInfo(idx);
      }
    });
  }

  drawSegment(index) {
    const ctx = this.ctx;
    const z = ZODIAC_DATA[index];
    const startAngle = this.rotation + index * this.segmentAngle;
    const endAngle = startAngle + this.segmentAngle;
    const isHovered = this.hoveredIndex === index;
    const isSelected = this.selectedIndex === index;

    // Segment fill
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.cx, this.cy);
    ctx.arc(this.cx, this.cy, isHovered || isSelected ? this.outerR + 8 : this.outerR, startAngle, endAngle);
    ctx.closePath();

    // Gradient fill
    const midAngle = startAngle + this.segmentAngle / 2;
    const gx = this.cx + Math.cos(midAngle) * this.outerR * 0.6;
    const gy = this.cy + Math.sin(midAngle) * this.outerR * 0.6;
    const grad = ctx.createRadialGradient(this.cx, this.cy, this.innerR, gx, gy, this.outerR * 0.5);

    if (isSelected) {
      grad.addColorStop(0, `${z.wheelColor}55`);
      grad.addColorStop(1, `${z.wheelColor}33`);
    } else if (isHovered) {
      grad.addColorStop(0, `${z.wheelColor}33`);
      grad.addColorStop(1, `${z.wheelColor}18`);
    } else {
      grad.addColorStop(0, 'rgba(10,20,60,0.85)');
      grad.addColorStop(1, 'rgba(5,10,30,0.6)');
    }

    ctx.fillStyle = grad;
    ctx.fill();

    // Border
    ctx.strokeStyle = isSelected ? z.wheelColor : (isHovered ? `${z.wheelColor}88` : 'rgba(201,162,39,0.18)');
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.stroke();
    ctx.restore();

    // Inner ring border
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.cx, this.cy);
    ctx.arc(this.cx, this.cy, this.innerR, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = 'rgba(5,10,30,0.8)';
    ctx.fill();
    ctx.restore();

    // Symbol + name
    const labelR = (this.outerR + this.innerR) / 2;
    const labelAngle = startAngle + this.segmentAngle / 2;
    const lx = this.cx + Math.cos(labelAngle) * labelR;
    const ly = this.cy + Math.sin(labelAngle) * labelR;

    ctx.save();
    ctx.translate(lx, ly);

    const symbolSize = isSelected || isHovered ? 20 : 17;
    ctx.font = `${symbolSize}px serif`;
    ctx.fillStyle = isSelected ? '#f5d76e' : (isHovered ? '#c9a227' : 'rgba(201,162,39,0.7)');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = isSelected ? z.wheelColor : 'transparent';
    ctx.shadowBlur = isSelected ? 12 : 0;
    ctx.fillText(z.symbol, 0, -8);

    ctx.font = `600 ${isSelected || isHovered ? 10 : 8.5}px 'Cinzel', serif`;
    ctx.fillStyle = isSelected ? '#f5d76e' : (isHovered ? '#c9a227' : 'rgba(201,162,39,0.5)');
    ctx.shadowBlur = 0;
    ctx.fillText(z.name.substring(0, 3).toUpperCase(), 0, 10);

    ctx.restore();
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    // Glow backdrop
    const glow = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.outerR);
    glow.addColorStop(0, 'rgba(201,162,39,0.04)');
    glow.addColorStop(0.7, 'rgba(13,92,58,0.03)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.outerR + 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw all segments
    for (let i = 0; i < 12; i++) this.drawSegment(i);

    // Outer ring decoration
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201,162,39,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.outerR + 14, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201,162,39,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner ring decoration
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.innerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201,162,39,0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center circle
    const centerGrad = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.centerR);
    centerGrad.addColorStop(0, 'rgba(15,30,61,0.95)');
    centerGrad.addColorStop(1, 'rgba(5,10,30,0.95)');
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.centerR, 0, Math.PI * 2);
    ctx.fillStyle = centerGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(201,162,39,0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Dot ornaments on outer ring
    for (let i = 0; i < 12; i++) {
      const angle = this.rotation + i * this.segmentAngle;
      const dx = this.cx + Math.cos(angle) * this.outerR;
      const dy = this.cy + Math.sin(angle) * this.outerR;
      ctx.beginPath();
      ctx.arc(dx, dy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,162,39,0.7)';
      ctx.fill();
    }
  }

  animate() {
    // Subtle slow rotation
    this.rotation += 0.0003;
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  showInfo(index) {
    const z = ZODIAC_DATA[index];
    const panel = document.getElementById('zodiac-info-panel');
    const centerIcon = document.getElementById('wheel-center-icon');
    const centerText = document.getElementById('wheel-center-text');

    if (centerIcon) centerIcon.textContent = z.symbol;
    if (centerText) centerText.textContent = z.name;

    if (!panel) return;

    panel.style.borderColor = `${z.wheelColor}55`;

    const strengths = z.strengths.map(s => `<span class="strength-pill">${s}</span>`).join('');
    const weaknesses = z.weaknesses.map(w => `<span class="weakness-pill">${w}</span>`).join('');

    panel.innerHTML = `
      <div class="zw-info-content">
        <div class="zw-sign-header">
          <div class="zw-sign-symbol" style="filter: drop-shadow(0 0 12px ${z.wheelColor}80)">${z.symbol}</div>
          <div class="zw-sign-name" style="color: ${z.wheelColor}">${z.name.toUpperCase()}</div>
          <div class="zw-date-range">${z.dateRange}</div>
        </div>
        <div class="zw-meta-row">
          <span class="zw-meta-badge zw-element">${z.elementEmoji} ${z.element}</span>
          <span class="zw-meta-badge zw-planet">🪐 ${z.planet}</span>
          <span class="zw-meta-badge" style="background:rgba(201,162,39,0.1);border-color:rgba(201,162,39,0.3);color:var(--gold-light)">💎 ${z.gemstone}</span>
        </div>
        <div class="zw-section-title">✦ Strengths</div>
        <div class="zw-strengths">${strengths}</div>
        <div class="zw-section-title">✦ Challenges</div>
        <div class="zw-weaknesses">${weaknesses}</div>
        <div class="zw-description">${z.description}</div>
      </div>
    `;

    // Animate panel
    panel.style.animation = 'none';
    panel.offsetHeight; // trigger reflow
    panel.style.animation = 'cardReveal 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }
}

function initZodiacWheel() {
  new ZodiacWheel('zodiacWheelCanvas');
}
