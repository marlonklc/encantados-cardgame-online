FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
ENV SERVER_PORT=8000
ENV CORS_ORIGINS=http://localhost:3000

EXPOSE 8000

CMD ["npm", "run", "production"]
