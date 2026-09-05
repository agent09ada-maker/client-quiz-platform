import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- First admin account ---
  // Change these before running in production, or change the password
  // immediately after your first login.
  const adminUsername = process.env.SEED_ADMIN_USERNAME || "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        username: adminUsername,
        name: "Administrator",
        passwordHash: await bcrypt.hash(adminPassword, 10),
      },
    });
    console.log(`Created admin "${adminUsername}" with password "${adminPassword}"`);
    console.log("IMPORTANT: log in and this is the only admin account — add more from the dashboard.");
  } else {
    console.log(`Admin "${adminUsername}" already exists, skipping.`);
  }

  // --- Sample client + a few questions so the app isn't empty on first run ---
  const sampleClient = await prisma.client.upsert({
    where: { id: "sample-client-1" },
    update: {},
    create: {
      id: "sample-client-1",
      name: "Sample Client Co.",
      summary: "A placeholder client so you can see how the quiz works end to end.",
    },
  });

  const sampleQuestionCount = await prisma.question.count({
    where: { clientId: sampleClient.id },
  });

  if (sampleQuestionCount === 0) {
    await prisma.question.createMany({
      data: [
        {
          clientId: sampleClient.id,
          difficulty: "EASY",
          prompt: "What industry is Sample Client Co. primarily in?",
          options: JSON.stringify(["Retail", "Logistics", "Banking", "Healthcare"]),
          correctIndex: 1,
          status: "APPROVED",
          generatedYear: new Date().getFullYear(),
        },
        {
          clientId: sampleClient.id,
          difficulty: "MEDIUM",
          prompt: "Which of these is a known priority for Sample Client Co. this year?",
          options: JSON.stringify([
            "Cost reduction",
            "International expansion",
            "Sustainability reporting",
            "All of the above",
          ]),
          correctIndex: 3,
          status: "APPROVED",
          generatedYear: new Date().getFullYear(),
        },
      ],
    });
    console.log("Added sample questions for Sample Client Co.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
