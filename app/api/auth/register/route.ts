import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  checkRateLimit,
  createRateLimitResponse,
  getClientIp,
} from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();
    const { name, email, password } = registerSchema.parse(body);
    
    console.log("[REGISTER] İstek alındı:", { email, name });

    const normalizedEmail = email.trim().toLowerCase();
    const [ipLimit, emailLimit] = await Promise.all([
      checkRateLimit({
        key: `auth:register:ip:${ip}`,
        limit: 10,
        windowMs: 15 * 60 * 1000,
      }),
      checkRateLimit({
        key: `auth:register:email:${normalizedEmail}`,
        limit: 5,
        windowMs: 60 * 60 * 1000,
      }),
    ]);

    if (!ipLimit.allowed || !emailLimit.allowed) {
      const limitResult = ipLimit.allowed ? emailLimit : ipLimit;
      return createRateLimitResponse(limitResult);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    console.log("[REGISTER] Kullanıcı kontrolü tamamlandı:", !!existingUser);

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "CUSTOMER",
        profile: {
          create: {
            name,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    
    console.log("[REGISTER] Kullanıcı başarıyla oluşturuldu:", user.id);

    return NextResponse.json(
      { message: "Kayıt başarılı", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      const errorMessage = firstError.message || "Geçersiz veri";
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    console.error("Register error:", error);
    
    // Better error messaging
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.error("[REGISTER] Hata detayları:", { errorMessage, errorType: error?.constructor?.name });
    
    // Check for specific database errors
    if (errorMessage.includes("Authentication failed") || errorMessage.includes("FATAL")) {
      return NextResponse.json(
        { error: "Veritabanı bağlantısı sorusu. Lütfen biraz sonra tekrar deneyin. (DB_CONNECTION_ERROR)" },
        { status: 503 }
      );
    }
    
    if (errorMessage.includes("Unique constraint failed")) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
