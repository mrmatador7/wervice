# Google Drive API Setup Guide

This guide explains how to set up Google Drive API for automatic image detection from folders during vendor import.

## Why Set Up Google Drive API?

With Google Drive API configured, the import system can:
- ✅ Automatically list all images in a vendor's Google Drive folder
- ✅ Select the first image as the profile photo automatically
- ✅ Use remaining images as gallery (up to 10 images)
- ✅ No need to manually add individual image URLs to CSV

Without Google Drive API:
- ⚠️ You need to provide individual image URLs in CSV columns (`profile_photo`, `gallery_1`, etc.)
- ⚠️ Folder links will be accepted but images won't be automatically detected

## How to Check if Google Drive API is Set Up

### In the Admin Panel

1. Go to `/admin/vendors`
2. Click "Import CSV" button
3. Look for the **Google Drive API Status** indicator:
   - ✅ **Green**: API is configured and working
   - ⚠️ **Yellow**: API is not configured or not working

### Via API Endpoint

You can check the API status programmatically:

```bash
curl http://localhost:3000/api/admin/check-google-drive
```

Response examples:

**Configured and Working:**
```json
{
  "configured": true,
  "working": true,
  "message": "Google Drive API is configured and working correctly."
}
```

**Not Configured:**
```json
{
  "configured": false,
  "message": "Google Drive API key not found in environment variables.",
  "instructions": "Add GOOGLE_DRIVE_API_KEY to your .env.local file..."
}
```

## Setting Up Google Drive API

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "Wervice Vendor Import")
4. Click "Create"

### Step 2: Enable Google Drive API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click on "Google Drive API"
4. Click **Enable**

### Step 3: Create API Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key (you'll need it in the next step)
4. (Optional) Click "Restrict Key" to limit usage:
   - Under "API restrictions", select "Restrict key"
   - Choose "Google Drive API"
   - Click "Save"

### Step 4: Add API Key to Your Project

1. Open your `.env.local` file in the project root
2. Add the following line:

```bash
GOOGLE_DRIVE_API_KEY=your_actual_api_key_here
```

3. Replace `your_actual_api_key_here` with the API key you copied
4. Save the file
5. **Restart your development server** for changes to take effect

### Step 5: Verify Setup

1. Go to `/admin/vendors` → Click "Import CSV"
2. Check the Google Drive API status indicator
3. It should show ✅ **Configured & Working**

## How Profile Photo Selection Works

When Google Drive API is configured and you provide a `folder_link` in your CSV:

1. **System fetches all images** from the vendor's Google Drive folder
2. **Images are sorted alphabetically** by filename
3. **First image** = Profile Photo (automatically selected)
4. **Remaining images** = Gallery (up to 10 images)

### Example

If a vendor's folder contains:
- `Aarich Traiteur 1.jpg`
- `Aarich Traiteur 2.webp`
- `Aarich Traiteur 3.webp`
- `Aarich Traiteur 4.webp`
- `Aarich Traiteur.jpg` (logo)

The system will:
- Use `Aarich Traiteur 1.jpg` as **profile photo**
- Use `Aarich Traiteur 2.webp`, `Aarich Traiteur 3.webp`, `Aarich Traiteur 4.webp` as **gallery images**
- Use `Aarich Traiteur.jpg` as additional gallery image (if space available)

## CSV Format with Folder Links

Your CSV should include a `folder_link` column:

```csv
business_name,category,city,phone,email,description,folder_link
"Aarich Traiteur",catering,casablanca,"+212600000000","contact@aarich.ma","Traditional catering","https://drive.google.com/drive/folders/1sZ1KEBDqyShzvmg8QZ4N73FZD86uS-TQ"
"Beautiful Venue",venues,marrakech,"+212611111111","info@venue.com","Garden venue","https://drive.google.com/drive/folders/ANOTHER_FOLDER_ID"
```

## Important Notes

1. **Folder Permissions**: Make sure all Google Drive folders are set to **"Anyone with the link can view"**

2. **API Quotas**: Google Drive API has quotas:
   - Free tier: 1,000 requests per 100 seconds per user
   - For 800 vendors, you may need to process in batches or upgrade your quota

3. **Image Types**: Supported formats: JPEG, PNG, WebP, GIF

4. **File Naming**: Images are sorted alphabetically, so naming matters:
   - `1_logo.jpg` will come before `2_event.jpg`
   - Consider using numbered prefixes for desired order

## Troubleshooting

### "API key is invalid"
- Check that you copied the full API key
- Verify the key is not restricted incorrectly
- Make sure Google Drive API is enabled in your project

### "Insufficient permissions"
- Check API key restrictions
- Ensure Google Drive API is enabled
- Verify the API key has access to the folders

### "Folder link provided but API not configured"
- Add `GOOGLE_DRIVE_API_KEY` to `.env.local`
- Restart your development server
- Check the status indicator again

### Images not being found
- Verify folder permissions are set to "Anyone with the link can view"
- Check that the folder contains image files
- Ensure the folder_link URL is correct

## Security Best Practices

1. **Restrict API Key**: Limit the API key to only Google Drive API
2. **Environment Variables**: Never commit `.env.local` to git
3. **Key Rotation**: Rotate API keys periodically
4. **Monitor Usage**: Check Google Cloud Console for unusual activity

## Alternative: Without Google Drive API

If you don't want to set up the API, you can still import vendors by:

1. Adding individual image URLs to your CSV:
   ```csv
   business_name,category,city,phone,profile_photo,gallery_1,gallery_2
   "Vendor Name",catering,casablanca,"+212600000000","https://drive.google.com/file/d/FILE_ID/view?usp=sharing","https://drive.google.com/file/d/FILE_ID2/view?usp=sharing",""
   ```

2. The system will download and upload these images automatically


