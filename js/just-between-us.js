/**
 * "JUST BETWEEN US ♡" — INTERACTIVE SECRET NOTES CONTROLLER
 */

const elieSecretNotes = [
  {
    id: "promise",
    tabLabel: "a quiet promise",
    title: "my promise to you",
    body: `I promise to always listen whenever you need someone to hear you, to cherish our quiet moments just as much as the golden ones, and to never let any amount of distance make you feel alone in this world.`,
    motif: "✦ ♡ ✦"
  },
  {
    id: "memory",
    tabLabel: "favorite memory",
    title: "the moments I replay",
    body: `My favorite memories are the unhurried late-night conversations when the rest of the world fades into silence, and it’s just the comfort of your voice making everything feel peaceful and completely right.`,
    motif: "🌸 ✨ 🌸"
  },
  {
    id: "love",
    tabLabel: "what I love most",
    title: "the things that make you, you",
    body: `I love the gentle grace in the way you care for people, your genuine smile, the warmth in your laughter, and how effortlessly you turn an ordinary day into something soft and memorable.`,
    motif: "💖 ♡ 💖"
  },
  {
    id: "wish",
    tabLabel: "secret wish",
    title: "maybe",
    body: `Somehow, somewhere down the line,
life gives us another chance..`,
    motif: "✦ ✨ ✦"
  }
];

class JustBetweenUsController {
  constructor() {
    this.notes = elieSecretNotes;
    this.currentNoteIndex = 0;

    // DOM Elements
    this.tabsContainer = document.getElementById('between-us-tabs-container');
    this.noteTitle = document.getElementById('between-us-note-title');
    this.noteBody = document.getElementById('between-us-note-body');
    this.noteMotif = document.getElementById('between-us-note-motif');
    this.noteBox = document.getElementById('between-us-note-box');

    this.init();
  }

  init() {
    this.renderTabs();
    this.renderNote(0);
  }

  renderTabs() {
    if (!this.tabsContainer) return;
    this.tabsContainer.innerHTML = '';

    this.notes.forEach((note, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `between-us-tab-btn ${index === this.currentNoteIndex ? 'active' : ''}`;
      btn.textContent = note.tabLabel;
      btn.addEventListener('click', () => this.switchNote(index));
      this.tabsContainer.appendChild(btn);
    });
  }

  switchNote(index) {
    if (index === this.currentNoteIndex || index < 0 || index >= this.notes.length) return;

    if (this.noteBox) {
      this.noteBox.style.opacity = '0';
      this.noteBox.style.transform = 'translateY(8px)';
    }

    setTimeout(() => {
      this.currentNoteIndex = index;
      this.renderNote(index);

      // Update active tab buttons
      const tabBtns = this.tabsContainer ? this.tabsContainer.querySelectorAll('.between-us-tab-btn') : [];
      tabBtns.forEach((btn, idx) => {
        if (idx === index) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      if (this.noteBox) {
        this.noteBox.style.opacity = '1';
        this.noteBox.style.transform = 'translateY(0)';
      }
    }, 200);
  }

  renderNote(index) {
    const note = this.notes[index];
    if (!note) return;

    if (this.noteTitle) this.noteTitle.textContent = note.title;
    if (this.noteBody) this.noteBody.textContent = note.body;
    if (this.noteMotif) this.noteMotif.textContent = note.motif;
  }
}

// Global initialization helper
window.JustBetweenUsController = JustBetweenUsController;
