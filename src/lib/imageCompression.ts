/**
 * Image compression utility
 * Compresses images before uploading to Google Drive
 */

interface CompressionOptions {
  maxSizeKB?: number; // Maximum file size (KB)
  quality?: number; // JPEG quality (0-1)
  maxWidth?: number; // Maximum width
  maxHeight?: number; // Maximum height
}

/**
 * Compress image using canvas
 */
function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxSizeKB = 200,
    quality = 0.8,
    maxWidth = 1200,
    maxHeight = 1200
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions (maintaining aspect ratio)
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw the image
        ctx?.drawImage(img, 0, 0, width, height);

        // Try quality settings
        let currentQuality = quality;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to blob conversion failed'));
                return;
              }

              const sizeKB = blob.size / 1024;
              console.log(`Compressed image: ${sizeKB.toFixed(2)}KB (quality: ${currentQuality})`);

              // Check size
              if (sizeKB <= maxSizeKB || currentQuality <= 0.1) {
                // Keep filename but change extension to jpeg
                const fileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
                const compressedFile = new File([blob], fileName, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                
                resolve(compressedFile);
              } else {
                // Reduce quality and try again
                currentQuality -= 0.1;
                tryCompress();
              }
            },
            'image/jpeg',
            currentQuality
          );
        };

        tryCompress();
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Image load failed'));
    };

    // Load the image
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('File read failed'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compress multiple images
 */
export async function compressImages(
  files: File[],
  options?: CompressionOptions
): Promise<File[]> {
  const results: File[] = [];
  
  for (const file of files) {
    try {
      console.log(`Compressing ${file.name} (${(file.size / 1024).toFixed(2)}KB)...`);
      
      const compressedFile = await compressImage(file, options);
      const originalSize = (file.size / 1024).toFixed(2);
      const compressedSize = (compressedFile.size / 1024).toFixed(2);
      const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
      
      console.log(`✅ ${file.name}: ${originalSize}KB → ${compressedSize}KB (${compressionRatio}% compression)`);
      
      results.push(compressedFile);
    } catch (error) {
      console.error(`❌ Failed to compress ${file.name}:`, error);
      // Use original file if compression fails
      results.push(file);
    }
  }
  
  return results;
}

/**
 * Compress single file
 */
export async function compressImageFile(
  file: File,
  options?: CompressionOptions
): Promise<File> {
  return compressImage(file, options);
}

/**
 * Dosya boyutunu kontrol et ve gerekirse sıkıştır
 */
export async function processImageFile(
  file: File,
  options?: CompressionOptions
): Promise<File> {
  const maxSizeKB = options?.maxSizeKB || 200;
  const currentSizeKB = file.size / 1024;
  
  if (currentSizeKB <= maxSizeKB) {
    console.log(`✅ ${file.name} already under ${maxSizeKB}KB (${currentSizeKB.toFixed(2)}KB)`);
    return file;
  }
  
  console.log(`🔄 Compressing ${file.name} (${currentSizeKB.toFixed(2)}KB > ${maxSizeKB}KB)`);
  return compressImageFile(file, options);
}

/**
 * Varsayılan sıkıştırma ayarları
 */
export const DEFAULT_COMPRESSION_OPTIONS: CompressionOptions = {
  maxSizeKB: 200,
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 1200
};

/**
 * Dosya boyutunu KB cinsinden göster
 */
export function formatFileSize(bytes: number): string {
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)}KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(1)}MB`;
}

/**
 * Resim dosyası mı kontrol et
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Desteklenen resim formatları
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
];
