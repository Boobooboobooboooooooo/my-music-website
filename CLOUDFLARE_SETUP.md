# Cloudflare Pages Setup Guide

## Step 1: Domain Setup

### Option A: Use Free Cloudflare Subdomain (Recommended for Start)
- **Leave domain field empty** or click "Skip"
- Cloudflare will give you: `your-site-name.pages.dev`
- You can add a custom domain later

### Option B: Use Your Own Domain
- Enter your domain (e.g., `example.com`)
- Cloudflare will guide you through DNS setup

**For now, I recommend Option A** - you can always add a custom domain later.

## Step 2: AI Crawler Settings

### For a Music Website:
**Choose: "Do not block (allow crawlers)"**

**Why?**
- Music sites benefit from being discoverable
- Your music metadata (song titles, artists) can be indexed
- No sensitive content to protect
- Better for SEO and sharing

**When to block:**
- Only if you have exclusive/private content
- If you're concerned about AI training on your music metadata
- For most music sites, blocking isn't necessary

## Step 3: Continue Setup

After choosing:
1. **Domain**: Skip or use free subdomain
2. **AI Crawlers**: "Do not block (allow crawlers)"
3. Click **Continue** or **Next**

## Step 4: Connect Your Repository

1. **Choose GitHub** (or GitLab/Bitbucket)
2. **Authorize Cloudflare** to access your repos
3. **Select your repository** (`My Music Website` or whatever you named it)
4. **Configure build:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (leave as is)

## Step 5: Environment Variables (For Firebase)

After deployment, add your Firebase credentials:
1. Go to **Pages** → Your site → **Settings** → **Environment variables**
2. Add:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

## Step 6: Deploy!

Click **Deploy** and wait ~2-3 minutes. Your site will be live!

---

## Quick Answers:

**Domain:** Skip (use free `.pages.dev` subdomain)  
**AI Crawlers:** "Do not block (allow crawlers)"  
**Continue:** Yes, proceed with setup

---

**Need help with any step?** Let me know!

