import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Search, Music, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/playlists', icon: Music, label: 'Playlists' },
    { path: '/stats', icon: BarChart3, label: 'Stats' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col">
      <nav className="glass-strong border-b border-white/20 px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center"
            >
              <Music className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-gradient">My Music</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pb-32 md:pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">{children}</div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-white/20 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary-400'
                    : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

