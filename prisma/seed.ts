import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "husainalimubarok28@gmail.com" },
    update: {},
    create: {
      email: "husainalimubarok28@gmail.com",
      name: "Husain Ali Mubarok",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user created:", admin.email);
  console.log("\nLogin credentials:");
  console.log("  Email: husainalimubarok28@gmail.com");
  console.log("  Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
