import { createClient } from "@/utils/supabase/client";

export interface UploadResult {
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    path: string;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percent: number;
}

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - Storage bucket name
 * @param folder - Optional folder path
 * @returns Upload result with URL and metadata
 */
export async function uploadToStorage(
    file: File,
    bucket: string = 'claim-photos',
    folder?: string
): Promise<UploadResult> {
    const supabase = createClient();

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 11);
    const fileName = `${timestamp}-${randomStr}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
        });

    if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return {
        url: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        path: data.path,
    };
}

/**
 * Upload multiple files to Supabase Storage
 * @param files - Array of files to upload
 * @param bucket - Storage bucket name
 * @param folder - Optional folder path
 * @param onProgress - Optional callback for upload progress
 * @returns Array of upload results
 */
export async function uploadMultipleToStorage(
    files: File[],
    bucket: string = 'claim-photos',
    folder?: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Report starting progress
        if (onProgress) {
            onProgress(i, { loaded: 0, total: file.size, percent: 0 });
        }

        try {
            const result = await uploadToStorage(file, bucket, folder);
            results.push(result);

            // Report completion
            if (onProgress) {
                onProgress(i, { loaded: file.size, total: file.size, percent: 100 });
            }
        } catch (error) {
            console.error(`Failed to upload file ${i}:`, error);
            throw error;
        }
    }

    return results;
}

/**
 * Delete a file from Supabase Storage
 * @param path - File path in storage
 * @param bucket - Storage bucket name
 */
export async function deleteFromStorage(
    path: string,
    bucket: string = 'claim-photos'
): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

    if (error) {
        console.error('Delete error:', error);
        throw new Error(`Delete failed: ${error.message}`);
    }
}

/**
 * Validate file before upload
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB
 * @param allowedTypes - Allowed MIME types
 * @returns Validation result
 */
export function validateFile(
    file: File,
    maxSizeMB: number = 5,
    allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
): { valid: boolean; error?: string } {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Desteklenmeyen dosya formatı: ${file.type}. İzin verilen formatlar: JPG, PNG, WebP`,
        };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return {
            valid: false,
            error: `Dosya boyutu çok büyük (${(file.size / 1024 / 1024).toFixed(2)} MB). Maksimum: ${maxSizeMB} MB`,
        };
    }

    return { valid: true };
}
