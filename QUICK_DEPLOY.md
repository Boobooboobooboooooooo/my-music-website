# Quick Deploy Guide - Drag & Drop to Netlify

## Step-by-Step Instructions

### 1. Make sure your project is built:
```bash
npm run build
```

### 2. Go to Netlify:
- Visit: https://app.netlify.com/
- Sign in or create a free account

### 3. Deploy the `dist` folder:
- Click **"Add new site"** (top right)
- Select **"Deploy manually"** or **"Deploy to Netlify"**
- **IMPORTANT**: Drag and drop the **`dist`** folder (NOT the root folder!)
  - The `dist` folder should contain:
    - `index.html`
    - `assets/` folder
    - `Music/` folder
    - `songs.json`
    - `sw.js` (service worker)
    - Icons and manifest files

### 4. Wait for deployment:
- Netlify will process your files
- You'll get a URL like: `https://random-name-123.netlify.app`

### 5. Configure Functions (for Firebase stats):
- Go to **Site settings** → **Environment variables**
- Add your Firebase credentials:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

## Troubleshooting "Deploy not found"

❌ **Wrong**: Dragging the root folder (`My Music Website`)
✅ **Correct**: Drag the `dist` folder inside it

**To find the dist folder:**
1. Open Finder
2. Navigate to: `Desktop/My Music Website/dist`
3. Drag that `dist` folder to Netlify

## Alternative: Deploy via Git (Recommended)

If drag-and-drop doesn't work, use Git:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Deploy music website"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to Netlify → "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository
   - Netlify will auto-detect settings from `netlify.toml`

---

**Need help?** Check the `DEPLOY.md` file for more detailed instructions.

