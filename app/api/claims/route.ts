import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// Error response helper
function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({
    success: false,
    error: message
  }, { status });
}

// Upload file to Supabase Storage
async function uploadToSupabase(file: File, claimId: string): Promise<{
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}> {
  const supabase = await createClient();

  // Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  const fileName = `${claimId}/${timestamp}-${randomStr}.${ext}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('claim-photos')
    .upload(fileName, buffer, {
      contentType: file.type,
      cacheControl: '3600',
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Fotoğraf yüklenemedi: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('claim-photos')
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Oturum açmanız gerekiyor", 401);
    }

    // Parse form data
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

    // Validation
    if (!deviceCategory) {
      return errorResponse("Cihaz türü seçiniz");
    }
    if (!deviceBrand || deviceBrand.length < 2) {
      return errorResponse("Geçerli bir cihaz markası giriniz");
    }
    if (!deviceModel || deviceModel.length < 2) {
      return errorResponse("Geçerli bir cihaz modeli giriniz");
    }
    if (!claimType) {
      return errorResponse("Hasar türü seçiniz");
    }
    if (!incidentDate) {
      return errorResponse("Olay tarihi giriniz");
    }
    if (!description || description.length < 20) {
      return errorResponse("Açıklama en az 20 karakter olmalıdır");
    }

    // Parse incident datetime
    let incidentAt: Date;
    try {
      const dateStr = incidentDate + (incidentTime ? `T${incidentTime}` : 'T00:00');
      incidentAt = new Date(dateStr);

      if (isNaN(incidentAt.getTime())) {
        return errorResponse("Geçersiz tarih formatı");
      }

      // Check if incident date is in the future
      if (incidentAt > new Date()) {
        return errorResponse("Olay tarihi gelecekte olamaz");
      }
    } catch {
      return errorResponse("Geçersiz tarih/saat formatı");
    }

    // Create claim
    const claim = await prisma.claim.create({
      data: {
        userId: session.user.id,
        damageType: claimType,
        description,
        notes: JSON.stringify({
          deviceCategory,
          deviceBrand,
          deviceModel,
          purchaseDate: purchaseDate || null,
          serialNumber: serialNumber || null,
          incidentAt: incidentAt.toISOString(),
        }),
      },
    });

    // Handle file uploads
    const uploadedPhotos: Array<{
      url: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
    }> = [];

    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File && value.size > 0) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(value.type)) {
          console.warn(`Skipping invalid file type: ${value.type}`);
          continue;
        }

        // Validate file size (max 5MB)
        if (value.size > 5 * 1024 * 1024) {
          console.warn(`Skipping oversized file: ${value.size} bytes`);
          continue;
        }

        files.push(value);
      }
    }

    // Upload files to Supabase Storage and create ClaimPhoto records
    for (const file of files) {
      try {
        const uploadResult = await uploadToSupabase(file, claim.id);
        uploadedPhotos.push(uploadResult);

        // Create ClaimPhoto record in database
        await prisma.claimPhoto.create({
          data: {
            claimId: claim.id,
            url: uploadResult.url,
            fileName: uploadResult.fileName,
            fileSize: uploadResult.fileSize,
            mimeType: uploadResult.mimeType,
          },
        });
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        // Continue with other files even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      claimId: claim.id,
      message: "Hasar talebiniz başarıyla oluşturuldu",
      photosUploaded: uploadedPhotos.length,
    });

  } catch (error) {
    console.error("Claim creation error:", error);

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('Prisma')) {
        return errorResponse("Veritabanı hatası oluştu. Lütfen tekrar deneyin.", 500);
      }
      if (error.message.includes('Supabase')) {
        return errorResponse("Dosya yükleme hatası. Lütfen tekrar deneyin.", 500);
      }
    }

    return errorResponse("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.", 500);
  }
}

// GET endpoint to fetch user's claims
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Oturum açmanız gerekiyor", 401);
    }

    const claims = await prisma.claim.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        photos: true,
        policy: {
          include: {
            device: true,
            plan: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      claims,
    });

  } catch (error) {
    console.error("Claims fetch error:", error);
    return errorResponse("Hasar talepleri yüklenemedi", 500);
  }
}
