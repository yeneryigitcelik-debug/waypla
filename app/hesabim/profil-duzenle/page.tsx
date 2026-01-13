"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const profileSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  phone: z.string().min(10, "Geçerli bir telefon numarası girin").optional().or(z.literal("")),
  city: z.string().min(2, "Şehir seçin"),
  district: z.string().min(2, "İlçe seçin"),
  neighborhood: z.string().optional(),
  line1: z.string().min(5, "Adres en az 5 karakter olmalı"),
  postalCode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    }
  }, [status, router]);

  useEffect(() => {
    // Load existing profile data
    const loadProfile = async () => {
      if (!session?.user?.id) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          reset({
            name: data.profile?.name || session.user.name || "",
            phone: data.profile?.phone || "",
            city: data.address?.city || "",
            district: data.address?.district || "",
            neighborhood: data.address?.neighborhood || "",
            line1: data.address?.line1 || "",
            postalCode: data.address?.postalCode || "",
          });
        }
      } catch (error) {
        console.error('Profile loading error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      loadProfile();
    }
  }, [session, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profiliniz başarıyla güncellendi' });
        router.refresh(); // Refresh session/data
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: 'error', text: 'Güncelleme başarısız oldu' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Bir hata oluştu' });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#101822]">
      <Header />

      <main className="flex-grow pb-24">
        {/* Header Section */}
        <section className="bg-primary dark:bg-[#0f172a] text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 backdrop-blur-3xl"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/hesabim" className="text-white/60 hover:text-white transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Hesabım</span>
              </Link>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Kişisel Bilgiler</h1>
            <p className="text-white/70 mt-2">Daha iyi bir hizmet için bilgilerinizi güncel tutun.</p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          {message && (
            <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 shadow-lg animate-fadeIn ${message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800'
              }`}>
              <span className="material-symbols-outlined">
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <p className="font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h2 className="text-lg font-bold text-primary dark:text-white">Kimlik & İletişim</h2>
              </div>

              <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:border-accent focus:bg-white dark:focus:bg-[#1a2634] transition-all"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                    E-posta
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={session.user.email || ""}
                      disabled
                      className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-[#0f1419] text-gray-500 cursor-not-allowed"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">lock</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="05XX XXX XX XX"
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:border-accent focus:bg-white dark:focus:bg-[#1a2634] transition-all"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Address Info Card */}
            <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-accent">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <h2 className="text-lg font-bold text-primary dark:text-white">Adres Bilgileri</h2>
              </div>

              <div className="p-6 lg:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Şehir
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:border-accent focus:bg-white dark:focus:bg-[#1a2634] transition-all"
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      İlçe
                    </label>
                    <input
                      type="text"
                      {...register("district")}
                      className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:border-accent focus:bg-white dark:focus:bg-[#1a2634] transition-all"
                    />
                    {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Mahalle
                    </label>
                    <input
                      type="text"
                      {...register("neighborhood")}
                      className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:border-accent focus:bg-white dark:focus:bg-[#1a2634] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Posta Kodu
                    </label>
                    <input
                      type="text"
                      {...register("postalCode")}
                      className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:border-accent focus:bg-white dark:focus:bg-[#1a2634] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                    Açık Adres
                  </label>
                  <textarea
                    {...register("line1")}
                    rows={3}
                    className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:border-accent focus:bg-white dark:focus:bg-[#1a2634] transition-all resize-none"
                    placeholder="Cadde, sokak, bina ve kapı no..."
                  />
                  {errors.line1 && <p className="mt-1 text-xs text-red-500">{errors.line1.message}</p>}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link href="/hesabim">
                <button type="button" className="px-6 py-3 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  İptal Et
                </button>
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center gap-2 ${isDirty
                    ? 'bg-accent hover:bg-orange-600 shadow-accent/30 hover:scale-105'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400 opacity-50'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Değişiklikleri Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}