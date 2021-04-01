FROM node:alpine AS builder
WORKDIR /usr/app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN yarn
RUN yarn build
## this is stage two , where the app actually runs
FROM node:alpine
WORKDIR /usr/app
COPY package.json ./
RUN yarn --prod
COPY --from=builder /usr/app/dist .
RUN yarn global add pm2 
CMD ["pm2-runtime","index.js"]