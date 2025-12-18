// Local storage utilities for tracking likes, plays, and visits

export interface SongStats {
  likes: number;
  playCount: number;
  lastPlayed?: number;
}

export interface SiteStats {
  totalVisits: number;
  lastVisit: number;
  totalPlays: number;
}

const STORAGE_KEYS = {
  SONG_STATS: 'music_song_stats',
  SITE_STATS: 'music_site_stats',
  USER_LIKES: 'music_user_likes',
};

export function getSongStats(songId: string): SongStats {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.SONG_STATS);
    const allStats = stats ? JSON.parse(stats) : {};
    return allStats[songId] || { likes: 0, playCount: 0 };
  } catch {
    return { likes: 0, playCount: 0 };
  }
}

export function updateSongStats(songId: string, updates: Partial<SongStats>): SongStats {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.SONG_STATS);
    const allStats = stats ? JSON.parse(stats) : {};
    
    const current = allStats[songId] || { likes: 0, playCount: 0 };
    const updated = { ...current, ...updates };
    
    allStats[songId] = updated;
    localStorage.setItem(STORAGE_KEYS.SONG_STATS, JSON.stringify(allStats));
    
    return updated;
  } catch {
    return { likes: 0, playCount: 0 };
  }
}

export function incrementPlayCount(songId: string): void {
  const current = getSongStats(songId);
  updateSongStats(songId, {
    playCount: current.playCount + 1,
    lastPlayed: Date.now(),
  });
}

export function toggleLike(songId: string): boolean {
  try {
    const userLikes = getUserLikes();
    const isLiked = userLikes.includes(songId);
    
    if (isLiked) {
      // Unlike
      const newLikes = userLikes.filter(id => id !== songId);
      localStorage.setItem(STORAGE_KEYS.USER_LIKES, JSON.stringify(newLikes));
      
      const current = getSongStats(songId);
      updateSongStats(songId, {
        likes: Math.max(0, current.likes - 1),
      });
      return false;
    } else {
      // Like
      const newLikes = [...userLikes, songId];
      localStorage.setItem(STORAGE_KEYS.USER_LIKES, JSON.stringify(newLikes));
      
      const current = getSongStats(songId);
      updateSongStats(songId, {
        likes: current.likes + 1,
      });
      return true;
    }
  } catch {
    return false;
  }
}

export function isLiked(songId: string): boolean {
  const userLikes = getUserLikes();
  return userLikes.includes(songId);
}

export function getUserLikes(): string[] {
  try {
    const likes = localStorage.getItem(STORAGE_KEYS.USER_LIKES);
    return likes ? JSON.parse(likes) : [];
  } catch {
    return [];
  }
}

// Cache for site stats to avoid too many API calls
let siteStatsCache: SiteStats | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

async function fetchSiteStatsFromAPI(): Promise<SiteStats | null> {
  try {
    const response = await fetch('/.netlify/functions/get-stats');
    if (response.ok) {
      const stats = await response.json();
      siteStatsCache = stats;
      lastFetchTime = Date.now();
      return stats;
    }
  } catch (error) {
    // API not available, use localStorage
  }
  return null;
}

async function updateSiteStatsAPI(action: 'incrementVisit' | 'incrementPlay'): Promise<void> {
  try {
    await fetch('/.netlify/functions/update-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });
    // Invalidate cache
    siteStatsCache = null;
  } catch (error) {
    // API not available, fall back to localStorage
  }
}

export async function getSiteStats(): Promise<SiteStats> {
  // Try API first if cache is stale
  const now = Date.now();
  if (!siteStatsCache || (now - lastFetchTime) > CACHE_DURATION) {
    const apiStats = await fetchSiteStatsFromAPI();
    if (apiStats) {
      // Also save to localStorage as backup
      try {
        localStorage.setItem(STORAGE_KEYS.SITE_STATS, JSON.stringify(apiStats));
      } catch {
        // Ignore localStorage errors
      }
      return apiStats;
    }
  } else if (siteStatsCache) {
    return siteStatsCache;
  }

  // Fallback to localStorage
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.SITE_STATS);
    if (stats) {
      const parsed = JSON.parse(stats);
      siteStatsCache = parsed;
      return parsed;
    }
  } catch {
    // Continue to default
  }

  // Initialize with defaults
  const initial: SiteStats = {
    totalVisits: 0,
    lastVisit: Date.now(),
    totalPlays: 0,
  };
  
  try {
    localStorage.setItem(STORAGE_KEYS.SITE_STATS, JSON.stringify(initial));
  } catch {
    // Ignore localStorage errors
  }
  
  return initial;
}

// Synchronous version for backwards compatibility (uses cache or localStorage)
export function getSiteStatsSync(): SiteStats {
  if (siteStatsCache) {
    return siteStatsCache;
  }
  
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.SITE_STATS);
    if (stats) {
      const parsed = JSON.parse(stats);
      siteStatsCache = parsed;
      return parsed;
    }
  } catch {
    // Continue to default
  }

  const initial: SiteStats = {
    totalVisits: 0,
    lastVisit: Date.now(),
    totalPlays: 0,
  };
  
  try {
    localStorage.setItem(STORAGE_KEYS.SITE_STATS, JSON.stringify(initial));
  } catch {
    // Ignore localStorage errors
  }
  
  return initial;
}

export async function incrementVisit(): Promise<void> {
  // Update API first
  await updateSiteStatsAPI('incrementVisit');
  
  // Also update localStorage as backup
  try {
    const current = getSiteStatsSync();
    const updated: SiteStats = {
      totalVisits: current.totalVisits + 1,
      lastVisit: Date.now(),
      totalPlays: current.totalPlays,
    };
    localStorage.setItem(STORAGE_KEYS.SITE_STATS, JSON.stringify(updated));
    siteStatsCache = updated;
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export async function incrementTotalPlays(): Promise<void> {
  // Update API first
  await updateSiteStatsAPI('incrementPlay');
  
  // Also update localStorage as backup
  try {
    const current = getSiteStatsSync();
    const updated: SiteStats = {
      ...current,
      totalPlays: current.totalPlays + 1,
    };
    localStorage.setItem(STORAGE_KEYS.SITE_STATS, JSON.stringify(updated));
    siteStatsCache = updated;
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

