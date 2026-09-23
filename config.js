/* scrapbook for loml - configuration
 * bright, cute, pastel pink theme */

const siteConfig = {
  // her Name
  herName: "Elie",

  // theme accent color scheme
  theme: {
    primaryBg: "#fff0f5",       // lavender blush / pastel pink bg
    secondaryBg: "#fce7f3",     // blush pink card bg
    cardBg: "rgba(255, 255, 255, 0.92)",
    cardBorder: "rgba(244, 114, 182, 0.4)",
    pinkBlush: "#fce7f3",       // light pink
    pinkBaby: "#fbcfe8",        // baby pink
    pinkRose: "#f472b6",        // rose pink
    pinkAccent: "#ec4899",      // hot pink
    pinkGlow: "rgba(244, 114, 182, 0.35)",
    textDark: "#831843",        // deep rose plum for text contrast
    textMuted: "#9f1239",       // rich rose text
    textSubtle: "#be185d",
    serifFont: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
    scriptFont: "'Caveat', 'Dancing Script', cursive"
  },

  background: {
    bgImage: null,
    overlayColor: "rgba(255, 240, 245, 0.85)",
    particlesEnabled: true,
  },

  // SCREEN 1: INTRO CONFIG
  intro: {
    heading: "about this little thing",
    paragraph1: "I've never been very good at putting everything I feel into words, so I made you somewhere I could put all of it instead.",
    paragraph2: "This little space holds a pink galaxy of 100 love languages, a central heartbeat surprise, and our favorite song.",
    closing: "take your time. there's no rush. every little thing here was made with you in mind. ♡",
    proceedButtonText: "okay, come in →"
  },

  // SCREEN 3: SONG CONFIG
  song: {
    pageTitle: "our song",
    badgeText: "♡ PRESS PLAY",
    mainHeading: "this song always\nbrings me back to you",
    subtitle: "press play, close your eyes — I'll be there too.",
    audioSrc: "./assets/audio/intertwine.mp3",
    coverImg: "./assets/song-cover.svg",
    songTitle: "Intertwine",
    artistName: "Over October ♡",
    caption: "Play this song while viewing ♡"
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = siteConfig;
}
