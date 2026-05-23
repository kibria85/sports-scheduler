FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

RUN npm install

COPY src ./src
COPY tsconfig.json ./

EXPOSE 5000

CMD ["npm", "run", "dev"]
