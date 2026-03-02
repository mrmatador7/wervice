# Bulk Vendor Import Guide

This guide explains how to bulk import 800 vendors from a spreadsheet with images from Google Drive.

## Overview

The Wervice admin panel supports bulk importing vendors via CSV files. The system can automatically:
- Import vendor data from CSV files
- Download images from Google Drive sharing links
- Upload images to Supabase storage
- Create vendor records in the database

## Step-by-Step Instructions

### 1. Prepare Your Spreadsheet

Your spreadsheet should have the following columns:

**Required Columns:**
- `business_name` - The vendor's business name
- `category` - One of: `venues`, `catering`, `photo_video`, `event_planner`, `beauty`, `decor`, `music`, `dresses`
- `city` - One of: `marrakech`, `casablanca`, `rabat`, `tangier`, `agadir`, `fes`, `meknes`, `elJadida`, `kenitra`
- `phone` - Phone number (WhatsApp format: +212XXXXXXXXX)

**Optional Columns:**
- `email` - Email address
- `description` - Business description
- `profile_photo` - Google Drive link to profile photo
- `gallery_1` through `gallery_10` - Google Drive links to gallery images

### 2. Prepare Google Drive Images

1. **Organize your images:**
   - Create a folder structure in Google Drive (e.g., one folder per vendor)
   - Or organize by vendor name

2. **Get sharing links:**
   - For each image, right-click → "Get link" or "Share"
   - Make sure the link is set to "Anyone with the link can view"
   - Copy the sharing link (format: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`)

3. **Add links to your spreadsheet:**
   - Add the profile photo link in the `profile_photo` column
   - Add gallery image links in `gallery_1`, `gallery_2`, etc. columns
   - You can have up to 10 gallery images per vendor

### 3. Export to CSV

1. Open your spreadsheet (Google Sheets, Excel, etc.)
2. Export or save as CSV format
3. Make sure the CSV uses UTF-8 encoding to handle special characters

### 4. Import via Admin Panel

1. **Navigate to Admin Panel:**
   - Go to `/admin/vendors` (you need admin access)
   - Log in with an admin account

2. **Open Import Dialog:**
   - Click the "Import CSV" button in the top right
   - Or use the upload icon in the vendors page header

3. **Download Template (Optional):**
   - Click "Download CSV Template" to see the exact format
   - Use this as a reference for column names

4. **Upload Your CSV:**
   - Click "Choose File" or drag and drop your CSV file
   - The system will validate the file format
   - Wait for the import to complete (this may take several minutes for 800 vendors)

5. **Review Results:**
   - The system will show:
     - Total vendors processed
     - Number of successful imports
     - Number of failed imports
     - List of errors (if any)
     - Warnings about image uploads

### 5. How Image Import Works

The system automatically:
1. **Converts Google Drive links:** Sharing links are converted to direct download links
2. **Downloads images:** Images are downloaded from Google Drive
3. **Uploads to Supabase:** Images are uploaded to Supabase storage bucket
4. **Updates vendor records:** Vendor records are updated with image URLs

**Supported URL formats:**
- Google Drive sharing links: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- Direct download links: `https://drive.google.com/uc?export=download&id=FILE_ID`
- Any public image URL: `https://example.com/image.jpg`

**Note:** 
- Images must be publicly accessible (not restricted)
- Large images may take time to process
- If an image fails to download, the vendor will still be created but without that image

## CSV Format Example

```csv
business_name,category,city,phone,email,description,profile_photo,gallery_1,gallery_2
"Beautiful Venue",venues,marrakech,"+212600000000","contact@venue.com","Stunning garden venue","https://drive.google.com/file/d/ABC123/view?usp=sharing","https://drive.google.com/file/d/DEF456/view?usp=sharing","https://drive.google.com/file/d/GHI789/view?usp=sharing"
"Chef Mohamed",catering,casablanca,"+212611111111","info@chef.ma","Traditional cuisine","https://drive.google.com/file/d/JKL012/view?usp=sharing","",""
```

## Troubleshooting

### Common Issues

1. **"Invalid category" error:**
   - Make sure category names match exactly: `venues`, `catering`, `photo_video`, etc.
   - Check for typos or extra spaces

2. **"Invalid city" error:**
   - Use lowercase city names: `marrakech` not `Marrakech`
   - Check the list of valid cities in the instructions

3. **Image upload failures:**
   - Ensure Google Drive links are set to "Anyone with the link can view"
   - Check that the file ID in the URL is correct
   - Try using direct download links instead

4. **CSV parsing errors:**
   - Make sure your CSV uses UTF-8 encoding
   - Check for unclosed quotes in text fields
   - Ensure commas inside text are properly quoted

5. **Import timeout:**
   - For large imports (800+ vendors), the process may take 10-30 minutes
   - Don't close the browser tab during import
   - Check the browser console for detailed error messages

### Best Practices

1. **Test with a small batch first:**
   - Import 5-10 vendors first to test the format
   - Fix any issues before importing all 800

2. **Organize images:**
   - Use consistent naming for image files
   - Keep a backup of your original spreadsheet

3. **Monitor progress:**
   - Watch the import progress indicator
   - Review error messages carefully
   - Fix common issues and re-import failed vendors

4. **Verify after import:**
   - Check a few vendors in the admin panel
   - Verify images are displaying correctly
   - Test vendor pages on the public site

## Technical Details

### Image Processing

- Images are downloaded from URLs (including Google Drive)
- Converted to appropriate format (JPEG, PNG, WebP)
- Uploaded to Supabase storage bucket: `vendor-files`
- Stored in path: `vendors/{vendor_id}/profile.{ext}` and `vendors/{vendor_id}/gallery/{index}.{ext}`

### Database Tables

Vendors are inserted into:
- `vendor_leads` - Admin/managed vendor data
- `vendors` - Public-facing vendor data (optional, can be published later)

### Performance

- Images are processed sequentially to avoid overwhelming the server
- Each vendor import includes:
  - Database insert (~100ms)
  - Image download (~1-5s per image)
  - Image upload (~1-3s per image)
- For 800 vendors with 3 images each: ~30-60 minutes total

## Support

If you encounter issues:
1. Check the error messages in the import results
2. Review the browser console for detailed errors
3. Verify your CSV format matches the template
4. Ensure Google Drive links are publicly accessible






