import express, { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

const router: Router = express.Router();
// POST /users
router.post('', async (req: Request, res: Response) => {
  try {
		const { username, password } = req.body;

		await prisma.user.create({
			data: {
				id: await uuidv4(),
				username,
				password,
			},
		})

    res.status(201).send();
  } catch (e) {
		console.error(e);
    res.status(500).send('Something went wrong');
  }
});

export default router;