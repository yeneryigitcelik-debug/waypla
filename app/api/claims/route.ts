import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    // Extract form fields
    const deviceCategory = formData.get('deviceCategory') as string;
    const deviceBrand = formData.get('deviceBrand') as string;
    const deviceModel = formData.get('deviceModel') as string;
    const purchaseDate = formData.get('purchaseDate') as string;
    const serialNumber = formData.get('serialNumber') as string;
    const claimType = formData.get('claimType') as string;
    const incidentDate = formData.get('incidentDate') as string;
    const incidentTime = formData.get('incidentTime') as string;
    const description = formData.get('description') as string;

    // Validate required fields
    if (!deviceCategory || !deviceBrand || !deviceModel || !claimType || !incidentDate || !description) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Create device snapshot
    const deviceSnapshot = {
      category: deviceCategory,
      brand: deviceBrand,
      model: deviceModel,
      purchaseDate: purchaseDate || null,
      serialNumber: serialNumber || null,
    };

    // Parse incident datetime
    let incidentAt: Date;
    try {
      const dateStr = incidentDate + (incidentTime ? `T${incidentTime}` : 'T00:00');
      incidentAt = new Date(dateStr);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid incident date/time format" },
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

