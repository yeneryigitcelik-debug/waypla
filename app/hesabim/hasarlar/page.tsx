"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MyClaimsPage() {
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
    const claims = [
        {
            id: "CLM-001",
            deviceName: "Samsung Galaxy S23",
            incidentDate: "2023-12-10",
            type: "Ekran Kırılması",
            status: "COMPLETED",
            statusText: "Tamamlandı",
            lastUpdate: "2023-12-15"
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
                            <h1 className="text-3xl font-bold text-[#111418] dark:text-white">Hasar Taleplerim</h1>
                        </div>
                        <Link href="/hasar/bildir">
                            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-600/20 transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined">report_problem</span>
                                Yeni Bildirim
                            </button>
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {claims.map((claim) => (
                            <div key={claim.id} className="bg-white dark:bg-[#1a2634] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-3xl">build_circle</span>
                                </div>

                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Cihaz</span>
                                        <h3 className="font-bold text-[#111418] dark:text-white">{claim.deviceName}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{claim.type}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Dosya No</span>
                                        <p className="font-medium text-[#111418] dark:text-white font-mono">{claim.id}</p>
                                        <p className="text-xs text-gray-500 mt-1">Olay: {claim.incidentDate}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Durum</span>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${claim.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                                claim.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                                                    "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {claim.statusText}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">Son güncellenme: {claim.lastUpdate}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <button className="w-full py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                            Detaylar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {claims.length === 0 && (
                            <div className="text-center py-12 bg-white dark:bg-[#1a2634] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">Hasar kaydı bulunamadı</h3>
                                <p className="text-gray-500">Geçmişe dönük hasar işleminiz yoktur.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
