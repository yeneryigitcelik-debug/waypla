'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="mb-6">
            <span className="inline-block text-8xl font-black text-accent">❌</span>
          </div>
          <h1 className="text-4xl font-black text-[#111418] dark:text-white mb-4">
            Bir Hata Oluştu!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {error.message || 'Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="h-12 px-8 bg-accent text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Tekrar Deneyin
            </button>
            <Link href="/">
              <button className="h-12 px-8 bg-gray-200 dark:bg-gray-700 text-[#111418] dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Ana Sayfaya Dön
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
