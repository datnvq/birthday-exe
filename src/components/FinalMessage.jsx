import React, { useEffect, useRef, useState } from 'react';
import { createFinaleTimeline } from '../animations/finaleTimeline';
import { useTeasing, TeasingBubble } from './InteractionGate';
// All styles are inline for this component

const FinalMessage = ({ config, onComplete }) => {
  const containerRef = useRef(null);
  const happyRef = useRef(null);
  const birthdayRef = useRef(null);
  const nameRef = useRef(null);
  const messageRef = useRef(null);
  const closingRef = useRef(null);
  const replayRef = useRef(null);
  const versionRef = useRef(null);
  
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  
  const teaseMessage = useTeasing('FINALE', animDone, false);

  useEffect(() => {
    const refs = {
      happy: happyRef.current,
      birthday: birthdayRef.current,
      name: nameRef.current,
      message: messageRef.current,
      closing: closingRef.current,
      replay: replayRef.current,
      version: versionRef.current,
      onComplete: () => setAnimDone(true)
    };

    const tl = createFinaleTimeline(refs);

    return () => {
      tl.kill();
    };
  }, []);

  const handleVersionClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount === 5) {
      setShowEasterEgg(true);
    }
  };

  const closeEasterEgg = () => {
    setShowEasterEgg(false);
  };

  return (
    <div 
      ref={containerRef} 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        padding: '2rem',
        boxSizing: 'border-box',
        backgroundColor: '#07080C',
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={happyRef} 
        style={{
          fontSize: 'clamp(30px, 6vw, 60px)',
          fontWeight: 300,
          letterSpacing: '0.2em',
          opacity: 0,
          marginBottom: '-5px'
        }}
      >
        CHÚC MỪNG
      </div>
      
      <div 
        ref={birthdayRef} 
        style={{
          fontSize: 'clamp(40px, 8vw, 85px)',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#F6C85F',
          opacity: 0,
          marginBottom: '10px'
        }}
      >
        SINH NHẬT
      </div>

      <div 
        ref={nameRef} 
        style={{
          fontSize: 'clamp(60px, 12vw, 120px)',
          fontWeight: 700,
          color: '#F6C85F',
          textShadow: '0 0 20px rgba(246, 200, 95, 0.4)',
          opacity: 0,
          marginBottom: '40px'
        }}
      >
        {config?.name || 'NAME'}
      </div>

      <div 
        ref={messageRef} 
        style={{
          fontSize: 'clamp(14px, 2vw, 20px)',
          lineHeight: 2,
          opacity: 0,
          maxWidth: '500px',
          textAlign: 'center',
          fontWeight: 300,
          marginBottom: '30px'
        }}
      >
        {(config?.birthdayMessage || 'Another year.\nAnother chapter.\nAnd hopefully, a lot of good memories ahead.')
          .split('\n')
          .map((line, i) => (
            <p key={i} style={{ margin: 0 }}>{line}</p>
          ))
        }
      </div>

      <div 
        ref={closingRef} 
        style={{
          color: '#F472B6',
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          fontWeight: 500,
          opacity: 0,
          marginBottom: '60px'
        }}
      >
        {config?.closingMessage || "I'm really glad you're here. ❤️"}
      </div>

      <div style={{ position: 'absolute', bottom: '15vh', zIndex: 100 }}>
        <TeasingBubble message={teaseMessage} />
      </div>

      <button 
        ref={replayRef}
        onClick={onComplete}
        style={{
          backgroundColor: 'transparent',
          border: '2px solid #F6C85F',
          color: '#F6C85F',
          padding: '12px 24px',
          borderRadius: '4px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '1rem',
          cursor: 'pointer',
          opacity: 0,
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(246, 200, 95, 0.1)';
          e.currentTarget.style.borderColor = '#F6C85F';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        [ CHƠI LẠI TỪ ĐẦU ]
      </button>

      <div
        ref={versionRef}
        onClick={handleVersionClick}
        style={{
          position: 'absolute',
          bottom: '20px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '12px',
          opacity: 0, // GSAP will make it 0.3
          cursor: 'pointer',
          transition: 'opacity 0.3s ease',
        }}
        onMouseOver={(e) => {
          if (e.currentTarget.style.opacity !== '0') {
            e.currentTarget.style.opacity = '0.6';
          }
        }}
        onMouseOut={(e) => {
          if (e.currentTarget.style.opacity !== '0') {
            e.currentTarget.style.opacity = '0.3';
          }
        }}
      >
        Bấm vô đây đi, đừng để lỡ mất quà của t đó!!!!!
      </div>

      {showEasterEgg && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#0D1018',
          border: '1px solid #7DD3FC',
          padding: '30px',
          borderRadius: '8px',
          fontFamily: '"JetBrains Mono", monospace',
          zIndex: 1000,
          boxShadow: '0 0 30px rgba(125, 211, 252, 0.2)',
          minWidth: '300px'
        }}>
          <div style={{ color: '#86EFAC', marginBottom: '10px' }}>{'> sudo birthday --secret'}</div>
          <div style={{ color: '#F6C85F', marginBottom: '10px' }}>ACCESS GRANTED</div>
          <div style={{ color: '#F472B6', marginBottom: '20px', fontWeight: 'bold' }}>🎁 SECRET MODE UNLOCKED</div>
          <div style={{ color: '#FFFFFF', marginBottom: '30px', lineHeight: 1.6 }}>
            {config?.secretMessage || "You found the secret! Have a wonderful day!"}
          </div>
          <button 
            onClick={closeEasterEgg}
            style={{
              background: 'transparent',
              border: '1px solid #7DD3FC',
              color: '#7DD3FC',
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: '"JetBrains Mono", monospace',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#7DD3FC';
              e.currentTarget.style.color = '#0D1018';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#7DD3FC';
            }}
          >
            [CLOSE]
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalMessage;
