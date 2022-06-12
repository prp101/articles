import express, { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const router: Router = express.Router();

// POST /api/articles
router.post('', async (req: Request, res: Response) => {
	try {
		const { title, slug } = req.body;
		let { published_at } = req.body;
		
		published_at = new Date(published_at);

		if (slug.length > 3) return res.status(400).send('Slug is in invalid format')

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

// GET /api/articles
router.get('', async (req: Request, res: Response) => {
  try {
		const { id } = req.query;

		if (!id) return res.status(400).send('Missing id query parameter');

		const articleResponse = await prisma.article.findUnique({
			where: {
				id,
			},
		})

		if (!articleResponse) return res.status(404).send('Article not Found');

    res.send(articleResponse);
  } catch (e) {
		console.error(e);
    res.status(500).send('Something went wrong');
  }
});

// GET /api/articles
router.get('/published', async (req: Request, res: Response) => {
  try {
		let skip = 0;
		const take = 10;
		const order = {
			'1': 'asc',
			'-1': 'desc'
		};
		const page = req.query.page ? req.query.page: 1;
		let publishedAt = req.query.publishedAt;

		if (order[publishedAt]) {
			publishedAt = order[publishedAt];
		} else {
			publishedAt = 'asc';
		}

		if (page > 1) skip = 10 * page;

		const articleResponse = await prisma.article.findMany({
			skip,
			take,
			where: {
				NOT: {
					published_at: null,
				}
			},
			orderBy: {
				published_at: publishedAt,
			},
		})

		if (!articleResponse) return res.status(404).send('Article not Found');

    res.send(articleResponse);
  } catch (e) {
		console.error(e);
    res.status(500).send('Something went wrong');
  }
});

export default router;