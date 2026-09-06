import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Countdown({ onComplete, onTick, onBlast }) {
  const containerRef = useRef(null);
  const numRef3 = useRef(null);
  const numRef2 = useRef(null);
  const numRef1 = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onBlast) onBlast();
          if (onComplete) onComplete();
        }
      });

      // Background slow zoom out
      gsap.fromTo(wrapperRef.current, 
        { scale: 1.1 }, 
        { scale: 1, duration: 3.5, ease: 'none' }
      );

      const animateNum = (ref) => {
        if (onTick) onTick();
        return gsap.fromTo(ref,
          { scale: 1.5, opacity: 0, filter: 'blur(10px)' },
          { 
            scale: 1, 
            opacity: 1, 
            filter: 'blur(0px)', 
            duration: 0.8, 
            ease: 'power3.out' 
          }
        ).then(() => {
          return gsap.to(ref, {
            opacity: 0,
            filter: 'blur(5px)',
            duration: 0.2
          });
        });
      };

      tl.add(() => animateNum(numRef3.current), 0)
        .add(() => animateNum(numRef2.current), 1)
        .add(() => animateNum(numRef1.current), 2);

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  const numStyle = {
    position: 'absolute',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: 'clamp(80px, 15vw, 200px)',
    color: '#FFF',
    textShadow: '0 0 20px rgba(255,255,255,0.3)',
    opacity: 0
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#07080C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 20
      }}
    >
      <div 
        ref={wrapperRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div ref={numRef3} style={numStyle}>3</div>
        <div ref={numRef2} style={numStyle}>2</div>
        <div ref={numRef1} style={numStyle}>1</div>
      </div>
    </div>
  );
}
