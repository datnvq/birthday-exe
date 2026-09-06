import gsap from 'gsap';

export function createIdleAnimation(giftRef) {
  const tl = gsap.timeline({ repeat: -1 });
  
  // Float
  tl.to(giftRef, {
    y: -8,
    duration: 1.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 1,
  });
  
  return tl;
}

export function createGlowPulse(shadowRef) {
  return gsap.to(shadowRef, {
    opacity: 0.3,
    scale: 1.1,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

export function createOpenTimeline({ lidRef, boxRef, ribbonRef, lightRef, containerRef, particlesRef }, onComplete) {
  const tl = gsap.timeline({
    onComplete
  });
  
  // 0.00s: disable further clicks - handled in component state
  
  // 0.10s: small shake
  tl.to(boxRef, { x: -2, duration: 0.05 }, 0.1)
    .to(boxRef, { x: 2, duration: 0.05 }, 0.15)
    .to(boxRef, { x: -2, duration: 0.05 }, 0.2)
    .to(boxRef, { x: 0, duration: 0.05 }, 0.25);
    
  // 0.25s: stronger shake
  tl.to(boxRef, { x: -4, duration: 0.05 }, 0.25)
    .to(boxRef, { x: 4, duration: 0.05 }, 0.3)
    .to(boxRef, { x: -3, duration: 0.05 }, 0.35)
    .to(boxRef, { x: 3, duration: 0.05 }, 0.4)
    .to(boxRef, { x: 0, duration: 0.05 }, 0.45);
    
  // 0.45s: ribbon wiggles
  tl.to(ribbonRef, { rotation: 5, duration: 0.05 }, 0.45)
    .to(ribbonRef, { rotation: -5, duration: 0.05 }, 0.5)
    .to(ribbonRef, { rotation: 0, duration: 0.05 }, 0.55);
    
  // 0.60s: lid starts opening
  tl.to(lidRef, { rotationX: -30, duration: 0.25, ease: "power1.inOut" }, 0.6);
  
  // 0.85s: lid rotates more
  tl.to(lidRef, { rotationX: -60, duration: 0.15, ease: "power1.inOut" }, 0.85);
  
  // 1.00s: warm light appears
  tl.to(lightRef, { opacity: 0.8, duration: 0.15 }, 1.0);
  
  // 1.15s: light intensifies
  tl.to(lightRef, { scale: 1.5, opacity: 1, duration: 0.35, ease: "power2.out" }, 1.15);
  
  // 1.30s: particle burst
  if (particlesRef && particlesRef.current) {
    const particles = particlesRef.current.children;
    tl.to(particles, {
      y: () => -50 - Math.random() * 100,
      x: () => (Math.random() - 0.5) * 100,
      opacity: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: "power2.out"
    }, 1.3);
  }
  
  // 1.50s: lid moves upward and fades
  tl.to(lidRef, { y: -100, opacity: 0, duration: 0.5, ease: "power2.in" }, 1.5);
  
  // 1.70s: camera-like zoom
  tl.to(containerRef, { scale: 1.3, duration: 0.6, ease: "power2.inOut" }, 1.7);
  
  // 2.00s: transition begins - fade out
  tl.to(containerRef, { opacity: 0, duration: 0.3, ease: "power1.inOut" }, 2.0);
  
  return tl;
}
