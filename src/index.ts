import express from 'express';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

dotenv.config();
const app = express();

async function main() {
	await prisma.$connect();
  app.listen(process.env.API_PORT, () => {
    console.log(`Artices app is listening on port ${process.env.API_PORT}`);
  })
}

main();
