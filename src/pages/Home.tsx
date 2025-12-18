import { useMusic } from '../context/MusicContext';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SongCard from '../components/SongCard';
import { getSiteStats, getSiteStatsSync } from '../utils/storage';
import SongRow from '../components/SongRow';

type GenreFilter = 'All' | 'Blues' | 'Rap' | 'Trap' | 'R&B';

export default function Home() {
  const { allSongs } = useMusic();
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('All');
  const [siteStats, setSiteStats] = useState(() => {
    return getSiteStatsSync();
  });

  useEffect(() => {
    getSiteStats().then(stats => {
      setSiteStats(stats);
    }).catch(() => {
      // Fallback to sync version
      setSiteStats(getSiteStatsSync());
    });
  }, []);

  const genres: GenreFilter[] = ['All', 'Blues', 'Rap', 'Trap', 'R&B'];
  
  const filteredSongs = selectedGenre === 'All' 
    ? allSongs 
    : allSongs.filter(song => song.genre === selectedGenre);
  
  const featuredSongs = filteredSongs;
  const recentSongs = filteredSongs;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Welcome to My Music
            </h1>
            <p className="text-gray-400 text-lg">
              Discover and enjoy your favorite tracks
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">
              <div>Total Visits: <span className="text-white font-semibold">{siteStats.totalVisits}</span></div>
              <div>Total Plays: <span className="text-white font-semibold">{siteStats.totalPlays}</span></div>
            </div>
          </div>
        </div>
      </motion.div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">All Songs</h2>
          <span className="text-gray-400 text-sm">{filteredSongs.length} songs</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedGenre === genre
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSongs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SongCard song={song} />
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Your Music</h2>
        <div className="glass rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  #
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  Album
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  <Clock className="w-4 h-4 inline" />
                </th>
              </tr>
            </thead>
            <tbody>
              {recentSongs.map((song, index) => (
                <SongRow key={song.id} song={song} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

