# How to Add Your Music to the Deployed Site

## Why Your Music Isn't Showing

The `Music` folder is in `.gitignore` (to avoid pushing large files), so it wasn't deployed to Vercel. The site built successfully but has an empty `songs.json` file.

## Solutions

### Option 1: Upload Music to Cloud Storage (Recommended)

**Best for:** Large music libraries, unlimited bandwidth

1. **Upload to Cloudflare R2 (Free - 10GB storage, unlimited egress):**
   - Sign up: https://www.cloudflare.com/products/r2/
   - Create a bucket
   - Upload your `Music` folder
   - Make files publicly accessible
   - Get public URLs for each file

2. **Update `songs.json` with R2 URLs:**
   - Update `audioUrl` in each song to point to R2
   - Example: `audioUrl: "https://your-bucket.r2.dev/Music/Blue%20Music%20/Song.mp3"`

3. **Push updated `songs.json` to GitHub**

### Option 2: Use GitHub LFS (Git Large File Storage)

**Best for:** If you want to keep music in the repository

1. **Install Git LFS:**
   ```bash
   brew install git-lfs  # macOS
   ```

2. **Set up LFS:**
   ```bash
   cd "/Users/peewee/Desktop/My Music Website"
   git lfs install
   git lfs track "Music/**/*.mp3"
   git lfs track "Music/**/*.m4a"
   git add .gitattributes
   git add Music/
   git commit -m "Add music files with LFS"
   git push
   ```

3. **Note:** GitHub LFS has limits (1GB free, then paid)

### Option 3: Manual Upload to Vercel (Not Recommended)

Vercel doesn't support uploading files directly. You'd need to:
- Add Music folder to git (not recommended - large files)
- Or use a different hosting method

### Option 4: Use a Different Music Hosting Service

**Services that work well:**
- **Backblaze B2** (Free tier: 10GB storage)
- **AWS S3** (Pay as you go)
- **Google Cloud Storage** (Free tier available)
- **Dropbox/Google Drive** (with public links)

---

## Quick Fix: Upload to Cloudflare R2

### Step-by-Step:

1. **Create R2 Bucket:**
   - Go to Cloudflare Dashboard → R2
   - Create bucket: `my-music-files`
   - Make it public

2. **Upload Music:**
   - Use Cloudflare dashboard or CLI
   - Upload entire `Music` folder structure

3. **Get Public URLs:**
   - Each file gets a URL like: `https://pub-xxxxx.r2.dev/Music/Blue%20Music%20/Song.mp3`

4. **Update songs.json:**
   - Run `npm run scan-music` locally
   - Manually update `audioUrl` in each song to use R2 URLs
   - Or modify `scan-music.js` to generate R2 URLs

5. **Push to GitHub:**
   ```bash
   git add public/songs.json
   git commit -m "Update songs.json with R2 URLs"
   git push
   ```

---

## Alternative: Keep Music Local (For Personal Use)

If this is just for you:
- Keep running locally with `npm run dev`
- Or use the deployed site without music (just the interface)

---

## Which Option Should You Choose?

- **Small library (< 1GB):** GitHub LFS
- **Large library or public site:** Cloudflare R2 (recommended)
- **Just testing:** Keep it local

**I recommend Cloudflare R2** - it's free, unlimited bandwidth, and perfect for music files.

---

**Want help setting up Cloudflare R2?** Let me know!

