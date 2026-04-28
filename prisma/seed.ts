import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main() {
  const email = getRequiredEnv("SUPER_ADMIN_EMAIL").toLowerCase();
  const password = getRequiredEnv("SUPER_ADMIN_PASSWORD");
  const name = process.env.SUPER_ADMIN_NAME?.trim() || "Super Admin";

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (existingUser) {
    console.log(`Super Admin already exists: ${existingUser.email}`);
    return;
  }

  const result = await auth.api.createUser({
    body: {
      email,
      password,
      name,
      role: "admin",
      data: {
        mustChangePassword: false,
      },
    },
  });

  console.log(`Super Admin created: ${result.user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
