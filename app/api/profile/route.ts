import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const optionalTrimmedString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  },
  z.string()
);

const phoneRegex = /^[+]?[\d\s().-]{7,20}$/;
const postalCodeRegex = /^\d{4,10}$/;

const profileSchema = z
  .object({
    name: optionalTrimmedString.max(120).optional(),
    phone: optionalTrimmedString.regex(phoneRegex, "Invalid phone number").optional(),
    city: optionalTrimmedString.max(100).optional(),
    district: optionalTrimmedString.max(100).optional(),
    neighborhood: optionalTrimmedString.max(100).optional(),
    line1: optionalTrimmedString.max(200).optional(),
    postalCode: optionalTrimmedString
      .regex(postalCodeRegex, "Invalid postal code")
      .optional(),
  })
  .superRefine((data, ctx) => {
    const hasAnyAddress =
      Boolean(data.city) ||
      Boolean(data.district) ||
      Boolean(data.neighborhood) ||
      Boolean(data.line1) ||
      Boolean(data.postalCode);

    if (!hasAnyAddress) {
      return;
    }

    if (!data.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required when providing an address",
        path: ["city"],
      });
    }

    if (!data.district) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "District is required when providing an address",
        path: ["district"],
      });
    }

    if (!data.line1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address line is required when providing an address",
        path: ["line1"],
      });
    }
  });

const formatValidationIssues = (error: z.ZodError) =>
  error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
    return `${path}${issue.message}`;
  });

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

    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid request", issues: ["body: Invalid JSON payload"] },
        { status: 400 }
      );
    }

    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          issues: formatValidationIssues(parsed.error),
        },
        { status: 400 }
      );
    }

    const { name, phone, city, district, neighborhood, line1, postalCode } = parsed.data;

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
