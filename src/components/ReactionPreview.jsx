import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { recordingManager } from '../managers/RecordingManager';

const ReactionPreview = ({ onReplay }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  
  useEffect(() => {
    const blob = recordingManager.getRecordedBlob();
    if (blob && blob.size > 0) {
      setHasVideo(true);
      const url = recordingManager.createVideoUrl();
      setVideoUrl(url);
    }
    
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' }
    );

    return () => {
      // Don't revoke URL immediately on unmount if it's still being downloaded, 
      // but App handles replay cleanup.
    };
  }, []);

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    recordingManager.downloadVideo();
  };

  return (
    <div ref={containerRef} style={styles.wrapper}>
      <h1 style={styles.header}>HOÀN THÀNH SINH_NHAT.EXE</h1>
      
      {hasVideo ? (
        <div style={styles.content}>
          <h2 style={styles.subheader}>ĐÃ BẮT TRỌN BIỂU CẢM KHÓ ĐỠ NÀY ✓</h2>
          
          <div style={styles.videoWrapper}>
            <video 
              ref={videoRef}
              src={videoUrl}
              style={styles.video}
              onEnded={() => setIsPlaying(false)}
              playsInline
            />
            {!isPlaying && (
              <button style={styles.playOverlay} onClick={handlePlayToggle}>
                ▶
              </button>
            )}
          </div>
          
          <div style={styles.actions}>
            <button style={styles.primaryButton} onClick={handleDownload}>
              [ TẢI VIDEO KỶ NIỆM VỀ MÁY ]
            </button>
            <button style={styles.secondaryButton} onClick={onReplay}>
              [ CHƠI LẠI LẦN NỮA ]
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.content}>
          <p style={styles.noVideo}>Trình duyệt này không hỗ trợ quay lại phản ứng rồi bạn ơi.</p>
          <button style={styles.primaryButton} onClick={onReplay}>
            [ CHƠI LẠI TỪ ĐẦU ]
          </button>
        </div>
      )}
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
    width: '100%',
    backgroundColor: '#07080C',
    color: '#fff',
    fontFamily: '"Inter", sans-serif',
    padding: '2rem',
  },
  header: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    color: '#F6C85F',
    letterSpacing: '2px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px',
  },
  subheader: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '1rem',
    color: '#4ade80',
    marginBottom: '2rem',
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    aspectRatio: '3/4',
    backgroundColor: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    marginBottom: '2rem',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scaleX(-1)', // Mirrored matching recording
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(246, 200, 95, 0.9)',
    color: '#07080C',
    border: 'none',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    paddingLeft: '6px', // Visual center for play triangle
    transition: 'transform 0.2s, background-color 0.2s',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '300px',
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
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#F2A0C4',
    border: '1px solid #F2A0C4',
    borderRadius: '6px',
    padding: '12px 24px',
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s',
  },
  noVideo: {
    color: '#FCA5A5',
    marginBottom: '2rem',
    textAlign: 'center',
  }
};

export default ReactionPreview;
