import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);
  const partnerPassword = await bcrypt.hash("partner123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cihazguvence.com" },
    update: {},
    create: {
      email: "admin@cihazguvence.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Demo Müşteri",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  const partner = await prisma.user.upsert({
    where: { email: "partner@example.com" },
    update: {},
    create: {
      email: "partner@example.com",
      name: "Demo Partner",
      password: partnerPassword,
      role: "PARTNER",
    },
  });

  console.log("Created users:", { admin: admin.email, customer: customer.email, partner: partner.email });

  // Create plans
  const plans = [
    {
      slug: "uzatilmis-garanti",
      name: "Uzatılmış Garanti",
      description: "Garanti süresini uzatın",
      coverageType: "EXTENDED_WARRANTY" as const,
      termType: "YEARLY" as const,
      basePrice: 1000,
      deductibleRules: { type: "percentage", value: 10 },
      limits: { maxClaims: 3, maxAmount: 0.5 },
      isActive: true,
    },
    {
      slug: "kazaen-hasar",
      name: "Kazaen Hasar",
      description: "Kazaya karşı koruma",
      coverageType: "ACCIDENTAL_DAMAGE" as const,
      termType: "YEARLY" as const,
      basePrice: 1500,
      deductibleRules: { type: "fixed", value: 500 },
      limits: { maxClaims: 2, maxAmount: 0.8 },
      isActive: true,
    },
    {
      slug: "tam-koruma",
      name: "Tam Koruma",
      description: "Kapsamlı koruma paketi",
      coverageType: "FULL_COVERAGE" as const,
      termType: "YEARLY" as const,
      basePrice: 2000,
      deductibleRules: { type: "percentage", value: 5 },
      limits: { maxClaims: 4, maxAmount: 1.0 },
      isActive: true,
    },
    {
      slug: "hirsizlik-kayip",
      name: "Hırsızlık-Kayıp",
      description: "Hırsızlık ve kayıp teminatı",
      coverageType: "THEFT_LOSS" as const,
      termType: "YEARLY" as const,
      basePrice: 1800,
      deductibleRules: { type: "percentage", value: 15 },
      limits: { maxClaims: 1, maxAmount: 0.9 },
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: plan,
    });
  }

  console.log("Created plans");

  // Create service centers
  const serviceCenters = [
    {
      name: "İstanbul Kadıköy Servis",
      city: "İstanbul",
      district: "Kadıköy",
      address: "Bağdat Caddesi No:123",
      phone: "+90 (216) 123 45 67",
      email: "kadikoy@cihazguvence.com",
      categories: ["phone", "laptop", "tablet"],
      slaDays: 7,
      isActive: true,
    },
    {
      name: "Ankara Çankaya Servis",
      city: "Ankara",
      district: "Çankaya",
      address: "Atatürk Bulvarı No:456",
      phone: "+90 (312) 234 56 78",
      email: "cankaya@cihazguvence.com",
      categories: ["phone", "laptop"],
      slaDays: 7,
      isActive: true,
    },
    {
      name: "İzmir Konak Servis",
      city: "İzmir",
      district: "Konak",
      address: "Kordon Boyu No:789",
      phone: "+90 (232) 345 67 89",
      email: "konak@cihazguvence.com",
      categories: ["phone", "tablet", "watch"],
      slaDays: 7,
      isActive: true,
    },
  ];

  for (const center of serviceCenters) {
    await prisma.serviceCenter.create({
      data: center,
    });
  }

  console.log("Created service centers");

  // Create a demo partner
  const partnerApiKey = await bcrypt.hash("demo_partner_key_123", 10);
  await prisma.partner.upsert({
    where: { apiKeyHash: partnerApiKey },
    update: {},
    create: {
      name: "Demo E-ticaret Partner",
      type: "ECOMMERCE",
      apiKeyHash: partnerApiKey,
      status: "active",
    },
  });

  console.log("Created partner");

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

