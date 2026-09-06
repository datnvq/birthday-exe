class AudioManager {
  constructor() {
    this.sounds = {};
    this.isMuted = true;
    this.globalVolume = 0.8;
    this.bgm = null;

    const files = [
      'boot', 'glitch', 'gift-shake', 'gift-open', 
      'magical-chime', 'candle-light', 'candle-blow', 
      'countdown', 'celebration', 'bgm'
    ];

    files.forEach(name => {
      const audio = new Audio(`/audio/${name}.mp3`);
      audio.preload = 'auto';
      
      if (name === 'bgm') {
        audio.loop = true;
        this.bgm = audio;
      }
      
      // Mute audio errors on load, we handle it gracefully
      audio.addEventListener('error', () => {
        // Silently catch missing files
        audio._error = true;
      });

      this.sounds[name] = audio;
    });
  }

  setMuted(muted) {
    this.isMuted = muted;
    Object.values(this.sounds).forEach(audio => {
      audio.muted = muted;
    });
  }

  setVolume(vol) {
    this.globalVolume = Math.max(0, Math.min(1, vol));
    Object.values(this.sounds).forEach(audio => {
      audio.volume = this.globalVolume;
    });
  }

  play(name) {
    if (this.isMuted) return;
    const audio = this.sounds[name];
    if (audio && !audio._error) {
      // Clone node for overlapping sound effects (like multiple candles)
      const clone = audio.cloneNode();
      clone.volume = this.globalVolume;
      clone.play().catch(e => console.warn(`Audio play failed: ${name}`, e));
    }
  }

  playBGM() {
    if (this.isMuted) return;
    if (this.bgm && !this.bgm._error) {
      this.bgm.volume = 0;
      this.bgm.play().catch(e => console.warn('BGM play failed', e));
      this.fadeIn(this.bgm);
    }
  }

  stopBGM() {
    if (this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
    }
  }

  fadeIn(audio, duration = 2000) {
    const steps = 20;
    const stepTime = duration / steps;
    const volStep = this.globalVolume / steps;
    let currentVol = 0;
    
    audio.volume = 0;
    
    const interval = setInterval(() => {
      currentVol = Math.min(this.globalVolume, currentVol + volStep);
      audio.volume = currentVol;
      if (currentVol >= this.globalVolume) {
        clearInterval(interval);
      }
    }, stepTime);
  }

  cleanup() {
    this.stopBGM();
  }
}

export const audioManager = new AudioManager();
