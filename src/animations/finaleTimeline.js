import gsap from 'gsap';

/**
 * Creates the finale text reveal GSAP timeline.
 * Staggered entrance of HAPPY → BIRTHDAY → name → message → closing → replay → version.
 * Respects prefers-reduced-motion by shortening durations and removing slide offsets.
 */
export const createFinaleTimeline = (refs) => {
  const { happy, birthday, name, message, closing, replay, version } = refs;

  const tl = gsap.timeline();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const yOffset = prefersReduced ? 0 : 20;
  const dm = prefersReduced ? 0.3 : 1; // duration multiplier

  tl.fromTo(happy,
    { opacity: 0, y: yOffset },
    { opacity: 1, y: 0, duration: 1 * dm, ease: 'power2.out' },
    0.5
  )

  .fromTo(birthday,
    { opacity: 0, y: yOffset },
    { opacity: 1, y: 0, duration: 1 * dm, ease: 'power2.out' },
    0.8
  )

  .fromTo(name,
    { opacity: 0, y: yOffset, scale: prefersReduced ? 1 : 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 1.5 * dm, ease: 'back.out(1.2)' },
    1.1
  )

  .fromTo(message,
    { opacity: 0, y: yOffset },
    { opacity: 0.8, y: 0, duration: 1.2 * dm, ease: 'power2.out' },
    2.1
  )

  .fromTo(closing,
    { opacity: 0, y: yOffset },
    { opacity: 1, y: 0, duration: 1 * dm, ease: 'power2.out' },
    3.1
  )

  .fromTo(replay,
    { opacity: 0, y: yOffset },
    { opacity: 1, y: 0, duration: 0.8 * dm, ease: 'power2.out' },
    3.6
  )

  .fromTo(version,
    { opacity: 0 },
    { opacity: 0.3, duration: 1 * dm, ease: 'power1.inOut' },
    4.1
  );

  if (refs.onComplete) {
    tl.call(refs.onComplete);
  }

  return tl;
};
