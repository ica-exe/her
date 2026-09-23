/** minimal screen with a single cute "enter" button.
 * clicking "enter" fades out the button, then launches background audio ("bye" by Ariana Grande) and 3D galaxy particle sequence at the exact same moment. **/

class LoginIntroController {
  constructor(onSuccess) {
    this.onSuccess = onSuccess;
    this.enterBtn = null;
    this.sectionIntro = null;
    this.audioEl = null;
    this.hasTriggered = false;
    this.isPlayingAudio = false;
  }

  init() {
    this.enterBtn = document.getElementById('enter-btn');
    this.sectionIntro = document.getElementById('section-intro');
    this.initAudio();

    if (this.enterBtn) {
      this.enterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.triggerEnter();
      });
    }
  }

  initAudio() {
    this.audioEl = document.getElementById('intro-background-audio');
    if (!this.audioEl) {
      this.audioEl = document.createElement('audio');
      this.audioEl.id = 'intro-background-audio';
      this.audioEl.src = 'assets/audio/bye.mp3';
      this.audioEl.loop = true;
      this.audioEl.preload = 'auto';
      document.body.appendChild(this.audioEl);
    } else {
      this.audioEl.loop = true;
    }
  }

  playAudio() {
    if (!this.audioEl || this.isPlayingAudio) return;
    try {
      this.audioEl.currentTime = 0;
      this.audioEl.volume = 0;
      this.audioEl.loop = true;
      const playPromise = this.audioEl.play();

      const fadeDuration = 500;
      const startTime = performance.now();
      const targetVolume = 1;

      const fadeInAudio = (now) => {
        if (!this.isPlayingAudio && this.audioEl.paused) return;
        const progress = Math.min((now - startTime) / fadeDuration, 1);
        this.audioEl.volume = progress * targetVolume;

        if (progress < 1) {
          requestAnimationFrame(fadeInAudio);
        }
      };

      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlayingAudio = true;
          requestAnimationFrame(fadeInAudio);
        }).catch((err) => {
          console.log('Intro background audio autoplay prevented or failed silently:', err);
          this.isPlayingAudio = false;
        });
      } else {
        this.isPlayingAudio = true;
        requestAnimationFrame(fadeInAudio);
      }
    } catch (err) {
      console.log('Intro audio play error handled silently:', err);
    }
  }

  stopAudio() {
    if (!this.audioEl) return;
    try {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
      this.audioEl.volume = 0;
    } catch (err) {
      console.log('Intro audio stop error handled silently:', err);
    }
    this.isPlayingAudio = false;
  }

  triggerEnter() {
    if (this.hasTriggered) return;
    this.hasTriggered = true;

    // 0.0s: Fade out the "enter" button smoothly
    if (this.enterBtn) {
      this.enterBtn.classList.add('fade-out');
    }

    // 0.5s: Start particle animation and dedicated "bye" audio playback at the exact same moment
    setTimeout(() => {
      if (this.sectionIntro) {
        this.sectionIntro.style.opacity = '0';
      }
      this.playAudio();
      if (typeof this.onSuccess === 'function') {
        this.onSuccess();
      }
    }, 500);
  }

  reset() {
    this.hasTriggered = false;
    this.stopAudio();
    if (this.enterBtn) {
      this.enterBtn.classList.remove('fade-out');
    }
    if (this.sectionIntro) {
      this.sectionIntro.style.opacity = '1';
    }
  }
}
