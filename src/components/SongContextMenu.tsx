import { Share2, Play } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Song } from '../types/music';
import { useMusic } from '../context/MusicContext';
import { motion, AnimatePresence } from 'framer-motion';
import LikeButton from './LikeButton';

interface SongContextMenuProps {
  song: Song;
  x: number;
  y: number;
  onClose: () => void;
}

export default function SongContextMenu({ song, x, y, onClose }: SongContextMenuProps) {
  const { playSong } = useMusic();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside as EventListener);
    document.addEventListener('touchstart', handleClickOutside as EventListener);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener);
      document.removeEventListener('touchstart', handleClickOutside as EventListener);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handlePlay = () => {
    playSong(song);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed z-50 glass-strong rounded-lg p-2 min-w-[180px] shadow-xl border border-white/20"
        style={{
          left: `${Math.min(x, window.innerWidth - 200)}px`,
          top: `${Math.min(y, window.innerHeight - 200)}px`,
        }}
      >
        <div className="flex flex-col gap-1">
          <button
            onClick={handlePlay}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left w-full"
          >
            <Play className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Play</span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-2">
            <LikeButton songId={song.id} showCount={true} className="flex-1 justify-start" />
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Trigger share directly
              const shareData = {
                title: `Check out "${song.title}" by ${song.artist}`,
                text: `Listen to "${song.title}" by ${song.artist} on My Music`,
                url: `${window.location.origin}${window.location.pathname}?song=${song.id}`,
              };
              
              if (navigator.share) {
                navigator.share(shareData).catch(() => {});
              } else {
                navigator.clipboard.writeText(shareData.url).then(() => {
                  // Show feedback
                });
              }
              onClose();
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left w-full"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Share</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

