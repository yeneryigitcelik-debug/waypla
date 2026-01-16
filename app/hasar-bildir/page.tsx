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
import { PhotoUploader, type UploadedPhoto } from "@/components/ui/PhotoUploader";
import { waypla } from "@/content/waypla";

const claimSchema = z.object({
  deviceCategory: z.string().min(1, "Cihaz türü seçin"),
  deviceBrand: z.string().min(2, "Marka en az 2 karakter olmalı"),
  deviceModel: z.string().min(2, "Model en az 2 karakter olmalı"),
  purchaseDate: z.string().optional(),
  serialNumber: z.string().optional(),
  claimType: z.string().min(1, "Hasar türü seçin"),
  incidentDate: z.string().min(1, "Olay tarihi girin"),
  incidentTime: z.string().optional(),
  description: z.string().min(20, "Açıklama en az 20 karakter olmalı"),
});

type ClaimForm = z.infer<typeof claimSchema>;

export default function ClaimReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ClaimForm>({
    resolver: zodResolver(claimSchema),
  });

  const selectedDeviceCategory = watch("deviceCategory");
  const selectedClaimType = watch("claimType");
  const descriptionLength = watch("description")?.length || 0;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    }
  }, [status, router]);

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['deviceCategory', 'deviceBrand', 'deviceModel']);
    } else if (currentStep === 2) {
      isValid = await trigger(['claimType', 'incidentDate', 'description']);
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: ClaimForm) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();

      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Add files
      uploadedPhotos.forEach((photo, index) => {
        formData.append(`file_${index}`, photo.file);
      });

      const response = await fetch('/api/claims', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({
          type: 'success',
          text: `Hasar talebiniz başarıyla oluşturuldu. Talep No: ${result.claimId}`
        });
        setTimeout(() => {
          router.push('/hesabim/hasarlar');
        }, 3000);
      } else {
<<<<<<< HEAD
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || error.error || 'Bir hata oluştu.' });
=======
        setMessage({
          type: 'error',
          text: result.error || 'Bir hata oluştu. Lütfen tekrar deneyin.'
        });
>>>>>>> dd786a0 (feat: Add admin dashboard with sidebar layout, stats, plans & reviews management)
      }
    } catch (error) {
      console.error('Claim submission error:', error);
      setMessage({ type: 'error', text: 'Bağlantı hatası. Lütfen tekrar deneyin.' });
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
            <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const steps = [
    { number: 1, title: "Cihaz Bilgisi", icon: "devices" },
    { number: 2, title: "Hasar Detayı", icon: "report_problem" },
    { number: 3, title: "Fotoğraf & Onay", icon: "cloud_upload" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#101822]">
      <Header />

      <main className="flex-grow pb-24">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-red-600 via-red-600 to-red-700 dark:from-red-900 dark:via-red-900 dark:to-red-950 text-white py-12 lg:py-16 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link href="/hesabim" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors text-sm">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>Hesabım</span>
            </Link>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">Hasar Bildirimi</h1>
            <p className="text-lg text-white/70 max-w-2xl">
              Cihazınızda oluşan hasarı hızlıca bildirin, uzman ekibimiz en kısa sürede size dönüş yapsın.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Stepper */}
            <div className="grid grid-cols-3 border-b border-gray-100 dark:border-gray-800">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-5 px-3 transition-all ${currentStep === step.number
                      ? 'bg-accent/5 dark:bg-accent/10'
                      : currentStep > step.number
                        ? 'bg-green-50 dark:bg-green-900/10'
                        : ''
                    }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-lg ${currentStep === step.number
                      ? 'bg-accent text-white shadow-accent/30'
                      : currentStep > step.number
                        ? 'bg-green-500 text-white shadow-green-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}>
                    {currentStep > step.number ? (
                      <span className="material-symbols-outlined text-lg">check</span>
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className={`font-bold text-xs sm:text-sm ${currentStep >= step.number
                        ? 'text-primary dark:text-white'
                        : 'text-gray-400'
                      }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 hidden sm:block">Adım {step.number}/3</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 lg:p-10">
              {/* Message */}
              {message && (
                <div className={`p-4 rounded-xl mb-8 flex items-start gap-3 animate-slide-up ${message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                  }`}>
                  <span className="material-symbols-outlined text-xl mt-0.5 shrink-0">
                    {message.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <p className="font-medium">{message.text}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* Step 1: Device Information */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold text-primary dark:text-white mb-6">
                        Hangi cihazınız hasar gördü?
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {waypla.deviceCategories.map((cat) => (
                          <div
                            key={cat.value}
                            onClick={() => setValue("deviceCategory", cat.value, { shouldValidate: true })}
                            className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 ${selectedDeviceCategory === cat.value
                                ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                                : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#22303e] hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                          >
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${selectedDeviceCategory === cat.value
                                ? 'bg-accent text-white shadow-lg shadow-accent/30'
                                : 'bg-white dark:bg-[#1a2634] text-gray-400'
                              }`}>
                              <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                            </div>
                            <span className={`font-bold text-xs text-center ${selectedDeviceCategory === cat.value ? 'text-accent' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                              {cat.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      {errors.deviceCategory && (
                        <p className="mt-3 text-sm text-red-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">error</span>
                          {errors.deviceCategory.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Cihaz Markası *</label>
                        <div className="relative">
                          <input
                            type="text"
                            {...register("deviceBrand")}
                            className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium"
                            placeholder="Örn: Apple, Samsung"
                          />
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">verified</span>
                        </div>
                        {errors.deviceBrand && <p className="text-xs text-red-500">{errors.deviceBrand.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Cihaz Modeli *</label>
                        <div className="relative">
                          <input
                            type="text"
                            {...register("deviceModel")}
                            className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium"
                            placeholder="Örn: iPhone 14 Pro, S23 Ultra"
                          />
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">smartphone</span>
                        </div>
                        {errors.deviceModel && <p className="text-xs text-red-500">{errors.deviceModel.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Satın Alma Tarihi</label>
                        <input
                          type="date"
                          {...register("purchaseDate")}
                          className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white focus:ring-0 focus:border-accent transition-all font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Seri Numarası / IMEI</label>
                        <input
                          type="text"
                          {...register("serialNumber")}
                          className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium"
                          placeholder="Fatura üzerindeki numara"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Incident Details */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold text-primary dark:text-white mb-6">Ne tür bir hasar var?</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {waypla.claimsCopy.claimTypes.map((type) => (
                          <div
                            key={type.value}
                            onClick={() => setValue("claimType", type.value, { shouldValidate: true })}
                            className={`cursor-pointer rounded-xl border-l-4 p-5 transition-all hover:scale-[1.02] ${selectedClaimType === type.value
                                ? 'border-l-accent bg-white dark:bg-[#22303e] ring-2 ring-accent ring-opacity-20 shadow-lg'
                                : 'border-l-transparent bg-gray-50 dark:bg-[#22303e] hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                          >
                            <span className={`font-bold block ${selectedClaimType === type.value ? 'text-accent' : 'text-primary dark:text-white'
                              }`}>
                              {type.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      {errors.claimType && (
                        <p className="mt-3 text-sm text-red-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">error</span>
                          {errors.claimType.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Olay Tarihi *</label>
                        <input
                          type="date"
                          {...register("incidentDate")}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white focus:ring-0 focus:border-accent transition-all font-medium"
                        />
                        {errors.incidentDate && <p className="text-xs text-red-500">{errors.incidentDate.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Olay Saati</label>
                        <input
                          type="time"
                          {...register("incidentTime")}
                          className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white focus:ring-0 focus:border-accent transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Olay Açıklaması *</label>
                      <textarea
                        {...register("description")}
                        rows={5}
                        className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-2 border-transparent text-primary dark:text-white placeholder-gray-400 focus:ring-0 focus:border-accent transition-all font-medium resize-none"
                        placeholder="Hasarın nasıl gerçekleştiğini detaylı bir şekilde anlatınız..."
                      />
                      <div className="flex justify-between text-xs">
                        {errors.description ? (
                          <span className="text-red-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">error</span>
                            {errors.description.message}
                          </span>
                        ) : (
                          <span className="text-gray-400">En az 20 karakter</span>
                        )}
                        <span className={`font-medium ${descriptionLength >= 20 ? 'text-green-500' : 'text-gray-400'}`}>
                          {descriptionLength} karakter
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Photos & Confirmation */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold text-primary dark:text-white mb-2">Hasar Fotoğrafları</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Cihazın hasarlı bölgelerini net gösteren fotoğraflar yükleyin.
                      </p>

                      <PhotoUploader
                        maxFiles={5}
                        maxSizeMB={5}
                        onPhotosChange={setUploadedPhotos}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Confirmation Box */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-blue-900/50 flex items-center justify-center shrink-0 shadow-lg">
                          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">verified_user</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-primary dark:text-white mb-2">Beyan ve Onay</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            Yukarıda verdiğim bilgilerin doğru olduğunu, eksik veya yanıltıcı bilgi vermem durumunda talebimin reddedilebileceğini kabul ediyorum. Waypla hasar onarım sürecinde cihazımdaki verilerin güvenliği için gerekli önlemleri alacağını taahhüt eder.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gray-50 dark:bg-[#22303e] rounded-2xl p-6">
                      <h4 className="font-bold text-primary dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent">summarize</span>
                        Talep Özeti
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Cihaz</span>
                          <p className="font-medium text-primary dark:text-white">
                            {watch("deviceBrand")} {watch("deviceModel")}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Hasar Türü</span>
                          <p className="font-medium text-primary dark:text-white">
                            {waypla.claimsCopy.claimTypes.find(t => t.value === watch("claimType"))?.label || "-"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Olay Tarihi</span>
                          <p className="font-medium text-primary dark:text-white">
                            {watch("incidentDate") || "-"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Fotoğraf</span>
                          <p className="font-medium text-primary dark:text-white">
                            {uploadedPhotos.length} adet
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={isSubmitting}
                      className="h-12 px-6 flex items-center gap-2 font-bold text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                      Geri Dön
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="h-14 px-8 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 hover:scale-105"
                    >
                      Devam Et
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 px-8 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          Hasar Talebini Oluştur
                          <span className="material-symbols-outlined">send</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
