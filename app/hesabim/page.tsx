"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatsGridSkeleton } from "@/components/dashboard/StatsSkeleton";

interface ProfileData {
  profile: {
    name: string | null;
    phone: string | null;
  } | null;
  address: {
    city: string;
    district: string;
    neighborhood: string | null;
    line1: string;
    postalCode: string | null;
  } | null;
}

interface DashboardStats {
  totalDevices: number;
  activePolicies: number;
  totalClaims: number;
  pendingClaims: number;
  totalCoverage: number;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    }
  }, [status, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) return;

      setIsLoadingProfile(true);
      setProfileError(null);

      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          setProfileError('Profil bilgileri yüklenemedi');
        }
      } catch (error) {
        console.error('Profile loading error:', error);
        setProfileError('Bir hata oluştu');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    // Simulated stats loading - replace with actual API call
    const loadStats = async () => {
      setIsLoadingStats(true);
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setStats({
          totalDevices: 2,
          activePolicies: 1,
          totalClaims: 0,
          pendingClaims: 0,
          totalCoverage: 45000,
        });
      } catch (error) {
        console.error('Stats loading error:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (session?.user?.id) {
      loadProfile();
      loadStats();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <span className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin block"></span>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const displayName = profileData?.profile?.name || session.user.name || "Belirtilmemiş";
  const displayPhone = profileData?.profile?.phone || null;
  const displayAddress = profileData?.address ?
    `${profileData.address.neighborhood ? profileData.address.neighborhood + ', ' : ''}${profileData.address.district}, ${profileData.address.city}`
    : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen pb-24 lg:pl-0 pt-16 lg:pt-0">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-[#1e3a5f] dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#1e293b] text-white py-12 lg:py-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="animate-slide-up">
              <p className="text-white/60 text-sm font-medium mb-2">Hoş geldiniz 👋</p>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">
                {displayName}
              </h1>
              <p className="text-white/70 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mail</span>
                {session.user.email}
              </p>
            </div>

            <div className="flex items-center gap-3 animate-slide-in-right">
              <Link href="/hasar-bildir">
                <button className="h-12 px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 transition-all flex items-center gap-2 hover:scale-105">
                  <span className="material-symbols-outlined">report_problem</span>
                  <span className="hidden sm:inline">Hasar Bildir</span>
                </button>
              </Link>
              <Link href="/hesabim/profil-duzenle">
                <button className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-sm transition-all border border-white/10 flex items-center gap-2 hover:scale-105">
                  <span className="material-symbols-outlined">edit</span>
                  <span className="hidden sm:inline">Profili Düzenle</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {isLoadingStats ? (
          <StatsGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-slide-up">
            <StatsCard
              href="/hesabim/policeler"
              icon="shield"
              iconBg="bg-gradient-to-br from-green-400 to-green-600"
              iconColor="text-white"
              title="Toplam Teminat"
              subtitle="Güvence altında"
              value={formatCurrency(stats?.totalCoverage || 0)}
            />
            <StatsCard
              href="/hesabim/cihazlar"
              icon="smartphone"
              iconBg="bg-gradient-to-br from-blue-400 to-blue-600"
              iconColor="text-white"
              title="Cihazlarım"
              subtitle="Kayıtlı cihazlar"
              value={stats?.totalDevices || 0}
            />
            <StatsCard
              href="/hesabim/policeler"
              icon="verified_user"
              iconBg="bg-gradient-to-br from-purple-400 to-purple-600"
              iconColor="text-white"
              title="Aktif Poliçe"
              subtitle="Koruma devam ediyor"
              value={stats?.activePolicies || 0}
            />
            <StatsCard
              href="/hesabim/hasarlar"
              icon="report"
              iconBg="bg-gradient-to-br from-orange-400 to-orange-600"
              iconColor="text-white"
              title="Hasar Talepleri"
              subtitle={stats?.pendingClaims ? `${stats.pendingClaims} beklemede` : "Tümü tamamlandı"}
              value={stats?.totalClaims || 0}
            />
          </div>
        )}
      </section>

      {/* Profile Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden animate-slide-up">
          {isLoadingProfile ? (
            <div className="p-8">
              <div className="flex items-center gap-6 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ) : profileError ? (
            <div className="p-8">
              <div className="text-red-500 text-center py-4 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {profileError}
              </div>
            </div>
          ) : (
            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                {/* Avatar & Info */}
                <div className="flex items-start gap-5 flex-1">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center text-white text-2xl lg:text-3xl font-bold shadow-lg shadow-accent/30">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl lg:text-2xl font-bold text-primary dark:text-white">{displayName}</h2>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20 uppercase tracking-wide">
                        {session.user.role === 'CUSTOMER' ? 'Bireysel' : session.user.role}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-base">mail</span>
                      {session.user.email}
                    </p>
                    {displayPhone && (
                      <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-base">call</span>
                        {displayPhone}
                      </p>
                    )}
                    {displayAddress && (
                      <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        {displayAddress}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800 lg:pl-6">
                  <Link href="/hesabim/profil-duzenle">
                    <button className="h-11 px-5 rounded-xl bg-gray-50 dark:bg-[#22303e] hover:bg-gray-100 dark:hover:bg-[#2a3b4d] text-primary dark:text-white font-bold transition-all border border-gray-200 dark:border-gray-700 flex items-center gap-2 group text-sm">
                      <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">edit_square</span>
                      Düzenle
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-xl font-bold text-primary dark:text-white mb-6">Hızlı İşlemler</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Hasar Bildir */}
          <Link href="/hasar-bildir" className="group">
            <div className="h-full bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/30">
                <span className="material-symbols-outlined text-white">report_problem</span>
              </div>
              <h3 className="text-lg font-bold text-primary dark:text-white mb-2">Hasar Bildir</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cihazınıza gelen hasarı hemen bildirin</p>
            </div>
          </Link>

          {/* Cihaz Ekle */}
          <Link href="/teklif" className="group">
            <div className="h-full bg-gradient-to-br from-accent/10 to-orange-100/50 dark:from-accent/10 dark:to-orange-900/10 border border-accent/30 dark:border-accent/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-accent/30">
                <span className="material-symbols-outlined text-white">add_circle</span>
              </div>
              <h3 className="text-lg font-bold text-primary dark:text-white mb-2">Yeni Cihaz Ekle</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cihazınızı koruma altına alın</p>
            </div>
          </Link>

          {/* Bakım Paketleri */}
          <Link href="/bakim-paketleri" className="group">
            <div className="h-full bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                <span className="material-symbols-outlined text-white">build</span>
              </div>
              <h3 className="text-lg font-bold text-primary dark:text-white mb-2">Bakım Paketleri</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cihazınızın ömrünü uzatın</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary dark:text-white">Son Aktiviteler</h2>
          <Link href="/hesabim/hasarlar" className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
            Tümünü Gör
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-gray-400">history</span>
            </div>
            <h3 className="font-bold text-primary dark:text-white mb-2">Henüz aktivite yok</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cihaz ekleyerek veya poliçe satın alarak başlayın
            </p>
            <Link href="/teklif">
              <button className="mt-4 h-10 px-5 bg-accent text-white font-bold rounded-lg hover:bg-orange-600 transition-colors text-sm">
                Hemen Başla
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
