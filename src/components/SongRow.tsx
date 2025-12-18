import { motion } from 'framer-motion';
import { Song } from '../types/music';
import { useMusic } from '../context/MusicContext';
import { getSongStats } from '../utils/storage';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import { useLongPress } from '../utils/touchHandlers';
import { useState } from 'react';
import SongContextMenu from './SongContextMenu';
import { Eye } from 'lucide-react';

interface SongRowProps {
  song: Song;
  index: number;
  showGenre?: boolean;
}

export default function SongRow({ song, index, showGenre = false }: SongRowProps) {
  const { playSong, state } = useMusic();
  const [contextMenu, setContextMenu] = useState<{ song: Song; x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0]?.clientX || e.changedTouches[0]?.clientX || 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY || e.changedTouches[0]?.clientY || 0 : e.clientY;
    setContextMenu({ song, x: clientX, y: clientY });
  };

  const longPressHandlers = useLongPress(
    handleContextMenu,
    () => playSong(song),
    { delay: 400 }
  );

  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.02 }}
        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
        onClick={() => playSong(song)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setContextMenu({ song, x: e.clientX, y: e.clientY });
        }}
        {...longPressHandlers}
      >
        <td className="py-3 px-4 text-gray-400 group-hover:text-white">
          {index + 1}
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <img
              src={song.cover}
              alt={song.title}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <div
                className={`font-medium ${
                  state.currentSong?.id === song.id
                    ? 'text-primary-400'
                    : 'text-white'
                }`}
              >
                {song.title}
              </div>
              <div className="text-sm text-gray-400">{song.artist}</div>
            </div>
          </div>
        </td>
        <td className="py-3 px-4 text-gray-400">{song.album}</td>
        {showGenre && (
          <td className="py-3 px-4 text-gray-400">{song.genre || 'N/A'}</td>
        )}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2 md:gap-3 justify-end">
            <LikeButton songId={song.id} showCount={true} />
            <ShareButton song={song} />
            <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 w-12">
              <Eye className="w-4 h-4" />
              <span>{getSongStats(song.id).playCount}</span>
            </div>
            <span className="text-gray-400 w-12 text-right">
              {Math.floor(song.duration / 60)}:
              {(song.duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </td>
      </motion.tr>
      {contextMenu && (
        <SongContextMenu
          song={contextMenu.song}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}

