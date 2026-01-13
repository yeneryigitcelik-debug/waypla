"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && session?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/planlar", label: "Ürünler" },
    { href: "/bakim-paketleri", label: "Bakım Paketleri" },
    { href: "/hasar-yonetimi", label: "Hasar Yönetimi" },
    { href: "/servis-agi", label: "Servis Ağı" },
    { href: "/kurumsal", label: "Kurumsal" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#111418]/90 backdrop-blur-md border-b border-[#f0f2f5] dark:border-[#22303e]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-1 group">
            <h2 className="text-primary dark:text-white text-2xl font-black tracking-tight lowercase">waypla<span className="text-accent">.com</span></h2>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#111418] dark:text-gray-300 hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/hesabim" className="text-sm font-medium text-[#111418] dark:text-gray-300 hover:text-accent transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                  {session.user.name || session.user.email}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="h-10 px-5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#111418] dark:text-white p-2"
              aria-label="Toggle mobile menu"
            >
              <span className="material-symbols-outlined">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#111418] border-t border-[#f0f2f5] dark:border-[#22303e]">
          <div className="max-w-[1280px] mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-[#111418] dark:text-gray-300 hover:text-accent transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/hesabim"
                    className="block text-sm font-medium text-[#111418] dark:text-gray-300 hover:text-accent transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Hesabım
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full h-10 px-5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link href="/giris" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full h-10 px-5 text-sm font-bold text-[#111418] dark:text-white bg-[#f0f2f5] dark:bg-[#22303e] rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      Giriş Yap
                    </button>
                  </Link>
                  <Link href="/teklif" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full h-10 px-5 text-sm font-bold text-white bg-accent rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
                      Teklif Al
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
