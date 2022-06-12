FROM node:14.19-alpine
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
ADD . /usr/src/app
RUN npm run build
RUN npx prisma generate
ARG API_PORT=3000

EXPOSE ${API_PORT}
CMD [ "npm", "start" ]