"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    } else if (session?.user.role !== "ADMIN") {
      router.push("/hesabim");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-16 text-center">Yükleniyor...</div>;
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Planlar</CardTitle>
              <CardDescription>Sigorta planlarını yönet</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/planlar">
                <Button variant="outline" size="sm" className="w-full">
                  Yönet
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Servis Ağı</CardTitle>
              <CardDescription>Servis merkezlerini yönet</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/servis-agi">
                <Button variant="outline" size="sm" className="w-full">
                  Yönet
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hasar Talepleri</CardTitle>
              <CardDescription>Hasar taleplerini incele</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/hasarlar">
                <Button variant="outline" size="sm" className="w-full">
                  Görüntüle
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kullanıcılar</CardTitle>
              <CardDescription>Kullanıcı ve partner listesi</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/kullanicilar">
                <Button variant="outline" size="sm" className="w-full">
                  Görüntüle
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hızlı İstatistikler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktif Poliçeler</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bekleyen Hasarlar</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold">0 TL</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


