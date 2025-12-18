import { Song } from '../types/music';

export function setupMediaSession(
  song: Song | null,
  onPlay: () => void,
  onPause: () => void,
  onNext: () => void,
  onPrevious: () => void,
  onSeek: (seekTime: number) => void
) {
  if (!('mediaSession' in navigator)) {
    return; // Media Session API not supported
  }

  const mediaSession = navigator.mediaSession;

  if (song) {
    // Set metadata for lock screen
    mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album,
      artwork: [
        { src: song.cover, sizes: '96x96', type: 'image/png' },
        { src: song.cover, sizes: '128x128', type: 'image/png' },
        { src: song.cover, sizes: '192x192', type: 'image/png' },
        { src: song.cover, sizes: '256x256', type: 'image/png' },
        { src: song.cover, sizes: '384x384', type: 'image/png' },
        { src: song.cover, sizes: '512x512', type: 'image/png' },
      ],
    });

    // Set up action handlers
    mediaSession.setActionHandler('play', () => {
      onPlay();
    });

    mediaSession.setActionHandler('pause', () => {
      onPause();
    });

    mediaSession.setActionHandler('previoustrack', () => {
      onPrevious();
    });

    mediaSession.setActionHandler('nexttrack', () => {
      onNext();
    });

    mediaSession.setActionHandler('seekbackward', (details) => {
      const seekTime = details.seekOffset || 10;
      onSeek(-seekTime);
    });

    mediaSession.setActionHandler('seekforward', (details) => {
      const seekTime = details.seekOffset || 10;
      onSeek(seekTime);
    });

    mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        // seekto provides absolute time, pass it as a large number to indicate absolute
        // We'll use 1000+ as a flag for absolute time
        onSeek(details.seekTime + 10000);
      }
    });
  } else {
    // Clear metadata when no song
    mediaSession.metadata = null;
  }
}

export function updateMediaSessionPlaybackState(
  isPlaying: boolean,
  currentTime: number,
  duration: number
) {
  if (!('mediaSession' in navigator)) {
    return;
  }

  const mediaSession = navigator.mediaSession;

  // Update playback state
  if (isPlaying) {
    mediaSession.playbackState = 'playing';
  } else {
    mediaSession.playbackState = 'paused';
  }

  // Update position state for lock screen progress
  if ('setPositionState' in mediaSession) {
    try {
      mediaSession.setPositionState({
        duration: duration || 0,
        playbackRate: 1.0,
        position: currentTime || 0,
      });
    } catch (error) {
      // Some browsers don't support setPositionState
      // This is okay, the controls will still work
    }
  }
}

