import React, { useEffect, useRef } from 'react';
import { ConfettiSystem } from '../effects/confetti';

const Confetti = ({ active, burstPosition }) => {
  const canvasRef = useRef(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize only when active to save resources, or initialize early and burst later
    if (!confettiRef.current) {
      confettiRef.current = new ConfettiSystem(canvasRef.current);
    }

    if (active) {
      const x = burstPosition?.x ?? window.innerWidth / 2;
      const y = burstPosition?.y ?? window.innerHeight;

      // First main burst
      confettiRef.current.burst({
        x,
        y,
        spread: 90,
        velocity: { min: 10, max: 20 }
      });

      // Second smaller burst
      const timer = setTimeout(() => {
        if (confettiRef.current) {
          confettiRef.current.burst({
            x,
            y,
            count: Math.floor(confettiRef.current.getParticleCount() / 2),
            spread: 120,
            velocity: { min: 5, max: 15 }
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [active, burstPosition]);

  useEffect(() => {
    return () => {
      if (confettiRef.current) {
        confettiRef.current.destroy();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  );
};

export default Confetti;
