# Google Drive API Kurulumu ve Kullanımı

## 🚀 Hızlı Başlangıç

Test sayfasını görüntülemek için:
```
http://localhost:5173/google-drive-test
```

## 📋 Adım Adım Kurulum

### 1. Google Cloud Console'da Proje Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Library" bölümüne gidin
4. **Google Drive API**'yi arayın ve etkinleştirin

### 2. OAuth 2.0 Client ID Oluşturma

1. "APIs & Services" > "Credentials" bölümüne gidin
2. "Create Credentials" > "OAuth client ID" seçin
3. Application type olarak **"Web application"** seçin
4. İsim verin (örn: "Rent Lease App")
5. **Authorized JavaScript origins** bölümüne ekleyin:
   ```
   http://localhost:5173
   http://localhost:3000
   https://your-production-domain.com
   ```
6. **Authorized redirect URIs** ekleyin (gerekirse):
   ```
   http://localhost:5173
   https://your-production-domain.com
   ```
7. "Create" butonuna tıklayın
8. **Client ID**'yi kopyalayın

### 3. API Key Oluşturma (Opsiyonel ama Önerilen)

1. "APIs & Services" > "Credentials" bölümünde
2. "Create Credentials" > "API key" seçin
3. Oluşturulan **API Key**'i kopyalayın
4. (Önerilen) "Restrict Key" ile sadece Google Drive API'ye sınırlandırın

### 4. OAuth Consent Screen Ayarlama

1. "APIs & Services" > "OAuth consent screen" bölümüne gidin
2. **User Type** olarak "External" seçin (test için)
3. App bilgilerini doldurun:
   - App name: Rent Lease
   - User support email: email@example.com
   - Developer contact: email@example.com
4. "Save and Continue"
5. **Scopes** bölümünde "Add or Remove Scopes" tıklayın
6. Google Drive API için `.../auth/drive.file` scope'unu ekleyin
7. "Save and Continue"
8. **Test users** bölümüne test için kullanacağınız Gmail hesaplarını ekleyin
9. "Save and Continue"

### 5. Kodda API Bilgilerini Güncelleme

`src/lib/googleDrive.ts` dosyasını açın ve kendi bilgilerinizi girin:

```typescript
const CLIENT_ID = 'SIZIN-CLIENT-ID-BURAYA';
const API_KEY = 'SIZIN-API-KEY-BURAYA'; // Opsiyonel
```

## 🧪 Test Etme

1. Uygulamayı başlatın:
   ```bash
   npm run dev
   ```

2. Tarayıcıda açın:
   ```
   http://localhost:5173/google-drive-test
   ```

3. "Google ile Giriş Yap" butonuna tıklayın
4. Test user olarak eklediğiniz Google hesabıyla giriş yapın
5. İzinleri onaylayın
6. Resim seçip yükleyin!

## 📝 Kullanım Örnekleri

### Araç Ekleme Sayfasına Entegrasyon

`AddCar.tsx` veya `EditCar.tsx` dosyalarında kullanım örneği:

```typescript
import { uploadFileToGoogleDrive, getDirectImageUrl } from '@/lib/googleDrive';

// Resim yükleme
const handleImageUpload = async (file: File) => {
  try {
    const result = await uploadFileToGoogleDrive(file);
    const imageUrl = getDirectImageUrl(result.id);
    
    // Bu URL'yi araç datasına kaydedin
    setCarData({
      ...carData,
      images: [...carData.images, imageUrl]
    });
    
    toast.success('Resim yüklendi!');
  } catch (error) {
    toast.error('Resim yüklenemedi');
  }
};
```

### Resim Silme

```typescript
import { deleteFileFromGoogleDrive } from '@/lib/googleDrive';

// URL'den file ID'yi çıkarın
const getFileIdFromUrl = (url: string) => {
  const match = url.match(/id=([^&]+)/);
  return match ? match[1] : null;
};

const handleDeleteImage = async (imageUrl: string) => {
  try {
    const fileId = getFileIdFromUrl(imageUrl);
    if (fileId) {
      await deleteFileFromGoogleDrive(fileId);
      toast.success('Resim silindi');
    }
  } catch (error) {
    toast.error('Resim silinemedi');
  }
};
```

## 🔒 Güvenlik Notları

### ✅ GÜVENLİ (Bu Yapı)
- Client ID frontend'de kullanılabilir (public bilgi)
- OAuth 2.0 kullanıcı izni gerektirir
- Her kullanıcı kendi Drive'ına yükler
- Scope sadece uygulama tarafından oluşturulan dosyalara erişim verir

### ❌ GÜVENSİZ (Yapmayın)
- CLIENT_SECRET'ı frontend koduna koymayın
- Service Account JSON'ını frontend'de kullanmayın
- API Key'i sınırlandırın (domain restriction)

## 🌐 Production'a Alma

### 1. OAuth Consent Screen'i Yayınlama
1. Google Cloud Console'da OAuth consent screen bölümüne gidin
2. "Publish App" butonuna tıklayın
3. Onay sürecini bekleyin (birkaç gün sürebilir)

### 2. Domain Eklemek
Production domain'inizi authorized origins'e ekleyin:
```
https://your-domain.com
https://www.your-domain.com
```

### 3. Environment Variables (Önerilen)
Production'da environment variables kullanın:

`.env` dosyası:
```env
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_GOOGLE_API_KEY=your-api-key
```

`googleDrive.ts`'de:
```typescript
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
```

## 🎯 Özellikler

### Mevcut Özellikler
- ✅ Google Drive'a dosya yükleme
- ✅ Dosyaları public yapma
- ✅ Direkt görüntülenebilir URL alma
- ✅ Dosya silme
- ✅ OAuth 2.0 authentication
- ✅ Resim önizleme
- ✅ URL kopyalama
- ✅ **Token localStorage'da otomatik kayıt** - Bir kere giriş yapınca tekrar giriş yapmaya gerek yok!
- ✅ **Token süre kontrolü** - Token süresi dolunca otomatik temizlenme

### Eklenmesi Gerekenler (Opsiyonel)
- [ ] Çoklu dosya yükleme
- [ ] Drag & drop
- [ ] Progress bar
- [ ] Dosya boyutu kontrolü
- [ ] Image compression
- [ ] Klasör oluşturma

## 🐛 Sık Karşılaşılan Hatalar

### "popup_closed_by_user"
- Kullanıcı popup'ı kapatmış
- Tekrar deneyin

### "access_denied"
- Kullanıcı izni reddetmiş
- OAuth consent screen'de scope'lar doğru mu kontrol edin

### "invalid_client"
- Client ID yanlış
- Authorized origins doğru ayarlanmamış

### "idpiframe_initialization_failed"
- Cookies engellenmiş olabilir
- Tarayıcı gizli modda olabilir
- Third-party cookies'i etkinleştirin

## 📊 Limitler

### Google Drive API Quotaları
- **Ücretsiz**: 
  - 15 GB storage (tüm Google services)
  - 10,000 requests/day
  - 1,000 requests/100 seconds/user

- **İhtiyaç durumunda**:
  - Quota artışı talep edebilirsiniz
  - Paid plan'e geçebilirsiniz

## 💡 İpuçları

1. **Test users eklemeyi unutmayın** - Yoksa sadece siz test edebilirsiniz
2. **Scope'u minimal tutun** - Sadece gerekeni isteyin
3. **URL'leri veritabanına kaydedin** - File ID'yi saklamak da işe yarar
4. **Error handling ekleyin** - Kullanıcı deneyimi için önemli
5. **Loading states gösterin** - Upload işlemi zaman alabilir
6. **Token otomatik kaydedilir** - Bir kere giriş yapınca 1 saat boyunca tekrar giriş yapmaya gerek yok!

## 🔗 Faydalı Linkler

- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Quotas](https://console.cloud.google.com/iam-admin/quotas)

## 📞 Destek

Sorun yaşarsanız:
1. Browser console'u kontrol edin
2. Network tab'inde API çağrılarını inceleyin
3. Google Cloud Console'da logs'u kontrol edin
4. OAuth consent screen ayarlarını gözden geçirin

---

**Not:** Bu sistem test amaçlıdır. Her kullanıcı kendi Google Drive hesabına yükler. Ortak bir storage istiyorsanız başka çözümler (Cloudinary, ImageKit) önerilir.

