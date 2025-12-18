# Testing Firebase Integration

## Quick Test Steps:

1. **Visit your website**: `https://fascinating-strudel-2ef307.netlify.app`

2. **Play a song** - This should increment Total Plays

3. **Check Stats page** - Go to the Stats page and note the numbers

4. **Open in a different browser/incognito** - Visit the site again from a different session

5. **Play another song** - The Total Plays should increase and be visible in both sessions

6. **Check Firebase Console**:
   - Go to https://console.firebase.google.com/
   - Select your project: `my-music-b80ac`
   - Go to Firestore Database
   - Look for collection: `siteStats`
   - Document ID: `main`
   - You should see `totalVisits` and `totalPlays` fields updating

## What to Look For:

✅ **Working correctly if:**
- Stats update when you play songs
- Stats are shared across different browsers/devices
- Numbers persist after refreshing the page
- Firebase Console shows the data updating

❌ **Not working if:**
- Stats only show locally (not shared)
- Numbers reset when you refresh
- Errors in Netlify function logs
- Firebase Console shows no data

## Check Netlify Function Logs:

1. Go to Netlify Dashboard
2. Click "Functions" in the sidebar
3. Click on `get-stats` or `update-stats`
4. Check the logs for any errors

Common errors:
- "Firebase initialization error" - Check environment variables
- "Permission denied" - Check Firestore security rules
- "Collection not found" - First request will create it automatically

