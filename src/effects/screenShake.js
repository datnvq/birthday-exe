import gsap from 'gsap';

export function screenShake(element, options = {}) {
  const { intensity = 3, duration = 0.4 } = options;
  const tl = gsap.timeline();
  const steps = 6;
  
  for (let i = 0; i < steps; i++) {
    const x = (Math.random() - 0.5) * intensity * 2 * (1 - i/steps);
    const y = (Math.random() - 0.5) * intensity * (1 - i/steps);
    tl.to(element, { x, y, duration: duration / steps, ease: 'power1.inOut' });
  }
  
  tl.to(element, { x: 0, y: 0, duration: 0.1 });
  return tl;
}
