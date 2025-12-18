# Firebase Environment Variables for Netlify

## ✅ Your Firebase Service Account Values

I've extracted the values from your service account file. Copy these exactly:

### Step 1: Go to Netlify
1. Open your site in Netlify Dashboard
2. Go to **Site settings** → **Environment variables**
3. Click **Add a variable** for each of the 3 variables below

### Step 2: Add These 3 Variables

#### Variable 1: FIREBASE_PROJECT_ID
**Key:** `FIREBASE_PROJECT_ID`  
**Value:** 
```
my-music-b80ac
```

#### Variable 2: FIREBASE_CLIENT_EMAIL
**Key:** `FIREBASE_CLIENT_EMAIL`  
**Value:**
```
firebase-adminsdk-fbsvc@my-music-b80ac.iam.gserviceaccount.com
```

#### Variable 3: FIREBASE_PRIVATE_KEY
**Key:** `FIREBASE_PRIVATE_KEY`  
**Value:** (Copy the ENTIRE key below - it's long, make sure you get it all)
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvsNtYq7RY142K
49OUslgbBq2BNuCGa6TTnFznomxxtV4arQWvg7lO46tz7lf9bwQrwsllbohBbDz4
K/lKw6cxy47farx41JkdZ9at3b0nXPOzvvIo3Fo5VMN+dtUbB6sD/lueOKVPOxTJ
LKaNC1IJQUG/JO7nH1ZxRakzGWt7fMNoL4tIncotwJ9sOWrxerRBbTqy4k1S6DO6
MqB7kELnin8P5qiri/CB6Dz6wyWJSQyMg0hag3uuavQv9pUTk7pfZEmTlJvxPAMo
T7mXfdxNJmbDLGz/gXP/9rzgBAQxx0mm02WFG6zLud/oWX9uYQB9WtnF+T+MF+o4
TLUBd4eBAgMBAAECggEAGgMbjsbUAQgKZwMb9fBBLDXdECcMWh/rkQBzHuvaQNb4
s7Fks0ZTnuhaymOCYpMCcT+PQEsmYFgCtOm/KKshgOAMa2wVszwi3rWGQErMG90J
dgDyQKDTY5lMXS0smH/A+b/krQniVoHprhluyq405grj4vA4cOl1C835DbLt9M6B
Prknlo2ZXfimSk2rRNsrh56ty6/dy0vC8VqbMfzBqtK/ZNc363F2/MRJYYtcanP6
m3g9FsBHcWZmzvyJrtRkKO/MDHFca9A/+kpRNXGec86WKkuT3TN2l2qo4755SVUf
qOg2Gp4q+SWRhND9JcFKMNwDoPiIqaQ/dMtmOuVtWwKBgQDmgsb2kZVlaX2nWsZF
/JD1N+uq0+b+35v/6RvAxBK5cwJzUJNqckPHLZyDRsicDyx8NACb5A0xUMHb32EL
hVLbuijdZ4H9BKXiHQ7BCNMQLPMWSVE89dIQDV4Euq3GJWQxe6WqYQBIkqki2DRg
XyCOuDFs5o240Eg0gvlMhWB7ywKBgQDDHkDumesfplaZl2TG3o4SfheTCUCBafch
6an4xzzsyR42hnmvapYSm3dEUfM63VLheIoL1WshNBSVS29G/Xg1aBKfFLVdSF+O
gazvZlzYwsf3bD6xHUiW76yyS7S6d7Pv29tSr5eFklqHHfKUuxG2ZucTjrJPCeGl
0xS9HlH4YwKBgHEOLSVbq+lMPvuo0twajsImhiiHu6C/7VQrcZgu0nwwQ0BpgZPQ
rRtwbHYabmPUMV5NZwsOY8YPNLVxLrim0EfCWy6UCLYe5HktBUJ54ILreOIyXWzH
qBqFY9pv8LDhP+3hFhSldK0jeV8EqVOm9GHrRxqBTXsadH+EyV7Vf8fXAoGBALjE
MWDAyHJUJbWUM45OueKxHMnT/Q2PtsKabqZypTLk0IN5nEmMeUhth+deYyHe69kv
OCo0kxoCI2us31cuN2L7hoa2KXiITFS6X3TkTg/Fg269RjCaNl8X30WHg0EAkZgV
bf9C4A1QpgFFTq2g6Aj+MNvISPmntdI9rGnaCG1ZAoGBAMXQS82vqnjihi0cb+O6
tOlLnt6lRlxCNFYwEdfT55caxCCKibW91HeNyC9KvE24i9kRcADgrfQ5tYpAPFK1
+sXcVTE+rCWizmKqvExww33hkVjt4XE3SCmbCYqXL+HhJg5aeuU/20dLMBW4CLho
aQ0SfacTr/NeDy3H44yy8xpm
-----END PRIVATE KEY-----
```

**⚠️ IMPORTANT:** When pasting the private key in Netlify, make sure to:
- Include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- Keep all the line breaks (Netlify will handle the `\n` characters automatically)
- Copy the ENTIRE key from BEGIN to END

---

## Alternative: Import from .env File

I've created a `.env.netlify` file in your project folder with all the values ready!

**To import in Netlify:**
1. Go to **Site settings** → **Environment variables**
2. Look for an **"Import from file"** or **"Upload .env file"** button
3. Select the `.env.netlify` file from your project folder
4. Netlify will automatically import all 3 variables

**Or manually add them:**
If the import option isn't available, you can still copy the values from this file and add them one by one in Netlify.

## Important Notes:

1. **Keep the private key secure** - Never commit it to Git (it's already in .gitignore)
2. **Copy the entire private key** - It should include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
3. **Keep the `\n` characters** - Netlify will handle them correctly
4. **After adding variables, redeploy** - Your site needs to be redeployed for the changes to take effect
5. **The .env.netlify file is in .gitignore** - It won't be committed to Git for security

## Testing

After deploying:
1. Visit your website
2. Play a song
3. Check the Stats page
4. The stats should now be shared across all users!

## Troubleshooting

If stats aren't updating:
1. Check Netlify function logs: Site → Functions → View logs
2. Verify all 3 environment variables are set correctly
3. Make sure Firestore is enabled in Firebase Console
4. Check that security rules allow server-side access

