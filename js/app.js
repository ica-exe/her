/**
 * ROMANTIC SCRAPBOOK FOR ELIE — APPLICATION ENGINE
 * Flow: ENTER -> GALAXY (100 Clickable Words) -> OUR SONG -> GALLERY -> POETRY WHEEL -> LOVE LETTERS ("FOR ELIE ♡")
 */

class RomanticApp {
  constructor() {
    this.config = typeof siteConfig !== 'undefined' ? siteConfig : {};
    this.currentSection = 'intro';

    // Sequential section order
    this.sectionOrder = ['intro', 'celebration', 'song'];

    // Active module controllers
    this.loginIntroCtrl = null;
    this.galaxyCtrl = null;
    this.audioCtrl = null;
    this.galleryCtrl = null;
    this.wheelCtrl = null;
    this.letterCtrl = null;
    this.betweenUsCtrl = null;

    // View state
    this.isGalleryVisible = false;
    this.isWheelVisible = false;
    this.isLetterVisible = false;
    this.isBetweenUsVisible = false;
    this.isFinalVisible = false;

    // Background particle canvas
    this.canvas = document.getElementById('bg-canvas');
    this.ctx = null;
    this.particles = [];
  }

  init() {
    this.initParticleBackground();
    this.initStoryNavigation();
    this.initSubModules();
    this.initGalleryTransition();
    this.initWheelTransition();
    this.initLetterTransition();
    this.initBetweenUsTransition();
    this.initFinalTransition();
  }

  initParticleBackground() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create dreamy floating blush hearts, sparkles, and flowers
    const colors = ['#f472b6', '#ec4899', '#fbcfe8', '#e879f9', '#ffb7d5'];
    const emojis = ['♡', '✨', '🌸', '💖', '✦'];

    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        alpha: Math.random() * 0.6 + 0.3,
        speedY: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        isEmoji: Math.random() < 0.35
      });
    }

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

        if (p.y < -15) {
          p.y = window.innerHeight + 15;
          p.x = Math.random() * window.innerWidth;
        }
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0.1, Math.min(0.85, p.alpha));

        if (p.isEmoji) {
          this.ctx.font = '13px serif';
          this.ctx.fillStyle = p.color;
          this.ctx.fillText(p.emoji, p.x, p.y);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = p.color;
          this.ctx.fill();
        }

        this.ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  initStoryNavigation() {
    // 1. Back button handler on Our Song page -> Navigates back to Galaxy
    const backBtns = document.querySelectorAll('.btn-back-subtle, .song-back-btn:not(.gallery-back-btn):not(.wheel-back-btn):not(.letter-back-btn)');
    backBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const prevSection = this.getPreviousSection(this.currentSection);
        if (prevSection) {
          this.navigateTo(prevSection);
        }
      });
    });
  }

  getPreviousSection(currentId) {
    const idx = this.sectionOrder.indexOf(currentId);
    if (idx > 0) {
      return this.sectionOrder[idx - 1];
    }
    return 'intro';
  }

  initSubModules() {
    // 1. 3D Galaxy Controller (Transition leads directly to Our Song page)
    if (typeof GalaxyController !== 'undefined') {
      this.galaxyCtrl = new GalaxyController(() => this.navigateTo('song'));
    }

    // 2. Login Intro Controller (ENTER button -> Galaxy transition)
    if (typeof LoginIntroController !== 'undefined') {
      this.loginIntroCtrl = new LoginIntroController(() => {
        this.navigateTo('celebration');
        if (this.galaxyCtrl) {
          this.galaxyCtrl.startTransition();
        }
      });
      this.loginIntroCtrl.init();
    }

    // 3. Audio Player Controller (Our Song page local audio player)
    this.audioCtrl = new AudioPlayerController(this.config.song);
    this.audioCtrl.init();
  }

  /** ── Gallery View Transition System ── */
  initGalleryTransition() {
    const seeGalleryBtn = document.getElementById('see-gallery-btn');
    const galleryBackBtn = document.getElementById('gallery-back-btn');

    if (seeGalleryBtn) {
      seeGalleryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showGallery();
      });
    }

    if (galleryBackBtn) {
      galleryBackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideGallery();
      });
    }
  }

  showGallery() {
    if (this.isGalleryVisible) return;
    this.isGalleryVisible = true;

    const mainContent = document.getElementById('main-content');
    const galleryView = document.getElementById('gallery-view');

    mainContent.classList.add('view-hidden');

    setTimeout(() => {
      mainContent.classList.add('view-gone');
      galleryView.classList.add('view-entering');

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      galleryView.offsetHeight;
      galleryView.classList.add('view-visible');

      if (!this.galleryCtrl) {
        this.galleryCtrl = new OrbitalGalleryApp();
        this.galleryCtrl.init();
      }
    }, 600);
  }

  hideGallery() {
    if (!this.isGalleryVisible) return;
    this.isGalleryVisible = false;

    const mainContent = document.getElementById('main-content');
    const galleryView = document.getElementById('gallery-view');

    galleryView.classList.remove('view-visible');

    setTimeout(() => {
      galleryView.classList.remove('view-entering');

      if (this.galleryCtrl) {
        this.galleryCtrl.destroy();
        this.galleryCtrl = null;
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      mainContent.classList.remove('view-gone');
      mainContent.offsetHeight;
      mainContent.classList.remove('view-hidden');
    }, 600);
  }

  /** ── Poetry Wheel View Transition System ── */
  initWheelTransition() {
    const seeWheelBtn = document.getElementById('see-wheel-btn');
    const wheelBackBtn = document.getElementById('wheel-back-btn');

    if (seeWheelBtn) {
      seeWheelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showWheel();
      });
    }

    if (wheelBackBtn) {
      wheelBackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideWheel();
      });
    }
  }

  showWheel() {
    if (this.isWheelVisible) return;
    this.isWheelVisible = true;

    const galleryView = document.getElementById('gallery-view');
    const wheelView = document.getElementById('wheel-view');

    if (galleryView) {
      galleryView.classList.remove('view-visible');
    }

    setTimeout(() => {
      if (galleryView) {
        galleryView.classList.remove('view-entering');
      }
      if (wheelView) {
        wheelView.classList.add('view-entering');
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (wheelView) {
        wheelView.offsetHeight;
        wheelView.classList.add('view-visible');
      }

      if (!this.wheelCtrl && typeof PoetryWheelController !== 'undefined') {
        this.wheelCtrl = new PoetryWheelController();
      }
    }, 600);
  }

  hideWheel() {
    if (!this.isWheelVisible) return;
    this.isWheelVisible = false;

    const galleryView = document.getElementById('gallery-view');
    const wheelView = document.getElementById('wheel-view');

    if (wheelView) {
      wheelView.classList.remove('view-visible');
    }

    setTimeout(() => {
      if (wheelView) {
        wheelView.classList.remove('view-entering');
      }

      if (galleryView) {
        galleryView.classList.add('view-entering');
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (galleryView) {
        galleryView.offsetHeight;
        galleryView.classList.add('view-visible');
      }
    }, 600);
  }

  /** ── Love Letter Journal View Transition System ("FOR ELIE ♡") ── */
  initLetterTransition() {
    const seeLetterBtn = document.getElementById('see-letter-btn');
    const letterBackBtn = document.getElementById('letter-back-btn');

    if (seeLetterBtn) {
      seeLetterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showLetter();
      });
    }

    if (letterBackBtn) {
      letterBackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideLetter();
      });
    }
  }

  showLetter() {
    if (this.isLetterVisible) return;
    this.isLetterVisible = true;

    const wheelView = document.getElementById('wheel-view');
    const letterView = document.getElementById('letter-view');

    if (wheelView) {
      wheelView.classList.remove('view-visible');
    }

    setTimeout(() => {
      if (wheelView) {
        wheelView.classList.remove('view-entering');
      }
      if (letterView) {
        letterView.classList.add('view-entering');
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (letterView) {
        letterView.offsetHeight;
        letterView.classList.add('view-visible');
      }

      if (!this.letterCtrl && typeof LoveLetterController !== 'undefined') {
        this.letterCtrl = new LoveLetterController();
      }
    }, 600);
  }

  hideLetter() {
    if (!this.isLetterVisible) return;
    this.isLetterVisible = false;

    const wheelView = document.getElementById('wheel-view');
    const letterView = document.getElementById('letter-view');

    if (letterView) {
      letterView.classList.remove('view-visible');
    }

    setTimeout(() => {
      if (letterView) {
        letterView.classList.remove('view-entering');
      }

      if (wheelView) {
        wheelView.classList.add('view-entering');
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (wheelView) {
        wheelView.offsetHeight;
        wheelView.classList.add('view-visible');
      }
    }, 600);
  }

  /** ── "JUST BETWEEN US" View Transition System ── */
  initBetweenUsTransition() {
    const seeBetweenUsBtn = document.getElementById('see-between-us-btn');
    const betweenUsBackBtn = document.getElementById('between-us-back-btn');

    if (seeBetweenUsBtn) {
      seeBetweenUsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showBetweenUs();
      });
    }

    if (betweenUsBackBtn) {
      betweenUsBackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideBetweenUs();
      });
    }
  }

  showBetweenUs() {
    if (this.isBetweenUsVisible) return;
    this.isBetweenUsVisible = true;

    const letterView = document.getElementById('letter-view');
    const betweenUsView = document.getElementById('between-us-view');

    if (letterView) {
      letterView.classList.remove('view-visible');
    }

    setTimeout(() => {
      if (letterView) {
        letterView.classList.remove('view-entering');
      }
      if (betweenUsView) {
        betweenUsView.classList.add('view-entering');
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (betweenUsView) {
        betweenUsView.offsetHeight;
        betweenUsView.classList.add('view-visible');
      }

      if (!this.betweenUsCtrl && typeof JustBetweenUsController !== 'undefined') {
        this.betweenUsCtrl = new JustBetweenUsController();
      }
    }, 600);
  }

  hideBetweenUs() {
    if (!this.isBetweenUsVisible) return;
    this.isBetweenUsVisible = false;

    const letterView = document.getElementById('letter-view');
    const betweenUsView = document.getElementById('between-us-view');

    if (betweenUsView) {
      betweenUsView.classList.remove('view-visible');
    }

    setTimeout(() => {
      if (betweenUsView) {
        betweenUsView.classList.remove('view-entering');
      }

      if (letterView) {
        letterView.classList.add('view-entering');
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (letterView) {
        letterView.offsetHeight;
        letterView.classList.add('view-visible');
      }
    }, 600);
  }

  /** ── FINAL PAGE View Transition System ── */
  initFinalTransition() {
    const seeFinalBtn = document.getElementById('see-final-btn');
    const finalBackBtn = document.getElementById('final-back-btn');

    if (seeFinalBtn) {
      seeFinalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.showFinal();
      });
    }

    if (finalBackBtn) {
      finalBackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideFinal();
      });
    }
  }

  showFinal() {
    if (this.isFinalVisible) return;
    this.isFinalVisible = true;

    const betweenUsView = document.getElementById('between-us-view');
    const finalView = document.getElementById('final-view');

    if (betweenUsView) {
      betweenUsView.classList.remove('view-visible');
    }

    setTimeout(() => {
      if (betweenUsView) {
        betweenUsView.classList.remove('view-entering');
      }
      if (finalView) {
        finalView.classList.add('view-entering');
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (finalView) {
        finalView.offsetHeight;
        finalView.classList.add('view-visible');
      }
    }, 600);
  }

  hideFinal() {
    if (!this.isFinalVisible) return;
    this.isFinalVisible = false;

    const betweenUsView = document.getElementById('between-us-view');
    const finalView = document.getElementById('final-view');

    if (finalView) {
      finalView.classList.remove('view-visible');
    }

    setTimeout(() => {
      if (finalView) {
        finalView.classList.remove('view-entering');
      }

      if (betweenUsView) {
        betweenUsView.classList.add('view-entering');
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (betweenUsView) {
        betweenUsView.offsetHeight;
        betweenUsView.classList.add('view-visible');
      }
    }, 600);
  }

  navigateTo(sectionId) {
    const allSections = document.querySelectorAll('.page-section');
    allSections.forEach(sec => sec.classList.remove('active'));

    const nextEl = document.getElementById(`section-${sectionId}`);
    if (nextEl) nextEl.classList.add('active');

    this.currentSection = sectionId;

    if (sectionId === 'intro' && this.loginIntroCtrl) {
      this.loginIntroCtrl.reset();
    }

    if (sectionId === 'celebration' && this.galaxyCtrl) {
      this.galaxyCtrl.reset();
    }
    
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new RomanticApp();
  window.app.init();
});
