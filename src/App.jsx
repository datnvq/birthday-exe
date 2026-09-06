import React, { useState, useCallback, useEffect, useRef } from 'react';
import birthdayConfig from './config/birthdayConfig';
import { cameraManager } from './managers/CameraManager';
import { recordingManager } from './managers/RecordingManager';
import { audioManager } from './managers/AudioManager';

import CameraPermission from './components/CameraPermission';
import CameraCalibration from './components/CameraCalibration';
import CameraOverlay from './components/CameraOverlay';
import BootSequence from './components/BootSequence';
import UserDetected from './components/UserDetected';
import ErrorWindow from './components/ErrorWindow';
import GiftBox from './components/GiftBox';
import BirthdayCake from './components/BirthdayCake';
import WishScene from './components/WishScene';
import Countdown from './components/Countdown';
import Confetti from './components/Confetti';
import MemoryReveal from './components/MemoryReveal';
import FinalMessage from './components/FinalMessage';
import ReactionPreview from './components/ReactionPreview';

const SCENES = {
  CAMERA_PERMISSION: 'CAMERA_PERMISSION',
  CAMERA_CALIBRATION: 'CAMERA_CALIBRATION',
  BOOT: 'BOOT',
  USER_DETECTED: 'USER_DETECTED',
  ERROR: 'ERROR',
  GIFT: 'GIFT',
  CAKE: 'CAKE',
  WISH: 'WISH',
  COUNTDOWN: 'COUNTDOWN',
  MEMORY_REVEAL: 'MEMORY_REVEAL',
  FINALE: 'FINALE',
  REACTION_PREVIEW: 'REACTION_PREVIEW',
};

const App = () => {
  const [currentScene, setCurrentScene] = useState(
    birthdayConfig.camera.enabled ? SCENES.CAMERA_PERMISSION : SCENES.BOOT
  );
  const [isMuted, setIsMuted] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Camera state
  const [cameraStream, setCameraStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const goTo = useCallback((scene) => {
    setCurrentScene(scene);
  }, []);

  // Update audio manager on mute change
  useEffect(() => {
    audioManager.setMuted(isMuted);
  }, [isMuted]);

  // Scene triggers
  useEffect(() => {
    if (currentScene === SCENES.BOOT) {
      audioManager.play('boot');
    } else if (currentScene === SCENES.ERROR) {
      audioManager.play('glitch');
    }
    
    // Confetti overlay persists through MEMORY_REVEAL and FINALE
    if (currentScene === SCENES.MEMORY_REVEAL || currentScene === SCENES.FINALE) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [currentScene]);

  // Handlers for Camera Flow
  const handleCameraGranted = () => {
    setCameraStream(cameraManager.getStream());
    goTo(SCENES.CAMERA_CALIBRATION);
  };

  const handleCameraSkip = () => {
    goTo(SCENES.BOOT);
  };

  const handleCalibrationComplete = async () => {
    if (birthdayConfig.camera.recordReaction && cameraStream) {
      const started = await recordingManager.startCompositedRecording(cameraStream, 'app-root');
      setIsRecording(started);
    }
    goTo(SCENES.BOOT);
  };

  const handleFinaleComplete = async () => {
    if (isRecording) {
      await recordingManager.stopRecording();
      setIsRecording(false);
      cameraManager.stopCamera();
      setCameraStream(null);
      goTo(SCENES.REACTION_PREVIEW);
    } else {
      goTo(SCENES.REACTION_PREVIEW);
    }
  };

  const handleReplay = useCallback(() => {
    // Reset all state
    audioManager.cleanup();
    recordingManager.revokeVideoUrl();
    cameraManager.stopCamera();
    
    setIsRecording(false);
    setCameraStream(null);
    setShowConfetti(false);
    
    goTo(birthdayConfig.camera.enabled ? SCENES.CAMERA_PERMISSION : SCENES.BOOT);
  }, [goTo]);

  // Sound toggle visibility
  const showSoundToggle = ![SCENES.CAMERA_PERMISSION, SCENES.CAMERA_CALIBRATION].includes(currentScene);
  const showCameraOverlay = birthdayConfig.camera.showOverlay && cameraStream && ![SCENES.CAMERA_PERMISSION, SCENES.CAMERA_CALIBRATION, SCENES.REACTION_PREVIEW].includes(currentScene);

  return (
    <div id="app-root" style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#07080C',
    }}>
      {/* Sound toggle */}
      {showSoundToggle && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          style={{
            position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
            fontSize: '24px', background: 'none', border: 'none',
            cursor: 'pointer', padding: '8px', lineHeight: 1,
            opacity: 0.6, transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      )}

      {/* Confetti overlay */}
      {showConfetti && <Confetti active={true} />}

      {/* Camera PiP */}
      {showCameraOverlay && (
        <CameraOverlay stream={cameraStream} isRecording={isRecording} />
      )}

      {/* Scene container */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>

        {currentScene === SCENES.CAMERA_PERMISSION && (
          <div className="scene active">
            <CameraPermission onGranted={handleCameraGranted} onSkip={handleCameraSkip} />
          </div>
        )}

        {currentScene === SCENES.CAMERA_CALIBRATION && (
          <div className="scene active">
            <CameraCalibration onComplete={handleCalibrationComplete} />
          </div>
        )}

        {currentScene === SCENES.BOOT && (
          <div className="scene active">
            <BootSequence onComplete={() => goTo(SCENES.USER_DETECTED)} />
          </div>
        )}

        {currentScene === SCENES.USER_DETECTED && (
          <div className="scene active">
            <UserDetected onComplete={() => goTo(SCENES.ERROR)} config={birthdayConfig} />
          </div>
        )}

        {currentScene === SCENES.ERROR && (
          <div className="scene active">
            <ErrorWindow onComplete={() => goTo(SCENES.GIFT)} />
          </div>
        )}

        {currentScene === SCENES.GIFT && (
          <div className="scene active">
            <GiftBox 
              onComplete={() => goTo(SCENES.CAKE)} 
              onInteraction={() => audioManager.play('gift-shake')}
              onOpen={() => {
                audioManager.play('gift-open');
                audioManager.playBGM();
              }}
            />
          </div>
        )}

        {currentScene === SCENES.CAKE && (
          <div className="scene active">
            <BirthdayCake
              config={birthdayConfig}
              onComplete={() => goTo(SCENES.WISH)}
              onCakeEmerge={() => audioManager.play('magical-chime')}
              onCandleLight={() => audioManager.play('candle-light')}
            />
          </div>
        )}

        {currentScene === SCENES.WISH && (
          <div className="scene active">
            <WishScene 
              onComplete={() => goTo(SCENES.COUNTDOWN)} 
              onExtinguish={() => audioManager.play('candle-blow')}
            />
          </div>
        )}

        {currentScene === SCENES.COUNTDOWN && (
          <div className="scene active">
            <Countdown 
              onComplete={() => goTo(SCENES.MEMORY_REVEAL)} 
              onTick={() => audioManager.play('countdown')}
              onBlast={() => audioManager.play('celebration')}
            />
          </div>
        )}

        {currentScene === SCENES.MEMORY_REVEAL && (
          <div className="scene active">
            <MemoryReveal 
              config={birthdayConfig} 
              onComplete={() => goTo(SCENES.FINALE)} 
            />
          </div>
        )}

        {currentScene === SCENES.FINALE && (
          <div className="scene active">
            <FinalMessage
              config={birthdayConfig}
              onComplete={handleFinaleComplete}
            />
          </div>
        )}

        {currentScene === SCENES.REACTION_PREVIEW && (
          <div className="scene active">
            <ReactionPreview onReplay={handleReplay} />
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
