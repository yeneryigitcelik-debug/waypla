"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.status === 429) {
        setError("Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.");
      } else if (result?.error) {
        console.error("Sign in error:", result.error);
        if (result.error.includes("JSON") || result.error.includes("DOCTYPE")) {
          setError("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
        } else {
          setError("Email veya şifre hatalı");
        }
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Beklenmeyen bir hata oluştu");
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      const errorMessage = err?.message || "Bir hata oluştu. Lütfen tekrar deneyin.";
      if (errorMessage.includes("JSON") || errorMessage.includes("DOCTYPE")) {
        setError("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
      } else {
        setError(errorMessage);
      }
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
              <h1 className="text-3xl font-black text-[#111418] dark:text-white mb-2">Giriş Yap</h1>
              <p className="text-gray-600 dark:text-gray-400">waypla hesabınıza giriş yapın</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              
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

              <button
                type="submit"
                className="w-full h-12 bg-accent hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Hesabınız yok mu? </span>
              <Link href="/kayit" className="text-accent hover:text-orange-600 font-semibold">
                Kayıt olun
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
