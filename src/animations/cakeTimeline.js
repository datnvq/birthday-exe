import gsap from 'gsap';

export function createCakeEmergence(cakeRef, onDone) {
  return gsap.fromTo(cakeRef,
    { y: 300, scale: 0.3, rotation: -8, opacity: 0 },
    { y: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.2)', onComplete: onDone }
  );
}

export function createCandleLighting(flameRefs) {
  const tl = gsap.timeline();
  flameRefs.forEach((flame, i) => {
    tl.fromTo(flame,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' },
      i * 0.15
    );
  });
  return tl;
}

export function createFlameFlicker(flameRef) {
  return gsap.to(flameRef, {
    scaleX: () => 0.85 + Math.random() * 0.3,
    scaleY: () => 0.9 + Math.random() * 0.2,
    opacity: () => 0.75 + Math.random() * 0.25,
    duration: () => 0.1 + Math.random() * 0.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    repeatRefresh: true
  });
}

export function extinguishFlames(flameRefs, smokeCallback) {
  const tl = gsap.timeline();
  // Rapid flicker
  flameRefs.forEach((flame, i) => {
    tl.to(flame, { scaleX: 1.3, duration: 0.05, yoyo: true, repeat: 3 }, 0);
  });
  // Shrink and disappear
  tl.to(flameRefs, {
    scale: 0, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power2.in',
    onComplete: smokeCallback
  }, 0.2);
  return tl;
}
