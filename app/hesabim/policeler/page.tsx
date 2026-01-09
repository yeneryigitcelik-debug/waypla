"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MyPoliciesPage() {
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

    const policies = [
        {
            id: "POL-240115",
            deviceName: "iPhone 15 Pro",
            plan: "Tam Koruma",
            startDate: "2024-01-15",
            endDate: "2025-01-15",
            status: "ACTIVE",
            premium: "189.90 TL/ay",
            nextPayment: "2024-02-15"
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
                            <h1 className="text-3xl font-bold text-[#111418] dark:text-white">Poliçelerim</h1>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {policies.map((policy) => (
                            <div key={policy.id} className="bg-white dark:bg-[#1a2634] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                                </div>

                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Cihaz</span>
                                        <h3 className="font-bold text-[#111418] dark:text-white">{policy.deviceName}</h3>
                                        <p className="text-sm text-accent font-medium">{policy.plan}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Poliçe No</span>
                                        <p className="font-medium text-[#111418] dark:text-white font-mono">{policy.id}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-bold">Aktif</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Bitiş Tarihi</span>
                                        <p className="font-medium text-[#111418] dark:text-white">{policy.endDate}</p>
                                        <p className="text-xs text-gray-500 mt-1">Sonraki Ödeme: {policy.nextPayment}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="flex-1 py-2 px-4 rounded-lg bg-primary text-white font-bold text-sm hover:bg-blue-700 transition-colors">
                                            Yönet
                                        </button>
                                        <Link href="/hasar/bildir">
                                            <button className="py-2 px-4 rounded-lg border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors">
                                                Hasar Bildir
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {policies.length === 0 && (
                            <div className="text-center py-12 bg-white dark:bg-[#1a2634] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-3xl">policy</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">Henüz poliçeniz yok</h3>
                                <p className="text-gray-500 mb-6">Cihazlarınızı güvence altına alarak başlayın.</p>
                                <Link href="/teklif">
                                    <button className="bg-accent text-white px-6 py-3 rounded-lg font-bold">Teklif Al</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
