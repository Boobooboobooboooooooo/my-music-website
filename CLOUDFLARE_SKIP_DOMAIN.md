# How to Skip Domain on Cloudflare Pages

## ✅ Solution: Leave Domain Field EMPTY

### Step-by-Step:

1. **On the domain page, you see:**
   ```
   Enter an existing domain
   Or register a new domain
   [example.com]  ← This field
   ```

2. **What to do:**
   - **DELETE** any text in the domain field (make it completely empty)
   - **DO NOT** enter "example.com" or anything else
   - **LEAVE IT BLANK**

3. **Then click:**
   - **"Continue"** button
   - **"Next"** button
   - **"Skip"** button (if visible)
   - **"Deploy"** button (if visible)

### Why "Invalid domain" error?
- You probably entered "example.com" or some text
- Cloudflare is checking if it's a valid domain
- **Solution: Leave it completely empty!**

---

## 🎯 Alternative: Look for These Buttons

If leaving it empty doesn't work, look for:

- **"Skip domain setup"** (usually at bottom)
- **"Continue without domain"**
- **"Set up domain later"**
- **"Use Pages subdomain"**
- **"I don't have a domain"**

---

## 📝 What Happens Next:

After skipping/leaving empty:
1. Cloudflare will automatically create your site
2. You'll get a free URL: `https://your-project-name.pages.dev`
3. You can add a custom domain later (optional)

---

## ⚠️ Important:

**DO NOT enter:**
- ❌ example.com
- ❌ your-domain.com
- ❌ Any domain name

**DO THIS:**
- ✅ Leave field completely empty
- ✅ Click Continue/Next

---

**Your site will work perfectly with the free `.pages.dev` subdomain!**

