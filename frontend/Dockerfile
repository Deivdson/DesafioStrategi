FROM node:20.18.3-alpine as builder
WORKDIR /app
COPY package.json .
COPY . .

RUN npm install

RUN npm run build

CMD npm run start
