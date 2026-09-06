import html2canvas from 'html2canvas';

class RecordingManager {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.blob = null;
    this.objectUrl = null;
    this.state = 'IDLE'; 
    this.compositingInterval = null;
    this.compositeCanvas = null;
    this.cameraVideo = null;
    this.audioContext = null;
    this.destinationNode = null;
  }

  async startCompositedRecording(cameraStream, targetElementId) {
    if (!cameraStream) {
      console.warn("No camera stream provided for composited recording");
      return false;
    }

    const targetElement = document.getElementById(targetElementId) || document.body;

    this.recordedChunks = [];
    this.blob = null;
    this.revokeVideoUrl();
    this.state = 'STARTING';

    // 1. Setup composite canvas
    this.compositeCanvas = document.createElement('canvas');
    this.compositeCanvas.width = 1280;
    this.compositeCanvas.height = 720;
    const ctx = this.compositeCanvas.getContext('2d', { alpha: false });

    // 2. Setup hidden video for camera
    this.cameraVideo = document.createElement('video');
    this.cameraVideo.srcObject = cameraStream;
    this.cameraVideo.muted = true;
    this.cameraVideo.playsInline = true;
    await this.cameraVideo.play();

    // 3. Audio mixing
    // We need to capture both the microphone (from cameraStream) and browser audio.
    // However, capturing browser audio automatically isn't possible without getDisplayMedia.
    // We will just record the microphone for now.
    const compositeStream = this.compositeCanvas.captureStream(10); // 10 FPS
    
    // Add microphone audio tracks to the composite stream
    cameraStream.getAudioTracks().forEach(track => {
      compositeStream.addTrack(track);
    });

    // 4. Start MediaRecorder
    let mimeType = 'video/webm';
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4'
    ];

    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) {
        mimeType = t;
        break;
      }
    }

    try {
      this.mediaRecorder = new MediaRecorder(compositeStream, { mimeType, videoBitsPerSecond: 2500000 });
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(1000); 
      this.state = 'ACTIVE';

      // 5. Compositing Loop (10 FPS)
      const targetFPS = 10;
      const intervalMs = 1000 / targetFPS;
      let isCapturing = false;

      this.compositingInterval = setInterval(async () => {
        if (isCapturing || this.state !== 'ACTIVE') return;
        isCapturing = true;

        try {
          const uiCanvas = await html2canvas(targetElement, {
            scale: 1, // keep it fast
            logging: false,
            useCORS: true,
            backgroundColor: '#07080C',
            ignoreElements: (el) => el.id === 'camera-overlay-pip' // ignore the standard PIP if it exists in DOM
          });

          // Draw UI
          ctx.drawImage(uiCanvas, 0, 0, this.compositeCanvas.width, this.compositeCanvas.height);

          // Draw Camera PiP (Top Right)
          const pipWidth = 240;
          const pipHeight = (this.cameraVideo.videoHeight / this.cameraVideo.videoWidth) * pipWidth || 180;
          const pipX = this.compositeCanvas.width - pipWidth - 30;
          const pipY = 30;

          // Draw border/shadow for PiP
          ctx.fillStyle = '#F6C85F';
          ctx.fillRect(pipX - 2, pipY - 2, pipWidth + 4, pipHeight + 4);
          
          ctx.drawImage(this.cameraVideo, pipX, pipY, pipWidth, pipHeight);

        } catch (e) {
          console.error("Compositing frame error:", e);
        } finally {
          isCapturing = false;
        }

      }, intervalMs);

      return true;
    } catch (err) {
      console.error('Error starting MediaRecorder:', err);
      this.state = 'ERROR';
      return false;
    }
  }

  stopRecording() {
    return new Promise((resolve) => {
      if (this.compositingInterval) {
        clearInterval(this.compositingInterval);
        this.compositingInterval = null;
      }

      if (this.cameraVideo) {
        this.cameraVideo.pause();
        this.cameraVideo.srcObject = null;
      }

      if (!this.mediaRecorder || this.state !== 'ACTIVE') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        this.blob = new Blob(this.recordedChunks, { type: this.mediaRecorder.mimeType });
        this.state = 'READY';
        resolve(this.blob);
      };

      this.mediaRecorder.stop();
      this.state = 'STOPPING';
    });
  }

  getRecordedBlob() {
    return this.blob;
  }

  createVideoUrl() {
    if (!this.blob) return null;
    if (this.objectUrl) this.revokeVideoUrl();
    this.objectUrl = URL.createObjectURL(this.blob);
    return this.objectUrl;
  }

  revokeVideoUrl() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  downloadVideo(filename = 'birthday-reaction.webm') {
    if (!this.blob) return;
    
    if (navigator.share && navigator.canShare) {
      const file = new File([this.blob], filename, { type: this.blob.type });
      if (navigator.canShare({ files: [file] })) {
        navigator.share({
          title: 'My Birthday Reaction',
          files: [file]
        }).catch(err => {
          console.log('Share canceled or failed', err);
          this._fallbackDownload(filename);
        });
        return;
      }
    }
    
    this._fallbackDownload(filename);
  }

  _fallbackDownload(filename) {
    const url = this.createVideoUrl();
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  }
}

export const recordingManager = new RecordingManager();
