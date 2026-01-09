import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#111418]/90 backdrop-blur-md border-b border-[#f0f2f5] dark:border-[#22303e]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-1 group">
            <h2 className="text-primary dark:text-white text-2xl font-black tracking-tight lowercase">waypla<span className="text-accent">.com</span></h2>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/planlar" className="text-sm font-medium text-[#111418] dark:text-gray-300 hover:text-accent transition-colors">Ürünler</Link>
            <Link href="/hasar-yonetimi" className="text-sm font-medium text-[#111418] dark:text-gray-300 hover:text-accent transition-colors">Hasar Yönetimi</Link>
            <Link href="/servis-agi" className="text-sm font-medium text-[#111418] dark:text-gray-300 hover:text-accent transition-colors">Servis Ağı</Link>
            <Link href="/kurumsal" className="text-sm font-medium text-[#111418] dark:text-gray-300 hover:text-accent transition-colors">Kurumsal</Link>
          </nav>
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/giris">
              <button className="h-10 px-5 text-sm font-bold text-[#111418] dark:text-white bg-[#f0f2f5] dark:bg-[#22303e] rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Giriş Yap
              </button>
            </Link>
            <Link href="/teklif">
              <button className="h-10 px-5 text-sm font-bold text-white bg-accent rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
                Teklif Al
              </button>
            </Link>
          </div>
          <div className="lg:hidden flex items-center">
            <button className="text-[#111418] dark:text-white p-2">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

