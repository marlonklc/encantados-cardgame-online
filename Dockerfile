FROM node:20-alpine

WORKDIR /home/app

COPY package.json ./

RUN npm install --silent

COPY . .

ENV NODE_ENV=production

EXPOSE 21005

CMD [ "npm", "start" ]
