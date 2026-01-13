"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
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

    if (session?.user?.id) {
      loadProfile();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin">
              <span className="material-symbols-outlined text-4xl text-accent">refresh</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        </div>
        <Footer />
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pb-24">
        {/* Account Header Section */}
        <section className="bg-primary dark:bg-[#0f172a] text-white py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 backdrop-blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">Hesabım</h1>
                <p className="text-lg text-white/70">
                  Hoş geldiniz, cihazlarınız ve poliçeleriniz güvende.
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="self-start md:self-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-sm transition-all border border-white/10 flex items-center gap-2"
              >
                <span className="material-symbols-outlined">logout</span>
                Çıkış Yap
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl dark:shadow-black/40 border border-gray-100 dark:border-gray-800 p-8 mb-12 overflow-hidden">
            {isLoadingProfile ? (
              <div className="flex items-center justify-center py-8">
                <span className="w-8 h-8 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></span>
              </div>
            ) : profileError ? (
              <div className="text-red-500 text-center py-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
                {profileError}
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-2xl font-bold text-primary dark:text-white">{displayName}</h2>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wide">
                        {session.user.role === 'CUSTOMER' ? 'Bireysel Müşteri' : session.user.role}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">mail</span>
                      {session.user.email}
                    </p>
                    {displayPhone && (
                      <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">call</span>
                        {displayPhone}
                      </p>
                    )}
                    {displayAddress && (
                      <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {displayAddress}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-700 pt-6 lg:pt-0 lg:pl-8">
                  <Link href="/hesabim/profil-duzenle">
                    <button className="h-12 px-6 rounded-xl bg-gray-50 dark:bg-[#22303e] hover:bg-gray-100 dark:hover:bg-[#2a3b4d] text-primary dark:text-white font-bold transition-all border border-gray-200 dark:border-gray-700 flex items-center gap-2 group">
                      <span className="material-symbols-outlined group-hover:scale-110 transition-transform">edit_square</span>
                      Profili Düzenle
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-2 bg-transparent">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-primary dark:text-white mb-8">Özet</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Cihazlarım Card */}
              <Link href="/hesabim/cihazlar" className="group">
                <div className="h-full bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:border-accent dark:hover:border-accent hover:shadow-lg dark:hover:shadow-accent/20 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400 group-hover:text-white">smartphone</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-accent transition-colors">arrow_forward</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-1">Cihazlarım</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Kayıtlı cihazlarınız</p>
                  <p className="text-3xl font-black text-accent">0</p>
                </div>
              </Link>

              {/* Poliçelerim Card */}
              <Link href="/hesabim/policeler" className="group">
                <div className="h-full bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:border-accent dark:hover:border-accent hover:shadow-lg dark:hover:shadow-accent/20 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400 group-hover:text-white">card_membership</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-accent transition-colors">arrow_forward</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-1">Poliçelerim</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Aktif poliçeleriniz</p>
                  <p className="text-3xl font-black text-accent">0</p>
                </div>
              </Link>

              {/* Hasar Taleplerim Card */}
              <Link href="/hesabim/hasarlar" className="group">
                <div className="h-full bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:border-accent dark:hover:border-accent hover:shadow-lg dark:hover:shadow-accent/20 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-2xl text-purple-600 dark:text-purple-400 group-hover:text-white">report</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-accent transition-colors">arrow_forward</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-1">Hasar Taleplerim</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Hasar geçmişiniz</p>
                  <p className="text-3xl font-black text-accent">0</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="py-2 bg-transparent">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-primary dark:text-white mb-8">Hızlı İşlemler</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profil Düzenle */}
              <Link href="/hesabim/profil-duzenle" className="group">
                <div className="h-full bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-200 dark:border-purple-800 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-purple-500/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-white">person</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-2">Profili Düzenle</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kişisel bilgilerinizi ve adresinizi güncelleyin</p>
                </div>
              </Link>

              {/* Hasar Bildir */}
              <Link href="/hasar-bildir" className="group">
                <div className="h-full bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border border-red-200 dark:border-red-800 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-red-500/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-white">report</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-2">Hasar Bildir</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cihazınıza gelen hasarı hemen bildirin</p>
                </div>
              </Link>

              {/* Bakım Paketleri */}
              <Link href="/bakim-paketleri" className="group">
                <div className="h-full bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-200 dark:border-green-800 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-green-500/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-white">build</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-2">Bakım Paketleri</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cihazınızın ömrünü uzatın</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
