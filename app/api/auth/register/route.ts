import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = registerSchema.parse(body);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

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
        email,
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

    const errorName = error instanceof Error ? error.name : "UnknownError";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("[REGISTER] Error", { errorName, errorStack });

    // Better error messaging
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
    
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
