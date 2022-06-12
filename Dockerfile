FROM node:14.19-alpine
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
ADD . /usr/src/app
RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]