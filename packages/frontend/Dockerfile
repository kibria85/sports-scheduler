FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

RUN yarn install

COPY src ./src
COPY public ./public
COPY tsconfig.json ./

EXPOSE 3000

CMD ["yarn", "run", "dev"]
