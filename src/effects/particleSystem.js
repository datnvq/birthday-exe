export class SparkleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;
    this.resize();
    this._handleResize = () => this.resize();
    window.addEventListener('resize', this._handleResize);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  emit(options = {}) {
    const {
      x = this.canvas.width / 2,
      y = this.canvas.height / 2,
      count = 10,
      radius = 50,
      colors = ['#ffffff', '#F6C85F', '#F2A0C4'],
    } = options;

    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const actualCount = prefersReduced ? Math.max(1, Math.floor(count / 3)) : count;

    for (let i = 0; i < actualCount; i++) {
      const offsetX = (Math.random() - 0.5) * radius * 2;
      const offsetY = (Math.random() - 0.5) * radius * 2;
      
      this.particles.push(this.createSparkle(x + offsetX, y + offsetY, colors));
    }

    if (!this.isRunning) this.start();
  }

  burst(options = {}) {
    this.emit({ ...options, count: options.count || 50, radius: options.radius || 100 });
  }

  createSparkle(x, y, colors) {
    return {
      x, y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 1) * 3 - 1, // Mostly upward
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.5,
      fadeRate: 0.01 + Math.random() * 0.02,
      wobbleSpeed: Math.random() * 0.1,
      wobbleOffset: Math.random() * Math.PI * 2,
      age: 0
    };
  }

  start() {
    this.isRunning = true;
    this.animate();
  }

  animate() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age++;
      
      // Wobble effect
      const wobble = Math.sin(p.age * p.wobbleSpeed + p.wobbleOffset) * 0.5;
      
      p.x += p.vx + wobble;
      p.y += p.vy;
      p.opacity -= p.fadeRate;

      if (p.opacity <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = p.size * 2;
      this.ctx.shadowColor = p.color;
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    if (this.particles.length === 0) {
      this.isRunning = false;
      return;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }

  destroy() {
    this.stop();
    this.particles = [];
    window.removeEventListener('resize', this._handleResize);
  }
}
