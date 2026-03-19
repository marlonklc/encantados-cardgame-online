FROM node:20-alpine

WORKDIR /home/app

COPY package.json ./

ENV NODE_ENV=production

RUN npm install --silent

COPY . .

EXPOSE 21005

CMD [ "npm", "run", "production" ]
