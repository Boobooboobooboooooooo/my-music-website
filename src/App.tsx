import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Library from './pages/Library';
import Playlists from './pages/Playlists';
import Search from './pages/Search';
import Stats from './pages/Stats';
import Player from './components/Player';
import InstallPrompt from './components/InstallPrompt';
import { ErrorBoundary } from './components/ErrorBoundary';
import { incrementVisit } from './utils/storage';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Track website visit
    incrementVisit().catch(() => {
      // Silently handle storage errors
    });
  }, []);

  return (
    <ErrorBoundary>
      <MusicProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/search" element={<Search />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
            <Player />
            <InstallPrompt />
          </Layout>
        </Router>
      </MusicProvider>
    </ErrorBoundary>
  );
}

export default App;

