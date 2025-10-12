import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Trash2, LogIn, LogOut, Image as ImageIcon, Link2, Copy } from 'lucide-react';
import {
  initializeGoogleDrive,
  signInToGoogle,
  signOutFromGoogle,
  uploadFileToGoogleDrive,
  deleteFileFromGoogleDrive,
  isSignedIn,
  getDirectImageUrl,
} from '@/lib/googleDrive';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  directUrl: string;
  uploadTime: string;
}

const GoogleDriveTest = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Google Drive API'yi başlat
    const init = async () => {
      try {
        await initializeGoogleDrive();
        setIsInitialized(true);
        const loggedIn = isSignedIn();
        setIsLoggedIn(loggedIn);
        
        if (loggedIn) {
          toast.success('Google Drive API hazır! Giriş yapılmış durumda.');
        } else {
          toast.success('Google Drive API hazır!');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Google Drive API başlatılamadı');
      }
    };

    init();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInToGoogle();
      setIsLoggedIn(true);
      toast.success('Google hesabına giriş yapıldı!');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Giriş yapılamadı');
    }
  };

  const handleSignOut = () => {
    signOutFromGoogle();
    setIsLoggedIn(false);
    toast.success('Çıkış yapıldı');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Preview oluştur
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Lütfen bir dosya seçin');
      return;
    }

    if (!isLoggedIn) {
      toast.error('Lütfen önce Google hesabınıza giriş yapın');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadFileToGoogleDrive(selectedFile);
      
      const uploadedFile: UploadedFile = {
        id: result.id,
        name: selectedFile.name,
        url: result.webViewLink,
        directUrl: getDirectImageUrl(result.id),
        uploadTime: new Date().toLocaleString('tr-TR'),
      };

      setUploadedFiles([uploadedFile, ...uploadedFiles]);
      toast.success('Dosya başarıyla yüklendi!');
      
      // Reset
      setSelectedFile(null);
      setPreviewUrl(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Dosya yüklenemedi');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFileFromGoogleDrive(fileId);
      setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
      toast.success('Dosya silindi');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Dosya silinemedi');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL kopyalandı!');
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Google Drive API yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Google Drive Upload Test</h1>
        <p className="text-gray-600">
          Fotoğrafları Google Drive'a yükleyin ve public URL alın
        </p>
      </div>

      {/* Login Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Google Hesabı
          </CardTitle>
          <CardDescription>
            Dosya yüklemek için Google hesabınıza giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                  <div>
                    <span className="font-medium block">Giriş yapıldı</span>
                    <span className="text-xs text-gray-500">Token otomatik kaydedildi, tekrar giriş yapmanıza gerek yok!</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleSignOut} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          ) : (
            <Button onClick={handleSignIn} className="w-full sm:w-auto">
              <LogIn className="w-4 h-4 mr-2" />
              Google ile Giriş Yap
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Dosya Yükle
          </CardTitle>
          <CardDescription>
            Resim veya dosya seçip Google Drive'a yükleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-input">Dosya Seç</Label>
            <Input
              id="file-input"
              type="file"
              onChange={handleFileSelect}
              disabled={!isLoggedIn}
              accept="image/*"
              className="mt-2"
            />
          </div>

          {previewUrl && (
            <div className="border rounded-lg p-4">
              <Label className="mb-2 block">Önizleme:</Label>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto max-h-64 rounded-lg"
              />
              <p className="mt-2 text-sm text-gray-600">{selectedFile?.name}</p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading || !isLoggedIn}
            className="w-full sm:w-auto"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Yükleniyor...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Google Drive'a Yükle
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Files Section */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Yüklenen Dosyalar ({uploadedFiles.length})
            </CardTitle>
            <CardDescription>
              Yüklediğiniz dosyaların URL'lerini kopyalayabilirsiniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{file.name}</h3>
                      <p className="text-sm text-gray-500">{file.uploadTime}</p>
                    </div>
                    <Button
                      onClick={() => handleDelete(file.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Resim önizlemesi */}
                  <div className="mb-3">
                    <img
                      src={file.directUrl}
                      alt={file.name}
                      className="max-w-full h-auto max-h-48 rounded-lg"
                      loading="lazy"
                    />
                  </div>

                  {/* URLs */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-600 min-w-[100px]">
                        Direkt URL:
                      </Label>
                      <Input
                        value={file.directUrl}
                        readOnly
                        className="text-xs flex-1"
                      />
                      <Button
                        onClick={() => copyToClipboard(file.directUrl)}
                        size="sm"
                        variant="outline"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-600 min-w-[100px]">
                        Web URL:
                      </Label>
                      <Input
                        value={file.url}
                        readOnly
                        className="text-xs flex-1"
                      />
                      <Button
                        onClick={() => window.open(file.url, '_blank')}
                        size="sm"
                        variant="outline"
                      >
                        <Link2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-6 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Nasıl Kullanılır?</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <ol className="list-decimal list-inside space-y-2">
            <li>Önce "Google ile Giriş Yap" butonuna tıklayın (sadece ilk seferde)</li>
            <li>Google hesabınızla giriş yapıp izin verin</li>
            <li>"Dosya Seç" butonuyla resim seçin</li>
            <li>"Google Drive'a Yükle" butonuna tıklayın</li>
            <li>Yüklenen resimlerin URL'lerini kopyalayıp kullanın</li>
          </ol>
          <div className="mt-4 p-3 bg-white rounded border border-blue-200">
            <p className="text-sm font-medium mb-1">✅ Önemli Avantaj:</p>
            <p className="text-sm">
              <strong>Bir kere giriş yaptıktan sonra</strong> token otomatik olarak kaydedilir. 
              Sayfayı yenilediğinizde veya başka bir zaman geldiğinizde tekrar giriş 
              yapmanıza gerek kalmaz! Token yaklaşık 1 saat geçerlidir.
            </p>
          </div>
          <div className="mt-4 p-3 bg-white rounded border border-blue-200">
            <p className="text-sm font-medium mb-1">⚠️ Not:</p>
            <p className="text-sm">
              Bu sayfa test amaçlıdır. Gerçek kullanımda araç ekleme sayfalarınıza
              entegre edilebilir.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleDriveTest;

