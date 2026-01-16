"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CardGridSkeleton } from "@/components/dashboard/StatsSkeleton";

interface Device {
    id: string;
    name: string;
    brand: string;
    category: string;
    purchaseDate: string;
    status: "PROTECTED" | "UNPROTECTED";
    image?: string;
}

export default function MyDevicesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/giris");
        }
    }, [status, router]);

    useEffect(() => {
        const loadDevices = async () => {
            setIsLoading(true);
            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 800));
                setDevices([
                    {
                        id: "1",
                        name: "iPhone 15 Pro",
                        brand: "Apple",
                        category: "Akıllı Telefon",
                        purchaseDate: "2024-01-15",
                        status: "PROTECTED",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_BK--b7Qg8WYYxXCgoyIB8bcYfqn-ZUUqt9W85AE_ggMmysI3U6Wu5vlaQXmlNZXjwp7VUUOTmUDo4Osb5WRxG1OjoLAaB7HZQnagrOH2B-Z5aXgDD8xm7vX7BUnJhCA1g3ugxnRhkDCo3G7hWqpsWTI9zNpPFdeFJDpGW3PUM7WOBG9xTCK9RpRJnMsmEod-r6rC992S5dDWgacJ-v4L1JfobFnxjx4-XJiUtd86wDolX8HZWoEU_YY385t2jRaCtcIpKmehXkPt"
                    },
                    {
                        id: "2",
                        name: "MacBook Air M2",
                        brand: "Apple",
                        category: "Laptop",
                        purchaseDate: "2023-11-20",
                        status: "UNPROTECTED",
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA74lmYx1O1vEnP5DJcHoiRepjepvIWIrfZwLPAvYFx8O7mA1G8tGIkcYKby7ejP3qG7i4oMl_J_RXxgmIphhzqfWeDLblkdOTteaD6zUn2wh92lSOcyDvfanTdGZctnX5sSgNLIajijCNA5KJEJpx2WdS-k3zhTgTCGao068t9PmlsxVjgjTHsIOK44svxGjnjremdrNpQJSSpXemaLRoLC9WUmXxUvyhvJc5ZUlHabvhA3gYeIEpIChahX7HkkJEZEzejDoFywiEd"
                    }
                ]);
            } catch (error) {
                console.error('Device loading error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.id) {
            loadDevices();
        }
    }, [session]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) return null;

    const categoryIcons: Record<string, string> = {
        "Akıllı Telefon": "smartphone",
        "Laptop": "laptop_mac",
        "Tablet": "tablet_mac",
        "Kulaklık": "headphones",
        "Akıllı Saat": "watch",
    };

    return (
        <div className="min-h-screen pb-24 lg:pl-0 pt-16 lg:pt-0">
            {/* Header */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-950 text-white py-10 lg:py-12 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/hesabim" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors text-sm">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        <span>Hesabım</span>
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black tracking-tight mb-1">Cihazlarım</h1>
                            <p className="text-white/70 text-sm">Kayıtlı cihazlarınızı yönetin</p>
                        </div>
                        <Link href="/teklif">
                            <button className="h-11 px-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-white/90 shadow-lg shadow-black/10 transition-all flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                Yeni Cihaz Ekle
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <CardGridSkeleton count={3} />
                ) : devices.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-[#1a2634] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl text-blue-500">smartphone</span>
                        </div>
                        <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Henüz cihaz eklenmemiş</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            Cihazlarınızı ekleyerek koruma planı satın alabilirsiniz
                        </p>
                        <Link href="/teklif">
                            <button className="h-12 px-6 bg-accent text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
                                İlk Cihazınızı Ekleyin
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {devices.map((device, index) => (
                            <div
                                key={device.id}
                                className="bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image */}
                                <div
                                    className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#22303e] dark:to-[#1a2634] bg-center bg-cover relative"
                                    style={{ backgroundImage: device.image ? `url('${device.image}')` : undefined }}
                                >
                                    {!device.image && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">
                                                {categoryIcons[device.category] || "devices"}
                                            </span>
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        {device.status === "PROTECTED" ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg">
                                                <span className="material-symbols-outlined text-sm">shield</span>
                                                Korumada
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-500/80 text-white backdrop-blur-sm">
                                                Korumasız
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="mb-4">
                                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">{device.category}</span>
                                        <h3 className="text-lg font-bold text-primary dark:text-white mt-1">{device.name}</h3>
                                    </div>

                                    <div className="space-y-2 mb-5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Marka</span>
                                            <span className="font-medium text-primary dark:text-white">{device.brand}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Alım Tarihi</span>
                                            <span className="font-medium text-primary dark:text-white">{device.purchaseDate}</span>
                                        </div>
                                    </div>

                                    {device.status === "PROTECTED" ? (
                                        <Link href="/hesabim/policeler">
                                            <button className="w-full h-11 rounded-xl border-2 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 font-bold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-2 text-sm">
                                                <span className="material-symbols-outlined text-lg">verified_user</span>
                                                Poliçeyi Görüntüle
                                            </button>
                                        </Link>
                                    ) : (
                                        <Link href="/teklif">
                                            <button className="w-full h-11 rounded-xl bg-accent text-white font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-accent/20">
                                                <span className="material-symbols-outlined text-lg">shield</span>
                                                Koruma Paketi Al
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
