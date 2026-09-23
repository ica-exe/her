/**
 * 3D ORBITAL CONSTELLATION MEMORY GALLERY CONTROLLER
 * Features:
 * 1. 15 Unique Cards with LDR/WLW Romantic Captions & Heartfelt Back Messages
 * 2. 3D In-Place Card Flip (Front: Photo & Caption | Back: Intimate Note)
 * 3. 14 Orbiting Thumbnail Cards forming a 3D constellation around the main card
 * 4. Interactive Click & Drag / Swipe Orbit Controls with Click vs Drag thresholding
 * 5. Dynamic Sizing & Upward Positioning with Dreamy Float Animations
 * 6. Keyboard Navigation (ArrowLeft, ArrowRight, Space, Enter)
 */

const galleryCards = [
  { id: 1, image: "assets/photo01.png", caption: "the prettiest ♡", message: "how are you this pretty? genuinely, I could stare at this face for hours." },
  { id: 2, image: "assets/photo02.jpeg", caption: "my favourite face", message: "if love were a place, i think I'd recognize it by the way everything feels when i look at you." },
  { id: 3, image: "assets/photo03.jpeg", caption: "pretty girl things", message: "I look at you the way the sun looks at everything it touches." },
  { id: 4, image: "assets/photo04.jpeg", caption: "my favourite view", message: "there are beautiful things everywhere, and somehow my eyes still choose you." },
  { id: 5, image: "assets/photo05.jpeg", caption: "you look so lovely", message: "I hope you never get tired of me telling you how pretty you are, because I'll probably never get tired of noticing." },
  { id: 6, image: "assets/photo06.jpeg", caption: "just look at her ♡", message: "there are so many pretty things in this world, and somehow i still keep choosing to look at you." },
  { id: 7, image: "assets/photo07.jpeg", caption: "another favourite", message: "i love collecting little moments of you. every picture somehow becomes another favourite." },
  { id: 8, image: "assets/photo08.jpeg", caption: "effortlessly pretty", message: "you don't even have to try. you're effortlessly, unfairly, ridiculously pretty." },
  { id: 9, image: "assets/photo09.jpeg", caption: "this face again ♡", message: "this is another one of those pictures that makes me pause for a second and just admire you." },
  { id: 10, image: "assets/photo10.jpeg", caption: "my pretty girl", message: "I could watch you exist in the smallest moments and somehow still find something new to adore." },
  { id: 11, image: "assets/photo11.jpeg", caption: "my favourite view", message: "your face is genuinely one of my favourite things to see pop up on my screen." },
  { id: 12, image: "assets/photo12.jpeg", caption: "cute, as always", message: "there's something about you that photographs can't quite capture, but somehow you still look this beautiful." },
  { id: 13, image: "assets/photo13.jpeg", caption: "one for the collection", message: "my pretty girl ♡ I could probably fill an entire gallery with every little picture of you i love." },
  { id: 14, image: "assets/photo14.jpeg", caption: "pretty from every angle", message: "even through a tiny screen, you somehow manage to be the prettiest part of my day." },
  { id: 15, image: "assets/photo15.jpeg", caption: "still my favourite ♡", message: "if I had to pick my favourite view over and over again, I'd probably still end up choosing you." }
];

class OrbitalGalleryApp {
  constructor() {
    this.cards = galleryCards;
    this.currentIndex = 0;
    this.isFlipped = false;
    this.orbitAngleOffset = 0;
    this.animLoopId = null;
    this._keyHandler = null;

    // Drag / Touch Interaction State
    this.isPointerDown = false;
    this.isDragging = false;
    this.hasDragged = false;
    this.startX = 0;
    this.startY = 0;
    this.lastX = 0;
    this.velocity = 0;
    this.dragThreshold = 10; // 10px threshold between click and drag

    // DOM Elements
    this.stageContainer = document.querySelector('.gallery-stage-container');
    this.flipCard = document.getElementById('photo-flip-card');
    this.photoImg = document.getElementById('gallery-photo-img');
    this.photoCaption = document.getElementById('gallery-photo-caption');
    this.backMessage = document.getElementById('gallery-back-message');
    this.counterEl = document.getElementById('gallery-counter');
    this.orbitContainer = document.getElementById('spherical-orbit-container');
    this.prevBtn = document.getElementById('gallery-prev-btn');
    this.nextBtn = document.getElementById('gallery-next-btn');

    // Bound handlers for pointer events
    this.onPointerDown = this.handlePointerDown.bind(this);
    this.onPointerMove = this.handlePointerMove.bind(this);
    this.onPointerUp = this.handlePointerUp.bind(this);
  }

  init() {
    this.preloadImages();

    // Main Card 3D Flip Handler
    if (this.flipCard) {
      this.flipCard.onclick = (e) => {
        e.stopPropagation();
        if (this.hasDragged) return;
        this.toggleFlip();
      };
    }

    // Navigation Arrow Controllers
    if (this.prevBtn) this.prevBtn.onclick = () => this.prevCard();
    if (this.nextBtn) this.nextBtn.onclick = () => this.nextCard();

    // Keyboard Navigation Handler
    this._keyHandler = (e) => {
      if (e.key === 'ArrowLeft') this.prevCard();
      else if (e.key === 'ArrowRight') this.nextCard();
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.toggleFlip();
      }
    };
    window.addEventListener('keydown', this._keyHandler);

    // Orbit Drag / Touch Drag Setup
    this.initDragControls();

    // Render Initial State
    this.renderOrbitThumbnails();
    this.renderCurrentCard();

    // Ambient Orbit Motion Loop
    this.startAmbientOrbit();
  }

  initDragControls() {
    if (!this.stageContainer) return;

    this.stageContainer.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
  }

  handlePointerDown(e) {
    // Only respond to primary button / touch
    if (e.button !== undefined && e.button !== 0) return;

    this.isPointerDown = true;
    this.isDragging = false;
    this.hasDragged = false;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.lastX = e.clientX;
    this.velocity = 0;
  }

  handlePointerMove(e) {
    if (!this.isPointerDown) return;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (!this.isDragging && dist > this.dragThreshold) {
      // Check if horizontal movement dominates vertical movement
      if (Math.abs(dx) > Math.abs(dy)) {
        this.isDragging = true;
        this.hasDragged = true;
        if (this.stageContainer) {
          this.stageContainer.classList.add('is-dragging');
        }
      }
    }

    if (this.isDragging) {
      const stepX = e.clientX - this.lastX;
      this.lastX = e.clientX;

      // Rotate orbit angle based on drag delta
      const sensitivity = 0.0045;
      this.orbitAngleOffset += stepX * sensitivity;
      this.velocity = stepX * sensitivity;

      this.updateOrbitPositions();

      if (e.cancelable) {
        e.preventDefault();
      }
    }
  }

  handlePointerUp() {
    if (!this.isPointerDown) return;

    this.isPointerDown = false;

    if (this.stageContainer) {
      this.stageContainer.classList.remove('is-dragging');
    }

    if (this.isDragging) {
      this.isDragging = false;
      // Keep hasDragged flag true briefly so click handlers ignore release event
      setTimeout(() => {
        this.hasDragged = false;
      }, 150);
    }
  }

  destroy() {
    // Stop the orbit animation loop
    if (this.animLoopId) {
      cancelAnimationFrame(this.animLoopId);
      this.animLoopId = null;
    }
    // Remove keyboard listener
    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
    // Remove pointer listeners
    if (this.stageContainer) {
      this.stageContainer.removeEventListener('pointerdown', this.onPointerDown);
    }
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
  }

  preloadImages() {
    this.cards.forEach((c) => {
      if (c.image) {
        const img = new Image();
        img.src = c.image;
      }
    });
  }

  renderCurrentCard() {
    // 1. Reset Flip State so new card ALWAYS opens on FRONT
    this.isFlipped = false;
    if (this.flipCard) {
      this.flipCard.classList.remove('flipped');
    }

    const card = this.cards[this.currentIndex];
    if (!card) return;

    // 2. Update Main Photo & Caption
    if (this.photoImg) {
      this.photoImg.src = card.image;
      this.photoImg.onerror = () => {
        // Fallback vector graphics
        this.photoImg.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='340' height='450' viewBox='0 0 340 450'><rect width='340' height='450' fill='%23fce7f3'/><text x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%23ec4899' text-anchor='middle'>photo ♡</text></svg>";
      };
    }
    if (this.photoCaption) this.photoCaption.textContent = card.caption || '';
    if (this.backMessage) this.backMessage.textContent = `"${card.message || ''}"`;

    // 3. Update Slide Counter (e.g. "01 / 15")
    if (this.counterEl) {
      const currStr = (this.currentIndex + 1).toString().padStart(2, '0');
      const totalStr = this.cards.length.toString().padStart(2, '0');
      this.counterEl.textContent = `${currStr} / ${totalStr}`;
    }

    // 4. Update 3D Constellation Orbit
    this.updateOrbitPositions();
  }

  renderOrbitThumbnails() {
    if (!this.orbitContainer) return;
    this.orbitContainer.innerHTML = '';

    this.cards.forEach((card, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'spherical-thumb-item';
      thumb.setAttribute('data-index', idx);

      const img = document.createElement('img');
      img.src = card.image;
      img.alt = `thumbnail ${idx + 1}`;
      img.onerror = () => {
        img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='130' viewBox='0 0 100 130'><rect width='100' height='130' fill='%23fce7f3'/></svg>";
      };
      thumb.appendChild(img);

      thumb.onclick = (e) => {
        e.stopPropagation();
        if (this.hasDragged) return;

        if (this.currentIndex !== idx) {
          // Smooth travel effect toward center
          thumb.style.transform = `translate3d(0px, 0px, 150px) scale(1.18)`;
          thumb.style.opacity = '1';
          setTimeout(() => {
            this.currentIndex = idx;
            this.renderCurrentCard();
          }, 150);
        }
      };

      this.orbitContainer.appendChild(thumb);
    });

    this.updateOrbitPositions();
  }

  updateOrbitPositions() {
    if (!this.orbitContainer) return;
    const thumbs = this.orbitContainer.querySelectorAll('.spherical-thumb-item');
    const total = this.cards.length;
    if (!total) return;

    const isMobile = window.innerWidth <= 600 || window.innerHeight <= 680;

    // Expanded radii for larger cards & clear space around main card
    const Rx = isMobile ? 210 : 330;
    const Ry = isMobile ? 65 : 95;
    const Rz = isMobile ? 130 : 185;

    const now = Date.now();

    thumbs.forEach((thumb) => {
      const idx = parseInt(thumb.getAttribute('data-index'), 10);

      if (idx === this.currentIndex) {
        // Selected main card is hidden from orbit ring (no duplicate thumbnail)
        thumb.style.display = 'none';
        return;
      }

      thumb.style.display = 'block';

      // Calculate relative index offset around the remaining 14 orbiting cards
      let offset = idx - this.currentIndex;
      while (offset > total / 2) offset -= total;
      while (offset < -total / 2) offset += total;

      const angle = (offset / total) * Math.PI * 2 + this.orbitAngleOffset;

      // Add gentle vertical floating motion per card
      const floatY = Math.sin(now * 0.0018 + idx * 0.75) * 5;

      const x = Math.sin(angle) * Rx;
      const y = -Math.cos(angle) * Ry + floatY;
      const z = Math.cos(angle) * Rz;

      const zNorm = (z + Rz) / (2 * Rz); // 0 (back) to 1 (front)
      const scale = 0.58 + 0.38 * zNorm;
      const opacity = 0.45 + 0.52 * zNorm;
      const zIndex = Math.round(zNorm * 50) + 1;

      thumb.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
      thumb.style.opacity = opacity;
      thumb.style.zIndex = zIndex;
    });
  }

  startAmbientOrbit() {
    const loop = () => {
      // Apply momentum decay after dragging
      if (!this.isPointerDown && Math.abs(this.velocity) > 0.00005) {
        this.orbitAngleOffset += this.velocity;
        this.velocity *= 0.92;
      }

      this.updateOrbitPositions();
      this.animLoopId = requestAnimationFrame(loop);
    };
    loop();
  }

  nextCard() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.renderCurrentCard();
  }

  prevCard() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.renderCurrentCard();
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    if (this.flipCard) {
      this.flipCard.classList.toggle('flipped', this.isFlipped);
    }
  }
}
