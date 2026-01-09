"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { brand } from "@/lib/brand";

const contactSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi girin"),
  subject: z.string().min(3, "Konu en az 3 karakter olmalı"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    // In a real app, this would send an email or save to database
    setTimeout(() => {
      setSuccess(true);
      reset();
      setIsSubmitting(false);
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">İletişim</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Sorularınız için bizimle iletişime geçin
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-1">Email</p>
                <p className="text-gray-600">{brand.email}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Telefon</p>
                <p className="text-gray-600">{brand.phone}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Adres</p>
                <p className="text-gray-600">{brand.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>İletişim Formu</CardTitle>
              <CardDescription>Mesajınızı gönderin</CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm mb-4">
                  Mesajınız gönderildi!
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">İsim</label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Konu</label>
                  <input
                    type="text"
                    {...register("subject")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mesaj</label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                </Button>
              </form>

              <p className="mt-4 text-xs text-gray-500">
                <a href="/hukuk/kvkk" className="text-blue-600 hover:underline">
                  KVKK Aydınlatma Metni
                </a>{" "}
                okudum, kabul ediyorum.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


