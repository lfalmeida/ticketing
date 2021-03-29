FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn --prod
COPY . .

CMD ["yarn", "start"]