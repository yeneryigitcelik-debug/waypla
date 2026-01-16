"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    FileText,
    Shield,
    AlertTriangle,
    MessageSquare,
    Users,
    LogOut,
    Smartphone,
    ChevronRight,
} from "lucide-react";

// Navigation items for admin sidebar
const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/policeler", label: "Poliçeler", icon: FileText },
    { href: "/admin/planlar", label: "Planlar", icon: Shield },
    { href: "/admin/cihazlar", label: "Cihazlar", icon: Smartphone },
    { href: "/admin/hasarlar", label: "Hasarlar", icon: AlertTriangle },
    { href: "/admin/yorumlar", label: "Yorumlar", icon: MessageSquare },
    { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/giris");
        } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
            router.push("/hesabim");
        }
    }, [status, session, router]);

    // Loading state
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Not authorized
    if (!session || session.user?.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg">Waypla</span>
                        <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                            Admin
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`} />
                                <span>{item.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
                            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                                {session.user?.name || "Admin"}
                            </p>
                            <p className="text-slate-500 text-xs truncate">
                                {session.user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/giris" })}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </aside>

            {/* Main content area */}
            <div className="flex-1 ml-64">
                {/* Top header */}
                <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <h1 className="text-gray-900 font-semibold">
                            {navItems.find(item =>
                                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                            )?.label || "Dashboard"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Siteye Dön →
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
