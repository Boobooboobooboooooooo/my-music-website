# Firebase Setup Checklist

## ✅ What You Need (Firestore Database - NOT Storage)

You need **Firestore Database**, not Firebase Storage. They are different:
- **Firestore Database** = NoSQL database (what we're using) ✅
- **Firebase Storage** = File storage (not needed) ❌

## Step-by-Step Verification

### 1. Verify Firestore is Enabled
- Go to Firebase Console: https://console.firebase.google.com/
- Select your project: `my-music-b80ac`
- Click **"Firestore Database"** in the left menu
- You should see the database interface (you already have this ✅)

### 2. Check Security Rules
- In Firestore Database, click the **"Rules"** tab
- Make sure the rules allow server-side access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /siteStats/{document} {
      // Allow server-side access only (via Netlify Functions)
      allow read, write: if false;
    }
    // Allow everything else for now (you can restrict later)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Important:** Since we're using server-side access (Netlify Functions with service account), the rules can be restrictive. The service account bypasses these rules.

### 3. Verify Service Account Permissions
- Go to Firebase Console → Project Settings → Service Accounts
- Make sure your service account has **Firebase Admin SDK Administrator Service Agent** role
- Or at minimum: **Cloud Datastore User** role

### 4. Check Database Location
- In Firestore Database → Settings
- Make sure you have a database location selected
- If it says "No location selected", you need to create the database first

### 5. Test Database Access
Try creating a document manually in Firebase Console:
- Go to Firestore Database → Data tab
- Click "+ Start collection"
- Collection ID: `siteStats`
- Document ID: `main`
- Add a field:
  - Field name: `totalVisits`
  - Type: `number`
  - Value: `0`
- Click "Save"

If you can create this manually, Firestore is working correctly.

## Common Issues

### Issue: "Permission denied"
**Solution:** Check security rules - they should allow server-side access or be permissive for testing

### Issue: "Database not found"
**Solution:** Make sure you created the database in production mode (not test mode)

### Issue: "Service account doesn't have permission"
**Solution:** Go to Google Cloud Console → IAM & Admin → IAM, find your service account email, and ensure it has "Cloud Datastore User" or "Firebase Admin SDK Administrator Service Agent" role

## Quick Test

After verifying everything above, redeploy your site and check Netlify function logs. You should see:
- "Firebase initialized successfully"
- "Firebase: Incremented visit" or "Firebase: Incremented play"

If you see errors, check the logs for specific error messages.

