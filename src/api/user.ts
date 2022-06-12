import express, { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

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
		});

    res.status(201).send();
  } catch (e) {
		console.error(e);
    res.status(500).send('Something went wrong');
  }
});

// POST /users/login
router.post('/login', async (req: Request, res: Response) => {
  try {
		const { username, password } = req.body;

		const userResponse = await prisma.user.findUnique({
			where: {
				username,
			},
		});

		if (!userResponse) return res.status(404).send('User not found')

		if (password !== userResponse.password) return res.status(401).send('Invalid password');

		let jwtSecretKey = process.env.JWT_SECRET_KEY;
		let data = {
			expiresIn: 3600,
			userId: userResponse.id,
		};

		const token = jwt.sign(data, jwtSecretKey);

    res.cookie('jwt', token, { httpOnly: true });
		res.send();
  } catch (e) {
		console.error(e);
    res.status(500).send('Something went wrong');
  }
});

export default router;