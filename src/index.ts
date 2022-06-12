import express from 'express';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import articleRoutes from './api/article';
import userRoutes from './api/user';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);

app.get('*', function(req, res){
  res.status(404).send(`Invalid URL: ${req.url}`);
});

app.post('*', function(req, res){
  res.status(404).send(`Invalid URL: ${req.url}`);
});

app.delete('*', function(req, res){
  res.status(404).send(`Invalid URL: ${req.url}`);
});

async function main() {
	await prisma.$connect();
  app.listen(process.env.API_PORT, () => {
    console.log(`Articles app is listening on port ${process.env.API_PORT}`);
  })
}

main();
