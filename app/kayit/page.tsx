"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(result.message || result.error || "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.");
          return;
        }
        setError(result.error || result.message || "Kayıt başarısız");
      } else {
        router.push("/giris?registered=true");
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 bg-background-light dark:bg-[#101822]">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white dark:bg-[#1a2634] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-[#111418] dark:text-white mb-2">Kayıt Ol</h1>
              <p className="text-gray-600 dark:text-gray-400">waypla hesabı oluşturun</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  İsim
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Adınız Soyadınız"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  E-posta
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Şifre
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Şifre Tekrar
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#22303e] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-accent hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Zaten hesabınız var mı? </span>
              <Link href="/giris" className="text-accent hover:text-orange-600 font-semibold">
                Giriş yapın
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
