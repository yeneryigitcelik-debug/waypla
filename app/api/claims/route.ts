import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash, createHmac } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  createRateLimitResponse,
  getClientIp,
} from "@/lib/rate-limit";

const DEFAULT_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const DEFAULT_ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
const DEFAULT_MAX_FILE_SIZE_MB = 10;
const EICAR_SIGNATURE = "EICAR-STANDARD-ANTIVIRUS-TEST-FILE";

type UploadProvider = "supabase" | "s3";

const errorResponse = (
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
) =>
  NextResponse.json(
    { success: false, error: { code, message, details } },
    { status }
  );

const sanitizeFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

const getAllowedMimeTypes = () =>
  process.env.CLAIM_UPLOAD_ALLOWED_MIME_TYPES?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? DEFAULT_ALLOWED_MIME_TYPES;

const getAllowedExtensions = () =>
  process.env.CLAIM_UPLOAD_ALLOWED_EXTENSIONS?.split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean) ?? DEFAULT_ALLOWED_EXTENSIONS;

const getMaxFileSizeBytes = () => {
  const maxSizeEnv = process.env.CLAIM_UPLOAD_MAX_SIZE_MB;
  const maxSizeMb = maxSizeEnv ? Number(maxSizeEnv) : DEFAULT_MAX_FILE_SIZE_MB;
  return maxSizeMb * 1024 * 1024;
};

const containsEicarSignature = (buffer: Buffer) =>
  buffer.toString("utf8").includes(EICAR_SIGNATURE);

const detectUploadProvider = (): UploadProvider | null => {
  const explicit = process.env.CLAIM_UPLOAD_PROVIDER?.toLowerCase();
  if (explicit === "supabase" || explicit === "s3") {
    return explicit;
  }
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return "supabase";
  }
  if (process.env.S3_BUCKET && process.env.AWS_REGION) {
    return "s3";
  }
  return null;
};

const scanFile = async (buffer: Buffer) => {
  if (containsEicarSignature(buffer)) {
    return { clean: false, reason: "EICAR_SIGNATURE_DETECTED" };
  }
  if (!process.env.VIRUS_SCAN_API_URL) {
    return { clean: true };
  }
  try {
    const response = await fetch(process.env.VIRUS_SCAN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        ...(process.env.VIRUS_SCAN_API_KEY
          ? { Authorization: `Bearer ${process.env.VIRUS_SCAN_API_KEY}` }
          : {}),
      },
      body: buffer,
    });
    if (!response.ok) {
      return { clean: false, reason: "VIRUS_SCAN_SERVICE_ERROR" };
    }
    const payload = (await response.json()) as { clean?: boolean };
    if (payload.clean === false) {
      return { clean: false, reason: "VIRUS_DETECTED" };
    }
    return { clean: true };
  } catch (error) {
    console.error("Virus scan failed:", error);
    return { clean: false, reason: "VIRUS_SCAN_FAILED" };
  }
};

const uploadToSupabase = async (
  buffer: Buffer,
  fileName: string,
  contentType: string
) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!supabaseUrl || !supabaseKey || !bucket) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }
  const client = createClient(supabaseUrl, supabaseKey);
  const { error } = await client.storage
    .from(bucket)
    .upload(fileName, buffer, { contentType, upsert: false });
  if (error) {
    throw new Error(`SUPABASE_UPLOAD_FAILED:${error.message}`);
  }
  const { data } = client.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
};

const uploadToS3 = async (
  buffer: Buffer,
  fileName: string,
  contentType: string
) => {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    throw new Error("S3_CONFIG_MISSING");
  }

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const encodedKey = encodeURIComponent(fileName).replace(/%2F/g, "/");
  const host =
    process.env.S3_ENDPOINT_HOST ??
    `${bucket}.s3.${region}.amazonaws.com`;
  const url = `https://${host}/${encodedKey}`;

  const payloadHash = createHash("sha256").update(buffer).digest("hex");
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [
    "PUT",
    `/${encodedKey}`,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");

  const kDate = createHmac("sha256", `AWS4${secretAccessKey}`)
    .update(dateStamp)
    .digest();
  const kRegion = createHmac("sha256", kDate).update(region).digest();
  const kService = createHmac("sha256", kRegion).update("s3").digest();
  const kSigning = createHmac("sha256", kService)
    .update("aws4_request")
    .digest();
  const signature = createHmac("sha256", kSigning)
    .update(stringToSign)
    .digest("hex");

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: authorization,
      "Content-Type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    },
    body: buffer,
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`S3_UPLOAD_FAILED:${response.status}:${responseText}`);
  }

  const publicBaseUrl =
    process.env.S3_PUBLIC_BASE_URL ?? `https://${host}`;
  return `${publicBaseUrl}/${encodedKey}`;
};

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse(401, "UNAUTHORIZED", "Unauthorized");
    }

    const [ipLimit, userLimit] = await Promise.all([
      checkRateLimit({
        key: `claims:create:ip:${ip}`,
        limit: 15,
        windowMs: 60 * 60 * 1000,
      }),
      checkRateLimit({
        key: `claims:create:user:${session.user.id}`,
        limit: 5,
        windowMs: 60 * 60 * 1000,
      }),
    ]);

    if (!ipLimit.allowed || !userLimit.allowed) {
      const limitResult = ipLimit.allowed ? userLimit : ipLimit;
      return createRateLimitResponse(limitResult);
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
    if (
      !deviceCategory ||
      !deviceBrand ||
      !deviceModel ||
      !claimType ||
      !incidentDate ||
      !description
    ) {
      return errorResponse(400, "MISSING_FIELDS", "Required fields are missing");
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
    const dateStr =
      incidentDate + (incidentTime ? `T${incidentTime}` : "T00:00");
    incidentAt = new Date(dateStr);
    if (Number.isNaN(incidentAt.getTime())) {
      return errorResponse(
        400,
        "INVALID_DATETIME",
        "Invalid incident date/time format"
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

    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file_") && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length > 0) {
      const provider = detectUploadProvider();
      if (!provider) {
        return errorResponse(
          500,
          "UPLOAD_CONFIG_MISSING",
          "Upload provider is not configured"
        );
      }
      const maxFileSizeBytes = getMaxFileSizeBytes();
      const allowedMimeTypes = getAllowedMimeTypes();
      const allowedExtensions = getAllowedExtensions();
      const attachments: string[] = [];

      for (const file of files) {
        const fileName = sanitizeFileName(file.name);
        const extension = `.${fileName.split(".").pop()?.toLowerCase() ?? ""}`;
        const contentType = file.type || "application/octet-stream";

        if (!allowedMimeTypes.includes(contentType)) {
          return errorResponse(400, "INVALID_FILE_TYPE", "Unsupported file type", {
            fileName,
            contentType,
          });
        }
        if (!allowedExtensions.includes(extension)) {
          return errorResponse(400, "INVALID_FILE_EXTENSION", "Unsupported file extension", {
            fileName,
            extension,
          });
        }
        if (file.size > maxFileSizeBytes) {
          return errorResponse(400, "FILE_TOO_LARGE", "File size exceeds limit", {
            fileName,
            maxSizeBytes: maxFileSizeBytes,
          });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const scanResult = await scanFile(buffer);
        if (!scanResult.clean) {
          return errorResponse(400, "FILE_VIRUS_DETECTED", "File failed virus scan", {
            fileName,
            reason: scanResult.reason,
          });
        }

        const storageKey = `claims/${claim.id}/${Date.now()}-${fileName}`;
        const url =
          provider === "supabase"
            ? await uploadToSupabase(buffer, storageKey, contentType)
            : await uploadToS3(buffer, storageKey, contentType);
        attachments.push(url);
      }

      await prisma.claim.update({
        where: { id: claim.id },
        data: { attachments },
      });
    }

    return NextResponse.json({
      success: true,
      claimId: claim.id,
      message: "Claim created successfully",
    });
  } catch (error) {
    console.error("Claim creation error:", error);
    return errorResponse(500, "INTERNAL_SERVER_ERROR", "Internal server error");
  }
}
