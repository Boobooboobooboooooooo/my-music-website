# My Music - Advanced Music Website

A modern, feature-rich music streaming website built with React, TypeScript, and Vite.

## Features

- 🎵 **Advanced Music Player**
  - Play, pause, next, previous controls
  - Shuffle and repeat modes
  - Volume control with mute
  - Progress bar with seeking
  - Real-time time display

- 🎨 **Modern UI/UX**
  - Beautiful glassmorphism design
  - Smooth animations with Framer Motion
  - Responsive design for all devices
  - Dark theme with gradient accents

- 📚 **Music Library**
  - Browse all songs
  - Grid and list view modes
  - Search functionality
  - Song details and metadata

- 🔍 **Advanced Search**
  - Search by title, artist, album, or genre
  - Browse by artists and genres
  - Real-time filtering

- 📋 **Playlist Management**
  - Create custom playlists
  - Add/remove songs from playlists
  - Play entire playlists
  - Playlist covers and descriptions

- 🏠 **Home Page**
  - Featured songs
  - Recently played tracks
  - Quick access to popular content

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Layout.tsx   # Main layout with navigation
│   ├── Player.tsx   # Music player component
│   └── SongCard.tsx # Song card component
├── context/          # React context providers
│   └── MusicContext.tsx  # Music player state management
├── pages/            # Page components
│   ├── Home.tsx      # Home page
│   ├── Library.tsx   # Music library
│   ├── Playlists.tsx # Playlist management
│   └── Search.tsx    # Search page
├── types/            # TypeScript type definitions
│   └── music.ts      # Music-related types
├── utils/            # Utility functions
│   └── formatTime.ts # Time formatting
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Features in Detail

### Music Player
- Full-featured audio player with all standard controls
- Visual feedback for currently playing song
- Queue management
- Shuffle and repeat modes (none, all, one)

### Playlist System
- Create unlimited playlists
- Add descriptions to playlists
- Easy song management
- Visual playlist covers

### Search & Discovery
- Fast, real-time search
- Filter by multiple criteria
- Browse by artists and genres
- Beautiful search results

## Adding Your Music

### Automatic Song Detection

The website automatically scans the `Music` folder in the project root for audio files.

**To add songs:**
1. Place your audio files (MP3, M4A, WAV, FLAC, OGG, AAC) in the `Music` folder
2. The website will automatically detect them when you:
   - Start the dev server (`npm run dev`)
   - Build for production (`npm run build`)
   - Click the refresh button in the Library page

**To manually scan for new songs:**
```bash
npm run scan-music
```

The script will:
- Scan all audio files in the `Music` folder
- Extract metadata (title, artist, album, duration, etc.) from the files
- Generate a `public/songs.json` file with all song information
- Use filenames if metadata is not available

**Supported formats:**
- MP3
- M4A
- WAV
- FLAC
- OGG
- AAC

**Note:** If your audio files have embedded metadata (ID3 tags), it will be used. Otherwise, the script will parse the filename to extract title and artist information.

### Styling

The project uses Tailwind CSS. Customize colors in `tailwind.config.js` and add custom styles in `src/index.css`.

## Installing as a Mobile App (PWA)

This website is a Progressive Web App (PWA) and can be installed on your phone or tablet.

### Android

1. Open the website in Chrome browser
2. You'll see an install prompt, or tap the menu (three dots) → "Install app"
3. The app will be added to your home screen and work like a native app

### iPhone/iPad

1. Open the website in Safari browser
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Customize the name if desired, then tap "Add"
5. The app icon will appear on your home screen

### Features When Installed

- Works offline (cached music and app files)
- App-like experience (no browser UI)
- Quick access from home screen
- Background audio playback support

## Deploying to Netlify

### Option 1: Deploy via Netlify Dashboard

1. **Build the project locally:**
   ```bash
   npm run build
   ```

2. **Go to [Netlify](https://app.netlify.com/)**
   - Sign up or log in
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `dist` folder

### Option 2: Deploy via Git (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18` (or use `.nvmrc`)

4. **Deploy!**
   - Netlify will automatically build and deploy your site

### Important Notes for Netlify

- **Music Files**: Make sure your `Music` folder is committed to Git (or use Netlify's file upload)
- **Build Process**: The build script automatically scans the Music folder and generates `songs.json`
- **Environment**: Netlify will use Node 18 (specified in `.nvmrc`)
- **Routing**: The `netlify.toml` file handles SPA routing correctly

### After Deployment

1. Your site will be live at `https://your-site-name.netlify.app`
2. The PWA features will work on mobile devices
3. Users can install it as an app on their phones

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

