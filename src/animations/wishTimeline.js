import gsap from 'gsap';

export function createSmokeWisps(smokeElements) {
  return gsap.fromTo(smokeElements,
    { y: 0, opacity: 0.8, scale: 0.5 },
    {
      y: () => -30 - Math.random() * 20,
      opacity: 0,
      scale: 1.5,
      duration: () => 1 + Math.random() * 0.5,
      stagger: 0.1,
      ease: 'power1.out',
      onComplete: function() {
        gsap.set(this.targets(), { display: 'none' });
      }
    }
  );
}
