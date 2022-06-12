# Human

- This is test Typescript project for Articles.
- NX was used to create boilerplate.
- Postgres is chosen Database.
- Prisma is used for ORM.
- Docker is used for easy setup and usage.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `build/` directory.

## Starting server

Run `npm run start` to start application locally. You can access it on localhost:PORT

## Instructions for Production

### Option A:
1. Start your postgres instance
2. Create .env file in root directory of project
3. Add and fill following variables:
	- DATABASE_URL=
	- API_PORT=
	- JWT_SECRET_KEY=
	- POSTGRES_PASSWORD=
4. Build and run Docker with provided API_PORT parameter

### Option B:
1. Create .env file in root directory of project
2. Add and fill following variables:
	- DATABASE_URL=
	- API_PORT=
	- JWT_SECRET_KEY=
	- POSTGRES_PASSWORD=
3. Run: `docker-compose up -d`

## Endpoints

- POST /api/users
- POST /api/users/login

- POST /api/articles
- DELETE /api/articles/:id
- GET /api/articles?id=id
- GET /api/articles?slug=slug
- GET /api/articles/published?page=1&publishedAt=1