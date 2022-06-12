import express, { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router: Router = express.Router();

// POST /api/articles
router.post('', async (req: Request, res: Response) => {
	try {
		const token = req.headers.authorization;

		if (!token) return res.status(401).send('Invalid Token');

		try {
			jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);
		} catch (error) {
			return res.status(401).send('Invalid Token');			
		}

		const { title, slug, privateArticle } = req.body;
		let { published_at } = req.body;
		
		published_at = new Date(published_at);

		if (slug.length > 3) return res.status(400).send('Slug is in invalid format')

		await prisma.article.create({
			data: {
				id: uuidv4(),
				title,
				slug,
				published_at,
				privateArticle,
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
		const token = req.headers.authorization;

		if (!token) return res.status(401).send('Invalid Token');

		try {
			jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);
		} catch (error) {
			return res.status(401).send('Invalid Token');			
		}

		const { id } = req.params;

		await prisma.article.delete({
			where: {
				id,
			},
		});

		res.send();
	} catch (e) {
		console.error(e);
		res.status(500).send('Something went wrong');
	}
});

// GET /api/articles
router.get('', async (req: Request, res: Response) => {
  try {
		const token = req.headers.authorization;
		const { id, slug } = req.query;

		if (!id && !slug) return res.status(400).send('Missing id query parameter');

		if (!token) {
			let articleResponse;
			if (id) {
				articleResponse = await prisma.article.findUnique({
					where: {
						id,
					},
				});
			} else {
				articleResponse = await prisma.article.findFirst({
					where: {
						slug,
					},
				});
			}

			if (!articleResponse) return res.status(404).send('Article not Found');
			if (articleResponse.privateArticle) return res.status(400).send('Article is private');

			res.send(articleResponse);
		} else {
			try {
				jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);
			} catch (error) {
				return res.status(401).send('Invalid Token');			
			}

			let articleResponse;
			if (id) {
				articleResponse = await prisma.article.findUnique({
					where: {
						id,
					},
				});
			} else {
				articleResponse = await prisma.article.findFirst({
					where: {
						slug,
					},
				});
			}

			if (!articleResponse) return res.status(404).send('Article not Found');

			res.send(articleResponse);
		}
  } catch (e) {
		console.error(e);
    res.status(500).send('Something went wrong');
  }
});

// GET /api/articles
router.get('/published', async (req: Request, res: Response) => {
  try {
		const token = req.headers.authorization;
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

		if (!token) {
			const articleResponse = await prisma.article.findMany({
				skip,
				take,
				where: {
					NOT: {
						published_at: null,
					},
					AND: {
						privateArticle: false,
					}
				},
				orderBy: {
					published_at: publishedAt,
				},
			});

			if (!articleResponse) return res.status(404).send('Article not Found');

			return res.send(articleResponse);
		} else {
			try {
				jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);
			} catch (error) {
				return res.status(401).send('Invalid Token');			
			}

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
			});

			if (!articleResponse) return res.status(404).send('Article not Found');

			return res.send(articleResponse);
		}
  } catch (e) {
		console.error(e);
    res.status(500).send('Something went wrong');
  }
});

export default router;