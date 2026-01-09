"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-16 text-center">Yükleniyor...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hesabım</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cihazlarım</CardTitle>
              <CardDescription>Kayıtlı cihazlarınız</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">0</p>
              <Link href="/hesabim/cihazlar">
                <Button variant="outline" size="sm">Görüntüle</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Poliçelerim</CardTitle>
              <CardDescription>Aktif poliçeleriniz</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">0</p>
              <Link href="/hesabim/policeler">
                <Button variant="outline" size="sm">Görüntüle</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hasar Taleplerim</CardTitle>
              <CardDescription>Hasar geçmişiniz</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">0</p>
              <Link href="/hesabim/hasarlar">
                <Button variant="outline" size="sm">Görüntüle</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/teklif">
                <Button className="w-full" variant="outline">
                  Yeni Teklif Al
                </Button>
              </Link>
              <Link href="/hasar/bildir">
                <Button className="w-full" variant="outline">
                  Hasar Bildir
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hesap Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>İsim:</strong> {session.user.name || "Belirtilmemiş"}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Rol:</strong> {session.user.role}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


