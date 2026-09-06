import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { createGlitchEffect } from '../animations/bootTimeline';
import InteractionGate from './InteractionGate';

const BootSequence = ({ onComplete }) => {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const line4Ref = useRef(null);
  const line5Ref = useRef(null);
  const line6Ref = useRef(null);
  const progressBarFillRef = useRef(null);
  const line7Ref = useRef(null);
  
  const [animDone, setAnimDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setAnimDone(true);
      return;
    }

    const tl = gsap.timeline();

    tl.to(containerRef.current, { opacity: 1, duration: 0.5 }, 0.3)
      .fromTo(line1Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0.8)
      .fromTo(line2Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 1.5)
      .fromTo(line3Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 2.2)
      .fromTo(line4Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 2.9)
      .fromTo(line5Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 3.5)
      .fromTo(line6Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 3.5) // appear before fill
      .to(progressBarFillRef.current, { width: '100%', duration: 0.4, ease: 'none' }, 3.8)
      .fromTo(line7Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 4.5);

    tl.add(createGlitchEffect(line7Ref.current, { duration: 0.3 }), 4.8);

    tl.call(() => setAnimDone(true), [], 5.2);

    return () => {
      tl.kill();
    };
  }, []);

  const handleInteract = () => {
    gsap.to(containerRef.current, { 
      opacity: 0, 
      scale: 0.95, 
      duration: 0.3, 
      onComplete 
    });
  };

  const styles = {
    wrapper: {
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#07080C',
      color: '#fff',
      fontFamily: '"JetBrains Mono", monospace'
    },
    terminal: {
      backgroundColor: '#0D1018',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.08)',
      maxWidth: 'min(600px, 92vw)',
      width: '100%',
      padding: 'clamp(1.2rem, 4vw, 2rem)',
      margin: '0 16px',
      opacity: 0,
      boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(6px, 1.5vh, 12px)'
    },
    line1: { color: '#F6C85F', fontSize: 'clamp(1rem, 3.5vw, 1.3rem)', fontWeight: 'bold' },
    lineDim: { fontSize: 'clamp(0.8rem, 2.8vw, 0.95rem)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 },
    lineReady: { color: '#4ade80', fontWeight: 'bold', marginTop: '10px', fontSize: 'clamp(0.85rem, 3vw, 1.05rem)' },
    progressBarContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.9rem',
      color: 'rgba(255,255,255,0.6)'
    },
    progressBar: {
      width: '200px',
      height: '14px',
      border: '1px solid rgba(255,255,255,0.3)',
      position: 'relative'
    },
    progressBarFill: {
      height: '100%',
      width: '0%',
      backgroundColor: 'rgba(255,255,255,0.8)'
    },
    cursor: {
      display: 'inline-block',
      width: '8px',
      height: '1em',
      backgroundColor: '#F6C85F',
      animation: 'blink 1s step-end infinite',
      verticalAlign: 'bottom',
      marginLeft: '5px'
    }
  };

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <InteractionGate active={animDone} sceneKey="BOOT" buttonText="[ BẮT ĐẦU NÈ BẠN ƠI ]" onInteract={handleInteract}>
      <div style={styles.wrapper}>
        <style>
          {`
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}
        </style>
        <div ref={containerRef} style={{...styles.terminal, opacity: isReduced ? 1 : 0}}>
          <div ref={line1Ref} style={{...styles.line1, opacity: isReduced ? 1 : 0}}>
            {'> SINH_NHAT.EXE'}
          </div>
          <div ref={line2Ref} style={{...styles.lineDim, opacity: isReduced ? 1 : 0}}>
            Khởi tạo giao thức chúc mừng sinh nhật...
          </div>
          <div ref={line3Ref} style={{...styles.lineDim, opacity: isReduced ? 1 : 0}}>
            Đang tải kho ảnh dìm và kỷ niệm...
          </div>
          <div ref={line4Ref} style={{...styles.lineDim, opacity: isReduced ? 1 : 0}}>
            Bơm 1000% sự xinh đẹp và nhiều tiền...
          </div>
          <div ref={line5Ref} style={{...styles.lineDim, opacity: isReduced ? 1 : 0}}>
            Chuẩn bị bánh kem siêu ngon... 🍰
          </div>
          <div ref={line6Ref} style={{...styles.progressBarContainer, opacity: isReduced ? 1 : 0}}>
            <span>[</span>
            <div style={styles.progressBar}>
              <div ref={progressBarFillRef} style={{...styles.progressBarFill, width: isReduced ? '100%' : '0%'}}></div>
            </div>
            <span>] 100%</span>
          </div>
          <div ref={line7Ref} style={{...styles.lineReady, opacity: isReduced ? 1 : 0}}>
            HỆ THỐNG ĐÃ SẴN SÀNG! <span style={styles.cursor}></span>
          </div>
        </div>
      </div>
    </InteractionGate>
  );
};

export default BootSequence;
