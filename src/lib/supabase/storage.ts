import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Download an image from a URL with timeout and size limits
 */
export async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string; extension: string } | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Wervice-Import/1.0'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('Image too large (>5MB)');
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Infer extension from content-type
    let extension = 'jpg'; // default
    if (contentType.includes('png')) extension = 'png';
    else if (contentType.includes('jpeg') || contentType.includes('jpg')) extension = 'jpg';
    else if (contentType.includes('webp')) extension = 'webp';
    else if (contentType.includes('gif')) extension = 'gif';

    return { buffer, contentType, extension };
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error);
    return null;
  }
}

/**
 * Upload a buffer to Supabase storage
 */
export async function uploadToStorage(
  buffer: Buffer,
  path: string,
  contentType: string,
  maxRetries: number = 2
): Promise<UploadResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.storage
        .from('vendor-files')
        .upload(path, buffer, {
          contentType,
          upsert: false
        });

      if (error) {
        if (attempt === maxRetries) {
          return { success: false, error: error.message };
        }
        console.warn(`Upload attempt ${attempt + 1} failed, retrying:`, error.message);
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('vendor-files')
        .getPublicUrl(path);

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      if (attempt === maxRetries) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown upload error'
        };
      }
      console.warn(`Upload attempt ${attempt + 1} failed, retrying:`, error);
    }
  }

  return { success: false, error: 'Max retries exceeded' };
}

