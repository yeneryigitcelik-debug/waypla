# CihazGüvence - Elektronik Cihaz Sigortası Platformu

Production-grade Next.js (App Router) uygulaması - B2C/B2B/B2B2C MVP + Marketing Sitesi

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+ 
- npm veya yarn

### Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Veritabanını oluşturun ve seed edin:
```bash
# Prisma client'ı generate edin
npm run prisma:generate

# Migration çalıştırın (veritabanı otomatik oluşturulur)
# Windows PowerShell:
$env:DATABASE_URL="file:./prisma/deviceguvence.db"; npx prisma migrate dev

# Seed data ekleyin (eğer tsx ile sorun yaşarsanız, seed.ts dosyasını manuel olarak çalıştırabilirsiniz)
# Windows PowerShell:
$env:DATABASE_URL="file:./prisma/deviceguvence.db"; npx tsx prisma/seed.ts
```

**Not:** Seed script çalışmazsa, demo hesapları manuel olarak oluşturabilirsiniz veya Prisma Studio üzerinden ekleyebilirsiniz.

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Uygulama http://localhost:3100 adresinde çalışacaktır.

## 🔧 Yapılandırma

### Port Yapılandırması

- **Dev Server**: PORT 3100 (3000 ile çakışmaz)
- **Prisma Studio**: PORT 5556 (varsayılan 5555 ile çakışmaz)

### Veritabanı

- **Varsayılan**: SQLite (`prisma/deviceguvence.db`)
- **Environment Variable**: `DATABASE_URL`

### Environment Variables

`.env.local` dosyası oluşturun (`.env.example` referans alınabilir):

```env
PORT=3100
NEXTAUTH_URL=http://localhost:3100
NEXTAUTH_SECRET=change-this-to-a-random-secret-in-production
DATABASE_URL="file:./prisma/deviceguvence.db"
```

## 👤 Demo Hesaplar

Seed script çalıştırıldıktan sonra aşağıdaki hesaplar oluşturulur:

### Admin
- Email: `admin@cihazguvence.com`
- Şifre: `admin123`
- Rol: ADMIN

### Müşteri
- Email: `customer@example.com`
- Şifre: `customer123`
- Rol: CUSTOMER

### Partner
- Email: `partner@example.com`
- Şifre: `partner123`
- Rol: PARTNER

## 📁 Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin paneli
│   ├── blog/              # Blog sayfaları
│   ├── hasar/             # Hasar yönetimi
│   ├── hesabim/           # Kullanıcı portalı
│   ├── partner/            # Partner portalı
│   └── ...                # Diğer sayfalar
├── components/            # React bileşenleri
│   ├── layout/            # Layout bileşenleri
│   └── ui/                # UI bileşenleri
├── lib/                   # Utility fonksiyonları
│   ├── auth.ts            # NextAuth yapılandırması
│   ├── brand.ts           # Marka yapılandırması
│   ├── pricing/           # Fiyatlandırma motoru
│   └── prisma.ts          # Prisma client
├── prisma/                # Prisma schema ve migrations
│   ├── schema.prisma      # Veritabanı şeması
│   └── seed.ts            # Seed script
└── types/                 # TypeScript type tanımları
```

## 🎯 Özellikler

### Public (Marketing) Sayfaları
- ✅ Ana sayfa (Hero, değer önerileri, planlar)
- ✅ Planlar & Fiyatlandırma
- ✅ Nasıl Çalışır?
- ✅ Hasar Yönetimi
- ✅ Servis Ağı
- ✅ İş Ortakları (B2B2C)
- ✅ Kurumsal (B2B)
- ✅ Blog (6+ yazı)
- ✅ SSS
- ✅ Hakkımızda
- ✅ İletişim
- ✅ Hukuk sayfaları (KVKK, Çerez, Kullanım Koşulları)

### MVP Ürün Akışları
- ✅ Multi-step teklif akışı (`/teklif`)
- ✅ Kullanıcı giriş/kayıt
- ✅ Kullanıcı portalı (`/hesabim`)
- ✅ Hasar bildirimi (`/hasar/bildir`)
- ✅ Partner portalı (`/partner`)
- ✅ Admin paneli (`/admin`)

### Teknik Özellikler
- ✅ Next.js App Router + TypeScript
- ✅ Tailwind CSS + Custom UI components
- ✅ React Hook Form + Zod validation
- ✅ Prisma ORM (SQLite default)
- ✅ NextAuth (Credentials provider)
- ✅ Rol bazlı yetkilendirme (CUSTOMER, PARTNER, ADMIN, BUSINESS)
- ✅ Pricing engine (deterministik prim hesaplama)
- ✅ SEO (metadata, sitemap, robots.txt)

## 📝 Scripts

```bash
# Geliştirme sunucusu (port 3100)
npm run dev

# Production build
npm run build

# Production start (port 3100)
npm start

# Prisma
npm run prisma:generate    # Prisma client generate
npm run prisma:migrate     # Migration çalıştır
npm run prisma:studio      # Prisma Studio (port 5556)
npm run prisma:seed        # Seed data ekle
```

## 🔐 Güvenlik Notları

- Production'da `NEXTAUTH_SECRET` değerini güvenli bir değerle değiştirin
- API anahtarları ve şifreler hash'lenmiş olarak saklanır
- Rol bazlı erişim kontrolü uygulanmıştır

## 🗄️ Veritabanı

### Domain Model

- **User**: Kullanıcılar (rol bazlı)
- **Device**: Cihazlar
- **Plan**: Sigorta planları
- **Policy**: Poliçeler
- **Claim**: Hasar talepleri
- **Partner**: İş ortakları
- **ServiceCenter**: Servis merkezleri
- **AuditLog**: Denetim kayıtları

### PostgreSQL'e Geçiş

SQLite'dan PostgreSQL'e geçmek için:

1. `.env.local` dosyasında `DATABASE_URL` değerini PostgreSQL connection string ile değiştirin:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/deviceguvence?schema=public"
```

2. `prisma/schema.prisma` dosyasında datasource provider'ı değiştirin:
```prisma
datasource db {
  provider = "postgresql"
}
```

3. Migration çalıştırın:
```bash
npm run prisma:migrate
```

## 🚧 Geliştirme Notları

- Tüm marka metinleri `lib/brand.ts` ve `content/waypla.ts` (Source of Truth) dosyasından yönetilir
- Pricing engine `lib/pricing/engine.ts` dosyasında izole edilmiştir
- Ödeme entegrasyonu şu an stub olarak çalışmaktadır
- Dosya yükleme (hasar fotoğrafları) için Supabase Storage entegrasyonu gereklidir

### Veritabanı ve Storage Kurulumu (MVP)

1. **Schema Güncellemesi**: Claim ve Profile tabloları güncellendi.
```bash
npx prisma migrate dev --name add_claim_and_profile_fields
```

2. **Storage Bucket**: Supabase projenizde `claim-attachments` adında bir private bucket oluşturun.
- Policy: Kullanıcı sadece kendi yüklediği dosyaları görebilmeli (`auth.uid() = homeowner`).
- Server-side upload için `app/api/claims/route.ts` içindeki TODO alanını Supabase Storage SDK ile güncelleyin.

3. **RLS Politikaları**:
- `profiles` tablosu: Kullanıcı sadece kendi profiline erişebilmeli.
- `claims` tablosu: Kullanıcı sadece kendi taleplerini görebilmeli.
- `addresses` tablosu: Kullanıcı sadece kendi adreslerini yönetebilmeli.

## 📄 Lisans

Bu proje demo amaçlıdır.
