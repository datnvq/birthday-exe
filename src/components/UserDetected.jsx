import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import InteractionGate from './InteractionGate';

const UserDetected = ({ onComplete, config }) => {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const line4Ref = useRef(null);
  const line5Ref = useRef(null);
  const [animDone, setAnimDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current, line5Ref.current], { opacity: 1 });
      setAnimDone(true);
      return;
    }

    const tl = gsap.timeline();

    tl.fromTo(line1Ref.current, 
      { opacity: 0, scale: 0.9, textShadow: '0 0 0px rgba(246, 200, 95, 0)' },
      { opacity: 1, scale: 1, textShadow: '0 0 10px rgba(246, 200, 95, 0.5)', duration: 0.8 }, 0
    )
      .fromTo(line2Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.0)
      .fromTo(line3Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5)
      .fromTo(line4Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 2.0)
      .fromTo(line5Ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 3.0)
      .call(() => setAnimDone(true));

    return () => {
      tl.kill();
    };
  }, []);

  const handleInteract = () => {
    gsap.to([line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current, line5Ref.current], { 
      opacity: 0, 
      duration: 0.5, 
      onComplete: onComplete 
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
      color: '#fff'
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(0.8rem, 2vh, 1.5rem)',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 clamp(16px, 4vw, 32px)',
      maxWidth: 'min(700px, 92vw)'
    },
    detected: {
      fontFamily: '"JetBrains Mono", monospace',
      textTransform: 'uppercase',
      letterSpacing: 'clamp(2px, 1vw, 4px)',
      color: '#F6C85F',
      fontSize: 'clamp(1.1rem, 4vw, 1.6rem)',
      fontWeight: 'bold',
      marginBottom: 'clamp(0.5rem, 1.5vh, 1rem)'
    },
    text: {
      fontFamily: '"Inter", sans-serif',
      fontSize: 'clamp(1rem, 3.5vw, 1.6rem)',
      opacity: 0,
      lineHeight: 1.4
    },
    accent: {
      color: '#F6C85F'
    },
    subtle: {
      color: '#F6C85F',
      fontSize: 'clamp(0.9rem, 3vw, 1.3rem)'
    },
    scan: { opacity: 0, fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', color: 'rgba(255,255,255,0.7)' },
    match: { opacity: 0, fontSize: 'clamp(1rem, 3.5vw, 1.4rem)', fontWeight: 600, color: '#4ade80' },
    warning: { opacity: 0, fontSize: 'clamp(0.95rem, 3.2vw, 1.3rem)', color: '#F2A0C4' },
    init: { opacity: 0, fontSize: 'clamp(0.9rem, 3vw, 1.2rem)', color: 'rgba(255,255,255,0.8)' }
  };

  return (
    <InteractionGate active={animDone} sceneKey="USER_DETECTED" buttonText="[ XEM TIẾP COI ]" onInteract={handleInteract}>
      <div ref={containerRef} style={styles.wrapper}>
        <div style={styles.container}>
          <div ref={line1Ref} style={styles.detected}>
            [ PHÁT HIỆN NHÂN VẬT CHÍNH ]
          </div>
          <div ref={line2Ref} style={styles.scan}>
            ĐANG QUÉT MỨC ĐỘ XINH ĐẸP...
          </div>
          <div ref={line3Ref} style={styles.match}>
            KẾT QUẢ: {config?.name || 'Mẫn Xinh Gái'} (10/10 ĐIỂM)
          </div>
          <div ref={line4Ref} style={styles.warning}>
            CẢNH BÁO: HÔM NAY LÀ NGÀY CỰC KỲ ĐẶC BIỆT!
          </div>
          <div ref={line5Ref} style={styles.init}>
            ĐANG CHUẨN BỊ BẮN BẤT NGỜ VÀO MẶT...
          </div>
        </div>
      </div>
    </InteractionGate>
  );
};

export default UserDetected;
