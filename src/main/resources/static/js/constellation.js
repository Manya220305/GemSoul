/* =============================================
   CONSTELLATION CANVAS ANIMATION
   ============================================= */

class ConstellationCanvas {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.shootingStars = [];
    this.options = {
      starCount: options.starCount || 140,
      maxDist: options.maxDist || 120,
      starColor: options.starColor || 'rgba(201,162,39,',
      lineColor: options.lineColor || 'rgba(201,162,39,',
      speed: options.speed || 0.3,
      density: options.density || 1,
    };
    this.animFrameId = null;
    this.init();
  }

  init() {
    this.resize();
    this.createStars();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.offsetWidth || window.innerWidth;
    this.canvas.height = this.canvas.offsetHeight || window.innerHeight;
    this.createStars();
  }

  createStars() {
    this.stars = [];
    const count = Math.floor(this.options.starCount * this.options.density);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: (Math.random() - 0.5) * this.options.speed,
        r: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  spawnShootingStar() {
    if (Math.random() > 0.005) return;
    this.shootingStars.push({
      x: Math.random() * this.canvas.width,
      y: Math.random() * (this.canvas.height / 2),
      len: Math.random() * 80 + 60,
      vx: Math.random() * 5 + 4,
      vy: Math.random() * 3 + 2,
      alpha: 1,
    });
  }

  drawShootingStars() {
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      this.ctx.save();
      const grad = this.ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.5);
      grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(s.x - s.len, s.y - s.len * 0.5);
      this.ctx.stroke();
      this.ctx.restore();
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 0.015;
      if (s.alpha <= 0 || s.x > this.canvas.width * 1.2 || s.y > this.canvas.height) {
        this.shootingStars.splice(i, 1);
      }
    }
  }

  animate() {
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.spawnShootingStar();
    this.drawShootingStars();

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.twinkle += s.twinkleSpeed;
      const twinkleFactor = 0.6 + Math.sin(s.twinkle) * 0.4;

      // Wrap around edges
      if (s.x < 0) s.x = this.canvas.width;
      if (s.x > this.canvas.width) s.x = 0;
      if (s.y < 0) s.y = this.canvas.height;
      if (s.y > this.canvas.height) s.y = 0;

      // Draw star
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `${this.options.starColor}${s.alpha * twinkleFactor})`;
      this.ctx.fill();

      // Draw constellation lines
      for (let j = i + 1; j < this.stars.length; j++) {
        const s2 = this.stars[j];
        const dx = s.x - s2.x;
        const dy = s.y - s2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.options.maxDist) {
          const lineAlpha = (1 - dist / this.options.maxDist) * 0.18;
          this.ctx.beginPath();
          this.ctx.moveTo(s.x, s.y);
          this.ctx.lineTo(s2.x, s2.y);
          this.ctx.strokeStyle = `${this.options.lineColor}${lineAlpha})`;
          this.ctx.lineWidth = 0.7;
          this.ctx.stroke();
        }
      }
    }

    this.animFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }
}

// Footer stars (simpler, more static)
class FooterStars {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.init();
  }

  init() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    this.draw();
  }

  draw() {
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const s of this.stars) {
      s.twinkle += 0.01;
      const a = s.alpha * (0.6 + Math.sin(s.twinkle) * 0.4);
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(201,162,39,${a})`;
      this.ctx.fill();
    }
    requestAnimationFrame(() => this.draw());
  }
}
