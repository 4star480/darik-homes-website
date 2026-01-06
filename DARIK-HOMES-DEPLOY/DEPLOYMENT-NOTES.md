# Deployment Notes for DARIK HOMES Website

## Critical: Images Folder Must Be Deployed

The `images` folder MUST be included in your Git repository and deployed to Netlify. 

### To Fix Image Loading Issues:

1. **Ensure images folder is in Git:**
   ```bash
   git add images/
   git commit -m "Add images folder"
   git push
   ```

2. **Verify Netlify Deployment:**
   - Check Netlify deployment logs to ensure the `images` folder is included
   - The folder structure should be: `images/New-folder/Under-properties/` etc.

3. **If using Netlify Drag & Drop:**
   - Make sure to include the entire `images` folder when uploading
   - The folder structure must be preserved

4. **Check .gitignore:**
   - Ensure `images/` is NOT in `.gitignore`
   - If it is, remove it and commit again

## Fixed Issues:

1. ✅ JavaScript error fixed: Added null check for `contactForm`
2. ✅ Folder names changed from spaces to hyphens: `New-folder`, `Under-properties`, `Current-projects`
3. ✅ Image paths use URL encoding for spaces in filenames
4. ✅ Date format corrected: `2025-12-19` (not `202025-12-19`)

## Image Path Format:

All image paths use this format:
- Folders: `New-folder/Under-properties/` (hyphens, no encoding)
- Files: `WhatsApp%20Image%2025-12-19%20at%2021.20.40_c0c9972c.jpg` (URL encoded spaces)

Example full path:
```
images/New-folder/Under-properties/WhatsApp%20Image%2025-12-19%20at%2021.20.40_c0c9972c.jpg
```

## Next Steps:

1. Commit all changes including the `images` folder
2. Push to your repository
3. Wait for Netlify to redeploy
4. Clear browser cache (Ctrl+Shift+R)
5. Verify images load correctly



