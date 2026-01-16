import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ============================================
  // DEVICE CATALOG - Popular devices with market prices
  // ============================================
  console.log("Seeding device catalog...");

  const deviceCatalog = [
    // Apple iPhones
    { brand: "Apple", model: "iPhone 15 Pro Max", storage: "256GB", category: "phone", marketPrice: 85000, releaseYear: 2023 },
    { brand: "Apple", model: "iPhone 15 Pro Max", storage: "512GB", category: "phone", marketPrice: 100000, releaseYear: 2023 },
    { brand: "Apple", model: "iPhone 15 Pro", storage: "128GB", category: "phone", marketPrice: 70000, releaseYear: 2023 },
    { brand: "Apple", model: "iPhone 15 Pro", storage: "256GB", category: "phone", marketPrice: 77000, releaseYear: 2023 },
    { brand: "Apple", model: "iPhone 15", storage: "128GB", category: "phone", marketPrice: 55000, releaseYear: 2023 },
    { brand: "Apple", model: "iPhone 15", storage: "256GB", category: "phone", marketPrice: 62000, releaseYear: 2023 },
    { brand: "Apple", model: "iPhone 14 Pro Max", storage: "256GB", category: "phone", marketPrice: 65000, releaseYear: 2022 },
    { brand: "Apple", model: "iPhone 14", storage: "128GB", category: "phone", marketPrice: 45000, releaseYear: 2022 },
    { brand: "Apple", model: "iPhone 13", storage: "128GB", category: "phone", marketPrice: 35000, releaseYear: 2021 },

    // Samsung Galaxy
    { brand: "Samsung", model: "Galaxy S24 Ultra", storage: "256GB", category: "phone", marketPrice: 75000, releaseYear: 2024 },
    { brand: "Samsung", model: "Galaxy S24 Ultra", storage: "512GB", category: "phone", marketPrice: 85000, releaseYear: 2024 },
    { brand: "Samsung", model: "Galaxy S24+", storage: "256GB", category: "phone", marketPrice: 55000, releaseYear: 2024 },
    { brand: "Samsung", model: "Galaxy S24", storage: "128GB", category: "phone", marketPrice: 40000, releaseYear: 2024 },
    { brand: "Samsung", model: "Galaxy S23 Ultra", storage: "256GB", category: "phone", marketPrice: 55000, releaseYear: 2023 },
    { brand: "Samsung", model: "Galaxy Z Fold5", storage: "256GB", category: "phone", marketPrice: 70000, releaseYear: 2023 },
    { brand: "Samsung", model: "Galaxy Z Flip5", storage: "256GB", category: "phone", marketPrice: 45000, releaseYear: 2023 },

    // Xiaomi
    { brand: "Xiaomi", model: "14 Ultra", storage: "256GB", category: "phone", marketPrice: 50000, releaseYear: 2024 },
    { brand: "Xiaomi", model: "14 Pro", storage: "256GB", category: "phone", marketPrice: 35000, releaseYear: 2024 },
    { brand: "Xiaomi", model: "Redmi Note 13 Pro+", storage: "256GB", category: "phone", marketPrice: 18000, releaseYear: 2024 },

    // Apple MacBooks
    { brand: "Apple", model: "MacBook Pro 16\"", storage: "M3 Max 1TB", category: "laptop", marketPrice: 150000, releaseYear: 2023 },
    { brand: "Apple", model: "MacBook Pro 14\"", storage: "M3 Pro 512GB", category: "laptop", marketPrice: 95000, releaseYear: 2023 },
    { brand: "Apple", model: "MacBook Air 15\"", storage: "M3 256GB", category: "laptop", marketPrice: 55000, releaseYear: 2024 },
    { brand: "Apple", model: "MacBook Air 13\"", storage: "M3 256GB", category: "laptop", marketPrice: 45000, releaseYear: 2024 },

    // Apple iPads
    { brand: "Apple", model: "iPad Pro 12.9\"", storage: "M2 256GB", category: "tablet", marketPrice: 50000, releaseYear: 2022 },
    { brand: "Apple", model: "iPad Pro 11\"", storage: "M2 128GB", category: "tablet", marketPrice: 35000, releaseYear: 2022 },
    { brand: "Apple", model: "iPad Air", storage: "M2 64GB", category: "tablet", marketPrice: 25000, releaseYear: 2024 },
    { brand: "Apple", model: "iPad 10. Nesil", storage: "64GB", category: "tablet", marketPrice: 18000, releaseYear: 2022 },

    // Samsung Tablets
    { brand: "Samsung", model: "Galaxy Tab S9 Ultra", storage: "256GB", category: "tablet", marketPrice: 45000, releaseYear: 2023 },
    { brand: "Samsung", model: "Galaxy Tab S9+", storage: "256GB", category: "tablet", marketPrice: 35000, releaseYear: 2023 },

    // Apple Watch
    { brand: "Apple", model: "Watch Ultra 2", storage: "Standard", category: "watch", marketPrice: 32000, releaseYear: 2023 },
    { brand: "Apple", model: "Watch Series 9", storage: "45mm", category: "watch", marketPrice: 18000, releaseYear: 2023 },
    { brand: "Apple", model: "Watch SE", storage: "44mm", category: "watch", marketPrice: 12000, releaseYear: 2023 },

    // Samsung Watch
    { brand: "Samsung", model: "Galaxy Watch Ultra", storage: "Standard", category: "watch", marketPrice: 25000, releaseYear: 2024 },
    { brand: "Samsung", model: "Galaxy Watch 6 Classic", storage: "47mm", category: "watch", marketPrice: 15000, releaseYear: 2023 },
  ];

  for (const device of deviceCatalog) {
    await prisma.deviceCatalog.upsert({
      where: {
        brand_model_storage: {
          brand: device.brand,
          model: device.model,
          storage: device.storage,
        },
      },
      update: { marketPrice: device.marketPrice },
      create: device,
    });
  }
  console.log(`Created ${deviceCatalog.length} catalog devices`);


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

