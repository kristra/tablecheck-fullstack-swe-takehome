import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

const globalPrisma = global as unknown as { prisma: PrismaClient };

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ errorFormat: "minimal", log: ["error"] });
} else {
  if (!globalPrisma.prisma) {
    globalPrisma.prisma = new PrismaClient({
      errorFormat: "pretty",
      log: ["error", "warn"],
    });
  }
  prisma = globalPrisma.prisma;
}

export default prisma;
