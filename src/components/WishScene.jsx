import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { createSmokeWisps } from '../animations/wishTimeline';

export default function WishScene({ onComplete }) {
  const containerRef = useRef(null);
  const smokeRefs = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Scene darkens more
      gsap.to(containerRef.current, { backgroundColor: 'rgba(7, 8, 12, 0.95)', duration: 1.5 });
      
      // Animate smoke
      if (smokeRefs.current.length > 0) {
        createSmokeWisps(smokeRefs.current);
      }

      // Transition out
      gsap.delayedCall(2, () => {
        if (onComplete) onComplete();
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(7, 8, 12, 0.6)', // Initial
        zIndex: 10
      }}
    >
      <div 
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Smoke particles */}
        <div style={{ position: 'absolute', top: '-40px', display: 'flex', gap: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 4 }}>
          {[1, 2, 3, 4, 5].map((candleIdx) => (
            <div key={candleIdx} style={{ position: 'relative', width: '6px' }}>
              {[1, 2, 3].map((smokeIdx) => (
                <div
                  key={smokeIdx}
                  ref={el => {
                    if (el) smokeRefs.current.push(el);
                  }}
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#999',
                    borderRadius: '50%',
                    opacity: 0
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Candles */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '-5px', zIndex: 3 }}>
          {['#FFB6C1', '#87CEFA', '#98FB98', '#FFDAB9', '#E6E6FA'].map((color, idx) => (
            <div key={idx} style={{ position: 'relative', width: '6px', height: '35px', backgroundColor: color, borderRadius: '3px 3px 0 0' }} />
          ))}
        </div>

        {/* Cake Top Tier */}
        <div style={{
          width: '140px',
          height: '50px',
          backgroundColor: '#F0D4B0',
          borderRadius: '10px 10px 0 0',
          position: 'relative',
          zIndex: 2,
          boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ position: 'absolute', top: 0, left: '-2px', right: '-2px', height: '15px', backgroundColor: '#FFF', borderRadius: '10px', display: 'flex', justifyContent: 'space-around' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ width: '15px', height: '15px', backgroundColor: '#FFF', borderRadius: '50%', transform: 'translateY(5px)' }} />
            ))}
          </div>
        </div>

        {/* Cake Bottom Tier */}
        <div style={{
          width: '200px',
          height: '60px',
          backgroundColor: '#F5E6CC',
          borderRadius: '10px 10px 0 0',
          position: 'relative',
          zIndex: 1,
          boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.05)'
        }}>
          <div style={{ position: 'absolute', top: 0, left: '-2px', right: '-2px', height: '15px', backgroundColor: '#FFF', borderRadius: '10px', display: 'flex', justifyContent: 'space-around' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} style={{ width: '15px', height: '15px', backgroundColor: '#FFF', borderRadius: '50%', transform: 'translateY(5px)' }} />
            ))}
          </div>
        </div>

        {/* Plate */}
        <div style={{
          width: '240px',
          height: '15px',
          backgroundColor: '#4A4A4A',
          borderRadius: '50px',
          marginTop: '-5px',
          zIndex: 0,
          boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
        }} />
      </div>
    </div>
  );
}
