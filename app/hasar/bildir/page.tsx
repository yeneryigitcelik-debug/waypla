"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const claimSchema = z.object({
  policyId: z.string().min(1, "Poliçe seçin"),
  incidentAt: z.string().min(1, "Olay tarihi seçin"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalı"),
  incidentType: z.string().min(1, "Olay türü seçin"),
});

type ClaimForm = z.infer<typeof claimSchema>;

export default function ReportClaimPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimForm>({
    resolver: zodResolver(claimSchema),
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    }
  }, [status, router]);

  const onSubmit = async (data: ClaimForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/hesabim");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-16 text-center">Yükleniyor...</div>;
  }

  if (!session) {
    return null;
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Hasar Talebi Oluşturuldu</h2>
            <p className="text-gray-600">Talebiniz incelenecek ve size bilgi verilecektir.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hasar Bildir</h1>

        <Card>
          <CardHeader>
            <CardTitle>Hasar Bilgileri</CardTitle>
            <CardDescription>Hasar talebinizi oluşturun</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Poliçe</label>
                <select
                  {...register("policyId")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Poliçe seçin</option>
                  {/* In real app, fetch user's policies */}
                  <option value="demo">Demo Poliçe</option>
                </select>
                {errors.policyId && (
                  <p className="mt-1 text-sm text-red-600">{errors.policyId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Olay Tarihi</label>
                <input
                  type="datetime-local"
                  {...register("incidentAt")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.incidentAt && (
                  <p className="mt-1 text-sm text-red-600">{errors.incidentAt.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Olay Türü</label>
                <select
                  {...register("incidentType")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  <p className="mt-1 text-sm text-red-600">{errors.incidentType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea
                  {...register("description")}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Olayı detaylı bir şekilde açıklayın..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fotoğraf/Video (Opsiyonel)</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-[#1a2634] transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                  </div>
                  <p className="text-sm font-medium text-[#111418] dark:text-white">Dosyaları buraya sürükleyin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">veya seçmek için tıklayın</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        alert(`${e.target.files.length} dosya seçildi (Demo)`);
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hasarlı cihazın fotoğraf ve videolarını ekleyin.</p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Gönderiliyor..." : "Hasar Talebi Oluştur"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




