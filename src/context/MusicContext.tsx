import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import { Song, Playlist, PlayerState } from '../types/music';
import { setupMediaSession, updateMediaSessionPlaybackState } from '../utils/mediaSession';

interface MusicContextType {
  state: PlayerState;
  playlists: Playlist[];
  allSongs: Song[];
  isLoading: boolean;
  dispatch: React.Dispatch<MusicAction>;
  audioRef: React.RefObject<HTMLAudioElement>;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  seekTo: (time: number) => void;
  addToQueue: (song: Song) => void;
  createPlaylist: (name: string, description?: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  refreshSongs: () => void;
}

type MusicAction =
  | { type: 'PLAY_SONG'; payload: Song }
  | { type: 'TOGGLE_PLAY_PAUSE' }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'NEXT_SONG' }
  | { type: 'PREVIOUS_SONG' }
  | { type: 'SET_QUEUE'; payload: Song[] }
  | { type: 'ADD_TO_QUEUE'; payload: Song }
  | { type: 'CREATE_PLAYLIST'; payload: Playlist }
  | { type: 'ADD_SONG_TO_PLAYLIST'; payload: { playlistId: string; song: Song } }
  | { type: 'REMOVE_SONG_FROM_PLAYLIST'; payload: { playlistId: string; songId: string } }
  | { type: 'DELETE_PLAYLIST'; payload: string };

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  volume: 0.7,
  isMuted: false,
  repeat: 'none',
  shuffle: false,
  queue: [],
  currentIndex: -1,
};

function musicReducer(state: PlayerState, action: MusicAction): PlayerState {
  switch (action.type) {
    case 'PLAY_SONG':
      const playIndex = state.queue.findIndex(s => s.id === action.payload.id);
      return {
        ...state,
        currentSong: action.payload,
        isPlaying: true,
        currentTime: 0,
        currentIndex: playIndex >= 0 ? playIndex : state.currentIndex,
      };
    case 'TOGGLE_PLAY_PAUSE':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: action.payload === 0 };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'TOGGLE_REPEAT':
      const repeatStates: ('none' | 'one' | 'all')[] = ['none', 'all', 'one'];
      const currentRepeatIndex = repeatStates.indexOf(state.repeat);
      const nextRepeat = repeatStates[(currentRepeatIndex + 1) % repeatStates.length];
      return { ...state, repeat: nextRepeat };
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };
    case 'NEXT_SONG':
      if (state.queue.length === 0) return state;
      let nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeat === 'all') nextIndex = 0;
        else return { ...state, isPlaying: false, currentSong: null };
      }
      return {
        ...state,
        currentSong: state.queue[nextIndex],
        currentIndex: nextIndex,
        currentTime: 0,
        isPlaying: true,
      };
    case 'PREVIOUS_SONG':
      if (state.queue.length === 0) return state;
      let prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        if (state.repeat === 'all') prevIndex = state.queue.length - 1;
        else return state;
      }
      return {
        ...state,
        currentSong: state.queue[prevIndex],
        currentIndex: prevIndex,
        currentTime: 0,
        isPlaying: true,
      };
    case 'SET_QUEUE':
      const songId = state.currentSong?.id;
      const newIndex = songId ? action.payload.findIndex(s => s.id === songId) : 0;
      return {
        ...state,
        queue: action.payload,
        currentIndex: newIndex >= 0 ? newIndex : (action.payload.length > 0 ? 0 : -1),
      };
    case 'ADD_TO_QUEUE':
      // Prevent adding duplicate songs to queue
      const isAlreadyInQueue = state.queue.some(s => s.id === action.payload.id);
      if (isAlreadyInQueue) {
        return state;
      }
      return {
        ...state,
        queue: [...state.queue, action.payload],
      };
    default:
      return state;
  }
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
  const [allSongs, setAllSongs] = React.useState<Song[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSongIdRef = useRef<string | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  // Load songs from JSON file
  const loadSongs = async () => {
    setIsLoading(true);
    try {
      // Try multiple paths in case of deployment issues
      const paths = [
        '/songs.json?t=' + Date.now(),
        './songs.json?t=' + Date.now(),
        '/public/songs.json?t=' + Date.now(),
      ];
      
      let songs = [];
      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            songs = await response.json();
            if (Array.isArray(songs) && songs.length > 0) {
              // Cache songs in localStorage as backup
              try {
                localStorage.setItem('cached_songs', JSON.stringify(songs));
              } catch {
                // Ignore localStorage errors
              }
              break;
            }
          }
        } catch (err) {
          // Try next path
          continue;
        }
      }
      
      if (Array.isArray(songs) && songs.length > 0) {
        setAllSongs(songs);
      } else {
        // Fallback: try to load from localStorage if available
        try {
          const cached = localStorage.getItem('cached_songs');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setAllSongs(parsed);
            } else {
              setAllSongs([]);
            }
          } else {
            setAllSongs([]);
          }
        } catch {
          setAllSongs([]);
        }
      }
    } catch (error) {
      // Try localStorage fallback
      try {
        const cached = localStorage.getItem('cached_songs');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllSongs(parsed);
          } else {
            setAllSongs([]);
          }
        } else {
          setAllSongs([]);
        }
      } catch {
        setAllSongs([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const refreshSongs = () => {
    loadSongs();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentSong) return;

    const updateTime = () => {
      if (!audio || audio.paused) return;
      const currentTime = audio.currentTime;
      if (!isNaN(currentTime) && isFinite(currentTime)) {
        dispatch({ type: 'SET_CURRENT_TIME', payload: currentTime });
        
        // Update Media Session position for lock screen
        if (state.currentSong && 'mediaSession' in navigator) {
          updateMediaSessionPlaybackState(
            state.isPlaying,
            currentTime,
            state.currentSong.duration
          );
        }
      }
    };

    const handleEnded = () => {
      if (state.repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        dispatch({ type: 'NEXT_SONG' });
      }
    };

    // Use timeupdate event (fires every ~250ms)
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    
    // Also use a more frequent interval for smoother updates on mobile
    const interval = setInterval(() => {
      if (audio && !audio.paused && state.isPlaying) {
        updateTime();
      }
    }, 100); // Update every 100ms for smoother progress bar

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      clearInterval(interval);
    };
  }, [state.repeat, state.isPlaying, state.currentSong, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentSong) return;

    const songId = state.currentSong.id;
    currentSongIdRef.current = songId;

    // Stop and reset audio before loading new song to prevent overlap
    audio.pause();
    audio.currentTime = 0;
    
    // Cancel any pending play promise
    if (playPromiseRef.current) {
      playPromiseRef.current.catch(() => {});
      playPromiseRef.current = null;
    }

    // Ensure the URL is properly formatted
    const audioUrl = state.currentSong.audioUrl;
    
    // When song changes, reload the audio source and wait for it to be ready
    const handleCanPlay = () => {
      // Only play if this is still the current song (prevent race conditions)
      if (currentSongIdRef.current === songId && state.isPlaying && audio) {
        // On mobile, ensure audio is ready before playing
        if (audio.readyState >= 2) {
          playPromiseRef.current = audio.play();
          if (playPromiseRef.current !== undefined) {
            playPromiseRef.current.catch(() => {
              // On mobile, play might fail if not triggered by user interaction
              // This is okay - user will need to click play button
            }).finally(() => {
              playPromiseRef.current = null;
            });
          }
        }
      }
    };

    const handleLoadedData = () => {
      // Only play if this is still the current song (prevent race conditions)
      if (currentSongIdRef.current === songId && state.isPlaying && audio && audio.readyState >= 2) {
        playPromiseRef.current = audio.play();
        if (playPromiseRef.current !== undefined) {
          playPromiseRef.current.catch(() => {
            // On mobile, play might fail if not triggered by user interaction
            // This is okay - user will need to click play button
          }).finally(() => {
            playPromiseRef.current = null;
          });
        }
      }
    };
    
    // Handle when audio can start playing (mobile-specific)
    const handleCanPlayThrough = () => {
      if (currentSongIdRef.current === songId && state.isPlaying && audio) {
        playPromiseRef.current = audio.play();
        if (playPromiseRef.current !== undefined) {
          playPromiseRef.current.catch(() => {}).finally(() => {
            playPromiseRef.current = null;
          });
        }
      }
    };

    const handleError = () => {
      // Try to reload once more on error, but only if still the current song
      setTimeout(() => {
        if (audio && currentSongIdRef.current === songId) {
          audio.load();
        }
      }, 100);
    };

    // Remove any existing listeners first to prevent duplicates
    audio.removeEventListener('canplay', handleCanPlay);
    audio.removeEventListener('loadeddata', handleLoadedData);
    audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    audio.removeEventListener('error', handleError);
    
    // Add new listeners
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    
    // Force set the source - this ensures special characters are handled correctly
    audio.src = audioUrl;
    // Small delay to ensure src is set before loading
    setTimeout(() => {
      if (audio && currentSongIdRef.current === songId) {
        audio.load();
      }
    }, 10);

    // Set up Media Session for lock screen controls
    if (state.currentSong) {
      setupMediaSession(
        state.currentSong,
        () => {
          if (!state.isPlaying) dispatch({ type: 'TOGGLE_PLAY_PAUSE' });
        },
        () => {
          if (state.isPlaying) dispatch({ type: 'TOGGLE_PLAY_PAUSE' });
        },
        () => {
          if (state.shuffle && state.queue.length > 1) {
            const availableSongs = state.queue.filter((_, idx) => idx !== state.currentIndex);
            if (availableSongs.length > 0) {
              const randomIndex = Math.floor(Math.random() * availableSongs.length);
              const randomSong = availableSongs[randomIndex];
              dispatch({ type: 'PLAY_SONG', payload: randomSong });
            }
          } else {
            dispatch({ type: 'NEXT_SONG' });
          }
        },
        () => dispatch({ type: 'PREVIOUS_SONG' }),
        (seekTime: number) => {
          if (audioRef.current && state.currentSong) {
            // If seekTime is > 10000, it's an absolute time (from seekto)
            // Otherwise it's a relative change (from seekforward/seekbackward)
            let newTime: number;
            if (seekTime > 10000) {
              newTime = seekTime - 10000; // Absolute time (remove flag)
            } else {
              newTime = audioRef.current.currentTime + seekTime; // Relative change
            }
            newTime = Math.max(0, Math.min(state.currentSong.duration, newTime));
            audioRef.current.currentTime = newTime;
            dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
          }
        }
      );
    }

        return () => {
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('loadeddata', handleLoadedData);
          audio.removeEventListener('canplaythrough', handleCanPlayThrough);
          audio.removeEventListener('error', handleError);
        };
  }, [state.currentSong, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying && state.currentSong) {
      // Only play if this is still the current song (prevent race conditions)
      const songId = state.currentSong.id;
      if (currentSongIdRef.current !== songId) {
        return; // Song has changed, don't play
      }

      // Update Media Session state
      updateMediaSessionPlaybackState(
        true,
        state.currentTime,
        state.currentSong.duration
      );

      // Only play if audio is ready and still matches current song
      if (audio.readyState >= 2 && currentSongIdRef.current === songId) {
        // Cancel any pending play promise
        if (playPromiseRef.current) {
          playPromiseRef.current.catch(() => {});
          playPromiseRef.current = null;
        }
        
        playPromiseRef.current = audio.play();
        if (playPromiseRef.current !== undefined) {
          playPromiseRef.current.catch(() => {
            // Silently handle play errors
          }).finally(() => {
            playPromiseRef.current = null;
          });
        }
      } else if (currentSongIdRef.current === songId) {
        // Wait for audio to be ready
        const handleCanPlay = () => {
          if (currentSongIdRef.current === songId && audio) {
            if (playPromiseRef.current) {
              playPromiseRef.current.catch(() => {});
              playPromiseRef.current = null;
            }
            playPromiseRef.current = audio.play();
            if (playPromiseRef.current !== undefined) {
              playPromiseRef.current.catch(() => {}).finally(() => {
                playPromiseRef.current = null;
              });
            }
          }
          audio.removeEventListener('canplay', handleCanPlay);
        };
        audio.addEventListener('canplay', handleCanPlay);
      }
    } else {
      // Update Media Session state
      if (state.currentSong) {
        updateMediaSessionPlaybackState(
          false,
          state.currentTime,
          state.currentSong.duration
        );
      }
      // Cancel any pending play promise
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }
      audio.pause();
    }
  }, [state.isPlaying, state.currentSong, state.currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = state.isMuted ? 0 : state.volume;
    audio.muted = state.isMuted;
  }, [state.volume, state.isMuted]);

  const playSong = (song: Song) => {
    // Prevent playing the same song if it's already playing
    if (state.currentSong?.id === song.id && state.isPlaying) {
      return;
    }
    
    // Track play count
    import('../utils/storage').then(({ incrementPlayCount, incrementTotalPlays }) => {
      incrementPlayCount(song.id);
      incrementTotalPlays().catch(() => {
        // Silently handle API errors
      });
    });
    
    // Stop any currently playing audio before switching
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    const queueIndex = state.queue.findIndex(s => s.id === song.id);
    if (queueIndex !== -1 && state.queue.length > 0) {
      // Song is already in queue, just play it without modifying queue
      dispatch({ type: 'PLAY_SONG', payload: song });
    } else {
      // Create fresh queue: selected song first, then all other songs
      // This prevents duplicates by always starting fresh
      const newQueue = [song, ...allSongs.filter((s: Song) => s.id !== song.id)];
      dispatch({ type: 'SET_QUEUE', payload: newQueue });
      dispatch({ type: 'PLAY_SONG', payload: song });
    }
    
    // On mobile, we need to trigger play directly from user interaction
    // Use setTimeout to ensure state has updated and audio src is set
    setTimeout(() => {
      const currentAudio = audioRef.current;
      if (currentAudio && currentAudio.src && currentSongIdRef.current === song.id) {
        // Try to play directly - this works better on mobile
        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Play failed, but that's okay - useEffect will handle it
          });
        }
      }
    }, 100);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    const wasPlaying = state.isPlaying;
    
    // Dispatch the state change first
    dispatch({ type: 'TOGGLE_PLAY_PAUSE' });
    
    // On mobile, directly trigger play/pause from user interaction
    if (audio && state.currentSong) {
      if (!wasPlaying) {
        // User wants to play - directly call play() from user interaction
        // This is required for mobile browsers
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If play fails, revert state
            dispatch({ type: 'TOGGLE_PLAY_PAUSE' });
          });
        }
      } else {
        // User wants to pause
        audio.pause();
      }
    }
  };

  const nextSong = () => {
    // Aggressively stop current audio before moving to next song
    const audio = audioRef.current;
    if (audio) {
      // Cancel any pending play promises first
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }
      // Immediately pause and reset
      audio.pause();
      audio.currentTime = 0;
      // Force load to ensure complete stop
      audio.load();
    }
    
    // Clear current song ID immediately to prevent old song from playing
    // This ensures event handlers won't play the old song
    if (state.currentSong) {
      currentSongIdRef.current = null;
    }
    
    if (state.shuffle && state.queue.length > 1) {
      const availableSongs = state.queue.filter((_, idx) => idx !== state.currentIndex);
      if (availableSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSongs.length);
        const randomSong = availableSongs[randomIndex];
        dispatch({ type: 'PLAY_SONG', payload: randomSong });
      }
    } else {
      dispatch({ type: 'NEXT_SONG' });
    }
  };

  const previousSong = () => {
    // Aggressively stop current audio before moving to previous song
    const audio = audioRef.current;
    if (audio) {
      // Cancel any pending play promises first
      if (playPromiseRef.current) {
        playPromiseRef.current.catch(() => {});
        playPromiseRef.current = null;
      }
      // Immediately pause and reset
      audio.pause();
      audio.currentTime = 0;
      // Force load to ensure complete stop
      audio.load();
    }
    
    // Clear current song ID immediately to prevent old song from playing
    // This ensures event handlers won't play the old song
    if (state.currentSong) {
      currentSongIdRef.current = null;
    }
    
    dispatch({ type: 'PREVIOUS_SONG' });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_MUTE' });
  };

  const toggleRepeat = () => {
    dispatch({ type: 'TOGGLE_REPEAT' });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
    }
  };

  const addToQueue = (song: Song) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: song });
  };

  const createPlaylist = (name: string, description?: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      songs: [],
      createdAt: new Date(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prev =>
      prev.map(playlist =>
        playlist.id === playlistId
          ? { ...playlist, songs: [...playlist.songs, song] }
          : playlist
      )
    );
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev =>
      prev.map(playlist =>
        playlist.id === playlistId
          ? { ...playlist, songs: playlist.songs.filter((s: Song) => s.id !== songId) }
          : playlist
      )
    );
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  return (
    <MusicContext.Provider
      value={{
        state,
        playlists,
        allSongs,
        isLoading,
        dispatch,
        audioRef,
        playSong,
        togglePlayPause,
        nextSong,
        previousSong,
        setVolume,
        toggleMute,
        toggleRepeat,
        toggleShuffle,
        seekTo,
        addToQueue,
        createPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        deletePlaylist,
        refreshSongs,
      }}
    >
      {children}
      <audio
        key={state.currentSong?.id || 'no-song'}
        ref={audioRef}
        src={state.currentSong?.audioUrl || ''}
        preload="metadata"
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}

