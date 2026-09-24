/*WHEEL & INTERACTIVE JOURNAL CONTROLLER
 */

const romanticPoems = [
  "i built a quiet corner in my heart\nwhere only your name softly resounds. ♡",
  "even the farthest distance grows gentle\nwhen i remember the warmth of your smile. ✨",
  "you are the quiet dawn\ni wait for through every long night. 🌸",
  "if my thoughts could leave footprints,\nthey would lead straight to your doorstep. 💖",
  "among a thousand evening stars,\nyour eyes remain my favourite glow. ✦",
  "no ocean between us is wider\nthan the tenderness i hold for you. ♡",
  "the world softens the moment\nyour voice reaches across the miles. ✨",
  "you turned every lonely whisper of mine\ninto a sweet, enduring lullaby. 🌸",
  "my days begin and end in the quiet promise\nof seeing you. 💖",
  "a tiny screen could never measure\nthe immense light you bring to my life. ✦",
  "i carry your laughter with me\nlike a flower pressed between favourite pages. ♡",
  "wherever you wander on this earth,\nmy love walks softly beside you. ✨",
  "you are the gentle rhythm\nthat keeps my heartbeat calm and sure. 🌸",
  "even in silence, we speak a language\nthat only our hearts understand. 💖",
  "i could count every star in the sky\nand still fall short of how much you mean to me. ✦",
  "your kindness is the sweetest shelter\ni have ever known. ♡",
  "the horizon separates cities,\nnever two souls that belong together. ✨",
  "in every quiet pause of my day,\ni am secretly sending you a kiss. 🌸",
  "you are the sunrise i look forward to\nand the moonlit dream i hold tight. 💖",
  "loving you across the distance\nis the easiest promise i have ever kept. ✦",
  "your softness stays with me\nlong after the call has ended. ♡",
  "i leave a trail of gentle wishes\nevery time i think of you. ✨",
  "the prettiest view in the world\nis the sight of your genuine happiness. 🌸",
  "you make every distance feel like\njust a temporary step toward forever. 💖",
  "my heart recognizes yours\nin every quiet, beautiful moment. ✦",
  "i trace the outline of your memory\nand smile knowing you are mine. ♡",
  "the hours grow softer whenever\ni am listening to you speak. ✨",
  "you are the sweetest secret\nmy heart keeps whispered to the night. 🌸",
  "no matter how far the road winds,\ni will always find my way to you. 💖",
  "your grace turns ordinary days\ninto something magical and bright. ✦",
  "every message from you feels like\na tiny bouquet of pink blossoms. ♡",
  "you are my favourite dream,\nthe kind i never want to wake from. ✨",
  "a thousand miles cannot hush\nthe song my heart sings for you. 🌸",
  "i keep your warmth tucked safely\ninside the pocket of my heart. 💖",
  "you're the gentle breeze that arrives\njust when i need a quiet comfort. ✦",
  "if love were written in stars,\nyours would shine brighter than all the rest. ♡",
  "i treasure the quiet certainty\nof waking up and loving you. ✨",
  "every version of tomorrow feels sweet\nbecause you are in it with me. 🌸",
  "your laughter is the melody\ni replay whenever the evening grows still. 💖",
  "to love you is to know that\nevery distance eventually melts away. ✦",
  "you are the softest landing place\nmy heart has ever found. ✨",
  "the moon watches over both of us,\nreminding me that we share the same sky. 🌸",
  "i find a piece of home\nin every message you send. 💖",
  "your love is a quiet miracle\ni thank the universe for every day. ✦",
  "you still feel like my\nfavorite part of every day. ♡",
  "A message from you can change the entire mood of my day\nYou’re precious to me,more than words can properly say ♡",
  "you make every ordinary second\nfeel like a golden memory. ✨",
  "my heart has chosen you,\nand it would choose you a million times over. 🌸",
  "in the vastness of everything,\nyou are my absolute favourite place to be. 💖",
  "loving you is the easiest\nand most natural thing in the world. ✦"
];

class PoetryWheelController {
  constructor() {
    this.totalSegments = 50;
    this.currentRotation = 0;
    this.isSpinning = false;
    this.currentWinningNumber = null;
    this.currentWinningText = "";

    // Storage Persistence
    this.storageKey = 'ROMANTIC_POETRY_COLLECTION';
    this.collectionList = this.loadCollection();
    this.collectedNumbers = this.collectionList.map(item => item.number);

    // Booklet Page State
    this.bookletPageIndex = 0;

    // DOM Elements - Wheel Stage
    this.wheelSvgWrap = document.getElementById('wheel-svg-wrap');
    this.wheelSvg = document.getElementById('wheel-svg-element');
    this.spinBtn = document.getElementById('wheel-spin-btn');
    this.pointerPin = document.getElementById('wheel-pointer-pin');

    // DOM Elements - Corner Book & Counter
    this.cornerBookBtn = document.getElementById('wheel-corner-book-btn');
    this.bookBadgeEl = document.getElementById('wheel-book-badge');

    // DOM Elements - Result Modal
    this.modalBackdrop = document.getElementById('poetry-modal-backdrop');
    this.modalNumber = document.getElementById('poetry-card-number');
    this.modalVerse = document.getElementById('poetry-card-verse');
    this.modalStatusNotice = document.getElementById('poetry-modal-status-notice');
    this.modalActionBtn = document.getElementById('poetry-modal-action-btn');
    this.modalCloseBtn = document.getElementById('poetry-card-close');

    // DOM Elements - Booklet Journal Modal
    this.bookletBackdrop = document.getElementById('poetry-booklet-backdrop');
    this.bookletCloseBtn = document.getElementById('booklet-close-btn');
    this.bookletTitle = document.getElementById('booklet-title-text');
    this.bookletBadge = document.getElementById('booklet-count-badge');
    this.bookletPoemNum = document.getElementById('booklet-poem-num');
    this.bookletPoemText = document.getElementById('booklet-poem-text');
    this.bookletIndicator = document.getElementById('booklet-page-indicator');
    this.bookletPrevBtn = document.getElementById('booklet-prev-btn');
    this.bookletNextBtn = document.getElementById('booklet-next-btn');

    // DOM Elements - Reset Confirmation Modal
    this.bookletResetBtn = document.getElementById('booklet-reset-btn');
    this.resetModalBackdrop = document.getElementById('poetry-reset-modal-backdrop');
    this.resetConfirmBtn = document.getElementById('reset-confirm-btn');
    this.resetCancelBtn = document.getElementById('reset-cancel-btn');
    this.resetCloseBtn = document.getElementById('reset-modal-close');

    this.init();
  }

  loadCollection() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("localStorage unavailable:", e);
      return [];
    }
  }

  saveCollection() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.collectionList));
    } catch (e) {
      console.warn("Failed to save collection:", e);
    }
  }

  init() {
    this.renderWheelSVG();
    this.bindEvents();
    this.updateBookBadgeUI();
    this.createFloatingLetters();
  }

  renderWheelSVG() {
    if (!this.wheelSvg) return;

    const size = 500;
    const center = size / 2;
    const radius = center - 6;
    const anglePerSeg = (2 * Math.PI) / this.totalSegments;

    const colors = [
      '#FFFFFF',
      '#FFF0F5',
      '#FCE7F3',
      '#FBCFE8',
      '#F472B6'
    ];

    let svgContent = `<defs>
      <filter id="wheelShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#EC4899" flood-opacity="0.15"/>
      </filter>
    </defs>`;

    // Draw 50 clearly numbered segments
    for (let i = 0; i < this.totalSegments; i++) {
      const startAngle = i * anglePerSeg - Math.PI / 2;
      const endAngle = (i + 1) * anglePerSeg - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
      const fillColor = colors[i % colors.length];

      svgContent += `<path d="${pathData}" fill="${fillColor}" stroke="#F472B6" stroke-width="0.75"/>`;

      // Text rotation & position
      const midAngle = startAngle + anglePerSeg / 2;
      const textRadius = radius * 0.82;
      const tx = center + textRadius * Math.cos(midAngle);
      const ty = center + textRadius * Math.sin(midAngle);

      const numStr = (i + 1).toString();
      const deg = (midAngle * 180) / Math.PI + 90;

      svgContent += `<text x="${tx}" y="${ty}" 
        fill="#831843" 
        font-family="'Plus Jakarta Sans', sans-serif" 
        font-size="10.5" 
        font-weight="700"
        text-anchor="middle" 
        dominant-baseline="central"
        transform="rotate(${deg}, ${tx}, ${ty})">
        ${numStr}
      </text>`;
    }

    svgContent += `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#F472B6" stroke-width="3"/>`;
    svgContent += `<circle cx="${center}" cy="${center}" r="${radius * 0.65}" fill="none" stroke="rgba(244, 114, 182, 0.4)" stroke-width="1" stroke-dasharray="3 3"/>`;

    this.wheelSvg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    this.wheelSvg.innerHTML = svgContent;
  }

  bindEvents() {
    // 1. Spin Button
    if (this.spinBtn) {
      this.spinBtn.onclick = () => this.spinWheel();
    }

    // 2. Corner Closed Book Button -> Opens Journal Booklet
    if (this.cornerBookBtn) {
      this.cornerBookBtn.onclick = (e) => {
        e.preventDefault();
        this.openBooklet();
      };
    }

    // 3. Result Modal Controls
    if (this.modalCloseBtn) {
      this.modalCloseBtn.onclick = () => this.hideModal();
    }
    if (this.modalBackdrop) {
      this.modalBackdrop.onclick = (e) => {
        if (e.target === this.modalBackdrop) {
          this.hideModal();
        }
      };
    }

    // 4. Booklet Controls
    if (this.bookletCloseBtn) {
      this.bookletCloseBtn.onclick = () => this.closeBooklet();
    }
    if (this.bookletBackdrop) {
      this.bookletBackdrop.onclick = (e) => {
        if (e.target === this.bookletBackdrop) {
          this.closeBooklet();
        }
      };
    }
    if (this.bookletPrevBtn) {
      this.bookletPrevBtn.onclick = () => this.prevBookletPage();
    }
    if (this.bookletNextBtn) {
      this.bookletNextBtn.onclick = () => this.nextBookletPage();
    }

    // 5. Reset Confirmation Controls
    if (this.bookletResetBtn) {
      this.bookletResetBtn.onclick = () => this.showResetModal();
    }
    if (this.resetCloseBtn) {
      this.resetCloseBtn.onclick = () => this.hideResetModal();
    }
    if (this.resetCancelBtn) {
      this.resetCancelBtn.onclick = () => this.hideResetModal();
    }
    if (this.resetConfirmBtn) {
      this.resetConfirmBtn.onclick = () => this.confirmResetCollection();
    }
    if (this.resetModalBackdrop) {
      this.resetModalBackdrop.onclick = (e) => {
        if (e.target === this.resetModalBackdrop) {
          this.hideResetModal();
        }
      };
    }
  }

  spinWheel() {
    if (this.isSpinning) return;
    this.hideModal();

    this.isSpinning = true;
    if (this.spinBtn) {
      this.spinBtn.disabled = true;
      this.spinBtn.textContent = "SPINNING... ♡";
    }

    // Pick random winning segment index (0 to 49)
    const winningIdx = Math.floor(Math.random() * this.totalSegments);
    const segAngle = 360 / this.totalSegments;
    const targetSegCenter = (winningIdx + 0.5) * segAngle;

    // Revolutions (5 to 8 full turns)
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const targetRotation = this.currentRotation + fullSpins + (360 - (targetSegCenter % 360));
    this.currentRotation = targetRotation;

    if (this.wheelSvgWrap) {
      this.wheelSvgWrap.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.94, 0.3, 1)';
      this.wheelSvgWrap.style.transform = `rotate(${this.currentRotation}deg)`;
    }

    // Pointer tick animation
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      if (this.pointerPin) {
        this.pointerPin.classList.toggle('tick', tickCount % 2 === 0);
      }
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
      if (this.pointerPin) {
        this.pointerPin.classList.remove('tick');
      }

      this.isSpinning = false;
      if (this.spinBtn) {
        this.spinBtn.disabled = false;
        this.spinBtn.textContent = "SPIN";
      }

      this.showResultModal(winningIdx);
    }, 4500);
  }

  showResultModal(segIndex) {
    const poemNumber = segIndex + 1;
    const poemText = romanticPoems[segIndex] || romanticPoems[0];

    this.currentWinningNumber = poemNumber;
    this.currentWinningText = poemText;

    if (this.modalNumber) {
      this.modalNumber.textContent = `✦ NO. ${poemNumber.toString().padStart(2, '0')} ✦`;
    }
    if (this.modalVerse) {
      this.modalVerse.textContent = poemText;
    }

    const isAlreadyCollected = this.collectedNumbers.includes(poemNumber);

    if (this.modalStatusNotice) {
      this.modalStatusNotice.textContent = isAlreadyCollected ? "✦ ALREADY IN YOUR BOOK ♡ ✦" : "✦ UNCOLLECTED ✦";
    }

    if (this.modalActionBtn) {
      if (isAlreadyCollected) {
        this.modalActionBtn.textContent = "SPIN AGAIN ♡";
        this.modalActionBtn.onclick = () => {
          this.spinWheel();
        };
      } else {
        this.modalActionBtn.textContent = "COLLECT ♡";
        this.modalActionBtn.onclick = () => {
          this.collectCurrentPoem();
        };
      }
    }

    if (this.modalBackdrop) {
      this.modalBackdrop.classList.add('active');
    }
  }

  collectCurrentPoem() {
    if (!this.currentWinningNumber) return;

    const num = this.currentWinningNumber;
    if (!this.collectedNumbers.includes(num)) {
      this.collectedNumbers.push(num);
      this.collectionList.push({
        number: num,
        text: this.currentWinningText,
        timestamp: Date.now()
      });

      this.saveCollection();
      this.updateBookBadgeUI();

      // Update Modal to reflect collected state
      if (this.modalStatusNotice) {
        this.modalStatusNotice.textContent = "✓ ADDED TO YOUR COLLECTION! ♡";
      }

      if (this.modalActionBtn) {
        this.modalActionBtn.textContent = "SPIN AGAIN ♡";
        this.modalActionBtn.onclick = () => {
          this.spinWheel();
        };
      }
    }
  }

  hideModal() {
    if (this.modalBackdrop) {
      this.modalBackdrop.classList.remove('active');
    }
  }

  updateBookBadgeUI() {
    if (this.bookBadgeEl) {
      const count = this.collectedNumbers.length;
      this.bookBadgeEl.textContent = `${count} / 50`;
    }
  }

  /* ── Enlarged Poetry Booklet Journal Modal ── */
  openBooklet() {
    if (this.collectionList.length === 0) {
      this.bookletPageIndex = 0;
    } else {
      // Start on the latest collected page
      this.bookletPageIndex = this.collectionList.length - 1;
    }

    this.renderBookletPage();

    if (this.bookletBackdrop) {
      this.bookletBackdrop.classList.add('active');
    }
  }

  closeBooklet() {
    if (this.bookletBackdrop) {
      this.bookletBackdrop.classList.remove('active');
    }
  }

  showResetModal() {
    if (this.resetModalBackdrop) {
      this.resetModalBackdrop.classList.add('active');
    }
  }

  hideResetModal() {
    if (this.resetModalBackdrop) {
      this.resetModalBackdrop.classList.remove('active');
    }
  }

  confirmResetCollection() {
    this.collectionList = [];
    this.collectedNumbers = [];
    this.bookletPageIndex = 0;

    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn("Failed to clear collection storage:", e);
    }

    this.updateBookBadgeUI();
    this.renderBookletPage();
    this.hideResetModal();
  }

  prevBookletPage() {
    if (this.bookletPageIndex > 0) {
      this.bookletPageIndex--;
      this.renderBookletPage();
    }
  }

  nextBookletPage() {
    if (this.bookletPageIndex < this.collectionList.length - 1) {
      this.bookletPageIndex++;
      this.renderBookletPage();
    }
  }

  renderBookletPage() {
    const totalCollected = this.collectionList.length;

    if (this.bookletBadge) {
      this.bookletBadge.textContent = `${totalCollected} / 50 collected`;
    }

    if (totalCollected === 0) {
      // Empty state
      if (this.bookletPoemNum) {
        this.bookletPoemNum.textContent = "✦ YOUR COLLECTION IS WAITING ✦";
      }
      if (this.bookletPoemText) {
        this.bookletPoemText.textContent = "your collection is empty right now ♡\n\nspin the wheel to discover and collect poems for Elie.";
      }
      if (this.bookletIndicator) {
        this.bookletIndicator.textContent = "0 / 50";
      }
      if (this.bookletPrevBtn) this.bookletPrevBtn.disabled = true;
      if (this.bookletNextBtn) this.bookletNextBtn.disabled = true;
      return;
    }

    // Clamp index
    if (this.bookletPageIndex < 0) this.bookletPageIndex = 0;
    if (this.bookletPageIndex >= totalCollected) this.bookletPageIndex = totalCollected - 1;

    const item = this.collectionList[this.bookletPageIndex];

    if (this.bookletPoemNum) {
      this.bookletPoemNum.textContent = `✦ NO. ${item.number.toString().padStart(2, '0')} ✦`;
    }

    if (this.bookletPoemText) {
      this.bookletPoemText.textContent = item.text;
    }

    if (this.bookletIndicator) {
      this.bookletIndicator.textContent = `${this.bookletPageIndex + 1} / ${totalCollected}`;
    }

    if (this.bookletPrevBtn) {
      this.bookletPrevBtn.disabled = this.bookletPageIndex === 0;
    }

    if (this.bookletNextBtn) {
      this.bookletNextBtn.disabled = this.bookletPageIndex === totalCollected - 1;
    }
  }

  createFloatingLetters() {
    const stage = document.querySelector('.wheel-stage-wrapper');
    if (!stage) return;

    const chars = ['♡', '✨', '✦', '🌸', 'p', 'o', 'e', 'm', 's', 'l', 'o', 'v', 'e'];
    
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('div');
      el.className = 'wheel-floating-letter';
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
      el.style.left = `${10 + Math.random() * 80}%`;
      el.style.top = `${60 + Math.random() * 30}%`;
      el.style.animationDelay = `${Math.random() * 6}s`;
      el.style.fontSize = `${14 + Math.random() * 12}px`;
      stage.appendChild(el);
    }
  }
}
