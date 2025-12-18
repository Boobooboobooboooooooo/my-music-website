# Setting Up Persistent Statistics

The website now supports persistent statistics that are shared across all users and persist even after website updates.

## How It Works

- **Total Visits** and **Total Plays** are now stored server-side
- Stats are shared across all users
- Stats persist even when you update the website
- Falls back to localStorage if the database isn't configured

## Setup Instructions

### Option 1: Using Firebase Firestore (Recommended - Free Tier Available)

Firebase is an excellent choice for this! It's reliable, scalable, and has a generous free tier.

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (or use existing)
2. Enable **Firestore Database**:
   - Go to "Firestore Database" in the left menu
   - Click "Create database"
   - Start in **production mode** (we'll set up security rules)
   - Choose a location close to your users
3. Set up Security Rules (optional but recommended):
   - Go to Firestore → Rules
   - Set rules to allow server-side only access:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /siteStats/{document} {
         allow read, write: if false; // Only server-side access
       }
     }
   }
   ```
4. Create a Service Account:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
5. Add Environment Variables in Netlify:
   - Go to your Netlify site → Site settings → Environment variables
   - Add these variables from your service account JSON:
     - `FIREBASE_PROJECT_ID` = Your project ID
     - `FIREBASE_CLIENT_EMAIL` = client_email from the JSON
     - `FIREBASE_PRIVATE_KEY` = private_key from the JSON (keep the `\n` characters)
6. Install Firebase Admin in Netlify Functions:
   - The functions will automatically use Firebase if these env vars are set
   - No additional code changes needed!

**Note**: The Firestore collection will be created automatically when the first update happens. The document ID will be `main` in the `siteStats` collection.

### Option 2: Using JSONBin.io (Free, No Credit Card Required)

1. Go to [JSONBin.io](https://jsonbin.io/) and create a free account
2. Create a new bin with this content:
   ```json
   {
     "totalVisits": 0,
     "totalPlays": 0,
     "lastVisit": 0
   }
   ```
3. Copy the Bin ID (looks like: `507f1f77bcf86cd799439011`)
4. Get your Master Key from your account settings
5. In Netlify, go to your site settings → Environment variables
6. Add these environment variables:
   - `STATS_BIN_ID` = Your Bin ID
   - `JSONBIN_MASTER_KEY` = Your Master Key

### Option 2: Using Supabase (Free Tier Available)

1. Go to [Supabase](https://supabase.com/) and create a free account
2. Create a new project
3. Create a table called `site_stats` with columns:
   - `id` (text, primary key) = 'main'
   - `total_visits` (integer) = 0
   - `total_plays` (integer) = 0
   - `last_visit` (timestamp)
4. Get your API URL and anon key
5. Update the Netlify functions to use Supabase instead of JSONBin
6. Add environment variables in Netlify:
   - `SUPABASE_URL` = Your Supabase URL
   - `SUPABASE_ANON_KEY` = Your anon key

### Option 3: Using FaunaDB (Free Tier Available)

1. Go to [Fauna](https://fauna.com/) and create a free account
2. Create a new database
3. Create a collection called `site_stats`
4. Create a document with ID `main` containing:
   ```json
   {
     "totalVisits": 0,
     "totalPlays": 0,
     "lastVisit": 0
   }
   ```
5. Create an API key
6. Update the Netlify functions to use Fauna
7. Add environment variable in Netlify:
   - `FAUNA_SECRET` = Your Fauna secret key

## Installing Dependencies

For Firebase support, you need to install the Firebase Admin SDK in your Netlify Functions:

1. Create a `package.json` in the `netlify/functions` directory (already created)
2. The build process will automatically install dependencies
3. Or manually run: `cd netlify/functions && npm install`

## Current Status

If no database is configured, the functions will:
- Still work and track stats locally
- Fall back to localStorage
- Display stats correctly, but they won't be shared across users

## Why Firebase is Great for This

✅ **Free tier**: 50K reads/day, 20K writes/day (more than enough for most sites)  
✅ **Real-time**: Updates are instant  
✅ **Reliable**: Google's infrastructure  
✅ **Scalable**: Grows with your site  
✅ **Easy setup**: Just add environment variables  
✅ **Secure**: Server-side only access

## Testing

After setup, you can test by:
1. Visiting the website from different devices/browsers
2. Playing some songs
3. Checking the Stats page - numbers should be shared across all sessions

## Notes

- Song-specific stats (likes, individual play counts) remain local to each user
- Only site-wide stats (Total Visits, Total Plays) are shared
- The system gracefully falls back to localStorage if the API is unavailable

