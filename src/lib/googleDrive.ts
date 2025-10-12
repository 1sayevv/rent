/**
 * Google Drive API service file
 * Upload and manage files to Google Drive from browser
 */

// Google API settings
const CLIENT_ID = '463634324331-18i8t5ffqn2908abe041fmcv7g7b9qmp.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAZHMOYwvVrgvlEWCEOtLnQWsTKPa_e8ic'; // API Key required from Google Cloud Console
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient: any;
let accessToken: string | null = null;

// LocalStorage keys
const STORAGE_KEY = 'google_drive_token';
const STORAGE_EXPIRY_KEY = 'google_drive_token_expiry';

/**
 * Load token from localStorage
 */
const loadTokenFromStorage = (): boolean => {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);
    
    if (token && expiry) {
      const expiryTime = parseInt(expiry, 10);
      const now = Date.now();
      
      // If token is still valid
      if (now < expiryTime) {
        accessToken = token;
        return true;
      } else {
        // Token expired, clear it
        clearTokenFromStorage();
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error('Token load error:', error);
    return false;
  }
};

/**
 * Save token to localStorage
 */
const saveTokenToStorage = (token: string, expiresIn: number = 3600): void => {
  try {
    const expiryTime = Date.now() + (expiresIn * 1000); // convert seconds to milliseconds
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(STORAGE_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Token save error:', error);
  }
};

/**
 * Clear token from localStorage
 */
const clearTokenFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
  } catch (error) {
    console.error('Token clear error:', error);
  }
};

/**
 * Load and initialize Google API
 */
export const initializeGoogleDrive = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // First load token from localStorage
    loadTokenFromStorage();
    
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      // @ts-ignore
      window.gapi.load('client', async () => {
        try {
          // @ts-ignore
          await window.gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);

    // Load Google Identity Services script
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.onload = () => {
      // @ts-ignore
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // Callback fonksiyonu runtime'da ayarlanacak
      });
    };
    document.body.appendChild(gisScript);
  });
};

/**
 * Sign in to Google account and get token
 */
export const signInToGoogle = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      tokenClient.callback = (response: any) => {
        if (response.error) {
          reject(response);
          return;
        }
        
        accessToken = response.access_token;
        
        // Save token to localStorage (use expires_in if available, otherwise default to 3600 seconds)
        const expiresIn = response.expires_in || 3600;
        saveTokenToStorage(accessToken, expiresIn);
        
        resolve(accessToken);
      };

      // @ts-ignore
      if (window.gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Sign out from Google account
 */
export const signOutFromGoogle = () => {
  // @ts-ignore
  const token = window.gapi.client.getToken();
  if (token !== null) {
    // @ts-ignore
    window.google.accounts.oauth2.revoke(token.access_token);
    // @ts-ignore
    window.gapi.client.setToken('');
  }
  
  // Clear token
  accessToken = null;
  clearTokenFromStorage();
};

/**
 * Upload file to Google Drive
 */
export const uploadFileToGoogleDrive = async (
  file: File,
  fileName?: string
): Promise<{ id: string; webViewLink: string; webContentLink: string }> => {
  try {
    if (!accessToken) {
      throw new Error('Lütfen önce Google hesabınıza giriş yapın');
    }

    const metadata = {
      name: fileName || file.name,
      mimeType: file.type,
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      }
    );

    if (!response.ok) {
      throw new Error('Dosya yükleme başarısız');
    }

    const data = await response.json();

    // Dosyayı herkese açık yap
    await makeFilePublic(data.id);

    // Güncellenmiş bilgileri al
    const fileInfo = await getFileInfo(data.id);
    
    // Alternatif görüntüleme URL'i de ekle
    return {
      ...fileInfo,
      directImageUrl: getAlternativeImageUrl(data.id)
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Make file public
 */
export const makeFilePublic = async (fileId: string): Promise<void> => {
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });
  } catch (error) {
    console.error('Make public error:', error);
    throw error;
  }
};

/**
 * Get file information
 */
export const getFileInfo = async (
  fileId: string
): Promise<{ id: string; webViewLink: string; webContentLink: string }> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,webViewLink,webContentLink`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get file information');
    }

    return await response.json();
  } catch (error) {
    console.error('Get file info error:', error);
    throw error;
  }
};

/**
 * Delete file from Google Drive
 */
export const deleteFileFromGoogleDrive = async (fileId: string): Promise<void> => {
  try {
    if (!accessToken) {
      throw new Error('Please sign in to your Google account first');
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('File deletion failed');
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

/**
 * Check user's sign-in status
 */
export const isSignedIn = (): boolean => {
  return accessToken !== null;
};

/**
 * Public dosya URL'ini direkt görüntülenebilir hale getir
 */
export const getDirectImageUrl = (fileId: string): string => {
  // CORS sorununu çözmek için farklı URL formatları dene
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

/**
 * Alternatif Google Drive görüntüleme URL'i
 */
export const getAlternativeImageUrl = (fileId: string): string => {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
};

/**
 * Google Drive URL'ini temizle ve file ID'yi çıkar
 */
export const extractFileIdFromUrl = (url: string): string | null => {
  // https://drive.google.com/uc?export=view&id=FILE_ID formatından
  const ucMatch = url.match(/[?&]id=([^&]+)/);
  if (ucMatch) return ucMatch[1];
  
  // https://drive.google.com/file/d/FILE_ID/view formatından
  const fileMatch = url.match(/\/file\/d\/([^\/]+)/);
  if (fileMatch) return fileMatch[1];
  
  // https://lh3.googleusercontent.com/d/FILE_ID formatından
  const lhMatch = url.match(/\/d\/([^\/]+)/);
  if (lhMatch) return lhMatch[1];
  
  return null;
};

