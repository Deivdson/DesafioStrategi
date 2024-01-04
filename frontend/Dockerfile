FROM node:20.10-alpine as builder
WORKDIR /app
COPY . .

RUN npm install

RUN npm run build

CMD npm start
