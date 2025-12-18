# Cloudflare R2 Setup Guide - Step by Step

## Step 1: Create R2 Bucket

1. **Go to Cloudflare Dashboard:**
   - Visit: https://dash.cloudflare.com
   - Sign in to your account

2. **Navigate to R2:**
   - Click **"R2"** in the left sidebar
   - Click **"Create bucket"**

3. **Configure Bucket:**
   - **Bucket name:** `my-music-files` (or any name)
   - **Location:** Choose closest to you (or default)
   - Click **"Create bucket"**

## Step 2: Make Bucket Public

1. **Go to your bucket** → Click on it
2. **Go to Settings tab**
3. **Public Access:**
   - Enable **"Public Access"**
   - This allows your website to access the files

## Step 3: Upload Music Files

### Option A: Using Cloudflare Dashboard (Easier)

1. **In your bucket, click "Upload"**
2. **Upload your entire Music folder structure:**
   - Keep the folder structure (Blue Music, Rap:Trap Music, etc.)
   - Upload all MP3 files

### Option B: Using R2 API/CLI (Faster for many files)

I can help you set this up if you prefer.

## Step 4: Get Public URLs

After uploading, each file will have a public URL like:
```
https://pub-[random-id].r2.dev/Music/Blue%20Music%20/Do%20The%20Soul%20Glide.mp3
```

**To find your public URL:**
1. Click on a file in your bucket
2. Copy the **"Public URL"** or **"R2.dev subdomain"** URL

## Step 5: Update songs.json

Once you have the R2 URLs, I'll help you update `songs.json` to use them.

---

## Quick Start Commands

After setting up R2, I can help you:
1. Update `scan-music.js` to generate R2 URLs automatically
2. Or manually update `songs.json` with R2 URLs
3. Push the changes to GitHub

---

**Ready to start?** Create the bucket first, then let me know and I'll help with the rest!

