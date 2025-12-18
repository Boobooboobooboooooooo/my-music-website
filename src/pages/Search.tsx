import { useMusic } from '../context/MusicContext';
import { Search as SearchIcon, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SongCard from '../components/SongCard';

export default function Search() {
  const { allSongs } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = allSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.genre?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uniqueArtists = Array.from(
    new Set(allSongs.map((song) => song.artist))
  ).slice(0, 6);

  const uniqueGenres = Array.from(
    new Set(allSongs.map((song) => song.genre).filter(Boolean))
  ).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gradient">Search</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search for songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400 text-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {searchQuery ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Search Results ({filteredSongs.length})
              </h2>
              {filteredSongs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSongs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <SongCard song={song} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No results found</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Browse Artists</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {uniqueArtists.map((artist, index) => (
                <motion.button
                  key={artist}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSearchQuery(artist)}
                  className="glass rounded-lg p-4 text-center hover:bg-white/10 transition-all group"
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                    {artist.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-white truncate">
                    {artist}
                  </p>
                </motion.button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Browse Genres</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {uniqueGenres.map((genre, index) => (
                <motion.button
                  key={genre}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSearchQuery(genre!)}
                  className="glass rounded-lg p-6 text-center hover:bg-white/10 transition-all"
                >
                  <p className="text-lg font-semibold text-white">{genre}</p>
                </motion.button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

