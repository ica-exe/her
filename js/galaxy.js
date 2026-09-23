/** 3D PINK GALAXY ENGINE
 * 
 * Features:
 * 1. Fullscreen pure black space (#000000)
 * 2. Massive Heart Outline made from uniform, luminous pink "I LOVE YOU" text elements (UNTOUCHED VISUAL DESIGN)
 *    - Waiting state: Calm, floating heart (AUTOMATIC PULSING REMOVED)
 *    - Central text heart is CLICKABLE/TAPPABLE (`cursor: pointer`)
 * 3. Interactive Sequence:
 *    - ON CLICK: Locks interaction & starts 5-SECOND ACCELERATING HEARTBEAT BUILDUP
 *    - AT 5.0s: HEART EXPLODES in a flash of pink-white light; "I LOVE YOU" phrases burst outward
 *    - AT 5.4s: CENTRAL GRAVITATIONAL VORTEX FORMS at (0, 140, 0)
 *    - SUCTION EFFECT: ALL 100 love-language words, heart fragments, stardust & particles spiral inward into the vortex and vanish
 *    - 8.5s+: ENTIRE SCREEN EMPTIES into blackness
 *    - CINEMATIC FADE into "OUR SONG" page (`section-song`)
 * 4. 100 Floating Love-Language Translations (Separate outer orbital system, 100% intact & restored on replay)
 * 6. 360° Drag Rotation & Scroll/Pinch Zoom
 */

class WritingAudioController {
  constructor() {
    this.audioSrc = "assets/audio/writing.mp3";
    this.audio = null;
  }

  start() {
    if (!this.audio) {
      this.audio = new Audio(this.audioSrc);
      this.audio.volume = 1;
      this.audio.loop = true;
    }
    try {
      this.audio.currentTime = 0;
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Writing audio autoplay prevented gracefully:', err);
        });
      }
    } catch (e) {
      console.log('Writing audio error:', e);
    }
  }

  stop() {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch(e) {}
    }
  }
}

class GalaxyController {
  constructor(onProceed) {
    this.onProceed = onProceed;
    this.container = null;
    this.canvas = null;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Pre-allocated Shared Textures
    this.glowTexture = null;
    this.pinkTextTextures = [];

    // Particles & Geometry
    this.stardustPoints = null;
    this.stardustGeo = null;
    this.stardustTargets = null;
    this.stardustOriginalPos = null;

    // Massive 3D Pink Heart Outline Object (Composed of uniformly spaced "I LOVE YOU" text sprites)
    this.heartGroup = null;
    this.heartTextSprites = [];

    // Visual Text Sprites Group (100 Love Languages - Untouched & Separate)
    this.textGroup = null;
    this.textSprites = [];

    // Raycasting & Click Interaction State
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.isHeartClicked = false;
    this.heartClickTime = 0;
    this.isExploding = false;
    this.explosionTime = 0;
    this.isVortexActive = false;
    this.transitionTriggered = false;
    this.lastSparkleTime = 0;
    this.cameraLookY = 70;
    this.disintegrateAnimId = null;

    // Camera & 360° Interaction State
    this.isMouseDown = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationVel = { x: 0, y: 0.0006 };
    this.targetRotation = { x: 0.4, y: 0 };
    this.currentRotation = { x: 0.4, y: 0 };
    this.targetZoom = 750;
    this.currentZoom = 1500;
    this.touchStartDist = 0;

    // Timeline Sequence & Cycle State
    this.stage = 0;
    this.startTime = 0;
    this.cycleStartTime = 0;
    this.animFrameId = null;
    this.isInitialized = false;

    // Dataset: Love language translations
    this.languagesData = typeof window.LOVE_LANGUAGES !== 'undefined'
      ? window.LOVE_LANGUAGES
      : (typeof loveLanguages !== 'undefined' ? loveLanguages : []);

    // 100 Language Interactive State
    this.hoveredSprite = null;
    this.activeLangSprite = null;
    this.infoBoxEl = null;
  }

  init() {
    this.container = document.getElementById('section-celebration');
    this.canvas = document.getElementById('galaxy-canvas');
    if (!this.container || !this.canvas) return;

    if (typeof THREE === 'undefined') {
      console.error('Three.js library is missing!');
      return;
    }

    // 1. Setup Three.js Pure Black Fullscreen Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.FogExp2(0x000000, 0.0004);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 1, 6000);
    this.camera.position.set(0, 220, this.currentZoom);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Pre-allocate shared textures
    this.glowTexture = this.createGlowTexture();
    this.pinkTextTextures = this.createILoveYouTextTextures();

    // 3. Build 3D Components
    this.createStardustParticleSystem();
    this.createSolid3DParticleHeart();
    this.create100LanguageTextSprites();

    // 4. Register Event Listeners & Initialize UI Tooltip
    this.initInfoBox();
    this.initEventListeners();
    this.isInitialized = true;
  }

  createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(244, 114, 182, 0.95)');
    grad.addColorStop(0.5, 'rgba(236, 72, 153, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Dedicated glowing "I LOVE YOU" canvas textures in a palette of luminous pink shades
   */
  createILoveYouTextTextures() {
    const pinkShades = [
      '#ec4899', // Hot pink
      '#f472b6', // Bright rose pink
      '#fbcfe8', // Soft blush pink
      '#ffb7d5', // Pale pink
      '#ffffff'  // White-pink highlight
    ];

    return pinkShades.map(colorHex => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      ctx.shadowColor = 'rgba(236, 72, 153, 0.95)';
      ctx.shadowBlur = 16;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.font = '700 28px "Playfair Display", "Plus Jakarta Sans", serif, sans-serif';
      ctx.fillStyle = colorHex;
      ctx.fillText('I LOVE YOU', 128, 32);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    });
  }

  /**
   * 1. MASSIVE 3D SPIRAL GALAXY DISK
   */
  createStardustParticleSystem() {
    const count = 3800;
    this.stardustGeo = new THREE.BufferGeometry();

    const pos = new Float32Array(count * 3);
    const originalPos = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const pinkPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#fbcfe8'),
      new THREE.Color('#f472b6'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#db2777'),
      new THREE.Color('#e879f9'),
      new THREE.Color('#ffb7d5')
    ];

    for (let i = 0; i < count; i++) {
      const edge = i % 4;
      let x, y, z;

      if (edge === 0) {
        x = (Math.random() - 0.5) * 4200;
        y = 1700 + Math.random() * 900;
        z = (Math.random() - 0.5) * 1800;
      } else if (edge === 1) {
        x = (Math.random() - 0.5) * 4200;
        y = -1700 - Math.random() * 900;
        z = (Math.random() - 0.5) * 1800;
      } else if (edge === 2) {
        x = -2200 - Math.random() * 900;
        y = (Math.random() - 0.5) * 3400;
        z = (Math.random() - 0.5) * 1800;
      } else {
        x = 2200 + Math.random() * 900;
        y = (Math.random() - 0.5) * 3400;
        z = (Math.random() - 0.5) * 1800;
      }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      originalPos[i * 3] = x;
      originalPos[i * 3 + 1] = y;
      originalPos[i * 3 + 2] = z;

      const arms = 4;
      const armIndex = i % arms;
      // Radius >= 320 units creates a clean black space quiet zone around central heart (0, 140, 0)
      const radius = Math.pow(Math.random(), 1.5) * 750 + 320;
      const spinAngle = radius * 0.0032;
      const branchAngle = ((armIndex * 2 * Math.PI) / arms) + spinAngle;

      const randomOffsetX = (Math.random() - 0.5) * Math.pow(radius, 0.7) * 10;
      const randomOffsetY = (Math.random() - 0.5) * Math.pow(radius, 0.6) * 6;
      const randomOffsetZ = (Math.random() - 0.5) * Math.pow(radius, 0.7) * 10;

      targets[i * 3] = Math.cos(branchAngle) * radius + randomOffsetX;
      targets[i * 3 + 1] = randomOffsetY;
      targets[i * 3 + 2] = Math.sin(branchAngle) * radius + randomOffsetZ;

      const c = pinkPalette[Math.floor(Math.random() * pinkPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 10 + 3;
    }

    this.stardustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.stardustGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.stardustGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.stardustTargets = targets;
    this.stardustOriginalPos = originalPos;

    const mat = new THREE.PointsMaterial({
      size: 8,
      map: this.glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.stardustPoints = new THREE.Points(this.stardustGeo, mat);
    this.scene.add(this.stardustPoints);
  }

  /**
   * 2. MASSIVE 3D PINK HEART OUTLINE MADE ENTIRELY FROM UNIFORM "I LOVE YOU" TEXT ELEMENTS
   * Starts with words scattered in space; gradually assembles in a wave starting from left to right.
   * Heart object transform NEVER rotates as a whole (0°).
   */
  createSolid3DParticleHeart() {
    this.heartGroup = new THREE.Group();
    this.heartGroup.position.set(0, 140, 0);
    this.heartGroup.rotation.set(0, 0, 0); // Always face camera directly!
    this.scene.add(this.heartGroup);

    this.heartTextSprites = [];
    const count = 280;
    const textures = this.pinkTextTextures;

    for (let i = 0; i < count; i++) {
      const texture = textures[i % textures.length];

      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.0, // Start invisible
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(spriteMat);
      
      const baseProgress = i / count;
      
      // Scattered starting position
      const startR = 380 + Math.random() * 450;
      const startAngle = Math.random() * Math.PI * 2;
      const startX = Math.cos(startAngle) * startR + (Math.random() - 0.5) * 180;
      const startY = Math.sin(startAngle) * startR + (Math.random() - 0.5) * 180;
      const startZ = (Math.random() - 0.5) * 550;

      const scatterX = (Math.random() - 0.5) * 12;
      const scatterY = (Math.random() - 0.5) * 12;
      const zOffset = (Math.random() - 0.5) * 50;

      const baseScaleX = 66 + Math.random() * 10;
      const baseScaleY = 18 + Math.random() * 3;
      sprite.scale.set(25, 7, 1);

      sprite.position.set(startX, startY, startZ);

      sprite.userData = {
        baseProgress: baseProgress,
        startX: startX,
        startY: startY,
        startZ: startZ,
        scatterX: scatterX,
        scatterY: scatterY,
        zDepth: zOffset,
        baseScale: new THREE.Vector3(baseScaleX, baseScaleY, 1),
        startTime: 0.8 + baseProgress * 4.8, // Staggered start from left side (0.8s to 5.6s)
        duration: 2.2,
        // Explosion & Suction Physics state
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
        currentPos: new THREE.Vector3(startX, startY, startZ)
      };

      this.heartTextSprites.push(sprite);
      this.heartGroup.add(sprite);
    }
  }

  /**
   * 3. 100 FLOATING "I LOVE YOU" LANGUAGES (SEPARATE UNTOUCHED SYSTEM)
   */
  create100LanguageTextSprites() {
    this.textGroup = new THREE.Group();
    this.scene.add(this.textGroup);

    const rawData = this.languagesData && this.languagesData.length >= 100
      ? this.languagesData.slice(0, 100)
      : (this.languagesData.length > 0 ? this.languagesData : [{ language: 'English', translation: 'I love you' }]);

    const total = Math.min(100, rawData.length);
    const minSafeRadius = 260;
    const maxOrbitalRadius = 880;

    for (let i = 0; i < total; i++) {
      const item = rawData[i];
      const textVal = item.translation || item.t || item.text || 'I love you';
      const langVal = item.language || item.l || 'Love';

      const textSprite = this.generateUniformTextSprite(textVal, langVal);

      const radiusProgress = i / total;
      const radius = Math.pow(radiusProgress, 0.65) * (maxOrbitalRadius - minSafeRadius) + minSafeRadius;
      const angle = i * (2 * Math.PI / 18) + (Math.random() - 0.5) * 0.2;
      const yOffset = (Math.random() - 0.5) * Math.pow(radius, 0.5) * 14;

      textSprite.position.set(
        Math.cos(angle) * radius,
        yOffset,
        Math.sin(angle) * radius
      );

      const isForeground = i % 10 === 0;
      const scaleBase = isForeground ? 85 : (i % 2 === 0 ? 55 : 38);
      textSprite.scale.set(scaleBase * 2.2, scaleBase, 1);

      textSprite.material.opacity = 0;
      textSprite.userData = {
        langData: item,
        angle: angle,
        radius: radius,
        speed: (Math.random() * 0.00035 + 0.00015) * (i % 2 === 0 ? 1 : -1),
        baseY: yOffset,
        targetOpacity: isForeground ? 0.95 : Math.random() * 0.35 + 0.5,
        baseScale: new THREE.Vector3(scaleBase * 2.2, scaleBase, 1),
        // Suction state
        suctionRadius: radius,
        suctionY: yOffset,
        suctionOpacity: isForeground ? 0.95 : Math.random() * 0.35 + 0.5
      };

      this.textSprites.push(textSprite);
      this.textGroup.add(textSprite);
    }
  }

  generateUniformTextSprite(text, lang) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.shadowColor = 'rgba(244, 114, 182, 0.95)';
    ctx.shadowBlur = 18;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = '600 38px "Playfair Display", "Plus Jakarta Sans", serif, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 256, 52);

    ctx.shadowBlur = 8;
    ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fbcfe8';
    ctx.fillText(`♡ ${lang} ♡`, 256, 95);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return new THREE.Sprite(spriteMat);
  }

  startTransition() {
    if (!this.isInitialized) this.init();

    this.container.classList.add('active');
    this.stage = 1;
    this.startTime = Date.now();
    this.cycleStartTime = Date.now();

    if (this.stardustPoints && this.stardustPoints.material) {
      this.stardustPoints.material.opacity = 0.0;
    }
    if (this.heartTextSprites) {
      this.heartTextSprites.forEach(s => s.material.opacity = 0.0);
    }
    if (this.textSprites) {
      this.textSprites.forEach(s => s.material.opacity = 0.0);
    }

    this.animate();
  }

  /**
   * RESET STATE FOR REPLAY SUPPORT
   */
  reset() {
    this.hideInfoBox();
    if (this.writingAudioCtrl) {
      this.writingAudioCtrl.stop();
    }

    // 1. Clean up transition, pen scene, and temporary elements
    const penScene = document.getElementById('galaxy-pen-scene');
    if (penScene) penScene.remove();

    const flash = document.querySelector('.galaxy-explosion-flash');
    if (flash) flash.remove();

    const overlay = document.querySelector('.scene-cinematic-transition-overlay');
    if (overlay) overlay.remove();

    const oldRest = document.querySelector('.galaxy-restoration-overlay');
    if (oldRest) oldRest.remove();

    if (this.disintegrateAnimId) {
      cancelAnimationFrame(this.disintegrateAnimId);
      this.disintegrateAnimId = null;
    }
    const disCanvas = document.getElementById('sentence-disintegrate-canvas');
    if (disCanvas) disCanvas.remove();

    document.querySelectorAll('.galaxy-click-sparkle').forEach(el => el.remove());

    if (!this.isInitialized) {
      this.init();
    }

    // 2. Reset timeline sequence & state flags
    this.isHeartClicked = false;
    this.heartClickTime = 0;
    this.isExploding = false;
    this.explosionTime = 0;
    this.isVortexActive = false;
    this.transitionTriggered = false;
    this.lastSparkleTime = 0;
    this.cameraLookY = 70;

    // Reset camera position & interaction state to default view
    this.targetRotation = { x: 0.4, y: 0 };
    this.currentRotation = { x: 0.4, y: 0 };
    this.rotationVel = { x: 0, y: 0.0006 };
    this.targetZoom = 750;
    this.currentZoom = 1500;
    if (this.camera) {
      this.camera.position.set(0, 220, 1500);
      this.camera.lookAt(0, 70, 0);
    }

    // Set timeline to stage 6 (fully assembled idle state)
    this.startTime = Date.now() - 15000;
    this.cycleStartTime = Date.now();
    this.stage = 6;

    if (this.canvas) {
      this.canvas.style.cursor = 'default';
    }

    // 3. Restore Massive 3D Pink Heart Outline
    if (this.heartGroup) {
      this.heartGroup.position.set(0, 140, 0);
      this.heartGroup.scale.set(1, 1, 1);
      this.heartGroup.rotation.set(0, 0, 0);
      this.heartGroup.visible = true;
    }

    if (this.heartTextSprites && this.heartTextSprites.length > 0) {
      const now = Date.now();
      const scale = 15.0;
      const timeSec = now * 0.001;
      const flowProgressOffset = (timeSec * 0.08) % 1.0;

      this.heartTextSprites.forEach((sprite) => {
        const uData = sprite.userData;
        uData.velocityX = 0;
        uData.velocityY = 0;
        uData.velocityZ = 0;

        let currentProgress = (uData.baseProgress + flowProgressOffset) % 1.0;
        if (currentProgress < 0) currentProgress += 1.0;

        const t = (Math.PI * 1.5 + currentProgress * Math.PI * 2) % (Math.PI * 2);
        const heartX0 = 16 * Math.pow(Math.sin(t), 3);
        const heartY0 = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        const targetX = heartX0 * scale + uData.scatterX;
        const targetY = heartY0 * scale + uData.scatterY;
        const targetZ = uData.zDepth;

        sprite.position.set(targetX, targetY, targetZ);
        if (uData.baseScale) {
          sprite.scale.copy(uData.baseScale);
        }
        sprite.material.opacity = 0.85;
        sprite.visible = true;
      });
    }

    // 4. Restore ALL EXACT 100 FLOATING LANGUAGE TEXT SPRITES
    if (this.textGroup) {
      this.textGroup.visible = true;
    }

    if (this.textSprites && this.textSprites.length > 0) {
      this.textSprites.forEach((sprite) => {
        const uData = sprite.userData;
        uData.suctionRadius = uData.radius;
        uData.suctionY = uData.baseY;
        uData.suctionOpacity = uData.targetOpacity;

        sprite.position.x = Math.cos(uData.angle) * uData.radius;
        sprite.position.y = uData.baseY;
        sprite.position.z = Math.sin(uData.angle) * uData.radius;

        if (uData.baseScale) {
          sprite.scale.copy(uData.baseScale);
        }
        sprite.material.opacity = uData.targetOpacity;
        sprite.visible = true;
      });
    }

    // 5. Restore Cosmic Spiral Galaxy Disk & Stardust Particles
    if (this.stardustGeo && this.stardustTargets) {
      const pos = this.stardustGeo.attributes.position.array;
      const targets = this.stardustTargets;
      for (let i = 0; i < pos.length; i++) {
        pos[i] = targets[i];
      }
      this.stardustGeo.attributes.position.needsUpdate = true;
    }

    if (this.stardustPoints && this.stardustPoints.material) {
      this.stardustPoints.material.opacity = 0.9;
      this.stardustPoints.visible = true;
    }

    // 6. Smooth Magical Restoration Animation (1.0s)
    this.triggerRestorationAnimation();

    // 7. Ensure animation loop is running
    if (!this.animFrameId) {
      this.animate();
    }
  }

  triggerRestorationAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'galaxy-restoration-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: #000000;
      z-index: 9999;
      pointer-events: none;
      opacity: 1;
      transition: opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '0';
    });

    setTimeout(() => {
      overlay.remove();
    }, 1100);
  }

  /**
   * MAIN ANIMATION & RENDERING LOOP
   */
  animate() {
    this.animFrameId = requestAnimationFrame(() => this.animate());

    const now = Date.now();
    const elapsed = (now - this.startTime) / 1000;

    if (this.stage === 1 && elapsed > 2.4) {
      this.stage = 2; // Step 3: 1 Second Pause
    } else if (this.stage === 2 && elapsed > 3.4) {
      this.stage = 3; // Step 4: Central Heart Formation starts
    } else if (this.stage === 3 && elapsed > 11.2) {
      this.stage = 5; // Step 5: 100 Multilingual "I Love You" Words start
    } else if (this.stage === 5 && elapsed > 12.8) {
      this.stage = 6; // Fully assembled state
    }

    // ----------------------------------------------------
    // CHECK RAYCASTING HOVER ON CENTRAL HEART & 100 LANGUAGES
    // ----------------------------------------------------
    if (!this.isHeartClicked && this.stage >= 3 && this.canvas) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const heartIntersects = this.raycaster.intersectObjects(this.heartTextSprites);
      
      // Also check bounding distance to central heart position (0, 140, 0)
      const heartCenter2D = new THREE.Vector3(0, 140, 0).project(this.camera);
      const mouseDist2D = Math.hypot(this.mouse.x - heartCenter2D.x, this.mouse.y - heartCenter2D.y);

      const isHeartHovered = heartIntersects.length > 0 || mouseDist2D < 0.28;

      if (isHeartHovered) {
        this.canvas.style.cursor = 'pointer';
        if (this.hoveredSprite) {
          if (this.hoveredSprite.userData && this.hoveredSprite.userData.baseScale) {
            this.hoveredSprite.scale.copy(this.hoveredSprite.userData.baseScale);
          }
          this.hoveredSprite = null;
        }
      } else {
        // Check hover on 100 language text sprites
        let hitLangSprite = null;
        if (this.textSprites && this.textSprites.length > 0 && !this.isVortexActive) {
          const langIntersects = this.raycaster.intersectObjects(this.textSprites);
          if (langIntersects.length > 0) {
            hitLangSprite = langIntersects[0].object;
          }
        }

        if (hitLangSprite) {
          this.canvas.style.cursor = 'pointer';
          if (this.hoveredSprite && this.hoveredSprite !== hitLangSprite && this.hoveredSprite !== this.activeLangSprite) {
            if (this.hoveredSprite.userData && this.hoveredSprite.userData.baseScale) {
              this.hoveredSprite.scale.copy(this.hoveredSprite.userData.baseScale);
            }
          }
          this.hoveredSprite = hitLangSprite;
          if (hitLangSprite.userData && hitLangSprite.userData.baseScale) {
            const mult = (hitLangSprite === this.activeLangSprite) ? 1.28 : 1.18;
            const bloomScale = hitLangSprite.userData.baseScale.clone().multiplyScalar(mult);
            hitLangSprite.scale.lerp(bloomScale, 0.2);
          }
        } else {
          this.canvas.style.cursor = 'default';
          if (this.hoveredSprite && this.hoveredSprite !== this.activeLangSprite) {
            if (this.hoveredSprite.userData && this.hoveredSprite.userData.baseScale) {
              this.hoveredSprite.scale.copy(this.hoveredSprite.userData.baseScale);
            }
            this.hoveredSprite = null;
          }
        }
      }
    }

    // ----------------------------------------------------
    // 1. ANIMATE STARDUST GALAXY PARTICLES
    // ----------------------------------------------------
    const pos = this.stardustGeo.attributes.position.array;
    const targets = this.stardustTargets;
    const count = pos.length / 3;

    if (this.stage === 1) {
      const progress = Math.min(1, elapsed / 2.4);
      const easeCurve = Math.pow(progress, 2.2);

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        pos[idx] += (targets[idx] - pos[idx]) * (0.035 + easeCurve * 0.08);
        pos[idx + 1] += (targets[idx + 1] - pos[idx + 1]) * (0.035 + easeCurve * 0.08);
        pos[idx + 2] += (targets[idx + 2] - pos[idx + 2]) * (0.035 + easeCurve * 0.08);
      }
      if (this.stardustPoints && this.stardustPoints.material) {
        this.stardustPoints.material.opacity = Math.min(0.9, progress * 0.9);
      }
    } else if (!this.isVortexActive) {
      if (this.stardustPoints && this.stardustPoints.material) {
        this.stardustPoints.material.opacity = 0.9;
      }
      const rotSpeed = 0.0016;
      const cos = Math.cos(rotSpeed);
      const sin = Math.sin(rotSpeed);

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const x = pos[idx];
        const z = pos[idx + 2];

        pos[idx] = x * cos - z * sin;
        pos[idx + 2] = x * sin + z * cos;
      }
    }
    this.stardustGeo.attributes.position.needsUpdate = true;

    // ----------------------------------------------------
    // 2. CENTRAL HEART INTERACTION, HEARTBEAT BUILDUP & EXPLOSION
    // ----------------------------------------------------
    if (this.stage >= 3) {
      const formElapsed = (this.stage >= 6 || this.isHeartClicked) ? (now - this.startTime) / 1000 : Math.max(0, (now - (this.startTime + 3400)) / 1000);
      const isAssembling = formElapsed < 8.0;
      const textCount = this.heartTextSprites ? this.heartTextSprites.length : 0;

      let speedMult = 1.0;
      let brightnessMult = 1.0;
      let pulseScale = 1.0;

      if (this.isHeartClicked) {
        const clickElapsed = (now - this.heartClickTime) / 1000;

        if (clickElapsed < 5.0) {
          // 2. FAST HEARTBEAT — EXACTLY 5 SECONDS (0 to 5.0s)
          const progress = Math.min(1.0, clickElapsed / 5.0);

          // Fast pulse rate: Noticeably fast (starts ~2.2 Hz / ~132 bpm, accelerates to ~6.5 Hz / ~390 bpm)
          const freq = 13.8 + Math.pow(progress, 2.0) * 28.0;
          const beatPhase = (clickElapsed * freq) % (Math.PI * 2);

          // Realistic palpable dual-beat rhythm
          const beatA = Math.pow(Math.max(0, Math.sin(beatPhase)), 4);
          const beatB = Math.pow(Math.max(0, Math.sin(beatPhase + 0.55)), 5) * 0.5;
          const heartBeatCurve = beatA + beatB;

          // Scale & glow pulse rapidly together, building up energy
          const amp = 0.09 + Math.pow(progress, 1.8) * 0.32;
          pulseScale = 1.0 + heartBeatCurve * amp;
          brightnessMult = 1.0 + Math.pow(progress, 1.8) * 1.8 + heartBeatCurve * (0.35 + progress * 0.9);
          speedMult = 1.0 + Math.pow(progress, 1.5) * 2.5;

          // FINAL LARGE PULSE at ~4.5s to 5.0s
          if (clickElapsed >= 4.5) {
            const finalT = (clickElapsed - 4.5) / 0.5;
            const finalSwell = Math.sin(finalT * Math.PI) * 0.55;
            pulseScale += finalSwell;
            brightnessMult += finalSwell * 2.8;
          }

          // Subtle surrounding sparkles react to pulse peaks
          if (heartBeatCurve > 0.8 && (now - this.lastSparkleTime > 160)) {
            this.lastSparkleTime = now;
            this.spawnHeartbeatSparkle(floatY);
          }
        } else if (!this.isExploding) {
          // 3. AT EXACTLY 5.0 SECONDS: HEART EXPLODES
          this.isExploding = true;
          this.explosionTime = now;
          this.triggerExplosionFlash();

          for (let i = 0; i < textCount; i++) {
            const sprite = this.heartTextSprites[i];
            const uData = sprite.userData;
            const angle = Math.random() * Math.PI * 2;
            const elevation = (Math.random() - 0.5) * Math.PI * 0.85;
            const speed = 300 + Math.random() * 450;
            uData.velocityX = Math.cos(angle) * Math.cos(elevation) * speed;
            uData.velocityY = Math.sin(elevation) * speed;
            uData.velocityZ = Math.sin(angle) * Math.cos(elevation) * speed;
          }
        }
      }

      // Heart object position float (AUTOMATIC PULSING REMOVED BEFORE CLICK!)
      const floatY = Math.sin(now * 0.0018) * 6 + 140;
      this.heartGroup.position.y = floatY;
      this.heartGroup.scale.set(pulseScale, pulseScale, pulseScale);
      this.heartGroup.rotation.set(0, 0, 0); // Always face camera directly!

      const timeSec = now * 0.001;
      const flowProgressOffset = (timeSec * 0.08 * speedMult) % 1.0;
      const scale = 15.0;

      for (let i = 0; i < textCount; i++) {
        const sprite = this.heartTextSprites[i];
        const userData = sprite.userData;

        if (this.isExploding) {
          // ------------------------------------------------
          // EXPLOSION & COSMIC VORTEX SUCTION FOR HEART FRAGMENTS
          // ------------------------------------------------
          const explodeElapsed = (now - this.explosionTime) / 1000;

          if (explodeElapsed < 0.6) {
            // Step 3: Outward burst during 0.0s - 0.6s from explosion
            sprite.position.x += userData.velocityX * 0.016;
            sprite.position.y += userData.velocityY * 0.016;
            sprite.position.z += userData.velocityZ * 0.016;

            sprite.scale.copy(userData.baseScale).multiplyScalar(1.25);
            sprite.material.opacity = 1.0;
          } else {
            // Step 4: Gravitational Cosmic Vortex Suction toward (0, 140, 0)
            this.isVortexActive = true;
            const vortexElapsed = explodeElapsed - 0.6;
            const suctionPower = Math.min(5.5, 0.8 + Math.pow(vortexElapsed / 1.4, 2.6));

            const dx = sprite.position.x;
            const dz = sprite.position.z;
            let dist = Math.hypot(dx, dz);

            let angle = Math.atan2(dz, dx) + (0.07 + 22.0 / (dist + 8)) * suctionPower;
            const newDist = Math.max(0, dist - (14.0 * suctionPower + 80.0 / (dist + 5)));

            sprite.position.x = Math.cos(angle) * newDist;
            sprite.position.z = Math.sin(angle) * newDist;
            sprite.position.y += (0 - sprite.position.y) * (0.08 * suctionPower);

            const collapseFactor = Math.max(0, newDist / 320);
            const coreGlow = (newDist > 25 && newDist < 180) ? 1.4 : 1.0;
            sprite.scale.copy(userData.baseScale).multiplyScalar(Math.min(1.4, collapseFactor) * coreGlow);
            sprite.material.opacity = Math.min(1.0, collapseFactor * 1.5);

            if (newDist < 14) {
              sprite.visible = false;
            }
          }
        } else {
          // Standard Assembly & Flow logic before click
          let currentProgress = (userData.baseProgress + flowProgressOffset) % 1.0;
          if (currentProgress < 0) currentProgress += 1.0;

          const t = (Math.PI * 1.5 + currentProgress * Math.PI * 2) % (Math.PI * 2);
          const heartX0 = 16 * Math.pow(Math.sin(t), 3);
          const heartY0 = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

          const floatDriftX = Math.sin(timeSec * 2.2 + i * 0.4) * 2.5;
          const floatDriftY = Math.cos(timeSec * 2.2 + i * 0.4) * 2.5;
          const floatDriftZ = Math.sin(timeSec * 1.6 + i * 0.3) * 4.0;

          const targetX = heartX0 * scale + userData.scatterX + floatDriftX;
          const targetY = heartY0 * scale + userData.scatterY + floatDriftY;
          const targetZ = userData.zDepth + floatDriftZ;

          if (formElapsed < userData.startTime) {
            const driftSX = userData.startX + Math.sin(timeSec * 1.5 + i) * 12.0;
            const driftSY = userData.startY + Math.cos(timeSec * 1.5 + i) * 12.0;
            const driftSZ = userData.startZ + Math.sin(timeSec * 1.2 + i) * 15.0;
            sprite.position.set(driftSX, driftSY, driftSZ);
            sprite.scale.set(25, 7, 1);
            sprite.material.opacity = Math.min(0.40, (formElapsed / 0.8) * 0.40);
          } else if (formElapsed >= userData.startTime && formElapsed < userData.startTime + userData.duration) {
            const p = (formElapsed - userData.startTime) / userData.duration;
            const cubicEase = 1 - Math.pow(1 - p, 3);
            const arcOffset = Math.sin(p * Math.PI) * 70;

            const currX = userData.startX + (targetX - userData.startX) * cubicEase + Math.sin(p * Math.PI * 1.5) * arcOffset;
            const currY = userData.startY + (targetY - userData.startY) * cubicEase + Math.cos(p * Math.PI * 1.5) * (arcOffset * 0.6);
            const currZ = userData.startZ + (targetZ - userData.startZ) * cubicEase;

            sprite.position.set(currX, currY, currZ);

            const baseScale = userData.baseScale;
            const scaleX = 25 + (baseScale.x - 25) * cubicEase;
            const scaleY = 7 + (baseScale.y - 7) * cubicEase;
            sprite.scale.set(scaleX, scaleY, 1);
            sprite.material.opacity = 0.40 + (0.85 - 0.40) * cubicEase;
          } else {
            sprite.position.set(targetX, targetY, targetZ);

            const baseScale = userData.baseScale;
            const currentScaleX = baseScale.x * Math.min(1.35, brightnessMult);
            const currentScaleY = baseScale.y * Math.min(1.35, brightnessMult);
            sprite.scale.set(currentScaleX, currentScaleY, 1);
            sprite.material.opacity = Math.min(1.0, 0.85 * brightnessMult);
          }
        }
      }
    }

    // ----------------------------------------------------
    // 3. ANIMATE FLOATING 100 LANGUAGE TEXT SPRITES & VORTEX SUCTION
    // ----------------------------------------------------
    if (this.stage >= 5) {
      this.textSprites.forEach((sprite) => {
        const uData = sprite.userData;

        if (this.isVortexActive) {
          const explodeElapsed = (now - this.explosionTime) / 1000;
          const vortexElapsed = Math.max(0, explodeElapsed - 0.6);
          const suctionPower = Math.min(5.5, 0.8 + Math.pow(vortexElapsed / 1.4, 2.6));

          // Curved spiral trajectory toward (0, 140, 0)
          uData.angle += (0.05 + 16.0 / (uData.suctionRadius + 10)) * suctionPower;
          uData.suctionRadius = Math.max(0, uData.suctionRadius - (12.0 * suctionPower + 70.0 / (uData.suctionRadius + 5)));
          uData.suctionY += (140 - uData.suctionY) * (0.07 * suctionPower);

          sprite.position.x = Math.cos(uData.angle) * uData.suctionRadius;
          sprite.position.y = uData.suctionY;
          sprite.position.z = Math.sin(uData.angle) * uData.suctionRadius;

          const langCollapse = Math.max(0, uData.suctionRadius / 380);
          const langCore = (uData.suctionRadius > 35 && uData.suctionRadius < 200) ? 1.3 : 1.0;
          sprite.scale.copy(uData.baseScale).multiplyScalar(Math.min(1.4, langCollapse) * langCore);
          sprite.material.opacity = Math.min(1.0, uData.targetOpacity * langCollapse * 1.6);

          if (uData.suctionRadius < 15) {
            sprite.visible = false;
          }
        } else {
          if (sprite.material.opacity < uData.targetOpacity) {
            sprite.material.opacity += 0.015;
          }
          uData.angle += uData.speed;
          sprite.position.x = Math.cos(uData.angle) * uData.radius;
          sprite.position.z = Math.sin(uData.angle) * uData.radius;
        }
      });
    }

    // ----------------------------------------------------
    // 4. ANIMATE STARDUST SUCTION INTO CENTRAL VORTEX
    // ----------------------------------------------------
    if (this.isVortexActive) {
      const explodeElapsed = (now - this.explosionTime) / 1000;
      const vortexElapsed = Math.max(0, explodeElapsed - 0.6);
      const suctionPower = Math.min(5.5, 0.8 + Math.pow(vortexElapsed / 1.4, 2.6));

      const sPos = this.stardustGeo.attributes.position.array;
      const sCount = sPos.length / 3;

      for (let i = 0; i < sCount; i++) {
        const idx = i * 3;
        const dx = sPos[idx];
        const dy = sPos[idx + 1] - 140;
        const dz = sPos[idx + 2];
        const dist = Math.hypot(dx, dz);

        let angle = Math.atan2(dz, dx) + (0.06 + 14.0 / (dist + 10)) * suctionPower;
        const newDist = Math.max(0, dist - (14.0 * suctionPower + 65.0 / (dist + 6)));
        sPos[idx] = Math.cos(angle) * newDist;
        sPos[idx + 1] += (140 - sPos[idx + 1]) * (0.08 * suctionPower);
        sPos[idx + 2] = Math.sin(angle) * newDist;
      }
      this.stardustGeo.attributes.position.needsUpdate = true;

      if (this.stardustPoints && this.stardustPoints.material) {
        this.stardustPoints.material.opacity = Math.max(0, 0.9 - (vortexElapsed / 2.6));
      }
    }

    // ----------------------------------------------------
    // 5. ENTIRE SCREEN EMPTYING & 1-SECOND BLACK SCREEN TRIGGER
    // ----------------------------------------------------
    if (this.isVortexActive) {
      const explodeElapsed = (now - this.explosionTime) / 1000;
      const vortexElapsed = explodeElapsed - 0.6;

      // After 3.0s of vortex suction: All elements collapsed into center
      if (vortexElapsed >= 3.0 && !this.transitionTriggered) {
        this.transitionTriggered = true;

        // Cleanly stop & reset intro background audio before transition to "for the only person that matters"
        if (window.app && window.app.loginIntroCtrl && typeof window.app.loginIntroCtrl.stopAudio === 'function') {
          window.app.loginIntroCtrl.stopAudio();
        }

        if (this.stardustPoints) this.stardustPoints.visible = false;
        if (this.heartGroup) this.heartGroup.visible = false;
        if (this.textGroup) this.textGroup.visible = false;

        // Render once to guarantee pure black canvas
        this.renderer.render(this.scene, this.camera);

        // Cancel render animation loop so no background CPU/GPU is wasted
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
          this.animFrameId = null;
        }

        // STEP 8: PURE BLACK SCREEN FOR EXACTLY 1 SECOND (1000ms)
        setTimeout(() => {
          this.renderFountainPenScene();
        }, 1000);
      }
    }

    // 6. Smooth 360° Camera Rotation & Zoom Inertia
    if (!this.isHeartClicked && !this.isMouseDown) {
      this.targetRotation.x += this.rotationVel.x;
      this.targetRotation.y += this.rotationVel.y;
      this.rotationVel.x *= 0.95;
      this.rotationVel.y *= 0.96;

      this.targetRotation.y -= 0.0005;
    } else if (this.isHeartClicked) {
      // Direct front lock: Center vortex at viewport center
      this.targetRotation.x = 0;
      this.targetRotation.y = 0;
      this.rotationVel.x = 0;
      this.rotationVel.y = 0;
      this.targetZoom = 750;
    }

    // Clamp vertical rotation pitch to avoid camera inversion at poles
    this.targetRotation.x = Math.max(-1.4, Math.min(1.4, this.targetRotation.x));

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;
    this.currentZoom += (this.targetZoom - this.currentZoom) * 0.06;

    const lookTargetY = this.isHeartClicked ? 140 : 70;
    this.cameraLookY += (lookTargetY - this.cameraLookY) * 0.06;

    const camDist = this.currentZoom;
    this.camera.position.x = camDist * Math.sin(this.currentRotation.y) * Math.cos(this.currentRotation.x);
    this.camera.position.y = camDist * Math.sin(this.currentRotation.x) + (this.cameraLookY - 70) * 0.5;
    this.camera.position.z = camDist * Math.cos(this.currentRotation.y) * Math.cos(this.currentRotation.x);
    this.camera.lookAt(0, this.cameraLookY, 0);

    this.renderer.render(this.scene, this.camera);
  }

  initInfoBox() {
    this.infoBoxEl = document.getElementById('galaxy-info-box');
    if (!this.infoBoxEl) {
      this.infoBoxEl = document.createElement('div');
      this.infoBoxEl.id = 'galaxy-info-box';
      this.infoBoxEl.className = 'galaxy-info-card';
      document.body.appendChild(this.infoBoxEl);
    }
  }

  showInfoBox(langData, screenX, screenY) {
    if (!this.infoBoxEl) this.initInfoBox();
    if (!langData) return;

    const langName = langData.language || 'Love';
    const word = langData.word || langData.translation || langData.text || 'I love you';
    const pronunciation = langData.pronunciation || '';
    const originCountry = langData.originCountry || langData.origin || '';
    const flag = langData.countryFlag || '';
    const meaning = langData.meaning || 'I love you';

    // Structured compact card content hierarchy:
    // 1. Language name at top (♡ Language)
    // 2. Original word (largest element)
    // 3. Pronunciation (soft and concise)
    // 4. Origin country with flag
    // 5. English meaning ("I love you")
    this.infoBoxEl.innerHTML = `
      <div class="galaxy-lang-inner">
        <div class="galaxy-lang-header">
          <span class="galaxy-lang-heart">♡</span>
          <span class="galaxy-lang-title">${langName}</span>
        </div>
        <div class="galaxy-lang-word">${word}</div>
        ${pronunciation ? `<div class="galaxy-lang-pronunciation">${pronunciation}</div>` : ''}
        ${originCountry ? `
          <div class="galaxy-lang-origin">
            ${flag ? `<span class="galaxy-lang-flag">${flag}</span>` : ''}
            <span class="galaxy-lang-country">${originCountry}</span>
          </div>` : ''}
        <div class="galaxy-lang-meaning">"${meaning}"</div>
      </div>
    `;

    // Ensure rendered for size calculation
    this.infoBoxEl.style.display = 'block';

    const rect = this.infoBoxEl.getBoundingClientRect();
    const boxWidth = rect.width > 0 ? rect.width : 220;
    const boxHeight = rect.height > 0 ? rect.height : 160;

    const margin = 16;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    // Horizontal positioning: center on clicked word, clamp to safe viewport edges
    let posX = screenX - boxWidth / 2;
    posX = Math.max(margin, Math.min(viewportW - boxWidth - margin, posX));

    // Vertical positioning:
    // Near bottom / lower half -> appears above word
    // Near top / upper half -> appears underneath word
    let posY;
    const spaceBelow = viewportH - screenY;

    if (screenY > viewportH * 0.55 || spaceBelow < boxHeight + 35) {
      posY = screenY - boxHeight - 16;
      if (posY < margin) {
        posY = screenY + 20;
      }
    } else {
      posY = screenY + 20;
      if (posY + boxHeight > viewportH - margin) {
        posY = screenY - boxHeight - 16;
      }
    }

    // Final safety clamp: never overflow or trigger scroll
    posY = Math.max(margin, Math.min(viewportH - boxHeight - margin, posY));

    this.infoBoxEl.style.left = `${Math.round(posX)}px`;
    this.infoBoxEl.style.top = `${Math.round(posY)}px`;

    // Smooth entry / update
    requestAnimationFrame(() => {
      if (this.infoBoxEl) {
        this.infoBoxEl.classList.add('active');
      }
    });
  }

  hideInfoBox() {
    if (this.infoBoxEl) {
      this.infoBoxEl.classList.remove('active');
    }
    if (this.activeLangSprite) {
      if (this.activeLangSprite.userData && this.activeLangSprite.userData.baseScale) {
        this.activeLangSprite.scale.copy(this.activeLangSprite.userData.baseScale);
      }
      this.activeLangSprite = null;
    }
  }

  spawnClickSparkles(screenX, screenY) {
    const burstCount = 8;
    for (let i = 0; i < burstCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'galaxy-click-sparkle';
      const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const distance = 18 + Math.random() * 24;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      spark.style.cssText = `
        position: fixed;
        left: ${screenX}px;
        top: ${screenY}px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #fbcfe8;
        box-shadow: 0 0 8px #f472b6, 0 0 16px #ffffff;
        pointer-events: none;
        z-index: 10001;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
      `;
      document.body.appendChild(spark);
      requestAnimationFrame(() => {
        spark.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
        spark.style.opacity = '0';
      });
      setTimeout(() => spark.remove(), 450);
    }
  }

  spawnHeartbeatSparkle(floatY) {
    if (!this.camera) return;
    const angle = Math.random() * Math.PI * 2;
    const radius = 170 + Math.random() * 60;
    const x3d = Math.cos(angle) * radius;
    const y3d = floatY + (Math.sin(angle) * radius * 0.85);
    const z3d = (Math.random() - 0.5) * 60;

    const p2d = new THREE.Vector3(x3d, y3d, z3d).project(this.camera);
    const sx = (p2d.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-p2d.y * 0.5 + 0.5) * window.innerHeight;

    const spark = document.createElement('div');
    spark.style.cssText = `
      position: fixed;
      left: ${sx}px;
      top: ${sy}px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 0 10px #f472b6, 0 0 20px #ffffff;
      pointer-events: none;
      z-index: 10000;
      opacity: 1;
      transform: scale(1);
      transition: transform 0.4s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.4s ease;
    `;
    document.body.appendChild(spark);
    const tx = (Math.random() - 0.5) * 40;
    const ty = (Math.random() - 0.5) * 40;
    requestAnimationFrame(() => {
      spark.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      spark.style.opacity = '0';
    });
    setTimeout(() => spark.remove(), 450);
  }

  triggerExplosionFlash() {
    const flash = document.createElement('div');
    flash.className = 'galaxy-explosion-flash';
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      flash.style.opacity = '0';
    });
    setTimeout(() => flash.remove(), 600);
  }

  renderFountainPenScene() {
    const existingScene = document.getElementById('galaxy-pen-scene');
    if (existingScene) existingScene.remove();

    if (window.app && window.app.loginIntroCtrl && typeof window.app.loginIntroCtrl.stopAudio === 'function') {
      window.app.loginIntroCtrl.stopAudio();
    }

    if (!this.writingAudioCtrl) {
      this.writingAudioCtrl = new WritingAudioController();
    }
    this.writingAudioCtrl.stop();

    const penScene = document.createElement('div');
    penScene.id = 'galaxy-pen-scene';
    penScene.className = 'galaxy-pen-scene';

    const textToScript = "for the only person that matters";

    // SVG Fountain Pen with nib tip at origin (0, 0)
    const penSVG = `
      <svg class="fountain-pen-svg" viewBox="-15 -95 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="penObsidian" x1="42" y1="-48" x2="82" y2="-88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#2d1527" />
            <stop offset="35%" stop-color="#140a13" />
            <stop offset="70%" stop-color="#0a0509" />
            <stop offset="100%" stop-color="#240f20" />
          </linearGradient>
          <linearGradient id="penRoseGold" x1="0" y1="0" x2="45" y2="-45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#fdf2f8" />
            <stop offset="25%" stop-color="#f472b6" />
            <stop offset="60%" stop-color="#fb7185" />
            <stop offset="100%" stop-color="#fbcfe8" />
          </linearGradient>
          <radialGradient id="nibInkGlow" cx="0" cy="0" r="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
            <stop offset="30%" stop-color="#f472b6" stop-opacity="0.9" />
            <stop offset="70%" stop-color="#db2777" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#ec4899" stop-opacity="0" />
          </radialGradient>
        </defs>
        <g class="pen-body">
          <polygon points="42,-48 80,-86 86,-80 48,-42" fill="url(#penObsidian)" />
          <line x1="43" y1="-47" x2="81" y2="-85" stroke="#fbcfe8" stroke-width="0.8" opacity="0.45" />
          <polygon points="38,-44 42,-48 48,-42 44,-38" fill="url(#penRoseGold)" />
          <polygon points="23,-29 38,-44 44,-38 29,-23" fill="#18181b" />
          <polygon points="19,-25 23,-29 29,-23 25,-19" fill="url(#penRoseGold)" />
          <polygon points="6,-10 19,-25 25,-19 10,-6" fill="url(#penRoseGold)" />
          <polygon points="0,0 6,-10 10,-6" fill="#fff1f2" />
          <line x1="0" y1="0" x2="14" y2="-14" stroke="#ec4899" stroke-width="0.75" />
          <circle cx="14" cy="-14" r="1.3" fill="#ec4899" />
          <circle class="pen-nib-ink-glow" cx="0" cy="0" r="3.5" fill="url(#nibInkGlow)" />
          <circle cx="0" cy="0" r="1.2" fill="#ffffff" />
        </g>
      </svg>
    `;

    penScene.innerHTML = `
      <div class="pen-sentence-wrapper">
        <div id="pen-written-text" class="pen-written-text">
          ${textToScript.split('').map((char, i) => {
            if (char === ' ') {
              return `<span class="pen-letter pen-space" data-index="${i}">&nbsp;</span>`;
            }
            return `<span class="pen-letter" data-index="${i}">${char}</span>`;
          }).join('')}
        </div>
        <div id="fountain-pen" class="fountain-pen">
          ${penSVG}
        </div>
      </div>
    `;

    document.body.appendChild(penScene);

    requestAnimationFrame(() => {
      penScene.classList.add('active');
    });

    const penEl = penScene.querySelector('#fountain-pen');
    const wrapperEl = penScene.querySelector('.pen-sentence-wrapper');
    const letterEls = penScene.querySelectorAll('.pen-letter');

    // Position nib tip accurately at the start of the first letter
    const wrapperRect = wrapperEl.getBoundingClientRect();
    const firstLetterRect = letterEls[0].getBoundingClientRect();
    const penW = penEl.offsetWidth || 72;
    const penH = penEl.offsetHeight || 72;
    const nibOffsetX = penW * (15 / 110);
    const nibOffsetY = penH * (95 / 110);

    const startNibX = firstLetterRect.left - wrapperRect.left + firstLetterRect.width * 0.2;
    const startNibY = firstLetterRect.top - wrapperRect.top + firstLetterRect.height * 0.78;

    const startPenX = startNibX - nibOffsetX;
    const startPenY = startNibY - nibOffsetY;

    penEl.style.transform = `translate(${startPenX}px, ${startPenY}px) rotate(-14deg)`;

    setTimeout(() => {
      penEl.classList.add('visible');
      // Begin slow handwriting letter-by-letter
      this.animateHandwriting(letterEls, wrapperEl, penEl, 0);
    }, 450);
  }

  animateHandwriting(letterEls, wrapperEl, penEl, currentIndex) {
    if (currentIndex >= letterEls.length) {
      // STOP WRITING SOUND EFFECT
      if (this.writingAudioCtrl) {
        this.writingAudioCtrl.stop();
      }

      // Pen gently lifts up and fades
      penEl.classList.add('pen-lift-fade');

      // WAIT EXACTLY 2 SECONDS (2000ms) with the fully formed sentence visible
      setTimeout(() => {
        this.startSentenceDisintegration(letterEls, wrapperEl);
      }, 2000);
      return;
    }

    // START WRITING SOUND EFFECT ON FIRST CHARACTER
    if (currentIndex === 0 && this.writingAudioCtrl) {
      this.writingAudioCtrl.start();
    }

    const currentLetter = letterEls[currentIndex];
    const isSpace = currentLetter.classList.contains('pen-space');

    const wrapperRect = wrapperEl.getBoundingClientRect();
    const letterRect = currentLetter.getBoundingClientRect();

    const penW = penEl.offsetWidth || 72;
    const penH = penEl.offsetHeight || 72;
    const nibOffsetX = penW * (15 / 110);
    const nibOffsetY = penH * (95 / 110);

    // Calculate actual nib position at end of active character stroke & baseline
    const letterNibX = letterRect.left - wrapperRect.left + (isSpace ? letterRect.width * 0.5 : letterRect.width * 0.88);
    const letterNibY = letterRect.top - wrapperRect.top + letterRect.height * 0.78;

    const penX = letterNibX - nibOffsetX;
    const penY = letterNibY - nibOffsetY;

    // Subtle natural writing tilt and stroke wobble
    const wobbleAngle = -14 + (currentIndex % 2 === 0 ? 1.5 : -1.5) + (Math.random() - 0.5) * 1.0;

    penEl.style.transition = isSpace ? 'transform 0.08s ease' : 'transform 0.11s cubic-bezier(0.2, 0.8, 0.4, 1)';
    penEl.style.transform = `translate(${penX}px, ${penY}px) rotate(${wobbleAngle}deg)`;

    if (!isSpace) {
      currentLetter.classList.add('written');
    }

    // Handwriting pacing: slow, natural, and deliberate
    const delay = isSpace ? 85 : 120 + Math.random() * 25;
    setTimeout(() => {
      this.animateHandwriting(letterEls, wrapperEl, penEl, currentIndex + 1);
    }, delay);
  }

  /**
   * PRE-RENDERED HIGH-PERFORMANCE PARTICLE GLOW SPRITES
   */
  createParticleSprites() {
    const sprites = [];
    const configs = [
      // Soft rose pink with bright luminous center
      { core: '#ffffff', mid: '#f472b6', outer: 'rgba(236,72,153,0)', outerStop: 0.8 },
      // Pale blush pink
      { core: '#ffffff', mid: '#fbcfe8', outer: 'rgba(244,114,182,0)', outerStop: 0.85 },
      // Luminous white-pink
      { core: '#ffffff', mid: '#fce7f3', outer: 'rgba(251,207,232,0)', outerStop: 0.75 },
      // Subtle warm-white highlight
      { core: '#ffffff', mid: '#fff0f5', outer: 'rgba(255,183,213,0)', outerStop: 0.7 },
      // Deep blossom pink
      { core: '#ffffff', mid: '#fb7185', outer: 'rgba(244,63,94,0)', outerStop: 0.9 }
    ];

    configs.forEach((cfg) => {
      const sCanvas = document.createElement('canvas');
      const size = 32;
      sCanvas.width = size;
      sCanvas.height = size;
      const sCtx = sCanvas.getContext('2d');
      const half = size / 2;
      const grad = sCtx.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0, cfg.core);
      grad.addColorStop(0.32, cfg.mid);
      grad.addColorStop(cfg.outerStop, cfg.outer);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.beginPath();
      sCtx.arc(half, half, half, 0, Math.PI * 2);
      sCtx.fill();
      sprites.push(sCanvas);
    });

    return sprites;
  }

  /**
   * STEP 13: SLOW, CONTINUOUS, ORGANIC SENTENCE DISINTEGRATION INTO DUST
   * 
   * 0.0–0.8s: Ink subtly shimmers, very subtle particles begin breaking away from strokes.
   * 0.8–2.0s: More sections fragment, small gaps appear and expand through the strokes.
   * 2.0–3.0s: Remaining solid ink dissolves into glowing dust, drifting upward/outward.
   * 3.0–4.0s: Scattered particles drift and dissolve into pure black darkness.
   * ~4.8s: Transition to Our Song begins after brief black pause.
   */
  startSentenceDisintegration(letterEls, wrapperEl) {
    const penScene = document.getElementById('galaxy-pen-scene');
    if (!penScene) {
      this.transitionToOurSong();
      return;
    }

    const textEl = document.getElementById('pen-written-text');
    if (!textEl) {
      this.transitionToOurSong();
      return;
    }

    if (this.disintegrateAnimId) {
      cancelAnimationFrame(this.disintegrateAnimId);
      this.disintegrateAnimId = null;
    }

    const prevCanvas = document.getElementById('sentence-disintegrate-canvas');
    if (prevCanvas) prevCanvas.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'sentence-disintegrate-canvas';
    canvas.className = 'sentence-disintegrate-canvas';
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 10000;
    `;
    penScene.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Create mutable offscreen canvas holding base ink strokes
    const textCanvas = document.createElement('canvas');
    textCanvas.width = canvas.width;
    textCanvas.height = canvas.height;
    const tCtx = textCanvas.getContext('2d');

    const comp = window.getComputedStyle(textEl);
    const fontSize = parseFloat(comp.fontSize) || 42;
    const fontWeight = comp.fontWeight || '600';
    const fontFamily = comp.fontFamily || "'Caveat', cursive";
    const font = `${fontWeight} ${fontSize * dpr}px ${fontFamily}`;

    tCtx.font = font;
    tCtx.fillStyle = '#fff0f5';
    tCtx.shadowColor = 'rgba(244, 114, 182, 0.95)';
    tCtx.shadowBlur = 18 * dpr;
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle';

    // Draw each letter directly at its DOM span position for 100% accurate alignment
    letterEls.forEach((span) => {
      if (span.classList.contains('pen-space')) return;
      const char = span.textContent;
      const rect = span.getBoundingClientRect();
      const cx = (rect.left + rect.width * 0.5) * dpr;
      const cy = (rect.top + rect.height * 0.5) * dpr;
      tCtx.fillText(char, cx, cy);
    });

    // Seamless handoff from DOM text to canvas ink
    textEl.style.transition = 'opacity 0.25s ease';
    textEl.style.opacity = '0';

    // Sample stroke pixels directly from the actual letter glyphs
    const textRect = textEl.getBoundingClientRect();
    const sx = Math.max(0, Math.floor((textRect.left - 24) * dpr));
    const sy = Math.max(0, Math.floor((textRect.top - 24) * dpr));
    const sw = Math.min(canvas.width - sx, Math.ceil((textRect.width + 48) * dpr));
    const sh = Math.min(canvas.height - sy, Math.ceil((textRect.height + 48) * dpr));

    const imgData = tCtx.getImageData(sx, sy, sw, sh);
    const sprites = this.createParticleSprites();
    const particles = [];
    const step = Math.max(2, Math.round(2.2 * dpr));

    for (let py = 0; py < sh; py += step) {
      for (let px = 0; px < sw; px += step) {
        const idx = (py * sw + px) * 4;
        const alpha = imgData.data[idx + 3];

        // Sample pixels that belong directly to ink strokes and immediate luminous halo
        if (alpha > 45) {
          const worldX = (sx + px) / dpr;
          const worldY = (sy + py) / dpr;

          // Organic cluster noise to naturally form small gaps in handwritten strokes
          const noise = Math.sin(worldX * 0.075) * Math.cos(worldY * 0.14) * 0.5 + 0.5;
          const rand = Math.random();
          const tier = noise * 0.45 + rand * 0.55;

          let releaseTime;
          if (tier < 0.08) {
            // 0.0s - 0.8s: very subtle initial particle shedding (edges & micro-sparkles)
            releaseTime = (tier / 0.08) * 0.8;
          } else if (tier < 0.68) {
            // 0.8s - 2.0s: rapid fragmentation, gaps expanding through strokes
            const t = (tier - 0.08) / (0.68 - 0.08);
            releaseTime = 0.8 + t * 1.2;
          } else {
            // 2.0s - 2.85s: remaining ink strokes dissolve completely into particles
            const t = (tier - 0.68) / (1.0 - 0.68);
            releaseTime = 2.0 + t * 0.85;
          }

          particles.push({
            originX: worldX,
            originY: worldY,
            x: worldX,
            y: worldY,
            // Delicate drift velocity: slow upward and gentle lateral spread
            vx: (Math.random() - 0.5) * 0.42,
            vy: -0.22 - Math.random() * 0.52,
            wobbleSpeed: 1.8 + Math.random() * 2.2,
            wobbleAmp: 0.25 + Math.random() * 0.55,
            wobblePhase: Math.random() * Math.PI * 2,
            size: 1.1 + Math.random() * 1.6,
            sprite: sprites[Math.floor(Math.random() * sprites.length)],
            releaseTime: releaseTime,
            isReleased: false,
            alpha: 0.82 + Math.random() * 0.18,
            sparkleFreq: 3.5 + Math.random() * 4.0
          });
        }
      }
    }

    const startTime = Date.now();
    const duration = 4.0; // Total 4.0 seconds disintegration

    const loop = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --------------------------------------------------
      // 1. UPDATE AND RELEASE PARTICLES & ERODE INK CANVAS
      // --------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!p.isReleased && elapsed >= p.releaseTime) {
          p.isReleased = true;

          // Erode ink on textCanvas at origin: cuts small gap right where particle broke away!
          tCtx.save();
          tCtx.globalCompositeOperation = 'destination-out';
          tCtx.beginPath();
          const holeRadius = (p.size * 1.6 + Math.random() * 1.2) * dpr;
          tCtx.arc(p.originX * dpr, p.originY * dpr, holeRadius, 0, Math.PI * 2);
          tCtx.fill();
          tCtx.restore();
        }

        if (p.isReleased) {
          // Drift physics
          p.x += p.vx;
          p.y += p.vy;
          // Organic sinusoidal sway
          p.x += Math.sin(elapsed * p.wobbleSpeed + p.wobblePhase) * 0.16;
          p.vx *= 0.985;
          p.vy *= 0.988;
        }
      }

      // --------------------------------------------------
      // 2. DRAW REMAINING BASE INK (WITH HOLES AND DIFFUSE GLOW)
      // --------------------------------------------------
      if (elapsed < 2.9) {
        ctx.save();
        // Delicate shimmer at 0.0s - 0.8s
        const shimmer = 1.0 + Math.sin(elapsed * 10) * 0.06 * Math.max(0, 1.0 - elapsed / 2.0);
        // As ink breaks apart, glow becomes softer and more diffuse
        const diffuseBlur = Math.min(3.5, elapsed * 1.1);
        if ('filter' in ctx) {
          ctx.filter = `blur(${diffuseBlur}px)`;
        }
        const baseFade = Math.max(0, 1.0 - Math.pow(elapsed / 2.9, 1.5));
        ctx.globalAlpha = baseFade * shimmer;
        ctx.drawImage(textCanvas, 0, 0);
        ctx.restore();
      }

      // --------------------------------------------------
      // 3. DRAW GLOWING DUST PARTICLES
      // --------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.isReleased) continue;

        // Particle life cycle from releaseTime to 4.0s
        const remainingLife = Math.max(0, (duration - elapsed) / (duration - p.releaseTime));
        if (remainingLife <= 0.01) continue;

        const currentAlpha = p.alpha * Math.pow(remainingLife, 1.35);
        const currentSize = p.size * (0.35 + 0.65 * remainingLife);
        const sparkle = 0.82 + 0.18 * Math.sin(elapsed * p.sparkleFreq + p.wobblePhase);

        ctx.globalAlpha = Math.max(0, Math.min(1.0, currentAlpha * sparkle));
        const drawDim = currentSize * 4.6 * dpr;
        ctx.drawImage(
          p.sprite,
          (p.x * dpr) - drawDim / 2,
          (p.y * dpr) - drawDim / 2,
          drawDim,
          drawDim
        );
      }
      ctx.globalAlpha = 1.0;

      // --------------------------------------------------
      // 4. CHECK COMPLETION & TRANSITION TO OUR SONG
      // --------------------------------------------------
      if (elapsed < duration) {
        this.disintegrateAnimId = requestAnimationFrame(loop);
      } else {
        // Complete darkness achieved at 4.0s!
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.disintegrateAnimId = null;

        // Brief black pause (~800ms) before subtle pink glow and Our Song fade-in begins
        setTimeout(() => {
          this.transitionToOurSong();
        }, 800);
      }
    };

    this.disintegrateAnimId = requestAnimationFrame(loop);
  }

  transitionToOurSong() {
    // STEP 14: GENTLE FADE TRANSITION TO OUR SONG:
    // BLACK -> very subtle pink glow -> Our Song page gradually appears -> full Our Song page visible
    const overlay = document.createElement('div');
    overlay.className = 'scene-cinematic-transition-overlay';
    document.body.appendChild(overlay);

    // Subtle pink glow
    setTimeout(() => {
      overlay.classList.add('pink-glow');

      // Call onProceed to activate Our Song page underneath
      setTimeout(() => {
        if (typeof this.onProceed === 'function') {
          this.onProceed();
        }

        // Overlay gently fades out over 1.3s
        setTimeout(() => {
          overlay.style.opacity = '0';
          setTimeout(() => {
            overlay.remove();
            const penScene = document.getElementById('galaxy-pen-scene');
            if (penScene) penScene.remove();
          }, 1400);
        }, 150);
      }, 500);
    }, 400);
  }

  /**
   * 360° DRAG ROTATION, CLICK INTERACTION & SCROLL/PINCH ZOOM EVENT LISTENERS
   */
  initEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());

    window.addEventListener('mousemove', (e) => {
      if (this.isHeartClicked) return;

      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (!this.isMouseDown) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      // Natural drag direction mapping
      this.rotationVel.y = -deltaX * 0.002;
      this.rotationVel.x = deltaY * 0.002;

      this.targetRotation.y -= deltaX * 0.0035;
      this.targetRotation.x += deltaY * 0.0035;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    const handleCanvasClick = (clientX, clientY) => {
      if (this.isHeartClicked || this.stage < 3) return;

      this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      // Priority 1: Central Heart Click (Triggers 5s pulse -> explosion -> vortex -> Our Song)
      const heartIntersects = this.raycaster.intersectObjects(this.heartTextSprites);
      const heartCenter2D = new THREE.Vector3(0, 140, 0).project(this.camera);
      const mouseDist2D = Math.hypot(this.mouse.x - heartCenter2D.x, this.mouse.y - heartCenter2D.y);

      if (heartIntersects.length > 0 || mouseDist2D < 0.28) {
        this.hideInfoBox();
        this.isHeartClicked = true;
        this.heartClickTime = Date.now();
        if (this.canvas) this.canvas.style.cursor = 'default';
        return;
      }

      // Priority 2: 100 Floating Love Languages Click (Opens/Toggles metadata card)
      if (this.textSprites && this.textSprites.length > 0 && !this.isVortexActive) {
        const langIntersects = this.raycaster.intersectObjects(this.textSprites);
        if (langIntersects.length > 0) {
          const sprite = langIntersects[0].object;
          if (this.activeLangSprite === sprite) {
            this.hideInfoBox();
          } else {
            if (this.activeLangSprite && this.activeLangSprite.userData && this.activeLangSprite.userData.baseScale) {
              this.activeLangSprite.scale.copy(this.activeLangSprite.userData.baseScale);
            }
            this.activeLangSprite = sprite;
            if (sprite.userData && sprite.userData.baseScale) {
              sprite.scale.copy(sprite.userData.baseScale.clone().multiplyScalar(1.28));
            }
            const p2d = sprite.position.clone().project(this.camera);
            const screenX = (p2d.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (-p2d.y * 0.5 + 0.5) * window.innerHeight;
            this.showInfoBox(sprite.userData.langData, screenX, screenY);
            this.spawnClickSparkles(screenX, screenY);
          }
          return;
        }
      }

      // Priority 3: Clicking Empty Space closes open tooltip card
      this.hideInfoBox();
    };

    this.canvas.addEventListener('click', (e) => {
      handleCanvasClick(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (this.isHeartClicked) return;
      this.isMouseDown = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideInfoBox();
      }
    });

    document.addEventListener('click', (e) => {
      if (!this.infoBoxEl || !this.infoBoxEl.classList.contains('active')) return;
      if (this.infoBoxEl.contains(e.target) || e.target === this.canvas) return;
      this.hideInfoBox();
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.isHeartClicked) return;
      this.targetZoom += e.deltaY * 0.65;
      this.targetZoom = Math.max(250, Math.min(2200, this.targetZoom));
    }, { passive: false });

    this.canvas.addEventListener('touchstart', (e) => {
      if (this.isHeartClicked) return;
      if (e.touches.length === 1) {
        this.isMouseDown = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        this.touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isHeartClicked) return;
      if (e.touches.length === 1 && this.isMouseDown) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

        this.rotationVel.y = -deltaX * 0.0025;
        this.rotationVel.x = deltaY * 0.0025;

        this.targetRotation.y -= deltaX * 0.0045;
        this.targetRotation.x += deltaY * 0.0045;

        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = this.touchStartDist - dist;
        this.targetZoom += delta * 1.6;
        this.targetZoom = Math.max(250, Math.min(2200, this.targetZoom));
        this.touchStartDist = dist;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (this.isHeartClicked) {
        this.isMouseDown = false;
        return;
      }
      if (e.changedTouches && e.changedTouches.length > 0) {
        handleCanvasClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
      this.isMouseDown = false;
    });
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  destroy() {
    this.hideInfoBox();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.infoBoxEl) {
      this.infoBoxEl.remove();
      this.infoBoxEl = null;
    }
    const penScene = document.getElementById('galaxy-pen-scene');
    if (penScene) penScene.remove();

    const flash = document.querySelector('.galaxy-explosion-flash');
    if (flash) flash.remove();

    const overlay = document.querySelector('.scene-cinematic-transition-overlay');
    if (overlay) overlay.remove();

    if (this.disintegrateAnimId) {
      cancelAnimationFrame(this.disintegrateAnimId);
      this.disintegrateAnimId = null;
    }
    const disCanvas = document.getElementById('sentence-disintegrate-canvas');
    if (disCanvas) disCanvas.remove();

    // Clean up Three.js objects
    if (this.scene) {
      this.scene.traverse((child) => {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat.map) mat.map.dispose();
              mat.dispose();
            });
          } else {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        }
      });
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    }

    if (this.glowTexture) {
      this.glowTexture.dispose();
      this.glowTexture = null;
    }
    if (this.pinkTextTextures) {
      this.pinkTextTextures.forEach((t) => t.dispose());
      this.pinkTextTextures = [];
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }

    this.heartGroup = null;
    this.stardustPoints = null;
    this.heartTextSprites = [];
    this.textSprites = [];
    this.isInitialized = false;

    if (this.container) {
      this.container.classList.remove('active');
    }
  }
}
