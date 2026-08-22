import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "./env";

const adapter = new PrismaMariaDb({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

export const checkDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
};

export default prisma;