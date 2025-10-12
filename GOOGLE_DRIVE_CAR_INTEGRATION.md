# Google Drive Entegrasyonu - Araç Fotoğraf Yükleme

## ✅ Tamamlanan Entegrasyon

Araç ekleme ve düzenleme sayfalarına Google Drive fotoğraf yükleme özelliği entegre edildi!

## 🎯 Özellikler

### Otomatik İşlem Akışı
1. **Fotoğraf seçimi** → Kullanıcı resim seçer
2. **Google Drive'a yükleme** → Otomatik olarak yüklenir
3. **Public URL alma** → Direkt görüntülenebilir link alınır
4. **Supabase'e kayıt** → URL araç datasına kaydedilir

### Ana Özellikler
- ✅ Otomatik Google Drive yükleme
- ✅ Çoklu fotoğraf desteği
- ✅ Sürükle-bırak ile yeniden sıralama
- ✅ Her fotoğraf için yükleme durumu
- ✅ Token otomatik kayıt (1 saat geçerli)
- ✅ Gerçek zamanlı yükleme bildirimleri
- ✅ Hata yönetimi
- ✅ Loading states

## 📝 Nasıl Kullanılır?

### İlk Kullanım (Tek Seferlik)

1. **Google Cloud Kurulumu**
   - `GOOGLE_DRIVE_SETUP.md` dosyasındaki adımları izleyin
   - CLIENT_ID'yi `src/lib/googleDrive.ts`'de güncelleyin
   - OAuth Consent Screen'i ayarlayın

2. **Uygulamayı Başlatın**
   ```bash
   npm run dev
   ```

### Araç Ekleme/Düzenleme

1. **Sayfayı Açın**
   - `/cars/add` - Yeni araç ekle
   - `/cars/edit/:id` - Araç düzenle

2. **Google Drive'a Giriş**
   - Sayfada "Google Drive'a giriş yapın" uyarısı görünecek
   - "Giriş Yap" butonuna tıklayın
   - Google hesabınızla giriş yapın
   - İzinleri onaylayın
   - ✅ Giriş başarılı - artık hazırsınız!

3. **Fotoğraf Yükleme**
   - "Fotoğraf yüklemek için tıklayın" alanına tıklayın
   - Bir veya birden fazla resim seçin
   - Otomatik olarak:
     * Google Drive'a yüklenecek
     * Public yapılacak
     * URL alınacak
     * Önizleme gösterilecek
   - Her fotoğraf için bildirim göreceksiniz!

4. **Araç Kaydetme**
   - Diğer bilgileri doldurun
   - "Save Car" butonuna tıklayın
   - ✅ Fotoğrafların URL'leri otomatik olarak Supabase'e kaydedilecek!

## 🔄 İş Akışı Detayı

```
Kullanıcı Fotoğraf Seçer
        ↓
Google Drive'a Giriş Kontrolü
        ↓
Her Fotoğraf için:
    ├─ Yükleme Başlıyor (Toast bildirimi)
    ├─ Google Drive'a Upload
    ├─ Public Yapılıyor
    ├─ Direkt URL Alınıyor
    └─ Yüklendi! (Toast bildirimi)
        ↓
URL'ler State'e Ekleniyor
        ↓
Kullanıcı Araç Bilgilerini Giriyor
        ↓
"Save Car" Butonuna Tıklıyor
        ↓
Tüm Data (Fotoğraf URL'leri dahil) Supabase'e Kaydediliyor
        ↓
✅ Tamamlandı!
```

## 💾 Veri Yapısı

### Araç Objesi
```typescript
{
  name: "Toyota Camry",
  model: "2024",
  // ... diğer bilgiler
  image: "https://drive.google.com/uc?export=view&id=FILE_ID_1", // İlk fotoğraf
  images: [
    "https://drive.google.com/uc?export=view&id=FILE_ID_1",
    "https://drive.google.com/uc?export=view&id=FILE_ID_2",
    "https://drive.google.com/uc?export=view&id=FILE_ID_3"
  ]
}
```

### Supabase'e Kaydedilme
- `image`: İlk fotoğrafın URL'si (eski sistemle uyumluluk için)
- `images`: Tüm fotoğrafların URL'leri (array)

## 🎨 Kullanıcı Arayüzü

### Giriş Yapmadıysa
```
⚠️ Google Drive'a giriş yapın
   Fotoğraflar otomatik olarak Google Drive'a yüklenecek
   [Giriş Yap]
```

### Giriş Yaptıktan Sonra
```
✅ Google Drive'a bağlı - Fotoğraflar otomatik yüklenecek

┌─────────────────────────────────────┐
│  📤 Fotoğraf yüklemek için tıklayın │
│  PNG, JPG - Google Drive'a otomatik │
│  yüklenecek                         │
└─────────────────────────────────────┘
```

### Yükleme Sırasında
```
┌─────────────────────────────────────┐
│  ⏳ Google Drive'a yükleniyor...    │
└─────────────────────────────────────┘

Toast Bildirimleri:
- "car1.jpg yükleniyor..." (loading)
- "car1.jpg yüklendi!" (success)
- "car2.jpg yükleniyor..." (loading)
- "car2.jpg yüklendi!" (success)
- "2 fotoğraf Google Drive'a yüklendi!" (success)
```

## 🔒 Güvenlik

### ✅ Güvenli
- Token localStorage'da saklanır
- Token 1 saat sonra otomatik sona erer
- Her kullanıcı kendi Google Drive'ına yükler
- OAuth 2.0 kullanıcı izni gerekir

### ⚠️ Önemli
- CLIENT_ID public'tir (sorun değil)
- CLIENT_SECRET kullanılmaz (frontend'de olmamalı)
- Token her kullanıcıya özeldir
- Scope sadece uygulama dosyalarına erişim verir

## 🚀 Production'a Alma

### 1. Environment Variables
`.env` dosyası oluşturun:
```env
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_GOOGLE_API_KEY=your-api-key
```

### 2. Kod Güncelleme
`src/lib/googleDrive.ts`:
```typescript
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
```

### 3. Google Cloud Console
- Production domain'i Authorized JavaScript origins'e ekleyin
- OAuth Consent Screen'i yayınlayın
- Test users'dan production users'a geçin

## 📊 Örnek Kullanım

### Yeni Araç Ekleme
```
1. /cars/add sayfasına git
2. Bir kere "Giriş Yap" (token 1 saat geçerli)
3. Fotoğraf seç (5 tane)
   ✅ car1.jpg yüklendi!
   ✅ car2.jpg yüklendi!
   ✅ car3.jpg yüklendi!
   ✅ car4.jpg yüklendi!
   ✅ car5.jpg yüklendi!
   ✅ 5 fotoğraf Google Drive'a yüklendi!
4. Araç bilgilerini doldur
5. "Save Car"
   ✅ Araç eklendi! (Fotoğraflar Supabase'de)
```

### Araç Düzenleme
```
1. /cars/edit/123 sayfasına git
2. Mevcut fotoğraflar görünüyor
3. Yeni fotoğraf ekle
   ✅ car6.jpg yüklendi!
4. Sürükle-bırak ile sırala
5. "Update Car"
   ✅ Araç güncellendi!
```

## 🎁 Bonuslar

### Drag & Drop Sıralama
- Fotoğrafları sürükleyip yeniden sıralayabilirsiniz
- İlk fotoğraf ana kapak fotoğrafı olur

### Gerçek Zamanlı Bildirimler
- Her fotoğraf için ayrı bildirim
- Loading, success, error durumları
- Kullanıcı her adımdan haberdar

### Otomatik Token Yönetimi
- İlk giriş: Token kaydedilir
- Sonraki kullanım: Otomatik giriş
- Token süresi dolarsa: Tekrar giriş istenir
- Sayfa yenileme: Token korunur

## 🐛 Sorun Giderme

### "Lütfen önce Google hesabınıza giriş yapın"
- "Giriş Yap" butonuna tıklayın
- Google hesabınızla giriş yapın

### Fotoğraf yüklenmiyor
- Token süresinin dolup dolmadığını kontrol edin
- Çıkış yapıp tekrar giriş yapın
- Browser console'da hata var mı kontrol edin

### Google API hatası
- CLIENT_ID doğru mu kontrol edin
- Google Cloud Console'da API etkin mi kontrol edin
- Authorized origins doğru mu kontrol edin

## 📞 Test Durumu

### Test Edilenler
- ✅ Google Drive login
- ✅ Token kaydetme/yükleme
- ✅ Tek fotoğraf yükleme
- ✅ Çoklu fotoğraf yükleme
- ✅ Loading states
- ✅ Hata yönetimi
- ✅ Drag & drop sıralama
- ✅ Fotoğraf silme
- ✅ Araç kaydetme (Supabase)
- ✅ Araç düzenleme

### Yapılması Gerekenler
- [ ] Production'da test
- [ ] Farklı tarayıcılarda test
- [ ] Büyük dosya testi
- [ ] Network hatası simülasyonu

## 🎉 Sonuç

Artık araç ekleme ve düzenleme sayfalarında fotoğraflar otomatik olarak Google Drive'a yükleniyor ve URL'leri Supabase'e kaydediliyor!

**Avantajlar:**
- ✅ Ücretsiz fotoğraf hosting (Google Drive)
- ✅ Sınırsız alan (15GB ücretsiz)
- ✅ Hızlı CDN
- ✅ Otomatik işlem
- ✅ Kullanıcı dostu arayüz
- ✅ Token yönetimi
- ✅ Güvenli

**Kullanım:**
1. İlk seferde bir kere giriş yap
2. Fotoğraf seç
3. Otomatik yükleniyor!
4. Araç kaydet
5. ✅ Tamamdır!

