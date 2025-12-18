import { useMusic } from '../context/MusicContext';
import { Search, Grid, List, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import SongCard from '../components/SongCard';
import SongRow from '../components/SongRow';

type GenreFilter = 'All' | 'Blues' | 'Rap' | 'Trap' | 'R&B';

export default function Library() {
  const { allSongs, isLoading, refreshSongs } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('All');

  const genres: GenreFilter[] = ['All', 'Blues', 'Rap', 'Trap', 'R&B'];

  const filteredSongs = allSongs.filter(
    (song) => {
      const matchesSearch = 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = selectedGenre === 'All' || song.genre === selectedGenre;
      
      return matchesSearch && matchesGenre;
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gradient">Your Library</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshSongs}
            disabled={isLoading}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
            title="Refresh songs from Music folder"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
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
      </div>

      {viewMode === 'grid' ? (
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
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                  Genre
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSongs.map((song, index) => (
                <SongRow key={song.id} song={song} index={index} showGenre={true} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
          <p className="text-gray-400 mt-4">Loading songs...</p>
        </div>
      )}

      {!isLoading && filteredSongs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No songs found</p>
          <p className="text-gray-500 text-sm mt-2">
            Add songs to the Music folder and click refresh
          </p>
        </div>
      )}
    </div>
  );
}

