import { useMusic } from '../context/MusicContext';
import { Plus, Play, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song } from '../types/music';
import ShareButton from '../components/ShareButton';

export default function Playlists() {
  const {
    playlists,
    allSongs,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    playSong,
  } = useMusic();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName, newPlaylistDesc);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreateModal(false);
    }
  };

  const handleAddSong = (song: Song) => {
    if (selectedPlaylist) {
      addSongToPlaylist(selectedPlaylist, song);
      setShowAddSongModal(false);
      setSelectedPlaylist(null);
    }
  };

  const handlePlayPlaylist = (playlistId: string) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (playlist && playlist.songs.length > 0) {
      playSong(playlist.songs[0]);
    }
  };

  const handleDeletePlaylist = () => {
    if (playlistToDelete) {
      deletePlaylist(playlistToDelete);
      setPlaylistToDelete(null);
      // Close the add song modal if it's open for the deleted playlist
      if (selectedPlaylist === playlistToDelete) {
        setShowAddSongModal(false);
        setSelectedPlaylist(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gradient">Playlists</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Create Playlist</span>
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-12 glass rounded-lg">
          <p className="text-gray-400 text-lg mb-4">No playlists yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg transition-all"
          >
            Create Your First Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-lg p-4 hover:bg-white/10 transition-all group cursor-pointer"
              onClick={() => {
                setSelectedPlaylist(playlist.id);
                setShowAddSongModal(true);
              }}
            >
              <div className="relative mb-4">
                {playlist.songs.length > 0 ? (
                  <img
                    src={playlist.songs[0].cover}
                    alt={playlist.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full aspect-square bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-50" />
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPlaylist(playlist.id);
                  }}
                  className="absolute bottom-2 right-2 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </button>
              </div>
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-white flex-1">{playlist.name}</h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ShareButton playlist={playlist} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlaylistToDelete(playlist.id);
                    }}
                    className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all"
                    title="Delete playlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
              </p>
              {playlist.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {playlist.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Create Playlist
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="My Playlist"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    placeholder="Add a description..."
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreatePlaylist}
                    className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-all"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showAddSongModal && selectedPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowAddSongModal(false);
              setSelectedPlaylist(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Add Songs to Playlist
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allSongs.map((song) => {
                  const playlist = playlists.find((p) => p.id === selectedPlaylist);
                  const isInPlaylist =
                    playlist?.songs.some((s) => s.id === song.id) || false;
                  return (
                    <div
                      key={song.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <img
                        src={song.cover}
                        alt={song.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">
                          {song.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {song.artist}
                        </div>
                      </div>
                      {isInPlaylist ? (
                        <button
                          onClick={() =>
                            removeSongFromPlaylist(selectedPlaylist, song.id)
                          }
                          className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddSong(song)}
                          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-all"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {playlistToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPlaylistToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Delete Playlist
              </h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{playlists.find(p => p.id === playlistToDelete)?.name}"? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeletePlaylist}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all text-white font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => setPlaylistToDelete(null)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

