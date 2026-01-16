"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && session?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation links - Hasar Bildir and Hasar Takibi highlighted
  const navLinks = [
    { href: "/planlar", label: "Ürünler" },
    { href: "/hasar/bildir", label: "Hasar Bildir", highlight: true },
    { href: "/hesabim/hasarlar", label: "Hasar Takibi", highlight: true },
    { href: "/kurumsal", label: "Kurumsal" },
  ];

  // Quick links for mobile menu
  const quickLinks = [
    { href: "/sss", label: "Sık Sorulan Sorular", icon: "help" },
    { href: "/planlar", label: "Güvence Kapsamı", icon: "verified_user" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#111418]/90 backdrop-blur-md border-b border-[#f0f2f5] dark:border-[#22303e]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-1 group">
            <h2 className="text-primary dark:text-white text-2xl font-black tracking-tight lowercase">waypla<span className="text-accent">.com</span></h2>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${link.highlight
                  ? "text-accent hover:text-orange-600 font-bold"
                  : "text-[#111418] dark:text-gray-300 hover:text-accent"
                  }`}
              >
                {link.highlight && (
                  <span className="material-symbols-outlined text-base">
                    {link.label === "Hasar Bildir" ? "report_problem" : "track_changes"}
                  </span>
                )}
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Aktif Talebim shortcut for authenticated users */}
                <Link
                  href="/hesabim/hasarlar"
                  className="text-sm font-bold text-accent hover:text-orange-600 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-lg">pending_actions</span>
                  Aktif Talebim
                </Link>
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
                <Link href="/hasar/bildir">
                  <button className="h-10 px-5 text-sm font-bold text-white bg-accent rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">report_problem</span>
                    Hasar Bildir
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
          <div className="max-w-[1280px] mx-auto px-4 py-4 space-y-2">
            {/* Primary CTA - Hasar Bildir */}
            <Link
              href="/hasar/bildir"
              className="flex items-center gap-3 p-3 rounded-xl bg-accent/10 text-accent font-bold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined">report_problem</span>
              Hasar Bildir
            </Link>

            {/* Nav Links */}
            {navLinks.filter(l => l.href !== "/hasar/bildir").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-sm font-medium py-2 transition-colors ${link.highlight
                  ? "text-accent flex items-center gap-2"
                  : "text-[#111418] dark:text-gray-300 hover:text-accent"
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.highlight && <span className="material-symbols-outlined text-base">track_changes</span>}
                {link.label}
              </Link>
            ))}

            {/* Quick Links */}
            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Hızlı Erişim</p>
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 py-2 hover:text-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="material-symbols-outlined text-base">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/hesabim/hasarlar"
                    className="flex items-center gap-2 text-sm font-bold text-accent py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined">pending_actions</span>
                    Aktif Talebim
                  </Link>
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
                    <button className="w-full h-10 px-5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
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
