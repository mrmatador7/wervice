# Vendor Import from Sheet

Use this folder for your **Vendors - Sheet** data before uploading to the website.

## Columns (from your sheet)

| Column       | Required | Description                                      |
|-------------|----------|--------------------------------------------------|
| Vendor      | Yes      | Business name                                    |
| Category    | Yes      | e.g. catering, venues, beauty, decor, photography|
| City        | Yes      | e.g. Marrakech, Casablanca, Rabat                |
| Phone       | Yes      | WhatsApp format: +212XXXXXXXXX                   |
| Email       | No       | Contact email                                    |
| Description | No       | Business description                             |
| Google Maps | No       | Link to Google Maps location                     |
| IG          | No       | Instagram handle                                 |
| Include     | Yes*     | Put **yes** for rows to import (green background)|

## Import only green-background rows

CSV files don't store cell colors. To import only vendors with green background:

1. **In your Google Sheet** ("Vendors - Sheet"): add a column called **Include**
2. For each row with **green background**, put `yes` in the Include column
3. For rows you don't want to import, leave Include empty or put `no`
4. **File → Download → CSV** (Comma Separated Values)
5. Save the CSV to this folder or use it in **Admin → Vendors → Import CSV**

## Upload to website

1. Go to **Admin → Vendors** (`/admin/vendors`)
2. Click **Import CSV**
3. Upload your CSV file
4. Optionally paste a Google Drive folder link to attach images (match vendor names to subfolder names)
5. Wait for the import to finish

## Optional: images from Google Drive

Add columns `profile_photo`, `gallery_1`, `gallery_2`, etc. with Google Drive sharing links, or provide one master folder link when importing (subfolders named after vendors will be matched).

## Normalize categories (assign vendors to Wervice categories)

If you have a **vendors list.csv** with columns **Vendor** and **Category**, you can assign all vendors to the correct Wervice categories (e.g. photographers/videographers → Photo & Film, catering/caterer → Caterer, negafa → Negafa, makeup/beauty → Beauty, event planners → Event Planner).

1. Save your CSV as **vendors list.csv** in this folder (`vendor/`) or in the project root.
2. Run:
   ```bash
   node scripts/normalize-vendor-categories.mjs
   ```
   Or with a custom path:
   ```bash
   node scripts/normalize-vendor-categories.mjs "vendor/vendors list.csv"
   ```
3. To preview without updating the database:
   ```bash
   node scripts/normalize-vendor-categories.mjs --dry-run
   ```

The script maps raw category names to: Florist, Dresses, Venue, Beauty, Photo & Film, Caterer, Decor, Negafa, Artist, Event Planner, Cakes.

## Fixing bad data already in the database

If `vendor_leads` has rows where **category** or **city** contain description text, URLs, or other garbage (e.g. from a CSV with unquoted commas), run the cleanup script:

```bash
# Preview what would be fixed
node scripts/cleanup-vendor-leads-category-city.mjs --dry-run

# Apply fixes (bad category → "unidentified", bad city → "Unidentified")
node scripts/cleanup-vendor-leads-category-city.mjs
```

Then fix or delete those rows in Admin → Vendors, or re-import from a correct CSV.

## Avoiding chaos in future imports

- **Use a proper CSV**: If your **Description** (or other columns) contain commas, the file must use **quoted fields** (e.g. `"text with, commas"`). The import script now uses a robust CSV parser (`csv-parse`) so quoted commas and newlines are handled correctly.
- **Validation**: Rows where Category or City look like descriptions or URLs are **skipped** on import (not inserted). Only valid-looking categories (from the Wervice list) and short, non-URL city names are accepted.

## Updating vendor pictures from R2 (Cloudflare)

If vendor images are stored in **R2** and listed in the Supabase **media_files** table (`vendor_name`, `file_key`, `mime_type`), you can sync them to `vendor_leads` (logo_url, gallery_urls) so they show on the site:

```bash
# Preview what would be updated
node scripts/sync-vendor-images-from-r2.mjs --dry-run

# Apply updates (sets logo_url and gallery_urls from R2 URLs)
node scripts/sync-vendor-images-from-r2.mjs
```

Or run **npm run sync-r2-media**. The script uses `NEXT_PUBLIC_MEDIA_BASE_URL` from `.env.local` (default `https://media.wervice.com`) to build image URLs. You can also use the **Sync R2 Media** button on Admin → Vendors.
