/**
AUDIO PLAYER ENGINE & INTERACTIVE PLAYLIST
 */

// Global state container across the session
if (!window.__ROMANTIC_AUDIO_STATE__) {
  window.__ROMANTIC_AUDIO_STATE__ = {
    audio: new Audio(),
    playlist: [
      {
        id: 'default-1',
        title: 'Intertwine',
        artist: 'Over October',
        src: 'assets/audio/intertwine.mp3',
        cover: 'assets/images/intertwine.jpg',
        favorite: true
      },
      {
        id: 'default-2',
        title: 'Sinderela',
        artist: 'Cup of Joe',
        src: 'assets/audio/sinderela.mp3',
        cover: 'assets/images/sinderela.jpg',
        favorite: false
      },
      {
        id: 'default-3',
        title: 'Kanelang mata',
        artist: 'Cup of Joe',
        src: 'assets/audio/kanelang-mata.mp3',
        cover: 'assets/images/kanelang-mata.jpg',
        favorite: false
      },
      {
        id: 'default-4',
        title: 'Oh irog',
        artist: '12th Street',
        src: 'assets/audio/oh-irog.mp3',
        cover: 'assets/images/oh-irog.jpg',
        favorite: false
      },
      {
        id: 'default-5',
        title: 'Panaginip (Stripped Version)',
        artist: 'Nicole',
        src: 'assets/audio/panaginip-stripped.mp3',
        cover: 'assets/images/panaginip.jpg',
        favorite: false
      },
      {
        id: 'default-6',
        title: 'Someday',
        artist: 'Ridleys',
        src: 'assets/audio/someday.mp3',
        cover: 'assets/images/someday.jpg',
        favorite: false
      }
    ],
    currentIndex: 0,
    isPlaylistOpen: true,
    boundGlobalEvents: false
  };
}

const audioState = window.__ROMANTIC_AUDIO_STATE__;

class AudioPlayerController {
  constructor(config) {
    this.config = config || {};
    this.audio = audioState.audio;
    this.hasError = false;

    // UI Elements
    this.domAudio = document.getElementById('audioPlayer');
    this.playerContainer = document.getElementById('romantic-audio-player');
    this.coverImg = document.getElementById('player-cover-img');
    this.songTitle = document.getElementById('player-song-title');
    this.artistName = document.getElementById('player-artist-name');
    this.favoriteBtn = document.getElementById('player-favorite-btn');
    this.playBtn = document.getElementById('player-play-btn');
    this.statusBadge = document.getElementById('song-badge-status') || document.getElementById('song-badge-play-btn');
    this.progressBar = document.getElementById('player-progress');
    this.timeCurrent = document.getElementById('player-time-current');
    this.timeDuration = document.getElementById('player-time-duration');
    
    // Playlist UI Elements
    this.playlistToggleBtn = document.getElementById('playlist-toggle-btn');
    this.playlistCard = document.getElementById('playlist-card');
    this.playlistItemsContainer = document.getElementById('playlist-items');
    this.addSongBtn = document.getElementById('add-song-btn');
    this.audioFileInput = document.getElementById('audio-file-input');
  }

  get currentSong() {
    return audioState.playlist[audioState.currentIndex] || audioState.playlist[0];
  }

  get isPlaying() {
    return !this.audio.paused && !this.audio.ended && this.audio.readyState > 2;
  }

  init() {
    // If an in-DOM audio element exists, sync it
    if (this.domAudio && this.domAudio !== this.audio) {
      // Use single persistent audio instance
    }

    // Set initial audio source if none set
    if (!this.audio.src || this.audio.src === '' || this.audio.src === window.location.href) {
      this.loadSong(audioState.currentIndex, false);
    } else {
      this.syncPlayerUI();
    }

    // Attach audio element event listeners once globally
    if (!audioState.boundGlobalEvents) {
      audioState.boundGlobalEvents = true;

      this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
      this.audio.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
      this.audio.addEventListener('play', () => this.onPlaybackStateChange());
      this.audio.addEventListener('pause', () => this.onPlaybackStateChange());
      this.audio.addEventListener('ended', () => this.onSongEnded());
      this.audio.addEventListener('error', (e) => this.onAudioError(e));
    }

    this.bindControls();
    this.renderPlaylist();
    this.syncPlaylistToggleUI();
    this.onTimeUpdate();
  }

  bindControls() {
    // 1. Play / Pause Button in main player
    if (this.playBtn) {
      this.playBtn.onclick = (e) => {
        e.preventDefault();
        this.togglePlay();
      };
    }

    // 2. Main Player Favorite Heart Button
    if (this.favoriteBtn) {
      this.favoriteBtn.onclick = (e) => {
        e.preventDefault();
        const song = this.currentSong;
        if (song) {
          song.favorite = !song.favorite;
          this.updateFavoriteUI();
          this.renderPlaylist();
        }
      };
    }

    // 4. Seeking on Progress Slider
    if (this.progressBar) {
      const handleSeek = (e) => {
        const val = parseFloat(e.target.value);
        if (this.audio.duration && !isNaN(this.audio.duration)) {
          const seekTime = (val / 100) * this.audio.duration;
          this.audio.currentTime = seekTime;
        }
        this.progressBar.style.setProperty('--progress', `${val}%`);
      };

      this.progressBar.oninput = handleSeek;
      this.progressBar.onchange = handleSeek;
    }

    // 5. Playlist Expand/Collapse Toggle Button
    if (this.playlistToggleBtn) {
      this.playlistToggleBtn.onclick = (e) => {
        e.preventDefault();
        audioState.isPlaylistOpen = !audioState.isPlaylistOpen;
        this.syncPlaylistToggleUI();
      };
    }

    // 6. "+ Add Songs" File Upload Handler
    if (this.addSongBtn && this.audioFileInput) {
      this.addSongBtn.onclick = (e) => {
        e.preventDefault();
        this.audioFileInput.click();
      };

      this.audioFileInput.onchange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        let firstNewIndex = -1;

        files.forEach((file) => {
          const audioUrl = URL.createObjectURL(file);
          // Parse title from file name without extension
          const cleanTitle = file.name.replace(/\.[^/.]+$/, '').trim() || 'Untitled Song';
          const newSong = {
            id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            title: cleanTitle,
            artist: 'Your song',
            src: audioUrl,
            cover: 'assets/song-cover.svg',
            isLocal: true,
            favorite: false
          };

          audioState.playlist.push(newSong);
          if (firstNewIndex === -1) {
            firstNewIndex = audioState.playlist.length - 1;
          }
        });

        this.renderPlaylist();

        // Immediately select and play the first newly added song
        if (firstNewIndex !== -1) {
          this.selectSong(firstNewIndex, true);
        }

        // Reset file input so same file can be added again if desired
        this.audioFileInput.value = '';
      };
    }
  }

  loadSong(index, shouldPlay = false) {
    if (index < 0 || index >= audioState.playlist.length) return;

    audioState.currentIndex = index;
    const song = this.currentSong;
    this.hasError = false;

    if (this.audio.src !== song.src) {
      this.audio.src = song.src;
      this.audio.currentTime = 0;
    }

    this.syncPlayerUI();
    this.renderPlaylist();

    if (shouldPlay) {
      this.play();
    }
  }

  selectSong(index, shouldPlay = true) {
    const wasPlaying = !this.audio.paused;
    this.loadSong(index, shouldPlay || wasPlaying);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.hasError) return;

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.onPlaybackStateChange();
        })
        .catch((err) => {
          console.warn("Audio play prevented or file missing:", err);
          this.onPlaybackStateChange();
        });
    }
  }

  pause() {
    this.audio.pause();
    this.onPlaybackStateChange();
  }

  nextSong() {
    const nextIdx = (audioState.currentIndex + 1) % audioState.playlist.length;
    this.selectSong(nextIdx, true);
  }

  previousSong() {
    const prevIdx = (audioState.currentIndex - 1 + audioState.playlist.length) % audioState.playlist.length;
    this.selectSong(prevIdx, true);
  }

  onSongEnded() {
    this.nextSong();
  }

  onAudioError(e) {
    console.warn("Audio load error for song:", this.currentSong);
    this.hasError = true;
    if (this.timeDuration) {
      this.timeDuration.textContent = "file notice ♡";
    }
    this.onPlaybackStateChange();
  }

  onTimeUpdate() {
    if (!this.audio.duration || isNaN(this.audio.duration)) return;

    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    if (this.progressBar) {
      this.progressBar.value = percent;
      this.progressBar.style.setProperty('--progress', `${percent}%`);
    }

    if (this.timeCurrent) {
      this.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
    }
    if (this.timeDuration && !this.hasError) {
      this.timeDuration.textContent = this.formatTime(this.audio.duration);
    }
  }

  onMetadataLoaded() {
    this.hasError = false;
    if (this.timeDuration && this.audio.duration && !isNaN(this.audio.duration)) {
      this.timeDuration.textContent = this.formatTime(this.audio.duration);
    }
    this.onTimeUpdate();
  }

  onPlaybackStateChange() {
    this.syncPlayerUI();
    this.updatePlaylistActiveIndicators();
  }

  syncPlayerUI() {
    const song = this.currentSong;
    if (!song) return;

    if (this.coverImg) {
      this.coverImg.src = song.cover || 'assets/song-cover.svg';
    }
    if (this.songTitle) {
      this.songTitle.textContent = song.title;
    }
    if (this.artistName) {
      this.artistName.textContent = song.artist.includes('♡') ? song.artist : `${song.artist} ♡`;
    }

    const playing = !this.audio.paused && !this.audio.ended;

    if (this.playerContainer) {
      this.playerContainer.classList.toggle('is-playing', playing);
    }

    if (this.playBtn) {
      this.playBtn.innerHTML = `<span class="player-btn-icon ${playing ? 'icon-pause' : 'icon-play'}">${playing ? 'Ⅱ' : '▶'}</span>`;
    }

    if (this.statusBadge) {
      this.statusBadge.textContent = playing ? '♡ PLAYING MUSIC' : (this.audio.currentTime > 0 ? '♡ MUSIC PAUSED' : '♡ PRESS PLAY');
    }

    this.updateFavoriteUI();
  }

  updateFavoriteUI() {
    const song = this.currentSong;
    if (this.favoriteBtn && song) {
      this.favoriteBtn.innerHTML = `<span class="heart-icon">${song.favorite ? '♥' : '♡'}</span>`;
      this.favoriteBtn.classList.toggle('is-favorite', !!song.favorite);
    }
  }

  syncPlaylistToggleUI() {
    if (!this.playlistCard) return;

    if (audioState.isPlaylistOpen) {
      this.playlistCard.classList.remove('collapsed');
      this.playlistCard.classList.add('expanded');
      if (this.playlistChevron) this.playlistChevron.style.transform = 'rotate(180deg)';
      if (this.playlistToggleBtn) this.playlistToggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      this.playlistCard.classList.remove('expanded');
      this.playlistCard.classList.add('collapsed');
      if (this.playlistChevron) this.playlistChevron.style.transform = 'rotate(0deg)';
      if (this.playlistToggleBtn) this.playlistToggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  renderPlaylist() {
    if (!this.playlistItemsContainer) return;

    this.playlistItemsContainer.innerHTML = '';

    audioState.playlist.forEach((song, index) => {
      const isSelected = index === audioState.currentIndex;
      const isPlayingCurrent = isSelected && !this.audio.paused && !this.audio.ended;

      const itemEl = document.createElement('div');
      itemEl.className = `playlist-item ${isSelected ? 'selected' : ''}`;
      itemEl.dataset.index = index;

      itemEl.innerHTML = `
        <div class="playlist-item-left">
          <img src="${song.cover || 'assets/song-cover.svg'}" alt="${song.title}" class="playlist-item-thumb">
          <div class="playlist-item-info">
            <div class="playlist-item-title">${this.escapeHtml(song.title)}</div>
            <div class="playlist-item-artist">${this.escapeHtml(song.artist)}</div>
          </div>
        </div>
        <div class="playlist-item-right">
          ${isPlayingCurrent ? `
            <div class="playing-equalizer-bars" title="Playing">
              <span class="eq-bar b1"></span>
              <span class="eq-bar b2"></span>
              <span class="eq-bar b3"></span>
            </div>
          ` : (isSelected ? `
            <div class="playing-equalizer-bars paused" title="Paused">
              <span class="eq-bar b1"></span>
              <span class="eq-bar b2"></span>
              <span class="eq-bar b3"></span>
            </div>
          ` : '')}
          <button class="playlist-item-heart-btn ${song.favorite ? 'is-favorite' : ''}" data-index="${index}" aria-label="Favorite">
            ${song.favorite ? '♥' : '♡'}
          </button>
        </div>
      `;

      // Click to select song
      itemEl.onclick = (e) => {
        // If clicking heart button inside playlist item
        if (e.target.closest('.playlist-item-heart-btn')) {
          e.stopPropagation();
          song.favorite = !song.favorite;
          this.updateFavoriteUI();
          this.renderPlaylist();
          return;
        }

        this.selectSong(index, true);
      };

      this.playlistItemsContainer.appendChild(itemEl);
    });
  }

  updatePlaylistActiveIndicators() {
    const items = this.playlistItemsContainer ? this.playlistItemsContainer.querySelectorAll('.playlist-item') : [];
    items.forEach((item, idx) => {
      const isSelected = idx === audioState.currentIndex;
      const isPlayingCurrent = isSelected && !this.audio.paused && !this.audio.ended;

      item.classList.toggle('selected', isSelected);
      const rightCol = item.querySelector('.playlist-item-right');
      if (rightCol) {
        const existingEq = rightCol.querySelector('.playing-equalizer-bars');
        if (existingEq) existingEq.remove();

        if (isPlayingCurrent) {
          const eqDiv = document.createElement('div');
          eqDiv.className = 'playing-equalizer-bars';
          eqDiv.innerHTML = '<span class="eq-bar b1"></span><span class="eq-bar b2"></span><span class="eq-bar b3"></span>';
          rightCol.insertBefore(eqDiv, rightCol.firstChild);
        } else if (isSelected) {
          const eqDiv = document.createElement('div');
          eqDiv.className = 'playing-equalizer-bars paused';
          eqDiv.innerHTML = '<span class="eq-bar b1"></span><span class="eq-bar b2"></span><span class="eq-bar b3"></span>';
          rightCol.insertBefore(eqDiv, rightCol.firstChild);
        }
      }
    });
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds === null) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
