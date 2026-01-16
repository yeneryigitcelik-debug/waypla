"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const claimSchema = z.object({
  policyId: z.string().min(1, "Poliçe seçin"),
  incidentAt: z.string().min(1, "Olay tarihi seçin"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı"),
  incidentType: z.string().min(1, "Olay türü seçin"),
});

type ClaimForm = z.infer<typeof claimSchema>;

// Step configuration with time estimates
const steps = [
  { id: 1, title: "Poliçe Seçimi", duration: "~1 dk", icon: "description" },
  { id: 2, title: "Olay Detayları", duration: "~1 dk", icon: "event" },
  { id: 3, title: "Belgeler", duration: "~1 dk", icon: "upload_file" },
  { id: 4, title: "Onay", duration: "~30 sn", icon: "check_circle" },
];

export default function ReportClaimPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [savedDraft, setSavedDraft] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ClaimForm>({
    resolver: zodResolver(claimSchema),
  });

  // Watch form changes for auto-save
  const formValues = watch();

  // Auto-save draft
  const saveDraft = useCallback(() => {
    if (formValues.policyId || formValues.description || formValues.incidentAt) {
      localStorage.setItem("claimDraft", JSON.stringify(formValues));
      setSavedDraft(true);
      setTimeout(() => setSavedDraft(false), 2000);
    }
  }, [formValues]);

  useEffect(() => {
    const timer = setTimeout(saveDraft, 3000);
    return () => clearTimeout(timer);
  }, [formValues, saveDraft]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    }
  }, [status, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = async (data: ClaimForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        localStorage.removeItem("claimDraft");
        setSuccess(true);
        setTimeout(() => {
          router.push("/hesabim/hasarlar");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#111418] px-4">
        <div className="max-w-md w-full bg-white dark:bg-[#1a2634] rounded-2xl p-8 text-center shadow-xl border border-gray-100 dark:border-gray-800 animate-scale-in">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-3">Hasar Talebi Oluşturuldu</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Talebiniz başarıyla alındı. En kısa sürede incelenecek ve size bilgi verilecektir.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-left mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">info</span>
              Ortalama inceleme süresi: <strong>24 saat</strong>
            </p>
          </div>
          <Link href="/hesabim/hasarlar">
            <Button className="w-full">Hasar Takibine Git</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111418]">
      {/* Header */}
      <header className="bg-gradient-to-r from-accent to-orange-600 text-white py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 transition-colors text-sm">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Ana Sayfa</span>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">Hasar Bildir</h1>
          <p className="text-white/80">Ortalama tamamlama süresi: 3 dakika</p>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-[#1a2634] border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 shrink-0 ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${currentStep === step.id
                    ? 'bg-accent/10 text-accent'
                    : currentStep > step.id
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === step.id
                      ? 'bg-accent text-white'
                      : currentStep > step.id
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}>
                    {currentStep > step.id ? (
                      <span className="material-symbols-outlined text-sm">check</span>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-sm font-medium ${currentStep === step.id ? 'text-accent' : ''}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.duration}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-save notification */}
      {savedDraft && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-up z-50">
          <span className="material-symbols-outlined text-lg">save</span>
          <span className="text-sm font-medium">Taslak kaydedildi</span>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Policy Selection */}
          <div className={`bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm ${currentStep === 1 ? '' : 'opacity-60'}`}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentStep >= 1 ? 'bg-accent/10 text-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary dark:text-white">Poliçe Seçimi</h3>
                  <p className="text-xs text-gray-500">Hasar bildirimini hangi poliçe için yapacaksınız?</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">~1 dk</span>
            </div>
            <div className="p-6">
              <label htmlFor="policyId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Poliçe
              </label>
              <select
                id="policyId"
                {...register("policyId")}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border border-gray-200 dark:border-gray-700 text-primary dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                onChange={() => setCurrentStep(Math.max(currentStep, 2))}
              >
                <option value="">Poliçe seçin</option>
                <option value="demo">Demo Poliçe - iPhone 15 Pro</option>
              </select>
              {errors.policyId && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.policyId.message}
                </p>
              )}
            </div>
          </div>

          {/* Step 2: Incident Details */}
          <div className={`bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm ${currentStep >= 2 ? '' : 'opacity-40 pointer-events-none'}`}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentStep >= 2 ? 'bg-accent/10 text-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <span className="material-symbols-outlined">event</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary dark:text-white">Olay Detayları</h3>
                  <p className="text-xs text-gray-500">Hasarın ne zaman ve nasıl oluştuğunu belirtin</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">~1 dk</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="incidentAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Olay Tarihi ve Saati
                  </label>
                  <input
                    id="incidentAt"
                    type="datetime-local"
                    {...register("incidentAt")}
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border border-gray-200 dark:border-gray-700 text-primary dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                    onChange={() => setCurrentStep(Math.max(currentStep, 2))}
                  />
                  {errors.incidentAt && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.incidentAt.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Olay Türü
                  </label>
                  <select
                    id="incidentType"
                    {...register("incidentType")}
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-[#22303e] border border-gray-200 dark:border-gray-700 text-primary dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                    onChange={() => setCurrentStep(Math.max(currentStep, 3))}
                  >
                    <option value="">Seçin</option>
                    <option value="screen_damage">Ekran Kırığı</option>
                    <option value="water_damage">Su Hasarı</option>
                    <option value="mechanical_failure">Mekanik Arıza</option>
                    <option value="theft">Hırsızlık</option>
                    <option value="loss">Kayıp</option>
                    <option value="other">Diğer</option>
                  </select>
                  {errors.incidentType && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {errors.incidentType.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Olay Açıklaması
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#22303e] border border-gray-200 dark:border-gray-700 text-primary dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                  placeholder="Olayı detaylı bir şekilde açıklayın..."
                  onChange={() => setCurrentStep(Math.max(currentStep, 3))}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Documents */}
          <div className={`bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm ${currentStep >= 3 ? '' : 'opacity-40 pointer-events-none'}`}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentStep >= 3 ? 'bg-accent/10 text-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <span className="material-symbols-outlined">upload_file</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary dark:text-white">Belgeler</h3>
                  <p className="text-xs text-gray-500">Hasar kanıtı olarak fotoğraf veya video ekleyin</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">~1 dk</span>
            </div>
            <div className="p-6 space-y-4">
              {/* Required documents info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">info</span>
                  Gerekli Belgeler
                </p>
                <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1 ml-6">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">check</span>
                    Hasarlı cihazın fotoğrafı (hasarın görüldüğü)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">check</span>
                    Cihaz IMEI/Seri numarasının fotoğrafı
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">check</span>
                    Fatura veya satın alma belgesi (varsa)
                  </li>
                </ul>
              </div>

              {/* File upload */}
              <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                </div>
                <p className="text-base font-medium text-[#111418] dark:text-white">Dosyaları buraya sürükleyin</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">veya seçmek için tıklayın</p>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, MP4 (maks. 10MB)</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    handleFileChange(e);
                    setCurrentStep(4);
                  }}
                />
              </div>

              {/* Uploaded files preview */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{uploadedFiles.length} dosya seçildi:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 dark:bg-[#22303e] rounded-lg p-3">
                      <span className="material-symbols-outlined text-accent">image</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Submit */}
          <div className={`bg-white dark:bg-[#1a2634] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm ${currentStep >= 4 ? '' : 'opacity-40 pointer-events-none'}`}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentStep >= 4 ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary dark:text-white">Onay ve Gönderim</h3>
                  <p className="text-xs text-gray-500">Bilgilerinizi kontrol edip gönderin</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">~30 sn</span>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                  <span className="material-symbols-outlined text-lg shrink-0">warning</span>
                  <span>Lütfen girdiğiniz bilgilerin doğruluğundan emin olun. Yanlış veya eksik bilgi talebinizin reddedilmesine neden olabilir.</span>
                </p>
              </div>
              <Button type="submit" className="w-full h-14 text-base" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Gönderiliyor...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined">send</span>
                    Hasar Talebini Gönder
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
