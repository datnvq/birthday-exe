import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  createCakeEmergence,
  createCandleLighting,
  createFlameFlicker,
  extinguishFlames
} from '../animations/cakeTimeline';
import InteractionGate from './InteractionGate';

export default function BirthdayCake({ onComplete, config, onCakeEmerge, onCandleLight, onExtinguish }) {
  const [phase, setPhase] = useState('EMERGING');
  const cakeRef = useRef(null);
  const flameRefs = useRef([]);
  const textRef = useRef(null);
  const subTextRef = useRef(null);
  const flickerTweens = useRef([]);
  const containerRef = useRef(null);
  const callbacksRef = useRef({ onCakeEmerge, onCandleLight, onExtinguish });

  useEffect(() => {
    callbacksRef.current = { onCakeEmerge, onCandleLight, onExtinguish };
  }, [onCakeEmerge, onCandleLight, onExtinguish]);

  useEffect(() => {
    if (callbacksRef.current.onCakeEmerge) callbacksRef.current.onCakeEmerge();
    let ctx = gsap.context(() => {
      createCakeEmergence(cakeRef.current, () => {
        setPhase('WAIT_CANDLES');
      });
      gsap.to(containerRef.current, { backgroundColor: 'rgba(7, 8, 12, 0.6)', duration: 1.5 });
    });

    return () => ctx.revert();
  }, []); // Run only once on mount

  useEffect(() => {
    if (phase === 'CANDLES') {
      if (callbacksRef.current.onCandleLight) {
        flameRefs.current.forEach((_, i) => {
          setTimeout(callbacksRef.current.onCandleLight, i * 400); 
        });
      }
      let ctx = gsap.context(() => {
        const tl = createCandleLighting(flameRefs.current);
        tl.then(() => {
          flameRefs.current.forEach(flame => {
            if (flame) {
              flickerTweens.current.push(createFlameFlicker(flame));
            }
          });
          setPhase('WISH');
        });
      });
      return () => {
        ctx.revert();
        flickerTweens.current.forEach(t => t.kill());
      };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'WISH') {
      let ctx = gsap.context(() => {
        gsap.fromTo(textRef.current, 
          { opacity: 0, y: 10 }, 
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        );
        gsap.fromTo(subTextRef.current,
          { opacity: 0 },
          { opacity: 0.5, duration: 1, delay: 1, ease: 'power2.out' }
        );
      });
      return () => ctx.revert();
    }
  }, [phase]);

  const handleLightCandles = () => {
    setPhase('CANDLES');
  };

  const handleMakeWish = () => {
    if (phase !== 'WISH') return;
    if (onExtinguish) onExtinguish();
    
    let ctx = gsap.context(() => {
      extinguishFlames(flameRefs.current, () => {
        if (onComplete) onComplete();
      });
      gsap.to([textRef.current, subTextRef.current], { opacity: 0, duration: 0.5 });
    });
    
    setPhase('EXTINGUISHED');
  };

  let gateActive = false;
  let gateKey = 'CAKE';
  let gateText = '[ THẮP NẾN LÊN NÀO ]';
  let handleInteract = () => {};

  if (phase === 'WAIT_CANDLES') {
    gateActive = true;
    gateKey = 'CAKE';
    gateText = '[ THẮP NẾN LÊN NÀO ]';
    handleInteract = handleLightCandles;
  } else if (phase === 'WISH') {
    gateActive = true;
    gateKey = 'WISH';
    gateText = '[ Ước lẹ đi ]';
    handleInteract = handleMakeWish;
  }

  const colors = config?.candles || ['#FFB6C1', '#87CEFA', '#98FB98', '#FFDAB9', '#E6E6FA'];

  return (
    <InteractionGate 
      active={gateActive} 
      sceneKey={gateKey} 
      buttonText={gateText} 
      onInteract={handleInteract}
    >
      <div 
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        <div 
          ref={cakeRef}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Candles */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '-5px', zIndex: 3 }}>
            {colors.slice(0, 5).map((color, idx) => (
              <div key={idx} style={{ position: 'relative', width: '6px', height: '35px', backgroundColor: color, borderRadius: '3px 3px 0 0' }}>
                <div 
                  ref={el => flameRefs.current[idx] = el}
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '12px',
                    height: '18px',
                    backgroundColor: '#FFD700',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    boxShadow: '0 0 15px 5px rgba(255, 215, 0, 0.4)',
                    opacity: 0,
                    transformOrigin: 'bottom center'
                  }}
                />
              </div>
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
          {/* Frosting drips */}
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
          {/* Frosting drips */}
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

        {/* Click Target */}
        {phase === 'WISH' && (
          <div 
            onClick={handleMakeWish}
            style={{
              position: 'absolute',
              top: '-60px',
              left: '-20px',
              right: '-20px',
              height: '120px',
              cursor: 'pointer',
              zIndex: 10
            }}
          />
        )}
      </div>

      <div style={{ marginTop: '50px', textAlign: 'center', height: '60px' }}>
        <div ref={textRef} style={{ opacity: 0, color: '#FFF', fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 500 }}>
          Ước một điều đi bạn tôi ơi ✨
        </div>
        <div ref={subTextRef} style={{ opacity: 0, color: '#F6C85F', fontFamily: '"JetBrains Mono", monospace', fontSize: '14px', marginTop: '10px' }}>
          Bấm vào ngọn nến để thổi tắt nha!
        </div>
      </div>
    </div>
    </InteractionGate>
  );
}
