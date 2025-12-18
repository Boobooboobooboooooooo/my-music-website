# Build Troubleshooting Guide

## Common Issues on Netlify

### Issue: Music Folder Not Found

**Problem:** The `Music` folder is not committed to Git (it's in `.gitignore`), so it doesn't exist on Netlify during build.

**Solution:** The build scripts now handle this gracefully:
- `scan-music.js` will create an empty `songs.json` if the Music folder doesn't exist
- The build will complete successfully even without music files
- You can upload music files later through Netlify's file upload or by committing them

### Issue: Node Version Mismatch

**Problem:** Some packages require Node 20, but Netlify is using Node 18.

**Solution:** 
- `.nvmrc` is set to `20`
- `netlify.toml` has `NODE_VERSION = "20"`
- `package.json` has `engines.node = ">=20.0.0"`

If you still see Node version errors, check:
1. Netlify site settings → Build & deploy → Environment
2. Ensure Node version is set to 20 (or auto-detect from `.nvmrc`)

### Issue: Build Fails During Icon Generation

**Problem:** Icon generation script fails.

**Solution:** The script now handles errors gracefully and won't fail the build. Icons are optional for the build to succeed.

### Issue: TypeScript Errors

**Problem:** TypeScript compilation fails.

**Solution:** 
- Check `tsconfig.json` for correct configuration
- Ensure all TypeScript files have proper types
- Run `npm run lint` locally to catch errors before deploying

## Manual Music Upload to Netlify

Since the Music folder isn't in Git, you have two options:

### Option 1: Commit Music Folder (Not Recommended for Large Files)

1. Remove `Music` from `.gitignore` (temporarily)
2. Commit and push music files
3. **Warning:** This will make your repo large and slow

### Option 2: Upload After Deployment (Recommended)

1. Deploy the site without music files
2. Use Netlify's file upload or drag-and-drop to add music files
3. Or use Netlify's Large Media feature for large files

### Option 3: Use External Storage

1. Upload music files to a CDN (like AWS S3, Cloudflare R2, etc.)
2. Update `scan-music.js` to fetch from the CDN
3. Or manually create `songs.json` with CDN URLs

## Checking Build Logs

1. Go to Netlify Dashboard → Your Site → Deploys
2. Click on the failed deploy
3. Check the build logs for specific error messages
4. Look for:
   - Node version warnings
   - Missing file errors
   - Permission errors
   - Package installation errors

## Quick Fixes

### Reset Build Cache
1. Netlify Dashboard → Site settings → Build & deploy
2. Click "Clear cache and retry deploy"

### Force Rebuild
1. Netlify Dashboard → Deploys
2. Click "Trigger deploy" → "Clear cache and deploy site"

### Check Environment Variables
1. Netlify Dashboard → Site settings → Environment variables
2. Ensure no conflicting variables are set

