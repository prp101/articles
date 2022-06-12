import express, { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const router: Router = express.Router();

// POST /api/articles
router.post('', async (req: Request, res: Response) => {
	try {
		const { title, slug, published_at } = req.body;

		await prisma.article.create({
			data: {
				id: uuidv4(),
				title,
				slug,
				published_at,
			},
		})

		res.send().status(201);
	} catch (e) {
		console.error(e);
		res.status(500).send('Something went wrong');
	}
});

// DELETE /api/articles/:id
router.delete('/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		await prisma.article.delete({
			where: {
				id,
			},
		})

		res.send();
	} catch (e) {
		console.error(e);
		res.status(500).send('Something went wrong');
	}
});

// GET /api/articles/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
		const { id } = req.params;

		const articleResponse = await prisma.article.findUnique({
			where: {
				id,
			},
		})

		if (!articleResponse) res.status(404).send('Article not Found');

    res.send(articleResponse);
  } catch (e) {
		console.error(e);
    res.status(500).send('Something went wrong');
  }
});

export default router;