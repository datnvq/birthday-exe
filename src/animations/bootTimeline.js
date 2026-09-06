import gsap from 'gsap';

export function createGlitchEffect(element, options = {}) {
  const { duration = 0.3, intensity = 2 } = options;
  const tl = gsap.timeline();
  
  tl.to(element, { x: intensity, opacity: 0.7, duration: duration / 5 })
    .to(element, { x: -intensity, opacity: 1, duration: duration / 5 })
    .to(element, { x: intensity * 0.5, opacity: 0.8, duration: duration / 5 })
    .to(element, { x: -intensity * 0.5, opacity: 1, duration: duration / 5 })
    .to(element, { x: 0, opacity: 1, duration: duration / 5 });
  
  return tl;
}

export function createTypewriterTimeline(elements, options = {}) {
  const { stagger = 0.7, startDelay = 0 } = options;
  const tl = gsap.timeline({ delay: startDelay });
  
  elements.forEach((el, i) => {
    tl.fromTo(el, 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      i * stagger
    );
  });
  
  return tl;
}
