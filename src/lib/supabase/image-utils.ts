/**
 * Utilities for downloading and uploading images from URLs (including Google Drive)
 */

interface ImageData {
  buffer: Buffer;
  contentType: string;
  extension: string;
}

/**
 * Convert Google Drive sharing link to direct download link
 * Supports both view and sharing links
 */
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;

  // If it's already a direct download link, return as-is
  if (url.includes('uc?id=') || url.includes('export=download')) {
    return url;
  }

  // Handle Google Drive sharing links
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    // Convert to direct download link
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  // Handle Google Drive folder links - will be processed separately
  if (url.includes('/folders/')) {
    // Return original URL, folder ID extraction is handled by getGoogleDriveFolderId
    return url;
  }

  // Return original URL if it doesn't match Google Drive patterns
  return url;
}

/**
 * Download image from URL (supports Google Drive, direct URLs, etc.)
 */
export async function downloadImage(url: string): Promise<ImageData | null> {
  try {
    // Convert Google Drive URL if needed
    const downloadUrl = convertGoogleDriveUrl(url);

    // Fetch the image
    const response = await fetch(downloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }

    // Get content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Determine file extension from content type
    const extensionMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    
    const extension = extensionMap[contentType] || 'jpg';

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return {
      buffer,
      contentType,
      extension,
    };
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    return null;
  }
}

/**
 * Upload image buffer to Supabase storage
 */
export async function uploadToStorage(
  buffer: Buffer,
  path: string,
  contentType: string,
  supabase: any
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vendor-files')
      .upload(path, buffer, {
        contentType,
        upsert: true, // Overwrite if exists
      });

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('vendor-files')
      .getPublicUrl(path);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Download and upload image from URL to Supabase storage
 * Returns the public URL of the uploaded image
 */
export async function downloadAndUploadImage(
  imageUrl: string,
  storagePath: string,
  supabase: any
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Download the image
    const imageData = await downloadImage(imageUrl);
    
    if (!imageData) {
      return {
        success: false,
        error: 'Failed to download image',
      };
    }

    // Determine full path with extension
    const fullPath = `${storagePath}.${imageData.extension}`;

    // Upload to storage
    return await uploadToStorage(imageData.buffer, fullPath, imageData.contentType, supabase);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get folder ID from Google Drive folder URL
 */
export function getGoogleDriveFolderId(folderUrl: string): string | null {
  if (!folderUrl) return null;
  
  const folderIdMatch = folderUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return folderIdMatch ? folderIdMatch[1] : null;
}

/**
 * Generate Google Drive file direct download URL from file ID
 */
export function getGoogleDriveFileUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Find images for a vendor in a Google Drive folder
 * Automatically selects first image as profile photo, rest as gallery
 */
export async function findVendorImagesInFolder(
  folderId: string,
  apiKey?: string
): Promise<{ profile?: string; gallery: string[] }> {
  if (!apiKey) {
    return { gallery: [] };
  }
  
  try {
    // List all image files in folder
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false+and+mimeType+contains+'image/'&fields=files(id,name,mimeType)&key=${apiKey}&orderBy=name`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Google Drive API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const imageFiles = data.files || [];
    
    // Sort by name to ensure consistent ordering (first image = profile)
    imageFiles.sort((a: any, b: any) => a.name.localeCompare(b.name));
    
    const result: { profile?: string; gallery: string[] } = { gallery: [] };
    
    if (imageFiles.length > 0) {
      // First image is automatically selected as profile photo
      result.profile = getGoogleDriveFileUrl(imageFiles[0].id);
      // Rest are gallery (up to 10)
      result.gallery = imageFiles.slice(1, 11).map((file: any) => getGoogleDriveFileUrl(file.id));
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    throw error;
  }
}

/**
 * Find images and videos for a vendor in a Google Drive folder
 * Automatically selects first image as profile photo, rest as gallery
 * Detects video files (MP4, MOV, etc.)
 */
export async function findVendorMediaInFolder(
  folderId: string,
  apiKey?: string
): Promise<{ profile?: string; gallery: string[]; video?: string }> {
  if (!apiKey) {
    return { gallery: [] };
  }
  
  try {
    // List all files in folder (images and videos)
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false+and+(mimeType+contains+'image/'+or+mimeType+contains+'video/')&fields=files(id,name,mimeType)&key=${apiKey}&orderBy=name`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Google Drive API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const allFiles = data.files || [];
    
    // Separate images and videos
    const imageFiles = allFiles.filter((file: any) => file.mimeType?.startsWith('image/'));
    const videoFiles = allFiles.filter((file: any) => file.mimeType?.startsWith('video/'));
    
    // Sort by name to ensure consistent ordering
    imageFiles.sort((a: any, b: any) => a.name.localeCompare(b.name));
    videoFiles.sort((a: any, b: any) => a.name.localeCompare(b.name));
    
    const result: { profile?: string; gallery: string[]; video?: string } = { gallery: [] };
    
    // First image is profile photo
    if (imageFiles.length > 0) {
      result.profile = getGoogleDriveFileUrl(imageFiles[0].id);
      // Rest are gallery (up to 10)
      result.gallery = imageFiles.slice(1, 11).map((file: any) => getGoogleDriveFileUrl(file.id));
    }
    
    // First video found
    if (videoFiles.length > 0) {
      result.video = getGoogleDriveFileUrl(videoFiles[0].id);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching folder media:', error);
    throw error;
  }
}

/**
 * Check if Google Drive API is configured
 */
export function isGoogleDriveApiConfigured(): boolean {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  return !!apiKey && apiKey !== 'your_google_drive_api_key_here' && !apiKey.includes('your_');
}

/**
 * Test Google Drive API connection
 */
export async function testGoogleDriveApi(apiKey?: string): Promise<{ success: boolean; message: string }> {
  const key = apiKey || process.env.GOOGLE_DRIVE_API_KEY;
  
  if (!key || key === 'your_google_drive_api_key_here' || key.includes('your_')) {
    return {
      success: false,
      message: 'Google Drive API key not configured. Please add GOOGLE_DRIVE_API_KEY to your .env.local file.'
    };
  }
  
  try {
    // Test API with a simple request (using a public test folder or file)
    const testResponse = await fetch(
      `https://www.googleapis.com/drive/v3/about?fields=user&key=${key}`,
      { method: 'GET' }
    );
    
    if (!testResponse.ok) {
      const errorData = await testResponse.json().catch(() => ({}));
      return {
        success: false,
        message: `API key is invalid or has insufficient permissions: ${errorData.error?.message || testResponse.statusText}`
      };
    }
    
    return {
      success: true,
      message: 'Google Drive API is configured and working correctly.'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error testing API: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

