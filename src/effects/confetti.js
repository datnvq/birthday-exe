export class ConfettiSystem {
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
  
  burst(options = {}) {
    const {
      x = this.canvas.width / 2,
      y = this.canvas.height / 2,
      count = this.getParticleCount(),
      spread = 360,
      velocity = { min: 5, max: 15 },
      colors = ['#F6C85F', '#F2A0C4', '#B8A9E8', '#7DD3FC', '#FCA5A5', '#86EFAC', '#FBBF24', '#F472B6'],
    } = options;
    
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(x, y, velocity, colors, spread));
    }
    
    if (!this.isRunning) this.start();
  }
  
  getParticleCount() {
    // Detect mobile
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return 50;
    return isMobile ? Math.floor(100 + Math.random() * 150) : Math.floor(300 + Math.random() * 300);
  }
  
  createParticle(x, y, velocity, colors, spread) {
    const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180) - Math.PI / 2;
    const speed = velocity.min + Math.random() * (velocity.max - velocity.min);
    const shapes = ['circle', 'rect', 'star', 'heart'];
    
    return {
      x, y,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
      vy: Math.sin(angle) * speed,
      gravity: 0.12 + Math.random() * 0.08,
      drag: 0.97 + Math.random() * 0.02,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      opacity: 1,
      lifetime: 150 + Math.random() * 150, // frames
      age: 0,
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
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.rotation += p.rotationSpeed;
      p.age++;
      
      // Fade out near end of lifetime
      if (p.age > p.lifetime * 0.7) {
        p.opacity = Math.max(0, 1 - (p.age - p.lifetime * 0.7) / (p.lifetime * 0.3));
      }
      
      // Remove dead particles
      if (p.age >= p.lifetime || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }
      
      this.drawParticle(p);
    }
    
    if (this.particles.length === 0) {
      this.isRunning = false;
      return;
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  drawParticle(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    
    switch (p.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'rect':
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        break;
      case 'star':
        this.drawStar(ctx, 0, 0, 5, p.size / 2, p.size / 4);
        break;
      case 'heart':
        this.drawHeart(ctx, 0, 0, p.size / 2);
        break;
    }
    
    ctx.restore();
  }
  
  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx, y = cy;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
  
  drawHeart(ctx, x, y, size) {
    const s = size * 1.5;
    ctx.beginPath();
    // Start at bottom tip
    ctx.moveTo(x, y + s / 2);
    // Left curve
    ctx.bezierCurveTo(
      x - s / 2, y + s / 4, 
      x - s / 2, y - s / 2, 
      x, y - s / 4
    );
    // Right curve
    ctx.bezierCurveTo(
      x + s / 2, y - s / 2, 
      x + s / 2, y + s / 4, 
      x, y + s / 2
    );
    ctx.closePath();
    ctx.fill();
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
