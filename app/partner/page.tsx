"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartnerPortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiKey, setApiKey] = useState("cg_live_xxxxxxxxxxxxxxxxxxxx");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    } else if (session?.user.role !== "PARTNER" && session?.user.role !== "ADMIN") {
      router.push("/hesabim");
    }
  }, [status, session, router]);

  const copyEmbedCode = () => {
    const embedCode = `<script src="https://cihazguvence.com/widget.js" data-api-key="${apiKey}"></script>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-16 text-center">Yükleniyor...</div>;
  }

  if (!session || (session.user.role !== "PARTNER" && session.user.role !== "ADMIN")) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Partner Portal</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Satış Widget'ı</CardTitle>
              <CardDescription>Web sitenize ekleyebileceğiniz widget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Embed Kodu</label>
                  <textarea
                    readOnly
                    value={`<script src="https://cihazguvence.com/widget.js" data-api-key="${apiKey}"></script>`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                    rows={3}
                  />
                </div>
                <Button onClick={copyEmbedCode} className="w-full">
                  {copied ? "Kopyalandı!" : "Kodu Kopyala"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Anahtarı</CardTitle>
              <CardDescription>API entegrasyonu için anahtarınız</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  API anahtarınızı güvenli tutun ve asla paylaşmayın.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Webhook Ayarları</CardTitle>
            <CardDescription>Satış bildirimleri için webhook URL'i</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Webhook URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/webhook"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <Button variant="outline">Kaydet</Button>
              <p className="text-xs text-gray-500">
                Webhook özelliği yakında aktif olacaktır.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Satış Raporu</CardTitle>
            <CardDescription>Son 30 günlük satış istatistikleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Toplam Satış</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Toplam Komisyon</p>
                  <p className="text-2xl font-bold">0 TL</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Aktif Poliçeler</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">Grafik görünümü yakında eklenecektir.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Link href="/partner/api-dokumantasyon">
            <Button variant="outline">API Dokümantasyonu</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

