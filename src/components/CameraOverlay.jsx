import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CameraOverlay = ({ stream, isRecording }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.2)' }
    );

    return () => {
      // Unmounting animation is usually handled by parent, but we can do a quick exit if needed
    };
  }, []);

  if (!stream) return null;

  return (
    <div id="camera-overlay-pip" ref={containerRef} className="camera-overlay-container" style={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={styles.video}
      />
      
      {isRecording && (
        <div style={styles.recIndicator}>
          <div style={styles.recDot} className="rec-pulse"></div>
          <span style={styles.recText}>REC</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    width: 'clamp(90px, 15vw, 120px)',
    aspectRatio: '3/4',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.4), 0 0 15px rgba(246, 200, 95, 0.1)',
    zIndex: 900, // Below top level UI, above scenes
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)', // Mirror user camera
  },
  recIndicator: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  recDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
  },
  recText: {
    color: '#fff',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '8px',
    fontWeight: 'bold',
  }
};

export default CameraOverlay;
