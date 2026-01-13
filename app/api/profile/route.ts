import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get profile with address
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        address: true,
      },
    });

    return NextResponse.json({
      profile: profile || null,
      address: profile?.address || null,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, city, district, neighborhood, line1, postalCode } = body;

    // Upsert profile
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        name: name || null,
        phone: phone || null,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        name: name || null,
        phone: phone || null,
      },
    });

    // Upsert address if address data is provided
    if (city && district && line1) {
      await prisma.address.upsert({
        where: { profileId: profile.id },
        update: {
          city,
          district,
          neighborhood: neighborhood || null,
          line1,
          postalCode: postalCode || null,
          updatedAt: new Date(),
        },
        create: {
          profileId: profile.id,
          city,
          district,
          neighborhood: neighborhood || null,
          line1,
          postalCode: postalCode || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}