# iOS App - Quick Start Guide

## ✅ Setup Complete!

Your React app is now configured as an iOS app using Capacitor.

## Next Steps

### 1. Install Xcode (If Not Already Installed)

1. Open **App Store**
2. Search for **"Xcode"**
3. Install (free, but large ~15GB)
4. Open Xcode once to accept license agreement

### 2. Install CocoaPods

```bash
sudo gem install cocoapods
```

### 3. Install iOS Dependencies

```bash
cd ios/App
pod install
cd ../..
```

### 4. Open in Xcode

```bash
npm run cap:ios
```

Or manually:
```bash
npx cap open ios
```

### 5. Configure App in Xcode

1. **Select the project** in left sidebar
2. **General tab:**
   - **Display Name:** "My Music"
   - **Bundle Identifier:** `com.mymusic.app` (or change to your own)
   - **Version:** 1.0.0
   - **Build:** 1

3. **Signing & Capabilities:**
   - Check **"Automatically manage signing"**
   - Select your **Team** (or add Apple ID)
   - Xcode will handle signing automatically

### 6. Add App Icon

1. In Xcode, go to **Assets.xcassets**
2. Click **AppIcon**
3. Drag your icon files:
   - 1024x1024 (required for App Store)
   - Or use the icons from `public/icon-512.png`

### 7. Run the App

**Option A: iOS Simulator**
- Click the device selector (top left)
- Choose an iPhone simulator
- Click the **Play** button (▶️)

**Option B: Real iPhone**
- Connect iPhone via USB
- Trust computer on iPhone
- Select your iPhone in device selector
- Click **Play** button
- On iPhone: Settings → General → VPN & Device Management → Trust developer

## Building for App Store

### 1. Archive the App

1. In Xcode: **Product** → **Archive**
2. Wait for build to complete
3. **Distribute App** window opens

### 2. Distribute

- **App Store Connect** (for App Store)
- **Ad Hoc** (for testing)
- **Development** (for development)

## Important Notes

✅ **Music Files:** Your `Music` folder is automatically included in the app bundle  
✅ **Offline:** App works completely offline  
✅ **No Hosting:** No server or hosting costs needed  
✅ **Free:** Apple Developer account is free (for personal use)  

## Troubleshooting

**"No such module 'Capacitor'"**
```bash
cd ios/App
pod install
```

**Build errors:**
- Make sure Xcode is updated
- Clean build folder: **Product** → **Clean Build Folder**

**Music not playing:**
- Check that `Music` folder exists in `dist/Music` after build
- Verify `songs.json` has correct paths

## Commands Reference

```bash
# Build and sync
npm run cap:build

# Open in Xcode
npm run cap:ios

# Sync only
npm run cap:sync
```

---

**Your iOS app is ready!** 🎉

Just open it in Xcode and run it!

