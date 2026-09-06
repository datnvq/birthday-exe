import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { cameraManager } from '../managers/CameraManager';

const CameraCalibration = ({ onComplete }) => {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let isActive = true;
    
    const runCalibration = async () => {
      const addLine = (text, delay) => {
        return new Promise(resolve => {
          setTimeout(() => {
            if (!isActive) return;
            setLines(prev => [...prev, text]);
            resolve();
          }, delay);
        });
      };

      await addLine('> ĐANG KẾT NỐI CAMERA...', 500);
      await addLine('✓ ĐÃ THẤY BẢN MẶT QUEN THUỘC', 600);
      
      const devices = cameraManager.devices;
      if (devices.length > 1) {
        await addLine('> PHÁT HIỆN NHIỀU CAMERA', 400);
        await addLine('> ĐANG XOAY SANG CAM TRƯỚC...', 800);
        // Ensure we are using the user-facing camera
        if (cameraManager.facingMode !== 'user') {
          await cameraManager.switchCamera();
        }
      }

      await addLine('✓ GƯƠNG MẶT ĐÃ SẴN SÀNG ĐỂ BỊ BẮT QUẢ TANG', 600);
      
      setTimeout(() => {
        if (!isActive) return;
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete
        });
      }, 800);
    };

    runCalibration();

    return () => {
      isActive = false;
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} style={styles.wrapper}>
      <div style={styles.terminal}>
        {lines.map((line, i) => (
          <div 
            key={i} 
            style={{
              ...styles.line, 
              color: line.startsWith('✓') ? '#4ade80' : '#E0E0E0'
            }}
          >
            {line}
          </div>
        ))}
        <div style={styles.cursor}></div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#07080C',
    fontFamily: '"JetBrains Mono", monospace',
  },
  terminal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
  },
  line: {
    fontSize: '1rem',
    letterSpacing: '1px',
    animation: 'fadeIn 0.2s forwards'
  },
  cursor: {
    width: '10px',
    height: '1.2em',
    backgroundColor: '#F6C85F',
    animation: 'blink 1s step-end infinite',
    marginTop: '5px'
  }
};

export default CameraCalibration;
