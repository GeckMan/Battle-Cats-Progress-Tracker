require("dotenv/config");

const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
  log: ["warn", "error"],
});

async function disconnect() {
  await prisma.$disconnect();
  await pool.end();
}

module.exports = { prisma, disconnect };
