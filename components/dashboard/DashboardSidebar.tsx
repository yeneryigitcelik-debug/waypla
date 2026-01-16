"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const menuItems = [
    { href: "/hesabim", icon: "dashboard", label: "Genel Bakış", exact: true },
    { href: "/hesabim/cihazlar", icon: "smartphone", label: "Cihazlarım" },
    { href: "/hesabim/policeler", icon: "verified_user", label: "Poliçelerim" },
    { href: "/hesabim/hasarlar", icon: "report", label: "Hasar Taleplerim" },
    { href: "/hesabim/profil-duzenle", icon: "person", label: "Profil Ayarları" },
];

const quickActions = [
    { href: "/hasar-bildir", icon: "report_problem", label: "Hasar Bildir", color: "text-red-500" },
    { href: "/teklif", icon: "add_circle", label: "Cihaz Ekle", color: "text-accent" },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        // For non-exact matches, ensure we're matching a full path segment
        // e.g., /hesabim/cihazlar should NOT match /hesabim
        if (pathname === href) return true;
        // Check if pathname starts with href followed by a slash
        return pathname.startsWith(href + '/');
    };

    const SidebarContent = () => (
        <>
            {/* Logo / Brand */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center shadow-lg shadow-accent/30">
                        <span className="text-white font-black text-lg">W</span>
                    </div>
                    <span className="font-black text-xl text-primary dark:text-white">Waypla</span>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-3">Menü</p>
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group
              ${isActive(item.href, item.exact)
                                ? "bg-gradient-to-r from-accent/10 to-orange-500/5 text-accent border-l-4 border-accent shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#22303e] hover:text-primary dark:hover:text-white"
                            }`}
                    >
                        <span className={`material-symbols-outlined transition-transform group-hover:scale-110
              ${isActive(item.href, item.exact) ? "text-accent" : ""}`}>
                            {item.icon}
                        </span>
                        {item.label}
                        {isActive(item.href, item.exact) && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-accent animate-pulse" />
                        )}
                    </Link>
                ))}

                {/* Quick Actions */}
                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-3">Hızlı İşlemler</p>
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#22303e] transition-all group"
                        >
                            <span className={`material-symbols-outlined ${action.color} group-hover:scale-110 transition-transform`}>
                                {action.icon}
                            </span>
                            {action.label}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Footer - Logout */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 font-medium transition-all group"
                >
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">logout</span>
                    Çıkış Yap
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#1a2634] border-r border-gray-100 dark:border-gray-800 min-h-screen sticky top-0">
                <SidebarContent />
            </aside>

            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 w-12 h-12 bg-white dark:bg-[#1a2634] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center hover:shadow-xl transition-all"
                aria-label="Menüyü aç"
            >
                <span className="material-symbols-outlined text-primary dark:text-white">menu</span>
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-[#1a2634] flex flex-col transform transition-transform duration-300 ease-out shadow-2xl
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Menüyü kapat"
                >
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">close</span>
                </button>

                <SidebarContent />
            </aside>
        </>
    );
}
