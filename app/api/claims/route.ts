import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const claimSchema = z.object({
  policyId: z.string(),
  incidentAt: z.string(),
  description: z.string().min(10),
  incidentType: z.string(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = claimSchema.parse(body);

    const claim = await prisma.claim.create({
      data: {
        policyId: data.policyId,
        userId: session.user.id,
        incidentAt: new Date(data.incidentAt),
        description: data.description,
        status: "CREATED",
        attachments: {
          incidentType: data.incidentType,
        },
      },
    });

    return NextResponse.json({ claim }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

