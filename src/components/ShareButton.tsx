import { Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { Song, Playlist } from '../types/music';

interface ShareButtonProps {
  song?: Song;
  playlist?: Playlist;
  className?: string;
}

export default function ShareButton({ song, playlist, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const getShareData = () => {
    const url = window.location.origin + window.location.pathname;
    
    if (song) {
      return {
        title: `Check out "${song.title}" by ${song.artist}`,
        text: `Listen to "${song.title}" by ${song.artist} on My Music`,
        url: `${url}?song=${song.id}`,
      };
    }
    
    if (playlist) {
      return {
        title: `Check out my playlist: "${playlist.name}"`,
        text: `Listen to my playlist "${playlist.name}" with ${playlist.songs.length} songs on My Music`,
        url: `${url}?playlist=${playlist.id}`,
      };
    }
    
    return {
      title: 'My Music - Advanced Music Player',
      text: 'Check out this amazing music website!',
      url: url,
    };
  };

  const handleShare = async () => {
    const shareData = getShareData();

    // Try Web Share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // User cancelled or error occurred, fall back to copy
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareData.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleShare();
      }}
      className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
        className || 'text-gray-400 hover:text-white hover:bg-white/10'
      }`}
      title={copied ? 'Copied!' : 'Share'}
    >
      {copied ? (
        <Check className="w-5 h-5 text-green-400" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}
    </button>
  );
}

