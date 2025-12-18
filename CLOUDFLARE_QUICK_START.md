# Quick Cloudflare Pages Setup - Step by Step

## ⚡ 5-Minute Setup Guide

### Step 1: Push to GitHub (If Not Already Done)

```bash
# In your terminal, run these commands:
cd "/Users/peewee/Desktop/My Music Website"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Cloudflare Pages deployment"

# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**OR** if you already have a GitHub repo:
```bash
git add .
git commit -m "Update for Cloudflare Pages"
git push
```

### Step 2: Go to Cloudflare Pages

1. **Visit:** https://pages.cloudflare.com
2. **Sign in** (or create free account with GitHub)
3. **Click:** "Create a project" or "Connect to Git"

### Step 3: Connect GitHub

1. **Select:** GitHub
2. **Authorize** Cloudflare to access your repos
3. **Choose your repository:** `My Music Website` (or whatever you named it)

### Step 4: Configure Build Settings

**Fill in these exact values:**

- **Project name:** `my-music-website` (or any name you like)
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave empty or as `/`)

### Step 5: Environment Variables (Optional - For Firebase Stats)

**Click "Add variable" and add these 3:**

1. **Variable name:** `FIREBASE_PROJECT_ID`
   - **Value:** (from your FIREBASE_SETUP.md file)

2. **Variable name:** `FIREBASE_CLIENT_EMAIL`
   - **Value:** (from your FIREBASE_SETUP.md file)

3. **Variable name:** `FIREBASE_PRIVATE_KEY`
   - **Value:** (from your FIREBASE_SETUP.md file - the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

### Step 6: Deploy!

1. **Click:** "Save and Deploy"
2. **Wait 2-3 minutes** for build to complete
3. **Your site will be live at:** `https://your-project-name.pages.dev`

### Step 7: Custom Domain (Optional - Later)

After deployment:
1. Go to your site → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain name
4. Follow DNS instructions

---

## 🎯 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Cloudflare account created
- [ ] Repository connected
- [ ] Build settings configured:
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `dist`
- [ ] Environment variables added (for Firebase)
- [ ] Deploy clicked
- [ ] Site is live!

---

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Cloudflare dashboard
- Make sure Node version is 20 (check `.nvmrc` file)

**Songs not loading?**
- Verify `dist/songs.json` exists after build
- Check browser console for errors

**Functions not working?**
- Cloudflare Pages uses Workers, not Netlify Functions
- We may need to convert functions to Cloudflare Workers format

---

**Need help?** Share any error messages you see!

