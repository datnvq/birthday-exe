import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTeasing, TeasingBubble } from './InteractionGate';

const ErrorWindow = ({ onComplete }) => {
  const dialogRef = useRef(null);
  const okBtnRef = useRef(null);
  const textRef = useRef(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const teaseMessage = useTeasing('ERROR', true, showCelebration);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Glitch/flicker on appearance
      const tl = gsap.timeline();
      
      tl.set(dialogRef.current, { opacity: 0, scale: 0.9 })
        .to(dialogRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" })
        // Subtle glitch
        .to(dialogRef.current, { opacity: 0.5, duration: 0.05, yoyo: true, repeat: 3 }, 0.1);
    }, dialogRef);

    return () => ctx.revert();
  }, []);

  const handleOkClick = () => {
    if (showCelebration) return;
    
    setShowCelebration(true);
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Dialog shake
      tl.to(dialogRef.current, { x: -3, duration: 0.05 })
        .to(dialogRef.current, { x: 3, duration: 0.05 })
        .to(dialogRef.current, { x: -2, duration: 0.05 })
        .to(dialogRef.current, { x: 2, duration: 0.05 })
        .to(dialogRef.current, { x: -1, duration: 0.05 })
        .to(dialogRef.current, { x: 0, duration: 0.05 });
        
      // Show text below
      tl.to(textRef.current, { opacity: 1, duration: 0.4 }, "+=0.1");
      
      // Wait 1.5s then fade out
      tl.to([dialogRef.current, textRef.current], { 
        opacity: 0, 
        scale: 0.9, 
        duration: 0.5,
        delay: 1.5,
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });
      
    }, dialogRef);
  };

  return (
    <div style={styles.overlay}>
      <div style={{ position: 'absolute', bottom: '15vh', zIndex: 100 }}>
        <TeasingBubble message={teaseMessage} />
      </div>
      <div ref={dialogRef} style={styles.dialog}>
        <div style={styles.titleBar}>
          <div style={styles.dot} />
          <div style={styles.titleText}>CẢNH BÁO LỖI HỆ THỐNG</div>
        </div>
        
        <div style={styles.body}>
          <div style={styles.content}>
            TUỔI TÁC: <span style={styles.redacted}>██████████</span><br/>
            MÃ LỖI: QUÁ_LÀ_XINH_GÁI<br/><br/>
            Không thể tính toán tuổi tác.<br/>
            Hệ thống bị quá tải vì nhan sắc này!
          </div>
          
          <button 
            ref={okBtnRef}
            onClick={handleOkClick}
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FFD770'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F6C85F'}
          >
            [ BẤM ĐÂY ĐỂ BỎ QUA ]
          </button>
        </div>
      </div>
      
      <div ref={textRef} style={styles.celebrationText}>
        Thôi quẩy lên bạn eiii! 🎉
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
    zIndex: 100,
  },
  dialog: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#0D1018',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 0 20px rgba(246, 200, 95, 0.15), 0 10px 30px rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#FF5F56',
    marginRight: '12px',
  },
  titleText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.8rem',
    letterSpacing: '1px',
    fontFamily: 'JetBrains Mono, monospace',
  },
  body: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  content: {
    fontFamily: 'JetBrains Mono, monospace',
    color: '#E0E0E0',
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  redacted: {
    color: 'rgba(255,255,255,0.2)',
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: '#F6C85F',
    color: '#07080C',
    border: 'none',
    padding: '8px 24px',
    borderRadius: '6px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, outline 0.2s',
    outline: 'none',
  },
  celebrationText: {
    marginTop: '2rem',
    color: '#F6C85F',
    fontSize: '1.1rem',
    opacity: 0, // initially hidden
    fontFamily: 'Inter, sans-serif',
  }
};

export default ErrorWindow;
