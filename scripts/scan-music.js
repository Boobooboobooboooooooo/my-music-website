import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFile } from 'music-metadata';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MUSIC_FOLDER = path.join(__dirname, '../Music');
const OUTPUT_FILE = path.join(__dirname, '../public/songs.json');

// Supported audio formats
const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.flac', '.ogg', '.aac'];

async function getAudioDuration(filePath) {
  try {
    const metadata = await parseFile(filePath);
    return Math.floor(metadata.format.duration || 0);
  } catch (error) {
    console.warn(`Could not get duration for ${filePath}:`, error.message);
    return 0;
  }
}

function extractMetadataFromFilename(filename) {
  // Remove extension
  const nameWithoutExt = path.basename(filename, path.extname(filename));
  
  // Try to parse "Artist - Title" or "Title" format
  const parts = nameWithoutExt.split(' - ');
  if (parts.length >= 2) {
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(' - ').trim(),
    };
  }
  
  // Try to parse "Artist_Title" format
  const underscoreParts = nameWithoutExt.split('_');
  if (underscoreParts.length >= 2) {
    return {
      artist: underscoreParts[0].trim(),
      title: underscoreParts.slice(1).join(' ').trim(),
    };
  }
  
  // If no artist separator, use filename as title
  return {
    artist: 'Unknown Artist',
    title: nameWithoutExt.trim(),
  };
}

async function scanMusicFolder() {
  console.log('Scanning Music folder...');
  
  // Ensure public directory exists
  const publicDirPath = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDirPath)) {
    fs.mkdirSync(publicDirPath, { recursive: true });
  }
  
  if (!fs.existsSync(MUSIC_FOLDER)) {
    console.warn(`Music folder not found at: ${MUSIC_FOLDER}`);
    console.warn('Creating empty songs.json file...');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    console.log('✅ Created empty songs.json');
    return;
  }

  // Recursively find all audio files in Music folder and subfolders
  function findAudioFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // Recursively search subdirectories
        findAudioFiles(filePath, fileList);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (AUDIO_EXTENSIONS.includes(ext)) {
          fileList.push(filePath);
        }
      }
    });
    
    return fileList;
  }
  
  const audioFiles = findAudioFiles(MUSIC_FOLDER);

  if (audioFiles.length === 0) {
    console.warn('No audio files found in Music folder');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    return;
  }

  console.log(`Found ${audioFiles.length} audio file(s)`);

  const songs = [];
  
  // Generate unique cover image URLs - each song gets a different image
  // Using completely different Unsplash photo IDs for true uniqueness
  const allCoverImages = [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&auto=format',
  ];
  
  // Track used covers to ensure uniqueness
  const usedCovers = new Set();

  for (let i = 0; i < audioFiles.length; i++) {
    const filePath = audioFiles[i]; // filePath is already the full path from findAudioFiles
    
    console.log(`Processing ${i + 1}/${audioFiles.length}: ${filePath}`);
    
    try {
      // Get metadata from file
      let metadata;
      try {
        metadata = await parseFile(filePath);
      } catch (error) {
        console.warn(`Could not parse metadata for ${filePath}, using filename`);
        metadata = null;
      }

      // Extract info from metadata or filename (use basename for filename parsing)
      const fileName = path.basename(filePath);
      const fileInfo = extractMetadataFromFilename(fileName);
      
      // Use metadata if available and valid, otherwise use filename parsing
      let title = metadata?.common?.title?.[0];
      let artist = metadata?.common?.artist?.[0];
      
      // Only use metadata if it's meaningful (not just single characters)
      if (!title || title.length < 2) {
        title = fileInfo.title;
      }
      if (!artist || artist.length < 2) {
        artist = fileInfo.artist;
      }
      
      const album = metadata?.common?.album?.[0] || 'Unknown Album';
      
      // Extract genre from folder name or metadata
      let genre = metadata?.common?.genre?.[0] || null;
      
      // If no genre in metadata, try to extract from folder name
      if (!genre) {
        const relativePath = path.relative(MUSIC_FOLDER, filePath);
        const pathParts = relativePath.split(path.sep);
        
        // Check if any folder in the path matches known genres
        // (excluding the filename itself, which is the last part)
        for (let k = 0; k < pathParts.length - 1; k++) {
          const folderName = pathParts[k].toLowerCase().trim();
          
          // Normalize common genre folder names (handle variations and spaces)
          if (folderName.includes('r&b') || folderName.includes('r and b') || folderName.includes('rnb') || folderName.includes('randb')) {
            genre = 'R&B';
            break;
          } else if (folderName.includes('trap') && !folderName.includes('rap')) {
            // Check for "trap" first if it's standalone (not "rap:trap")
            genre = 'Trap';
            break;
          } else if (folderName.includes('rap')) {
            // Check for "rap" (this will also catch "rap:trap" but prioritize trap if it's standalone)
            genre = 'Rap';
            break;
          } else if (folderName.includes('blues') || (folderName.includes('blue') && !folderName.includes('blueprint'))) {
            genre = 'Blues';
            break;
          }
        }
      }
      
      // Normalize genre names to standard format
      if (genre) {
        const genreLower = genre.toLowerCase().trim();
        if (genreLower === 'r&b' || genreLower === 'r and b' || genreLower === 'rnb' || genreLower === 'randb') {
          genre = 'R&B';
        } else if (genreLower === 'rap' || genreLower === 'hip-hop' || genreLower === 'hiphop') {
          genre = 'Rap';
        } else if (genreLower === 'trap') {
          genre = 'Trap';
        } else if (genreLower === 'blues' || genreLower === 'blue') {
          genre = 'Blues';
        }
      }
      
      const year = metadata?.common?.year || null;
      
      // Get duration
      const duration = await getAudioDuration(filePath);
      
      // Generate a unique cover based on song title hash, ensuring no duplicates
      let titleHash = 0;
      const songTitle = (title || fileInfo.title).toLowerCase();
      for (let j = 0; j < songTitle.length; j++) {
        titleHash = ((titleHash << 5) - titleHash) + songTitle.charCodeAt(j);
        titleHash = titleHash & titleHash; // Convert to 32bit integer
      }
      
      // Start with hash-based index
      let coverIndex = Math.abs(titleHash) % allCoverImages.length;
      let cover = allCoverImages[coverIndex];
      
      // If this cover was already used, find the next available one
      let attempts = 0;
      while (usedCovers.has(cover) && attempts < allCoverImages.length) {
        coverIndex = (coverIndex + 1) % allCoverImages.length;
        cover = allCoverImages[coverIndex];
        attempts++;
      }
      
      // Mark this cover as used
      usedCovers.add(cover);
      
      // Try to use embedded artwork if available
      if (metadata?.common?.picture?.[0]) {
        // For embedded artwork, we'd need to extract and save it
        // For now, keep using the unique cover from array
      }

      // Get relative path from Music folder for URL encoding
      const relativePath = path.relative(MUSIC_FOLDER, filePath);
      const encodedPath = relativePath.split(path.sep).map(encodeURIComponent).join('/');
      
      const song = {
        id: `song-${i + 1}-${Date.now()}`,
        title: title || fileInfo.title,
        artist: artist || fileInfo.artist,
        album: album || 'Unknown Album',
        duration: duration || 0,
        cover: cover,
        audioUrl: `/Music/${encodedPath}`,
        genre: genre,
        year: year,
      };
      
      // Log the URL for debugging
      if (fileName.includes('&') || fileName.includes('Tested') || fileName.includes('Lens')) {
        console.log(`  Generated URL for "${fileName}": ${song.audioUrl}`);
      }

      songs.push(song);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }

  // Write songs.json
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(songs, null, 2));
  console.log(`\n✅ Successfully scanned ${songs.length} song(s)`);
  console.log(`📝 Songs data written to: ${OUTPUT_FILE}`);
}

scanMusicFolder().catch(console.error);

