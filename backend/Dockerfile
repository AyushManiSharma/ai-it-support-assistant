FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production image — only ships compiled output, not dev tools
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --chown=node:node --from=builder /app/dist ./dist

USER node

EXPOSE 5000

CMD ["node", "dist/server.js"]
