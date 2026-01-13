import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="mb-6">
            <span className="inline-block text-8xl font-black text-accent">404</span>
          </div>
          <h1 className="text-4xl font-black text-[#111418] dark:text-white mb-4">
            Sayfa Bulunamadı
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Link href="/">
            <button className="h-12 px-8 bg-accent text-white font-bold rounded-lg hover:bg-orange-600 transition-colors">
              Ana Sayfaya Dön
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
