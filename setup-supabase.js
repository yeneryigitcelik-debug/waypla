require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setup() {
  try {
    console.log('Supabase veritabanı bağlantısı test ediliyor...\n');
    
    // Bağlantı testi
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Veritabanı bağlantısı başarılı!');
    console.log('Sunucu saati:', result[0]);
    
    console.log('\n📋 Tabloları kontrol ediliyor...');
    
    // Tabloları kontrol et
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('\n✅ Mevcut tablolar:');
    if (tables.length === 0) {
      console.log('   Tablo yok. Prisma migrate veya db push kullanarak tabloları oluşturun.');
      console.log('\n   Komut: npx prisma db push');
    } else {
      tables.forEach(t => console.log('   -', t.table_name));
    }
    
  } catch (error) {
    console.error('❌ Hata oluştu:', error.message);
    if (error.message.includes('Circuit breaker')) {
      console.error('\n⚠️  Supabase güvenlik kilitlenmesi aktif.');
      console.error('   Lütfen 5-10 dakika sonra tekrar deneyin.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

setup();
