export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  cover: string;
  audioUrl: string;
  genre?: string;
  year?: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover?: string;
  songs: Song[];
  createdAt: Date;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
  queue: Song[];
  currentIndex: number;
}

