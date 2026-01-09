"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MyDevicesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/giris");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
    }

    if (!session) return null;

    // Mock data
    const devices = [
        {
            id: 1,
            name: "iPhone 15 Pro",
            brand: "Apple",
            category: "Akıllı Telefon",
            purchaseDate: "2024-01-15",
            status: "PROTECTED",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_BK--b7Qg8WYYxXCgoyIB8bcYfqn-ZUUqt9W85AE_ggMmysI3U6Wu5vlaQXmlNZXjwp7VUUOTmUDo4Osb5WRxG1OjoLAaB7HZQnagrOH2B-Z5aXgDD8xm7vX7BUnJhCA1g3ugxnRhkDCo3G7hWqpsWTI9zNpPFdeFJDpGW3PUM7WOBG9xTCK9RpRJnMsmEod-r6rC992S5dDWgacJ-v4L1JfobFnxjx4-XJiUtd86wDolX8HZWoEU_YY385t2jRaCtcIpKmehXkPt"
        },
        {
            id: 2,
            name: "MacBook Air M2",
            brand: "Apple",
            category: "Laptop",
            purchaseDate: "2023-11-20",
            status: "UNPROTECTED",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA74lmYx1O1vEnP5DJcHoiRepjepvIWIrfZwLPAvYFx8O7mA1G8tGIkcYKby7ejP3qG7i4oMl_J_RXxgmIphhzqfWeDLblkdOTteaD6zUn2wh92lSOcyDvfanTdGZctnX5sSgNLIajijCNA5KJEJpx2WdS-k3zhTgTCGao068t9PmlsxVjgjTHsIOK44svxGjnjremdrNpQJSSpXemaLRoLC9WUmXxUvyhvJc5ZUlHabvhA3gYeIEpIChahX7HkkJEZEzejDoFywiEd"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow py-12 bg-gray-50 dark:bg-[#111418]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Link href="/hesabim" className="text-sm text-gray-500 hover:text-primary mb-2 inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Hesabıma Dön
                            </Link>
                            <h1 className="text-3xl font-bold text-[#111418] dark:text-white">Cihazlarım</h1>
                        </div>
                        <Link href="/teklif">
                            <button className="bg-accent hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined">add_circle</span>
                                Yeni Cihaz Ekle
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {devices.map((device) => (
                            <div key={device.id} className="bg-white dark:bg-[#1a2634] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                                <div className="aspect-video rounded-xl bg-gray-50 dark:bg-[#22303e] mb-4 bg-center bg-cover" style={{ backgroundImage: `url('${device.image}')` }}></div>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{device.category}</span>
                                        <h3 className="text-lg font-bold text-[#111418] dark:text-white">{device.name}</h3>
                                    </div>
                                    {device.status === "PROTECTED" ? (
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">shield</span>
                                            Korumada
                                        </span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                                            Korumasız
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Marka</span>
                                        <span className="font-medium dark:text-gray-300">{device.brand}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Alım Tarihi</span>
                                        <span className="font-medium dark:text-gray-300">{device.purchaseDate}</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    {device.status === "PROTECTED" ? (
                                        <Link href={`/hesabim/policeler`}>
                                            <button className="w-full py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors">
                                                Poliçeyi Gör
                                            </button>
                                        </Link>
                                    ) : (
                                        <Link href="/teklif">
                                            <button className="w-full py-2.5 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">
                                                Koruma Paketi Al
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
