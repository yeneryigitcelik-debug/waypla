"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

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
        router.refresh();
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Güncelleme başarısız oldu' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen pb-24 lg:pl-0 pt-16 lg:pt-0">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-900 dark:to-purple-950 text-white py-10 lg:py-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/hesabim" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors text-sm">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Hesabım</span>
          </Link>

          <h1 className="text-2xl lg:text-3xl font-black tracking-tight mb-1">Profil Ayarları</h1>
          <p className="text-white/70 text-sm">Kişisel bilgilerinizi ve adresinizi güncelleyin</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 shadow-lg animate-slide-up ${message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
            <span className="material-symbols-outlined text-xl">
              {message.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden animate-slide-up">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white">person</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary dark:text-white">Kimlik & İletişim</h2>
                <p className="text-xs text-gray-500">Temel kişisel bilgileriniz</p>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              {isLoading ? (
                <div className="space-y-6 animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                      Ad Soyad *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium"
                        placeholder="Adınız Soyadınız"
                      />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">badge</span>
                    </div>
                    {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                      E-posta
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={session.user.email || ""}
                        disabled
                        className="w-full h-14 pl-12 pr-12 rounded-xl bg-gray-100 dark:bg-[#0f1419] border-2 border-gray-200 dark:border-gray-800 text-gray-500 cursor-not-allowed font-medium"
                      />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">lock</span>
                    </div>
                    <p className="text-xs text-gray-400">E-posta adresi değiştirilemez</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                      Telefon Numarası
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="05XX XXX XX XX"
                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium"
                      />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">call</span>
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.phone.message}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address Info Card */}
          <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white">location_on</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary dark:text-white">Adres Bilgileri</h2>
                <p className="text-xs text-gray-500">Teslimat ve iletişim adresi</p>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              {isLoading ? (
                <div className="space-y-6 animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  </div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Şehir *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          {...register("city")}
                          className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium"
                          placeholder="İstanbul"
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">apartment</span>
                      </div>
                      {errors.city && <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.city.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                        İlçe *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          {...register("district")}
                          className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium"
                          placeholder="Kadıköy"
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">location_city</span>
                      </div>
                      {errors.district && <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.district.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Mahalle
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          {...register("neighborhood")}
                          className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium"
                          placeholder="Caferağa"
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">home</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                        Posta Kodu
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          {...register("postalCode")}
                          className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium"
                          placeholder="34000"
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">markunread_mailbox</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                      Açık Adres *
                    </label>
                    <textarea
                      {...register("line1")}
                      rows={3}
                      className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium resize-none"
                      placeholder="Cadde, sokak, bina ve kapı numarası..."
                    />
                    {errors.line1 && <p className="text-xs text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span>{errors.line1.message}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4">
            <Link href="/hesabim">
              <button
                type="button"
                className="h-12 px-6 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Geri Dön
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className={`h-12 px-8 rounded-xl font-bold text-white transition-all shadow-lg flex items-center gap-2 ${isDirty
                  ? 'bg-gradient-to-r from-accent to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-accent/30 hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
    </div>
  );
}