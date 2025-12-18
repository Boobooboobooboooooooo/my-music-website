import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toggleLike, isLiked, getSongStats } from '../utils/storage';

interface LikeButtonProps {
  songId: string;
  className?: string;
  showCount?: boolean;
}

export default function LikeButton({ songId, className = '', showCount = true }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    setLiked(isLiked(songId));
    const stats = getSongStats(songId);
    setLikeCount(stats.likes);
  }, [songId]);

  const handleLike = () => {
    const newLiked = toggleLike(songId);
    setLiked(newLiked);
    const stats = getSongStats(songId);
    setLikeCount(stats.likes);
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
        liked
          ? 'text-red-400 hover:text-red-300 bg-red-500/20'
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      } ${className}`}
      title={liked ? 'Unlike' : 'Like'}
    >
      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
      {showCount && likeCount > 0 && (
        <span className="text-sm font-medium">{likeCount}</span>
      )}
    </button>
  );
}

