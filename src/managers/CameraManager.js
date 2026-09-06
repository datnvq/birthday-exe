class CameraManager {
  constructor() {
    this.stream = null;
    this.state = 'IDLE'; // IDLE, REQUESTING, READY, ERROR
    this.facingMode = 'user';
    this.devices = [];
  }

  async enumerateDevices() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return [];
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.devices = devices.filter(d => d.kind === 'videoinput');
      return this.devices;
    } catch (err) {
      console.warn('Error enumerating devices:', err);
      return [];
    }
  }

  async requestPermission() {
    this.state = 'REQUESTING';
    try {
      this.stopCamera();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia not supported in this browser context (requires HTTPS or localhost)');
        this.state = 'ERROR';
        return false;
      }

      // Try 1: Ideal request (front camera + audio)
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: this.facingMode },
          audio: true
        });
      } catch (err1) {
        console.warn('Failed ideal camera+mic, trying video only:', err1);
        try {
          // Try 2: Video only (maybe no microphone connected)
          this.stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: this.facingMode }
          });
        } catch (err2) {
          console.warn('Failed facingMode video, trying any video device:', err2);
          // Try 3: Any video device (desktop webcam without facingMode support)
          this.stream = await navigator.mediaDevices.getUserMedia({
            video: true
          });
        }
      }

      this.state = 'READY';
      await this.enumerateDevices();
      return true;
    } catch (err) {
      console.error('Camera permission denied or device error:', err);
      this.state = 'ERROR';
      return false;
    }
  }

  async switchCamera() {
    if (this.devices.length <= 1) return false;
    
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    return this.requestPermission();
  }

  getStream() {
    return this.stream;
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.state = 'STOPPED';
  }
}

export const cameraManager = new CameraManager();
