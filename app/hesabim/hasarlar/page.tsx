"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TableSkeleton } from "@/components/dashboard/StatsSkeleton";

interface Claim {
    id: string;
    deviceName: string;
    incidentDate: string;
    type: string;
    status: "CREATED" | "REVIEW" | "APPROVED" | "REPAIR" | "REPLACED" | "PAID" | "REJECTED";
    statusText: string;
    lastUpdate: string;
    description?: string;
}

export default function MyClaimsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/giris");
        }
    }, [status, router]);

    useEffect(() => {
        const loadClaims = async () => {
            setIsLoading(true);
            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 800));
                setClaims([
                    {
                        id: "CLM-001",
                        deviceName: "Samsung Galaxy S23",
                        incidentDate: "2023-12-10",
                        type: "Ekran Kırılması",
                        status: "PAID",
                        statusText: "Tamamlandı",
                        lastUpdate: "2023-12-15",
                        description: "Telefon düşme sonucu ekran kırıldı"
                    }
                ]);
            } catch (error) {
                console.error('Claims loading error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.id) {
            loadClaims();
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

    const statusConfig: Record<string, { bg: string; text: string; icon: string }> = {
        CREATED: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", icon: "draft" },
        REVIEW: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", icon: "search" },
        APPROVED: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", icon: "check_circle" },
        REPAIR: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-400", icon: "build" },
        REPLACED: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", icon: "swap_horiz" },
        PAID: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", icon: "paid" },
        REJECTED: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", icon: "cancel" },
    };

    const claimTypeIcons: Record<string, string> = {
        "Ekran Kırılması": "phone_iphone",
        "Sıvı Hasarı": "water_drop",
        "Fiziksel Hasar": "broken_image",
        "Çalınma": "report",
        "Arıza": "error",
    };

    return (
        <div className="min-h-screen pb-24 lg:pl-0 pt-16 lg:pt-0">
            {/* Header */}
            <section className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-900 dark:to-purple-950 text-white py-10 lg:py-12 relative overflow-hidden">
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
                            <h1 className="text-2xl lg:text-3xl font-black tracking-tight mb-1">Hasar Taleplerim</h1>
                            <p className="text-white/70 text-sm">Hasar bildirilerinizi ve durumlarını takip edin</p>
                        </div>
                        <Link href="/hasar-bildir">
                            <button className="h-11 px-5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-lg">report_problem</span>
                                Yeni Hasar Bildir
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Timeline/Status Info */}
            {!isLoading && claims.length > 0 && (
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                    <div className="bg-white dark:bg-[#1a2634] rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm text-gray-500">draft</span>
                                </div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Oluşturuldu</span>
                            </div>
                            <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">search</span>
                                </div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">İnceleme</span>
                            </div>
                            <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm text-yellow-600 dark:text-yellow-400">build</span>
                                </div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Onarım</span>
                            </div>
                            <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm text-green-600 dark:text-green-400">check_circle</span>
                                </div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tamamlandı</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Content */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <TableSkeleton rows={2} />
                ) : claims.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-[#1a2634] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl text-purple-500">history</span>
                        </div>
                        <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Hasar kaydı bulunamadı</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            Geçmişe dönük hasar işleminiz bulunmamaktadır. Bu iyi bir haber! 🎉
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {claims.map((claim, index) => (
                            <div
                                key={claim.id}
                                className="bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Icon */}
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
                                            <span className="material-symbols-outlined text-3xl text-white">
                                                {claimTypeIcons[claim.type] || "report"}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cihaz</span>
                                                <h3 className="font-bold text-primary dark:text-white mt-1">{claim.deviceName}</h3>
                                                <p className="text-sm text-red-500 font-medium">{claim.type}</p>
                                            </div>

                                            <div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dosya No</span>
                                                <p className="font-bold text-primary dark:text-white font-mono mt-1">{claim.id}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Olay: {claim.incidentDate}</p>
                                            </div>

                                            <div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Durum</span>
                                                <div className={`inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-bold ${statusConfig[claim.status]?.bg || statusConfig.CREATED.bg} ${statusConfig[claim.status]?.text || statusConfig.CREATED.text}`}>
                                                    <span className="material-symbols-outlined text-xs">{statusConfig[claim.status]?.icon || "info"}</span>
                                                    {claim.statusText}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Güncelleme: {claim.lastUpdate}</p>
                                            </div>

                                            <div className="flex items-center">
                                                <button className="w-full h-11 rounded-xl bg-gray-100 dark:bg-gray-800 text-primary dark:text-white font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                    Detaylar
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {claim.description && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                <span className="material-symbols-outlined text-base mt-0.5 shrink-0">description</span>
                                                {claim.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar for active claims */}
                                {claim.status !== "PAID" && claim.status !== "REJECTED" && (
                                    <div className="h-1 bg-gray-100 dark:bg-gray-800">
                                        <div
                                            className="h-full bg-gradient-to-r from-accent to-orange-600 transition-all duration-500"
                                            style={{
                                                width: claim.status === "CREATED" ? "25%" :
                                                    claim.status === "REVIEW" ? "50%" :
                                                        claim.status === "APPROVED" ? "75%" :
                                                            claim.status === "REPAIR" ? "85%" : "100%"
                                            }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
