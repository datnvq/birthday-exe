import React, { useState, useEffect, useRef } from 'react';
import { teasingMessages } from '../config/teasingMessages';
import gsap from 'gsap';

export function useTeasing(sceneKey, active = true, isInteracted = false) {
  const [teaseLevel, setTeaseLevel] = useState(-1);
  
  useEffect(() => {
    if (!active || isInteracted) return;

    const messages = teasingMessages.scenes[sceneKey] || [];
    let timers = [];

    const startTimer = (delayMs, level) => {
      timers.push(
        setTimeout(() => {
          if (messages[level]) {
            setTeaseLevel(level);
          }
        }, delayMs)
      );
    };

    // 6s, 12s, 20s, 30s
    startTimer(6000, 0);
    startTimer(12000, 1);
    startTimer(20000, 2);
    startTimer(30000, 3);

    return () => timers.forEach(clearTimeout);
  }, [active, sceneKey, isInteracted]);

  const teaseMessage = teaseLevel >= 0 && teasingMessages.scenes[sceneKey] 
    ? teasingMessages.scenes[sceneKey][teaseLevel] 
    : null;

  return teaseMessage;
}

export function TeasingBubble({ message }) {
  const teaseRef = useRef(null);

  useEffect(() => {
    if (message && teaseRef.current) {
      gsap.fromTo(teaseRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
      );
    }
  }, [message]);

  if (!message) return null;

  return (
    <div ref={teaseRef} style={styles.teaseBubble}>
      {message}
    </div>
  );
}

export default function InteractionGate({ sceneKey, onInteract, buttonText, children, active = true }) {
  const [isInteracted, setIsInteracted] = useState(false);
  const teaseMessage = useTeasing(sceneKey, active, isInteracted);

  useEffect(() => {
    setIsInteracted(false);
  }, [sceneKey]);

  const handleInteraction = () => {
    if (!active || isInteracted) return;
    setIsInteracted(true);
    onInteract();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        {children}
      </div>

      {active && !isInteracted && (
        <div style={styles.gateOverlay}>
          <TeasingBubble message={teaseMessage} />
          <button 
            onClick={handleInteraction}
            style={styles.actionButton}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {buttonText || '[ CONTINUE ]'}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    height: '100%',
  },
  gateOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: '15vh',
    pointerEvents: 'none',
  },
  actionButton: {
    backgroundColor: 'rgba(246, 200, 95, 0.9)', // Accent Gold
    color: '#07080C',
    border: 'none',
    borderRadius: '8px',
    padding: '16px 32px',
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: 'bold',
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(246, 200, 95, 0.3)',
    transition: 'transform 0.2s',
    pointerEvents: 'auto',
  },
  teaseBubble: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '12px',
    fontFamily: '"Inter", sans-serif',
    fontSize: '0.9rem',
    marginBottom: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
    pointerEvents: 'none',
    textAlign: 'center',
    maxWidth: '80%',
  }
};
