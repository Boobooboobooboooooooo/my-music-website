import { Play, Pause, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { Song } from '../types/music';
import { useState, useEffect } from 'react';
import { getSongStats } from '../utils/storage';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import SongContextMenu from './SongContextMenu';
import { useLongPress } from '../utils/touchHandlers';

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const { playSong, state } = useMusic();
  const isPlaying = state.currentSong?.id === song.id && state.isPlaying;
  const [playCount, setPlayCount] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const stats = getSongStats(song.id);
    setPlayCount(stats.playCount);
  }, [song.id]);

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0]?.clientX || e.changedTouches[0]?.clientX || 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY || e.changedTouches[0]?.clientY || 0 : e.clientY;
    setContextMenu({ x: clientX, y: clientY });
  };

  const longPressHandlers = useLongPress(
    handleContextMenu,
    () => playSong(song),
    { delay: 400 }
  );

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group"
        onClick={() => playSong(song)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setContextMenu({ x: e.clientX, y: e.clientY });
        }}
        {...longPressHandlers}
      >
      <div className="relative mb-4">
        <img
          src={song.cover}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            playSong(song);
          }}
          className="absolute bottom-2 right-2 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" />
          )}
        </motion.button>
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <LikeButton songId={song.id} showCount={false} />
          <ShareButton song={song} />
        </div>
      </div>
      <h3 className="font-semibold text-white mb-1 truncate">{song.title}</h3>
      <p className="text-sm text-gray-400 truncate">{song.artist}</p>
      <div className="flex items-center justify-between mt-2">
        {song.genre && (
          <p className="text-xs text-gray-500">{song.genre}</p>
        )}
        {playCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="w-3 h-3" />
            <span>{playCount}</span>
          </div>
        )}
      </div>
    </motion.div>
    
    {contextMenu && (
      <SongContextMenu
        song={song}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu(null)}
      />
    )}
    </>
  );
}

