import { useMusic } from '../context/MusicContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Repeat1,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../utils/formatTime';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';

export default function Player() {
  const {
    state,
    togglePlayPause,
    nextSong,
    previousSong,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    seekTo,
  } = useMusic();

  if (!state.currentSong) {
    return null;
  }

  const progress = state.currentSong.duration
    ? (state.currentTime / state.currentSong.duration) * 100
    : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * state.currentSong!.duration;
    seekTo(newTime);
  };

  const handleProgressTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * state.currentSong!.duration;
    seekTo(newTime);
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 glass-strong border-t border-white/20 z-50"
      style={{ 
        bottom: 'env(safe-area-inset-bottom, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div className="max-w-7xl mx-auto px-2 md:px-6 py-2 md:py-4">
        {/* Mobile Layout - Stacked */}
        <div className="md:hidden space-y-3">
          {/* Top row: Song info and volume */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.img
                key={state.currentSong.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={state.currentSong.cover}
                alt={state.currentSong.title}
                className="w-12 h-12 rounded-lg object-cover shadow-lg flex-shrink-0"
              />
            </AnimatePresence>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate text-sm">
                {state.currentSong.title}
              </h3>
              <p className="text-xs text-gray-400 truncate">
                {state.currentSong.artist}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full text-gray-400 active:text-white transition-all touch-manipulation"
                aria-label={state.isMuted ? 'Unmute' : 'Mute'}
              >
                {state.isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.isMuted ? 0 : state.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500 touch-none"
                aria-label="Volume"
              />
            </div>
          </div>
          
          {/* Middle row: Controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-all ${
                state.shuffle
                  ? 'text-primary-400 bg-primary-500/20'
                  : 'text-gray-400'
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              onClick={previousSong}
              className="p-2 rounded-full text-white active:bg-white/10 transition-all"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                togglePlayPause();
              }}
              className="p-3 rounded-full bg-primary-500 text-white active:bg-primary-600 transition-all shadow-lg touch-manipulation"
              aria-label={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>
            <button
              onClick={nextSong}
              className="p-2 rounded-full text-white active:bg-white/10 transition-all"
            >
              <SkipForward className="w-6 h-6" />
            </button>
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-all ${
                state.repeat !== 'none'
                  ? 'text-primary-400 bg-primary-500/20'
                  : 'text-gray-400'
              }`}
            >
              {state.repeat === 'one' ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Bottom row: Progress bar */}
          <div className="flex items-center gap-2 w-full px-1">
            <span className="text-xs text-gray-400 w-10 text-right flex-shrink-0">
              {formatTime(state.currentTime)}
            </span>
            <div
              className="flex-1 h-1.5 bg-gray-700 rounded-full cursor-pointer group relative touch-none"
              onClick={handleProgressClick}
              onTouchStart={handleProgressTouch}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full relative"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-10 flex-shrink-0">
              {formatTime(state.currentSong.duration)}
            </span>
          </div>
        </div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={state.currentSong.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={state.currentSong.cover}
                alt={state.currentSong.title}
                className="w-16 h-16 rounded-lg object-cover shadow-lg flex-shrink-0"
              />
            </AnimatePresence>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate text-base">
                {state.currentSong.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {state.currentSong.artist}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <LikeButton songId={state.currentSong.id} showCount={true} />
              <ShareButton song={state.currentSong} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl min-w-0">
            <div className="flex items-center gap-4 w-full justify-center">
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-all ${
                  state.shuffle
                    ? 'text-primary-400 bg-primary-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={previousSong}
                className="p-2 rounded-full text-white hover:bg-white/10 transition-all"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg"
                aria-label={state.isPlaying ? 'Pause' : 'Play'}
              >
                {state.isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>

              <button
                onClick={nextSong}
                className="p-2 rounded-full text-white hover:bg-white/10 transition-all"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-full transition-all ${
                  state.repeat !== 'none'
                    ? 'text-primary-400 bg-primary-500/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {state.repeat === 'one' ? (
                  <Repeat1 className="w-5 h-5" />
                ) : (
                  <Repeat className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 w-full px-2">
              <span className="text-xs text-gray-400 w-12 text-right flex-shrink-0">
                {formatTime(state.currentTime)}
              </span>
              <div
                className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer group relative"
                onClick={handleProgressClick}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>
              <span className="text-xs text-gray-400 w-12 flex-shrink-0">
                {formatTime(state.currentSong.duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-all"
              aria-label={state.isMuted ? 'Unmute' : 'Mute'}
            >
              {state.isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-2 w-32">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.isMuted ? 0 : state.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-xs text-gray-400 w-10">
                {Math.round((state.isMuted ? 0 : state.volume) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

