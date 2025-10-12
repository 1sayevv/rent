/**
 * Google Drive API servis dosyası
 * Tarayıcı üzerinden Google Drive'a dosya yükleme ve yönetme
 */

// Google API ayarları
const CLIENT_ID = '463634324331-18i8t5ffqn2908abe041fmcv7g7b9qmp.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAZHMOYwvVrgvlEWCEOtLnQWsTKPa_e8ic'; // Google Cloud Console'dan API Key gerekli
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient: any;
let accessToken: string | null = null;

// LocalStorage keys
const STORAGE_KEY = 'google_drive_token';
const STORAGE_EXPIRY_KEY = 'google_drive_token_expiry';

/**
 * LocalStorage'dan token'ı yükle
 */
const loadTokenFromStorage = (): boolean => {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);
    
    if (token && expiry) {
      const expiryTime = parseInt(expiry, 10);
      const now = Date.now();
      
      // Token hala geçerliyse
      if (now < expiryTime) {
        accessToken = token;
        return true;
      } else {
        // Token süresi dolmuş, temizle
        clearTokenFromStorage();
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error('Token yükleme hatası:', error);
    return false;
  }
};

/**
 * Token'ı localStorage'a kaydet
 */
const saveTokenToStorage = (token: string, expiresIn: number = 3600): void => {
  try {
    const expiryTime = Date.now() + (expiresIn * 1000); // saniyeyi milisaniyeye çevir
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(STORAGE_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Token kaydetme hatası:', error);
  }
};

/**
 * Token'ı localStorage'dan temizle
 */
const clearTokenFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
  } catch (error) {
    console.error('Token temizleme hatası:', error);
  }
};

/**
 * Google API'yi yükle ve başlat
 */
export const initializeGoogleDrive = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Önce localStorage'dan token'ı yükle
    loadTokenFromStorage();
    
    // Google API script'ini yükle
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

    // Google Identity Services script'ini yükle
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
 * Google hesabına giriş yap ve token al
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
        
        // Token'ı localStorage'a kaydet (expires_in varsa kullan, yoksa 3600 saniye default)
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
 * Google hesabından çıkış yap
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
  
  // Token'ı temizle
  accessToken = null;
  clearTokenFromStorage();
};

/**
 * Dosyayı Google Drive'a yükle
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
 * Dosyayı herkese açık yap
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
 * Dosya bilgilerini al
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
      throw new Error('Dosya bilgileri alınamadı');
    }

    return await response.json();
  } catch (error) {
    console.error('Get file info error:', error);
    throw error;
  }
};

/**
 * Dosyayı Google Drive'dan sil
 */
export const deleteFileFromGoogleDrive = async (fileId: string): Promise<void> => {
  try {
    if (!accessToken) {
      throw new Error('Lütfen önce Google hesabınıza giriş yapın');
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      throw new Error('Dosya silme başarısız');
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

/**
 * Kullanıcının giriş durumunu kontrol et
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

