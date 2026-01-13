"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            {brand.name}
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/planlar" className="text-sm hover:text-blue-600">
              Planlar
            </Link>
            <Link href="/nasil-calisir" className="text-sm hover:text-blue-600">
              Nasıl Çalışır?
            </Link>
            <Link href="/blog" className="text-sm hover:text-blue-600">
              Blog
            </Link>
            
            {status === "loading" ? (
              <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
            ) : session ? (
              <>
                <Link href="/hesabim">
                  <Button variant="ghost" size="sm">
                    Hesabım
                  </Button>
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                {session.user.role === "PARTNER" && (
                  <Link href="/partner">
                    <Button variant="ghost" size="sm">
                      Partner
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Çıkış
                </Button>
              </>
            ) : (
              <>
                <Link href="/giris">
                  <Button variant="ghost" size="sm">
                    Giriş
                  </Button>
                </Link>
                <Link href="/kayit">
                  <Button size="sm">
                    Kayıt Ol
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}




