FROM node:20-alpine

WORKDIR /home/app

COPY package.json ./

RUN npm install --silent

COPY . .

EXPOSE 21005

CMD [ "npm", "start" ]
