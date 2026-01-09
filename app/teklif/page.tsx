"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { calculatePremium } from "@/lib/pricing/engine";

const deviceSchema = z.object({
  category: z.string().min(1, "Kategori seçin"),
  brand: z.string().min(1, "Marka girin"),
  model: z.string().min(1, "Model girin"),
  purchaseDate: z.string().min(1, "Satın alma tarihi seçin"),
  declaredValue: z.number().min(100, "Cihaz değeri en az 100 TL olmalı"),
});

type DeviceForm = z.infer<typeof deviceSchema>;

type CoverageType = "EXTENDED_WARRANTY" | "ACCIDENTAL_DAMAGE" | "FULL_COVERAGE" | "THEFT_LOSS";
type PaymentMode = "subscription_monthly" | "subscription_yearly" | "one_time_1" | "one_time_2" | "one_time_3";

const coverageTypes = {
  EXTENDED_WARRANTY: "Uzatılmış Garanti",
  ACCIDENTAL_DAMAGE: "Kazaen Hasar",
  FULL_COVERAGE: "Tam Koruma",
  THEFT_LOSS: "Hırsızlık-Kayıp",
};

export default function QuotePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [deviceData, setDeviceData] = useState<DeviceForm | null>(null);
  const [coverageType, setCoverageType] = useState<CoverageType | null>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentMode | null>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeviceForm>({
    resolver: zodResolver(deviceSchema),
  });

  const onDeviceSubmit = (data: DeviceForm) => {
    setDeviceData(data);
    setStep(2);
  };

  const handleCoverageSelect = (type: CoverageType) => {
    setCoverageType(type);
    if (deviceData) {
      const purchaseDate = new Date(deviceData.purchaseDate);
      const ageMonths = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
      
      const result = calculatePremium({
        declaredValue: deviceData.declaredValue,
        deviceCategory: deviceData.category,
        purchaseAgeMonths: ageMonths,
        coverageType: type,
      });
      setPricing(result);
    }
    setStep(3);
  };

  const handlePaymentSelect = (mode: PaymentMode) => {
    setPaymentMode(mode);
    setStep(4);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/hesabim");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-16 bg-background-light dark:bg-[#101822]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-[#111418] dark:text-white mb-2">Teklif Al</h1>
            <p className="text-gray-600 dark:text-gray-400">Cihazınız için uygun planı seçin</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? "bg-accent text-white shadow-lg shadow-accent/30" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      step > s ? "bg-accent" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Device Information */}
          {step === 1 && (
            <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">1. Cihaz Bilgileri</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Cihazınızın bilgilerini girin</p>
              <form onSubmit={handleSubmit(onDeviceSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Kategori</label>
                  <select
                    {...register("category")}
                    className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    defaultValue=""
                  >
                    <option disabled value="">Seçin</option>
                    <option value="Telefon">Telefon</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Akıllı Saat">Akıllı Saat</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Marka</label>
                    <input
                      type="text"
                      {...register("brand")}
                      className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Örn: Apple, Samsung"
                    />
                    {errors.brand && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.brand.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Model</label>
                    <input
                      type="text"
                      {...register("model")}
                      className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Örn: iPhone 15 Pro"
                    />
                    {errors.model && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.model.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Satın Alma Tarihi</label>
                    <input
                      type="date"
                      {...register("purchaseDate")}
                      className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {errors.purchaseDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.purchaseDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">Cihaz Değeri (TL)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("declaredValue", { valueAsNumber: true })}
                      className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Örn: 25000"
                    />
                    {errors.declaredValue && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.declaredValue.message}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-accent hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-accent/30"
                >
                  Devam Et
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Coverage Selection */}
          {step === 2 && (
            <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">2. Kapsam Seçimi</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Size uygun kapsam planını seçin</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(coverageTypes).map(([key, name]) => (
                  <div
                    key={key}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      coverageType === key
                        ? "border-accent bg-accent/5 dark:bg-accent/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-accent/50"
                    }`}
                    onClick={() => handleCoverageSelect(key as CoverageType)}
                  >
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-2">{name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {key === "EXTENDED_WARRANTY" && "Garanti süresini uzatın"}
                      {key === "ACCIDENTAL_DAMAGE" && "Kazaya karşı koruma"}
                      {key === "FULL_COVERAGE" && "Kapsamlı koruma paketi"}
                      {key === "THEFT_LOSS" && "Hırsızlık ve kayıp teminatı"}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors"
              >
                Geri
              </button>
            </div>
          )}

          {/* Step 3: Payment Mode */}
          {step === 3 && pricing && (
            <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">3. Ödeme Modeli</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Ödeme şeklinizi seçin</p>
              
              <div className="p-6 bg-accent/10 dark:bg-accent/20 rounded-xl mb-6 border border-accent/20">
                <h3 className="font-bold text-[#111418] dark:text-white mb-2">Seçilen Plan: {coverageTypes[coverageType!]}</h3>
                  <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                    <p>Yıllık Prim: <strong>{pricing.annualPremium.toFixed(2)} TL</strong></p>
                    <p>Aylık Prim: <strong>{pricing.monthlyPremium.toFixed(2)} TL</strong></p>
                    <p>Muafiyet: <strong>{pricing.deductible.type === "percentage" ? `%${pricing.deductible.value}` : `${pricing.deductible.value} TL`}</strong></p>
                  </div>
              </div>

              <div className="space-y-3 mb-6">
                <div
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMode === "subscription_monthly"
                      ? "border-accent bg-accent/5 dark:bg-accent/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-accent/50"
                  }`}
                  onClick={() => handlePaymentSelect("subscription_monthly")}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#111418] dark:text-white">Abonelik (Aylık)</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{pricing.monthlyPremium.toFixed(2)} TL/ay</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMode === "subscription_yearly"
                      ? "border-accent bg-accent/5 dark:bg-accent/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-accent/50"
                  }`}
                  onClick={() => handlePaymentSelect("subscription_yearly")}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#111418] dark:text-white">Abonelik (Yıllık)</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{pricing.annualPremium.toFixed(2)} TL/yıl</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMode === "one_time_1"
                      ? "border-accent bg-accent/5 dark:bg-accent/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-accent/50"
                  }`}
                  onClick={() => handlePaymentSelect("one_time_1")}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#111418] dark:text-white">Peşin (1 Yıl)</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{pricing.annualPremium.toFixed(2)} TL</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMode === "one_time_2"
                      ? "border-accent bg-accent/5 dark:bg-accent/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-accent/50"
                  }`}
                  onClick={() => handlePaymentSelect("one_time_2")}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#111418] dark:text-white">Peşin (2 Yıl) - İndirimli</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(pricing.annualPremium * 2 * 0.92).toFixed(2)} TL
                      </p>
                    </div>
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">%8 İndirim</span>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMode === "one_time_3"
                      ? "border-accent bg-accent/5 dark:bg-accent/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-accent/50"
                  }`}
                  onClick={() => handlePaymentSelect("one_time_3")}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#111418] dark:text-white">Peşin (3 Yıl) - İndirimli</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(pricing.annualPremium * 3 * 0.88).toFixed(2)} TL
                      </p>
                    </div>
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">%12 İndirim</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors"
              >
                Geri
              </button>
            </div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && pricing && deviceData && (
            <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">4. Özet & Satın Al</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Teklifinizi kontrol edin</p>
              
              <div className="space-y-6 mb-6">
                <div className="p-6 bg-background-light dark:bg-[#22303e] rounded-xl">
                  <h3 className="font-bold text-[#111418] dark:text-white mb-4">Cihaz Bilgileri</h3>
                  <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong>Kategori:</strong> {deviceData.category}</p>
                    <p><strong>Marka/Model:</strong> {deviceData.brand} {deviceData.model}</p>
                    <p><strong>Değer:</strong> {deviceData.declaredValue.toFixed(2)} TL</p>
                  </div>
                </div>

                <div className="p-6 bg-background-light dark:bg-[#22303e] rounded-xl">
                  <h3 className="font-bold text-[#111418] dark:text-white mb-4">Seçilen Plan</h3>
                  <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong>Kapsam:</strong> {coverageTypes[coverageType!]}</p>
                    <p><strong>Ödeme:</strong> {
                      paymentMode === "subscription_monthly" ? "Abonelik (Aylık)" :
                      paymentMode === "subscription_yearly" ? "Abonelik (Yıllık)" :
                      paymentMode?.startsWith("one_time") ? `Peşin (${paymentMode.split("_")[2]} Yıl)` : ""
                    }</p>
                  </div>
                </div>

                <div className="p-6 bg-accent/10 dark:bg-accent/20 rounded-xl border border-accent/20">
                  <h3 className="font-bold text-[#111418] dark:text-white mb-4">Fiyat Detayları</h3>
                  <div className="text-sm space-y-2">
                    {paymentMode === "subscription_monthly" && (
                      <p className="text-2xl font-black text-accent">{pricing.monthlyPremium.toFixed(2)} TL/ay</p>
                    )}
                    {paymentMode === "subscription_yearly" && (
                      <p className="text-2xl font-black text-accent">{pricing.annualPremium.toFixed(2)} TL/yıl</p>
                    )}
                    {paymentMode?.startsWith("one_time") && (
                      <p className="text-2xl font-black text-accent">
                        {paymentMode === "one_time_1" && pricing.annualPremium.toFixed(2)}
                        {paymentMode === "one_time_2" && (pricing.annualPremium * 2 * 0.92).toFixed(2)}
                        {paymentMode === "one_time_3" && (pricing.annualPremium * 3 * 0.88).toFixed(2)}
                        {" "}TL
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">Muafiyet: {pricing.deductible.type === "percentage" ? `%${pricing.deductible.value}` : `${pricing.deductible.value} TL`}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-[#111418] dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-[#22303e] transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-accent hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "İşleniyor..." : "Satın Al (Stub)"}
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                Not: Bu bir demo uygulamasıdır. Gerçek ödeme entegrasyonu yapılmamıştır.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
