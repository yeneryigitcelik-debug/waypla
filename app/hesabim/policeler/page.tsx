"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TableSkeleton } from "@/components/dashboard/StatsSkeleton";

interface Policy {
    id: string;
    deviceName: string;
    plan: string;
    startDate: string;
    endDate: string;
    status: "ACTIVE" | "EXPIRED" | "PENDING";
    premium: string;
    nextPayment: string;
    coverage: number;
}

export default function MyPoliciesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/giris");
        }
    }, [status, router]);

    useEffect(() => {
        const loadPolicies = async () => {
            setIsLoading(true);
            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 800));
                setPolicies([
                    {
                        id: "POL-240115",
                        deviceName: "iPhone 15 Pro",
                        plan: "Tam Koruma",
                        startDate: "2024-01-15",
                        endDate: "2025-01-15",
                        status: "ACTIVE",
                        premium: "189.90",
                        nextPayment: "2024-02-15",
                        coverage: 45000
                    }
                ]);
            } catch (error) {
                console.error('Policy loading error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.id) {
            loadPolicies();
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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const statusConfig = {
        ACTIVE: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", label: "Aktif", icon: "check_circle" },
        EXPIRED: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", label: "Süresi Dolmuş", icon: "schedule" },
        PENDING: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400", label: "Beklemede", icon: "hourglass_empty" },
    };

    return (
        <div className="min-h-screen pb-24 lg:pl-0 pt-16 lg:pt-0">
            {/* Header */}
            <section className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-900 dark:to-green-950 text-white py-10 lg:py-12 relative overflow-hidden">
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
                            <h1 className="text-2xl lg:text-3xl font-black tracking-tight mb-1">Poliçelerim</h1>
                            <p className="text-white/70 text-sm">Aktif koruma planlarınızı görüntüleyin</p>
                        </div>
                        <Link href="/teklif">
                            <button className="h-11 px-5 bg-white text-green-600 font-bold rounded-xl hover:bg-white/90 shadow-lg shadow-black/10 transition-all flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                Yeni Poliçe Al
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Cards */}
            {!isLoading && policies.length > 0 && (
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-[#1a2634] rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">verified_user</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Aktif Poliçe</p>
                                    <p className="text-xl font-bold text-primary dark:text-white">{policies.filter(p => p.status === "ACTIVE").length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1a2634] rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">shield</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Toplam Teminat</p>
                                    <p className="text-xl font-bold text-primary dark:text-white">{formatCurrency(policies.reduce((sum, p) => sum + p.coverage, 0))}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#1a2634] rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-accent">payments</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Aylık Ödeme</p>
                                    <p className="text-xl font-bold text-primary dark:text-white">{policies.reduce((sum, p) => sum + parseFloat(p.premium), 0).toFixed(2)} ₺</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Content */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <TableSkeleton rows={2} />
                ) : policies.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-[#1a2634] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl text-green-500">verified_user</span>
                        </div>
                        <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Henüz poliçeniz yok</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            Cihazlarınızı güvence altına alarak başlayın
                        </p>
                        <Link href="/teklif">
                            <button className="h-12 px-6 bg-accent text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
                                Teklif Al
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {policies.map((policy, index) => (
                            <div
                                key={policy.id}
                                className="bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/30">
                                        <span className="material-symbols-outlined text-3xl text-white">verified_user</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cihaz</span>
                                            <h3 className="font-bold text-primary dark:text-white mt-1">{policy.deviceName}</h3>
                                            <p className="text-sm text-accent font-medium">{policy.plan}</p>
                                        </div>

                                        <div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Poliçe No</span>
                                            <p className="font-bold text-primary dark:text-white font-mono mt-1">{policy.id}</p>
                                            <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${statusConfig[policy.status].bg} ${statusConfig[policy.status].text}`}>
                                                <span className="material-symbols-outlined text-xs">{statusConfig[policy.status].icon}</span>
                                                {statusConfig[policy.status].label}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teminat</span>
                                            <p className="font-bold text-primary dark:text-white mt-1">{formatCurrency(policy.coverage)}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bitiş: {policy.endDate}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button className="flex-1 h-11 rounded-xl bg-primary dark:bg-white text-white dark:text-primary font-bold text-sm hover:opacity-90 transition-all">
                                                Yönet
                                            </button>
                                            <Link href="/hasar-bildir">
                                                <button className="h-11 px-4 rounded-xl border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                    Hasar
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-base">calendar_month</span>
                                        <span>Başlangıç: {policy.startDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-base">payments</span>
                                        <span>Aylık: {policy.premium} ₺</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-base">schedule</span>
                                        <span>Sonraki ödeme: {policy.nextPayment}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
