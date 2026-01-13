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
import { waypla } from "@/content/waypla";

const claimSchema = z.object({
  deviceCategory: z.string().min(1, "Cihaz türü seçin"),
  deviceBrand: z.string().min(1, "Marka girin"),
  deviceModel: z.string().min(1, "Model girin"),
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    }
  }, [status, router]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setMessage({ type: 'error', text: 'Sadece JPEG, PNG, WebP formatında ve 5MB\'dan küçük dosyalar kabul edilir.' });
    }

    setUploadedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['deviceCategory', 'deviceBrand', 'deviceModel']);
    } else if (currentStep === 2) {
      isValid = await trigger(['claimType', 'incidentDate', 'description']);
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
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
      uploadedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });

      const response = await fetch('/api/claims', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ type: 'success', text: `Hasar talebiniz başarıyla oluşturuldu. Talep No: ${result.claimId}` });
        setTimeout(() => {
          router.push('/hesabim');
        }, 3000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Bir hata oluştu.' });
      }
    } catch (error) {
      console.error('Claim submission error:', error);
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
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

  const steps = [
    { number: 1, title: "Cihaz Bilgisi", icon: "devices" },
    { number: 2, title: "Hasar Detayı", icon: "report_problem" },
    { number: 3, title: "Onay & Gönder", icon: "cloud_upload" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#101822]">
      <Header />

      <main className="flex-grow pb-24">
        {/* Header Section */}
        <section className="bg-primary dark:bg-[#0f172a] text-white py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 backdrop-blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <Link href="/hesabim" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Hesabım</span>
              </Link>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">Hasar Bildirimi</h1>
              <p className="text-lg text-white/70 max-w-2xl">
                Cihazınızda oluşan hasarı hızlıca bildirin, uzman ekibimiz en kısa sürede değerlendirip size dönüş yapsın.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Stepper Grid */}
            <div className="grid grid-cols-3 border-b border-gray-100 dark:border-gray-800">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-3 py-6 px-4 transition-colors ${currentStep === step.number
                      ? 'bg-blue-50/50 dark:bg-blue-900/10 text-primary dark:text-white'
                      : currentStep > step.number
                        ? 'text-accent'
                        : 'text-gray-400'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${currentStep === step.number
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : currentStep > step.number
                        ? 'bg-accent text-white shadow-lg shadow-accent/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>
                    {currentStep > step.number ? (
                      <span className="material-symbols-outlined text-xl">check</span>
                    ) : step.number}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-sm sm:text-base whitespace-nowrap">{step.title}</p>
                    <p className="text-xs opacity-60 hidden sm:block">Adım {step.number}/3</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 lg:p-12">
              {message && (
                <div className={`p-4 rounded-xl mb-8 flex items-start gap-3 ${message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800'
                  }`}>
                  <span className="material-symbols-outlined text-xl mt-0.5">
                    {message.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <p>{message.text}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-12">
                {/* Step 1: Device Information */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h3 className="text-2xl font-bold text-primary dark:text-white mb-6">Hangi cihazınız hasar gördü?</h3>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {waypla.deviceCategories.map((cat) => (
                          <div
                            key={cat.value}
                            onClick={() => setValue("deviceCategory", cat.value, { shouldValidate: true })}
                            className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${selectedDeviceCategory === cat.value
                                ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                                : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#22303e] hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedDeviceCategory === cat.value
                                ? 'bg-accent text-white'
                                : 'bg-white dark:bg-[#1a2634] text-gray-400'
                              }`}>
                              <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                            </div>
                            <span className={`font-bold text-sm ${selectedDeviceCategory === cat.value ? 'text-accent' : 'text-gray-600 dark:text-gray-400'
                              }`}>{cat.label}</span>
                          </div>
                        ))}
                      </div>
                      {errors.deviceCategory && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">error</span>
                          {errors.deviceCategory.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Cihaz Markası</label>
                        <div className="relative">
                          <input
                            type="text"
                            {...register("deviceBrand")}
                            className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-0 text-primary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent transition-shadow font-medium"
                            placeholder="Örn: Apple, Samsung"
                          />
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">verified</span>
                        </div>
                        {errors.deviceBrand && <p className="text-xs text-red-500">{errors.deviceBrand.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Cihaz Modeli</label>
                        <div className="relative">
                          <input
                            type="text"
                            {...register("deviceModel")}
                            className="w-full h-14 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-0 text-primary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent transition-shadow font-medium"
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
                          className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-0 text-primary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent transition-shadow font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Seri Numarası / IMEI</label>
                        <input
                          type="text"
                          {...register("serialNumber")}
                          className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-0 text-primary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent transition-shadow font-medium"
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
                      <h3 className="text-2xl font-bold text-primary dark:text-white mb-6">Ne tür bir hasar var?</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {waypla.claimsCopy.claimTypes.map((type) => (
                          <div
                            key={type.value}
                            onClick={() => setValue("claimType", type.value, { shouldValidate: true })}
                            className={`cursor-pointer rounded-xl border-l-4 p-5 transition-all shadow-sm ${selectedClaimType === type.value
                                ? 'border-l-accent bg-white dark:bg-[#22303e] ring-2 ring-accent ring-opacity-20 shadow-lg'
                                : 'border-l-transparent bg-gray-50 dark:bg-[#22303e] hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                          >
                            <span className={`font-bold block mb-1 ${selectedClaimType === type.value ? 'text-accent' : 'text-primary dark:text-white'
                              }`}>{type.label}</span>
                          </div>
                        ))}
                      </div>
                      {errors.claimType && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">error</span>
                          {errors.claimType.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Olay Tarihi</label>
                        <input
                          type="date"
                          {...register("incidentDate")}
                          className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-0 text-primary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent transition-shadow font-medium"
                        />
                        {errors.incidentDate && <p className="text-xs text-red-500">{errors.incidentDate.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Olay Saati</label>
                        <input
                          type="time"
                          {...register("incidentTime")}
                          className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-0 text-primary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent transition-shadow font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Olay Açıklaması</label>
                      <textarea
                        {...register("description")}
                        rows={6}
                        className="w-full p-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border-0 text-primary dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent transition-shadow font-medium resize-none"
                        placeholder="Hasarın nasıl gerçekleştiğini detaylı bir şekilde anlatınız..."
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        {errors.description ? (
                          <span className="text-red-500">{errors.description.message}</span>
                        ) : (
                          <span>En az 20 karakter</span>
                        )}
                        <span>{watch("description")?.length || 0} karakter</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Photos & Confirmation */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">Hasar Fotoğrafları</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">Cihazın hasarlı bölgelerini net gösteren fotoğraflar yükleyin.</p>

                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-10 text-center hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors cursor-pointer group relative">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="mb-4 w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">cloud_upload</span>
                        </div>
                        <h4 className="font-bold text-lg text-primary dark:text-white mb-2">Fotoğrafları buraya sürükleyin</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">veya dosya seçmek için tıklayın</p>
                        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500">
                          <span className="material-symbols-outlined text-sm">info</span>
                          Max 5MB • JPG, PNG
                        </div>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="relative group rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                              <div className="aspect-square flex items-center justify-center bg-gray-50">
                                <span className="material-symbols-outlined text-3xl text-gray-400">image</span>
                              </div>
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-red-500 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                                >
                                  <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-xs truncate">{file.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">verified_user</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-primary dark:text-white mb-1">Beyan ve Onay</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            Yukarıda verdiğim bilgilerin doğru olduğunu, eksik veya yanıltıcı bilgi vermem durumunda talebimin reddedilebileceğini kabul ediyorum. Waypla hasar onarım sürecinde cihazımdaki verilerin güvenliği için gerekli önlemleri alacağını taahhüt eder.
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
                      className="h-12 px-8 flex items-center gap-2 font-bold text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors"
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
                      className="h-14 px-10 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
                    >
                      Devam Et
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 px-10 bg-accent text-white font-bold rounded-xl hover:bg-orange-600 hover:shadow-lg hover:shadow-accent/20 transition-all flex items-center gap-2"
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
