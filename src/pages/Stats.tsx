import { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import { getSiteStats, getSiteStatsSync, getSongStats, getUserLikes } from '../utils/storage';
import { Eye, Heart, Play, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Stats() {
  const { allSongs } = useMusic();
  const [siteStats, setSiteStats] = useState(getSiteStatsSync());
  const [songStats, setSongStats] = useState<Array<{ song: any; stats: any }>>([]);
  const [userLikes, setUserLikes] = useState<string[]>([]);

  useEffect(() => {
    getSiteStats().then(stats => {
      setSiteStats(stats);
    }).catch(() => {
      setSiteStats(getSiteStatsSync());
    });
    setUserLikes(getUserLikes());
    
    const stats = allSongs.map(song => ({
      song,
      stats: getSongStats(song.id),
    })).sort((a, b) => b.stats.playCount - a.stats.playCount);
    
    setSongStats(stats);
  }, [allSongs]);

  const topSongs = songStats.slice(0, 10);
  const mostLiked = [...songStats].sort((a, b) => b.stats.likes - a.stats.likes).slice(0, 10);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gradient">Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Visits</p>
              <p className="text-2xl font-bold text-white">{siteStats.totalVisits}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Play className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Plays</p>
              <p className="text-2xl font-bold text-white">{siteStats.totalPlays}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-lg p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Your Likes</p>
              <p className="text-2xl font-bold text-white">{userLikes.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Most Played Songs
        </h2>
        <div className="glass rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">#</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Song</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Plays</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Likes</th>
              </tr>
            </thead>
            <tbody>
              {topSongs.map((item, index) => (
                <tr
                  key={item.song.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.song.cover}
                        alt={item.song.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium text-white">{item.song.title}</div>
                        <div className="text-sm text-gray-400">{item.song.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-right">
                    {item.stats.playCount}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-right">
                    {item.stats.likes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-400" />
          Most Liked Songs
        </h2>
        <div className="glass rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">#</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Song</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Likes</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Plays</th>
              </tr>
            </thead>
            <tbody>
              {mostLiked.map((item, index) => (
                <tr
                  key={item.song.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.song.cover}
                        alt={item.song.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium text-white">{item.song.title}</div>
                        <div className="text-sm text-gray-400">{item.song.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-right">
                    {item.stats.likes}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-right">
                    {item.stats.playCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

