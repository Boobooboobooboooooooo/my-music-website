# Quick R2 Setup - Get Your Music Online

## Step 1: Create R2 Bucket (5 minutes)

1. **Go to:** https://dash.cloudflare.com
2. **Click:** "R2" in sidebar
3. **Click:** "Create bucket"
4. **Name:** `my-music-files`
5. **Click:** "Create bucket"

## Step 2: Enable Public Access

1. **Click on your bucket**
2. **Go to "Settings" tab**
3. **Enable "Public Access"**
4. **Note your public URL** (looks like: `https://pub-xxxxx.r2.dev`)

## Step 3: Upload Music Files

1. **In your bucket, click "Upload"**
2. **Upload your Music folder:**
   - Keep the folder structure (Blue Music, Rap:Trap Music, etc.)
   - Upload all MP3 files
   - This may take a while depending on file sizes

## Step 4: Update songs.json with R2 URLs

After uploading, run this command with your R2 URL:

```bash
cd "/Users/peewee/Desktop/My Music Website"
R2_BASE_URL="https://pub-xxxxx.r2.dev" npm run scan-music
```

**Replace `https://pub-xxxxx.r2.dev` with your actual R2 public URL!**

## Step 5: Push to GitHub

```bash
git add public/songs.json
git commit -m "Update songs.json with R2 URLs"
git push
```

## Step 6: Vercel Auto-Deploys

Vercel will automatically rebuild and your music will be live! 🎉

---

## Finding Your R2 Public URL

1. **In your R2 bucket, click on any file**
2. **Copy the "Public URL"** or **"R2.dev subdomain"**
3. **It should look like:** `https://pub-[random-id].r2.dev`

---

## Quick Test

After updating `songs.json`, you can test locally:
```bash
npm run dev
```

Your music should load from R2!

---

**Need help?** Share your R2 public URL and I'll help you update the files!

