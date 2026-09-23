/**
 * DIGITAL LOVE LETTER JOURNAL CONTROLLER — "FOR ELIE ♡"
 * Features:
 * 1. Exactly 5 Completely Original, Heartfelt LDR Letters written specifically for Elie
 * 2. Realistic Open Keepsake Journal Layout
 * 3. Interactive Page Turning with Page Counter ("01 / 05")
 * 4. Keyboard Arrow Navigation
 * 5. Strict Non-looping Navigation (Stops at Page 05)
 */

const elieLoveLetters = [
  {
    pageStr: "01",
    heading: "what usually stays inside",
    motif: "✦ ♡ ✦",
    paragraphs: [
      "I’ve always been someone who stumbles when trying to say the things that matter most out loud. Whenever I hear your voice, the sheer weight of how much I care gets tangled somewhere between my heart and my tongue.",
      "Writing this down was the only way I knew how to be completely honest without getting nervous. On paper, my feelings don't get shy. I wanted you to have something real—words you can return to whenever you need a reminder of how deeply you are felt.",
      "You deserve to know what goes on in my mind when it's quiet: that every small moment with you feels significant, even the ones we haven't lived yet."
    ]
  },
  {
    pageStr: "02",
    heading: "a gentle thank you",
    motif: "🌸 ✨ 🌸",
    paragraphs: [
      "Thank you for the patient way you hold space for me. You love with a quiet grace that never makes me feel like I have to perform or pretend to be anything other than who I am.",
      "I notice every small gesture—the soft reassurance in your messages, the way you pay attention to details I thought were forgotten, and how easily you offer warmth when my days grow heavy.",
      "Being loved by you has given me a kind of peace I didn't know I was allowed to have. Thank you for choosing to understand me, even during the moments when I'm still trying to understand myself."
    ]
  },
  {
    pageStr: "03",
    heading: "the space between us",
    motif: "✦ ✨ ✦",
    paragraphs: [
      "Long-distance has a strange way of making ordinary moments feel like precious treasures. There are so many times during the day when something simple happens, and my immediate instinct is to reach out and share it with you.",
      "We live through screens and late-night conversations, learning to read each other's moods through tone and text. It isn't always easy, but there is an undeniable comfort in knowing that despite every mile, your presence remains the steadiest part of my world.",
      "Distance only tests geography; it has never managed to touch the closeness we built together."
    ]
  },
  {
    pageStr: "04",
    heading: "choosing you, intentionally",
    motif: "💖 ♡ 💖",
    paragraphs: [
      "My affection for you isn't just a fleeting feeling that came out of nowhere. It is a quiet, deliberate choice I make every morning when I wake up, and every evening before I sleep.",
      "I want you in the most unvarnished, everyday ways. I want to learn every new chapter of who you are as time moves forward—your changing habits, your private thoughts, and the things that make you smile when nobody else is watching.",
      "Out of all the paths life could have taken, building this connection with you is the one I would pick every single time."
    ]
  },
  {
    pageStr: "05",
    heading: "simple tomorrows",
    motif: "✦ ♡ ✦",
    paragraphs: [
      "When I think about what lies ahead, my mind doesn't jump to grand, dramatic gestures. I just think about the quiet, unhurried routines we get to share when the distance finally gives way.",
      "I look forward to simple mornings, making coffee without rushing, sharing meals without a timer, and having random conversations that drift effortlessly into the night.",
      "I want to grow beside you, step by step, turning every quiet plan into a lived reality. Until then, know that my heart is right where it needs to be—with you."
    ]
  }
];

class LoveLetterController {
  constructor() {
    this.letters = elieLoveLetters;
    this.currentPageIndex = 0;
    this.isTurningPage = false;
    this._keyHandler = null;

    // DOM Elements
    this.bookElement = document.getElementById('letter-open-book');
    this.leftPageNumTag = document.getElementById('letter-left-page-number-tag');
    this.pageNumTag = document.getElementById('letter-page-number-tag');
    this.pageHeading = document.getElementById('letter-page-heading');
    this.bodyContent = document.getElementById('letter-body-content');
    this.motifText = document.getElementById('letter-motif-text');
    this.pageCounter = document.getElementById('letter-page-counter');
    this.prevBtn = document.getElementById('letter-prev-btn');
    this.nextBtn = document.getElementById('letter-next-btn');

    // 3D Turning Leaf & Shadow Elements
    this.turningLeaf = document.getElementById('letter-turning-leaf');
    this.leafFrontInner = document.getElementById('leaf-front-inner');
    this.leafBackInner = document.getElementById('leaf-back-inner');
    this.leafShadow = document.getElementById('letter-leaf-shadow');

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderCurrentPage();
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.onclick = () => this.prevPage();
    }
    if (this.nextBtn) {
      this.nextBtn.onclick = () => this.nextPage();
    }

    // Keyboard Arrow Navigation
    this._keyHandler = (e) => {
      const letterView = document.getElementById('letter-view');
      if (!letterView || !letterView.classList.contains('view-visible')) return;

      if (e.key === 'ArrowLeft') {
        this.prevPage();
      } else if (e.key === 'ArrowRight') {
        this.nextPage();
      }
    };
    window.addEventListener('keydown', this._keyHandler);
  }

  destroy() {
    if (this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
  }

  prevPage() {
    if (this.isTurningPage || this.currentPageIndex <= 0) return;
    this.turnPage(this.currentPageIndex - 1, 'prev');
  }

  nextPage() {
    if (this.isTurningPage || this.currentPageIndex >= this.letters.length - 1) return;
    this.turnPage(this.currentPageIndex + 1, 'next');
  }

  turnPage(targetIndex, direction) {
    this.isTurningPage = true;
    const oldIndex = this.currentPageIndex;
    const oldLetter = this.letters[oldIndex];
    const newLetter = this.letters[targetIndex];

    if (!this.turningLeaf || !this.leafFrontInner || !this.leafBackInner) {
      // Fallback if 3D elements missing
      this.currentPageIndex = targetIndex;
      this.renderCurrentPage();
      this.isTurningPage = false;
      return;
    }

    // Helpers to generate page content HTML
    const buildPageHTML = (letter) => `
      <div class="letter-page-top-bar">
        <span class="letter-page-number-tag">${letter.pageStr}</span>
        <span class="letter-page-heading">${this.escapeHtml(letter.heading)}</span>
      </div>
      <div class="letter-body-content">
        ${letter.paragraphs.map(p => `<p>${this.escapeHtml(p)}</p>`).join('')}
      </div>
      <div class="letter-page-bottom-bar">
        <span class="letter-motif-text">${letter.motif}</span>
      </div>
    `;

    const buildLeftPageHTML = (pageIndex) => `
      <div class="letter-page-top-bar">
        <span class="letter-left-tag">FOR ELIE ♡</span>
        <span class="letter-left-sub">KEEPSAKE JOURNAL</span>
      </div>
      <div class="letter-left-body">
        <div class="letter-left-heart">💗</div>
        <div class="letter-left-title">a quiet space for words</div>
        <p class="letter-left-quote">"written slowly, meant for your heart alone."</p>
        <div class="letter-left-motif">✦ ✨ ✦</div>
      </div>
      <div class="letter-page-bottom-bar">
        <span class="letter-motif-text">✦ PAGE ${(pageIndex + 1).toString().padStart(2, '0')} ✦</span>
      </div>
    `;

    const duration = 1400; // 1.4 seconds physical page turn

    if (direction === 'next') {
      // Populate Leaf Front with current right content
      this.leafFrontInner.innerHTML = buildPageHTML(oldLetter);
      // Populate Leaf Back with decorative left page layout
      this.leafBackInner.innerHTML = buildLeftPageHTML(targetIndex);

      // Render target letter under turning leaf on the right page immediately
      this.currentPageIndex = targetIndex;
      this.renderCurrentPage();

      // Configure Leaf for Next Turn (Origin Left Center - Spine Seam)
      this.turningLeaf.className = 'letter-turning-leaf turning-next';
      this.turningLeaf.style.display = 'block';
      this.turningLeaf.style.transform = 'rotateY(0deg)';
      this.turningLeaf.style.transition = 'none';

      if (this.leafShadow) {
        this.leafShadow.className = 'letter-leaf-shadow shadow-right';
        this.leafShadow.style.opacity = '0';
      }

      // Force Reflow
      void this.turningLeaf.offsetHeight;

      // Smooth cubic-bezier rotation over 1.4s
      this.turningLeaf.style.transition = `transform ${duration}ms cubic-bezier(0.37, 0, 0.63, 1)`;
      this.turningLeaf.style.transform = 'rotateY(-180deg)';

      if (this.leafShadow) {
        this.leafShadow.style.transition = `opacity ${duration / 2}ms ease-in-out`;
        this.leafShadow.style.opacity = '0.65';
        setTimeout(() => {
          if (this.leafShadow) {
            this.leafShadow.style.transition = `opacity ${duration / 2}ms ease-in-out`;
            this.leafShadow.style.opacity = '0';
          }
        }, duration / 2);
      }
    } else {
      // Prev turn
      // Populate Leaf Front with Left Page decoration
      this.leafFrontInner.innerHTML = buildLeftPageHTML(oldIndex);
      // Populate Leaf Back with Target letter content
      this.leafBackInner.innerHTML = buildPageHTML(newLetter);

      // Render target letter on the right page immediately
      this.currentPageIndex = targetIndex;
      this.renderCurrentPage();

      // Configure Leaf for Prev Turn (Origin Right Center - Spine Seam)
      this.turningLeaf.className = 'letter-turning-leaf turning-prev';
      this.turningLeaf.style.display = 'block';
      this.turningLeaf.style.transform = 'rotateY(0deg)';
      this.turningLeaf.style.transition = 'none';

      if (this.leafShadow) {
        this.leafShadow.className = 'letter-leaf-shadow shadow-left';
        this.leafShadow.style.opacity = '0';
      }

      // Force Reflow
      void this.turningLeaf.offsetHeight;

      // Smooth cubic-bezier rotation over 1.4s
      this.turningLeaf.style.transition = `transform ${duration}ms cubic-bezier(0.37, 0, 0.63, 1)`;
      this.turningLeaf.style.transform = 'rotateY(180deg)';

      if (this.leafShadow) {
        this.leafShadow.style.transition = `opacity ${duration / 2}ms ease-in-out`;
        this.leafShadow.style.opacity = '0.65';
        setTimeout(() => {
          if (this.leafShadow) {
            this.leafShadow.style.transition = `opacity ${duration / 2}ms ease-in-out`;
            this.leafShadow.style.opacity = '0';
          }
        }, duration / 2);
      }
    }

    // Cleanup & Unlock after 1.4s animation completes
    setTimeout(() => {
      if (this.turningLeaf) {
        this.turningLeaf.style.display = 'none';
        this.turningLeaf.style.transform = 'none';
      }
      if (this.leafShadow) {
        this.leafShadow.style.opacity = '0';
      }
      this.isTurningPage = false;
    }, duration);
  }

  renderCurrentPage() {
    const letter = this.letters[this.currentPageIndex];
    if (!letter) return;

    // Single source of truth for the current 2-digit page number string
    const currentNumStr = (this.currentPageIndex + 1).toString().padStart(2, '0');
    const totalNumStr = this.letters.length.toString().padStart(2, '0');

    // 1. Update Left Page Number Tag ("✦ PAGE 01 ✦")
    if (this.leftPageNumTag) {
      this.leftPageNumTag.textContent = `✦ PAGE ${currentNumStr} ✦`;
    }

    // 2. Update Right Page Header Tag ("01")
    if (this.pageNumTag) {
      this.pageNumTag.textContent = letter.pageStr;
    }

    if (this.pageHeading) {
      this.pageHeading.textContent = letter.heading;
    }

    if (this.motifText) {
      this.motifText.textContent = letter.motif;
    }

    if (this.bodyContent) {
      this.bodyContent.innerHTML = letter.paragraphs
        .map(p => `<p>${this.escapeHtml(p)}</p>`)
        .join('');
    }

    // 3. Update Bottom Navigation Counter ("01 / 05")
    if (this.pageCounter) {
      this.pageCounter.textContent = `${currentNumStr} / ${totalNumStr}`;
    }

    // Nav Buttons Disabled States
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentPageIndex === 0;
    }

    if (this.nextBtn) {
      // Prevents automatic looping past page 5
      this.nextBtn.disabled = this.currentPageIndex === this.letters.length - 1;
    }
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
