# Deploying to Netlify

Your music website is now ready to deploy to Netlify! 🚀

## Quick Deploy (Drag & Drop)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Go to [Netlify](https://app.netlify.com/)**
   - Sign up or log in (it's free!)
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `dist` folder
   - Your site will be live in seconds!

## Deploy via Git (Recommended)

### Step 1: Push to GitHub

1. **Initialize Git (if not already):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - My Music Website"
   ```

2. **Create a GitHub repository:**
   - Go to [GitHub](https://github.com/new)
   - Create a new repository
   - Don't initialize with README (you already have one)

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Netlify

1. **Go to [Netlify](https://app.netlify.com/)**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your repository

2. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Netlify will auto-detect these from `netlify.toml`

3. **Deploy!**
   - Click "Deploy site"
   - Wait for the build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

## Important Notes

✅ **Music Files**: The `Music` folder is automatically copied to `dist` during build  
✅ **PWA Ready**: Your site works as a Progressive Web App on mobile  
✅ **Auto Updates**: Netlify will rebuild when you push to GitHub  
✅ **Free SSL**: HTTPS is automatically enabled  

## After Deployment

1. **Test your site:**
   - Visit your Netlify URL
   - Check that all songs load and play
   - Test on mobile devices

2. **Custom Domain (Optional):**
   - Go to Site settings → Domain management
   - Add your custom domain

3. **Update Music:**
   - Add new songs to the `Music` folder
   - Run `npm run scan-music`
   - Commit and push to GitHub
   - Netlify will automatically rebuild

## Troubleshooting

**Build fails?**
- Make sure Node version is 18 (check `.nvmrc`)
- Verify all dependencies are in `package.json`

**Songs not playing?**
- Check that `dist/Music` folder exists after build
- Verify `dist/songs.json` is present
- Check browser console for errors

**Need help?**
- Check Netlify build logs
- Verify `netlify.toml` is in the root directory

---

🎵 Your music website is ready to share with the world!

