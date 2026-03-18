FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copiar e instalar
COPY package*.json .

RUN npm ci

COPY /src ./src

# Build do backend
RUN npm run build

# ========== STAGE 3: PRODUCTION ==========
FROM node:20-alpine AS production

WORKDIR /app

# Copiar backend
COPY --from=backend-builder /app/package*.json ./
COPY --from=backend-builder /app/dist ./dist

# Instalar apenas prod deps
RUN npm ci --only=production

ENV NODE_ENV=production
EXPOSE 3001
CMD [ "npm", "run", "start" ]
