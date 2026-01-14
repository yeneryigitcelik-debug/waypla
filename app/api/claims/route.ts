import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

const normalizeString = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const parseLocalDateTime = (dateString: string, timeString?: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = (timeString ?? "00:00").split(":").map(Number);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }

  const parsed = new Date(year, month - 1, day, hours, minutes);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hours ||
    parsed.getMinutes() !== minutes
  ) {
    return null;
  }

  return parsed;
};

const claimSchema = z
  .object({
    deviceCategory: z.string().min(1),
    deviceBrand: z.string().min(1),
    deviceModel: z.string().min(1),
    purchaseDate: z.string().regex(dateRegex).optional(),
    serialNumber: z.string().min(1).optional(),
    claimType: z.string().min(1),
    incidentDate: z.string().regex(dateRegex),
    incidentTime: z.string().regex(timeRegex).optional(),
    description: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    const incidentAt = parseLocalDateTime(data.incidentDate, data.incidentTime);

    if (!incidentAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid incident date/time",
        path: ["incidentDate"],
      });
      return;
    }

    if (incidentAt.getTime() > Date.now()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Incident date cannot be in the future",
        path: ["incidentDate"],
      });
    }

    if (data.purchaseDate) {
      const purchaseAt = parseLocalDateTime(data.purchaseDate);
      if (!purchaseAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid purchase date",
          path: ["purchaseDate"],
        });
      }
    }
  });

const formatValidationIssues = (error: z.ZodError) =>
  error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
    return `${path}${issue.message}`;
  });

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const parsed = claimSchema.safeParse({
      deviceCategory: normalizeString(formData.get("deviceCategory")),
      deviceBrand: normalizeString(formData.get("deviceBrand")),
      deviceModel: normalizeString(formData.get("deviceModel")),
      purchaseDate: normalizeString(formData.get("purchaseDate")),
      serialNumber: normalizeString(formData.get("serialNumber")),
      claimType: normalizeString(formData.get("claimType")),
      incidentDate: normalizeString(formData.get("incidentDate")),
      incidentTime: normalizeString(formData.get("incidentTime")),
      description: normalizeString(formData.get("description")),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          issues: formatValidationIssues(parsed.error),
        },
        { status: 400 }
      );
    }

    const {
      deviceCategory,
      deviceBrand,
      deviceModel,
      purchaseDate,
      serialNumber,
      claimType,
      incidentDate,
      incidentTime,
      description,
    } = parsed.data;

    // Create device snapshot
    const deviceSnapshot = {
      category: deviceCategory,
      brand: deviceBrand,
      model: deviceModel,
      purchaseDate: purchaseDate || null,
      serialNumber: serialNumber || null,
    };

    // Parse incident datetime
    const incidentAt = parseLocalDateTime(incidentDate, incidentTime);

    if (!incidentAt) {
      return NextResponse.json(
        { error: "Invalid request", issues: ["incidentDate: Invalid incident date/time"] },
        { status: 400 }
      );
    }

    // Create claim
    const claim = await prisma.claim.create({
      data: {
        userId: session.user.id,
        deviceSnapshot,
        claimType,
        incidentAt,
        description,
        // status defaults to CREATED in schema
      },
    });

    // Handle file uploads (placeholder - would need Supabase Storage setup)
    const files = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        files.push(value);
      }
    }

    // TODO: Upload files to Supabase Storage and create claim_attachments records
    // For now, just log the files
    if (files.length > 0) {
      console.log(`Claim ${claim.id}: ${files.length} files uploaded (not stored yet)`);
    }

    return NextResponse.json({
      success: true,
      claimId: claim.id,
      message: "Claim created successfully",
    });
  } catch (error) {
    console.error("Claim creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
