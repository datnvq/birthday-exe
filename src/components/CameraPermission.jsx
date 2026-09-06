import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { cameraManager } from '../managers/CameraManager';
import { teasingMessages } from '../config/teasingMessages';

const CameraPermission = ({ onGranted, onSkip }) => {
  const containerRef = useRef(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [refusalLevel, setRefusalLevel] = useState(0); // 0 = initial, up to 4

  useEffect(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );
  }, []);

  const [permissionError, setPermissionError] = useState(null);

  const handleEnableCamera = async () => {
    setIsRequesting(true);
    setPermissionError(null);
    const success = await cameraManager.requestPermission();
    
    if (success) {
      gsap.to(containerRef.current, { opacity: 0, duration: 0.5, onComplete: onGranted });
    } else {
      setIsRequesting(false);
      // Check if getUserMedia is not supported (HTTP vs HTTPS / localhost)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError("Trình duyệt chỉ cho phép mở camera khi chạy trên 'localhost' hoặc 'https://'.");
      } else {
        setPermissionError("Không thể mở camera (Do chặn quyền trên trình duyệt hoặc máy tính chưa cắm webcam).");
      }
      handleRefusal();
    }
  };

  const handleRefusal = () => {
    const nextLevel = refusalLevel + 1;
    if (nextLevel >= 4) {
      // Respect decision on 4th refusal and continue without camera
      setRefusalLevel(4);
    } else {
      setRefusalLevel(nextLevel);
    }
  };

  const handleContinueWithoutCamera = () => {
    gsap.to(containerRef.current, { opacity: 0, duration: 0.5, onComplete: onSkip });
  };

  const renderContent = () => {
    if (refusalLevel === 0) {
      return (
        <div style={styles.box}>
          <h2 style={styles.subtitle}>CAMERA ACCESS REQUIRED</h2>
          <p style={styles.text}>Một thứ hơi đáng ngờ đang chuẩn bị xảy ra...</p>
          <p style={styles.text}>Nhớ mở âm thanh ở cái nút trên góc phải nha Mẫn...</p>
          <p style={styles.textSmall}>📷 Cho phép camera để hệ thống có thể nhìn thấy reaction của bạn.</p>
          
          <button 
            onClick={handleEnableCamera} 
            disabled={isRequesting}
            style={styles.primaryButton}
          >
            {isRequesting ? 'REQUESTING...' : '[ CHO PHÉP CAMERA ]'}
          </button>
          
          <button onClick={handleRefusal} style={styles.skipButton}>
            [ CÔNG CHÚA Y VINH BỮA NI NGẠI ]
          </button>

          
        </div>
      );
    }

    const tease = teasingMessages.camera[refusalLevel - 1];

    if (refusalLevel === 4) {
      return (
        <div style={styles.box}>
          <p style={styles.text}>{tease.msg1}</p>
          <p style={{...styles.text, whiteSpace: 'pre-line'}}>{tease.msg2}</p>
          <button onClick={handleContinueWithoutCamera} style={styles.primaryButton}>
            {tease.btnYes}
          </button>
        </div>
      );
    }

    return (
      <div style={styles.box}>
        <p style={styles.text}>{tease.msg1}</p>
        <p style={styles.textSmall}>{tease.msg2}</p>
        
        {permissionError && (
          <p style={{ color: '#F87171', fontSize: '0.85rem', marginTop: '10px' }}>⚠️ {permissionError}</p>
        )}

        <button 
          onClick={handleEnableCamera} 
          disabled={isRequesting}
          style={styles.primaryButton}
        >
          {isRequesting ? 'ĐANG KẾT NỐI...' : tease.btnYes}
        </button>
        
        {tease.btnNo && (
          <button onClick={handleRefusal} style={styles.skipButton}>
            {tease.btnNo}
          </button>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} style={styles.wrapper}>
      <h1 style={styles.title}>BIRTHDAY.EXE</h1>
      {renderContent()}
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontFamily: '"Inter", sans-serif',
    color: '#fff',
    padding: '2rem',
    textAlign: 'center',
    opacity: 0
  },
  title: {
    fontFamily: '"JetBrains Mono", monospace',
    color: '#F6C85F',
    letterSpacing: '0.2em',
    marginBottom: '3rem',
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
  },
  box: {
    backgroundColor: '#0D1018',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  subtitle: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '1rem',
    color: '#F2A0C4',
    marginBottom: '1rem',
    letterSpacing: '1px',
  },
  text: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
    color: '#E0E0E0',
  },
  textSmall: {
    fontSize: '0.9rem',
    marginBottom: '2rem',
    color: '#A0A0A0',
  },
  primaryButton: {
    backgroundColor: '#F6C85F',
    color: '#07080C',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s',
    marginBottom: '1rem',
  },
  skipButton: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    color: '#E0E0E0',
    padding: '12px 24px',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '0.9rem',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s',
  },
  privacy: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '1.5rem',
  }
};

export default CameraPermission;
