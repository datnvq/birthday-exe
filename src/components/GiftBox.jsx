import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { createIdleAnimation, createGlowPulse, createOpenTimeline } from '../animations/giftTimeline';
import InteractionGate from './InteractionGate';

const GiftBox = ({ onComplete, onInteraction, onOpen, startOpen }) => {
  const containerRef = useRef(null);
  const boxRef = useRef(null);
  const lidRef = useRef(null);
  const ribbonRef = useRef(null);
  const lightRef = useRef(null);
  const particlesRef = useRef(null);
  const shadowRef = useRef(null);
  const textRef = useRef(null);
  
  const [isOpened, setIsOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const triggerOpen = useCallback(() => {
    if (isOpened) return;
    setIsOpened(true);
    
    if (onInteraction) onInteraction();
    if (onOpen) setTimeout(onOpen, 600); // delay open sound to match animation lid popping

    // Stop idle animations
    gsap.killTweensOf(containerRef.current);
    gsap.killTweensOf(shadowRef.current);
    gsap.killTweensOf(textRef.current);
    
    gsap.to(textRef.current, { opacity: 0, duration: 0.3 });

    const ctx = gsap.context(() => {
      createOpenTimeline({
        lidRef: lidRef.current,
        boxRef: boxRef.current,
        ribbonRef: ribbonRef.current,
        lightRef: lightRef.current,
        containerRef: containerRef.current,
        particlesRef: particlesRef
      }, () => {
        if (onComplete) onComplete();
      });
    });
  }, [isOpened, onComplete, onInteraction, onOpen]);

  useEffect(() => {
    let idleCtx;
    
    if (!isOpened) {
      idleCtx = gsap.context(() => {
        // Idle animation
        createIdleAnimation(containerRef.current);
        createGlowPulse(shadowRef.current);
        
        // Breathing text
        gsap.to(textRef.current, {
          opacity: 1,
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      });
    }

    return () => {
      if (idleCtx) idleCtx.revert();
    };
  }, [isOpened]);

  useEffect(() => {
    if (startOpen && !isOpened) {
      triggerOpen();
    }
  }, [startOpen, isOpened, triggerOpen]);

  // Generate particles
  const particles = Array.from({ length: 12 }).map((_, i) => (
    <div key={i} style={{
      position: 'absolute',
      width: `${Math.random() * 6 + 4}px`,
      height: `${Math.random() * 6 + 4}px`,
      borderRadius: '50%',
      backgroundColor: ['#F6C85F', '#F2A0C4', '#FFFFFF'][Math.floor(Math.random() * 3)],
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 1,
      zIndex: 5
    }} />
  ));

  return (
    <InteractionGate 
      active={!isOpened} 
      sceneKey="GIFT" 
      buttonText="[ MỞ HỘP QUÀ RA COI ]" 
      onInteract={triggerOpen}
    >
      <div style={styles.wrapper}>
        <div 
          ref={containerRef}
          onClick={triggerOpen}
          style={{
            ...styles.container,
            transform: isHovered && !isOpened ? 'scale(1.05)' : 'scale(1)',
            filter: isHovered && !isOpened ? 'drop-shadow(0 0 15px rgba(246, 200, 95, 0.4))' : 'none'
          }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div ref={shadowRef} style={styles.shadow} />
        
        <div ref={boxRef} style={styles.giftBoxWrapper}>
          <div style={styles.giftBox}>
            <div style={styles.ribbonV} />
            <div style={styles.ribbonH} />
            
            {/* The magical light */}
            <div ref={lightRef} style={styles.light} />
            
            {/* Particles container */}
            <div ref={particlesRef} style={styles.particlesContainer}>
              {particles}
            </div>
          </div>
          
          <div ref={lidRef} style={styles.giftLidWrapper}>
            <div style={styles.giftLid}>
              <div style={styles.lidRibbonV} />
              <div style={styles.lidRibbonH} />
              <div ref={ribbonRef} style={styles.bow}>
                <div style={styles.bowLoopLeft} />
                <div style={styles.bowLoopRight} />
                <div style={styles.bowKnot} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div ref={textRef} style={styles.text}>
        BẤM VÀO HỘP ĐỂ MỞ QUÀ 🎁
      </div>
    </div>
    </InteractionGate>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    position: 'relative',
    perspective: '800px',
  },
  container: {
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, filter 0.3s ease',
    transformStyle: 'preserve-3d',
    zIndex: 10,
  },
  shadow: {
    position: 'absolute',
    bottom: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '120px',
    height: '20px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: '50%',
    filter: 'blur(5px)',
    opacity: 0.3,
    zIndex: 1,
  },
  giftBoxWrapper: {
    position: 'relative',
    transformStyle: 'preserve-3d',
    zIndex: 2,
  },
  giftBox: {
    width: '150px',
    height: '120px',
    background: 'linear-gradient(135deg, #F6C85F 0%, #E8A830 100%)',
    borderRadius: '4px',
    position: 'relative',
    boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  ribbonV: {
    position: 'absolute',
    width: '24px',
    height: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#F2A0C4',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
  },
  ribbonH: {
    position: 'absolute',
    height: '24px',
    width: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#F2A0C4',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
  },
  giftLidWrapper: {
    position: 'absolute',
    top: '-30px',
    left: '-10px',
    width: '170px',
    height: '35px',
    transformOrigin: 'bottom center',
    transformStyle: 'preserve-3d',
    zIndex: 10,
  },
  giftLid: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #F6C85F 0%, #E8A830 100%)',
    borderRadius: '4px',
    position: 'relative',
    boxShadow: 'inset -2px -2px 10px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.2)',
  },
  lidRibbonV: {
    position: 'absolute',
    width: '24px',
    height: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#F2A0C4',
  },
  lidRibbonH: {
    position: 'absolute',
    height: '12px',
    width: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#F2A0C4',
  },
  bow: {
    position: 'absolute',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '30px',
    zIndex: 15,
  },
  bowLoopLeft: {
    position: 'absolute',
    left: '0',
    top: '0',
    width: '30px',
    height: '25px',
    background: '#F2A0C4',
    borderRadius: '30px 0 30px 30px',
    transformOrigin: 'bottom right',
    transform: 'rotate(-20deg)',
    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1)',
  },
  bowLoopRight: {
    position: 'absolute',
    right: '0',
    top: '0',
    width: '30px',
    height: '25px',
    background: '#F2A0C4',
    borderRadius: '0 30px 30px 30px',
    transformOrigin: 'bottom left',
    transform: 'rotate(20deg)',
    boxShadow: 'inset -2px 2px 5px rgba(0,0,0,0.1)',
  },
  bowKnot: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -20%)',
    width: '16px',
    height: '16px',
    background: '#E080A8',
    borderRadius: '50%',
    zIndex: 2,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  light: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%) scale(0.5)',
    width: '150px',
    height: '150px',
    background: 'radial-gradient(circle, rgba(255,230,150,1) 0%, rgba(246,200,95,0.6) 40%, rgba(0,0,0,0) 70%)',
    opacity: 0,
    zIndex: 4,
    pointerEvents: 'none',
    mixBlendMode: 'screen',
  },
  particlesContainer: {
    position: 'absolute',
    top: '20px',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 5,
  },
  text: {
    marginTop: 'clamp(24px, 5vh, 40px)',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 'clamp(0.8rem, 2.8vw, 0.95rem)',
    color: '#E0E0E0',
    letterSpacing: 'clamp(1px, 0.5vw, 2px)',
    textAlign: 'center',
    padding: '6px 16px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    opacity: 0.8,
  }
};

export default GiftBox;
