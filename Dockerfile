# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install client dependencies
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm install

# Build client
COPY client/ ./
RUN npm run build

# Install backend dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --production

# Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/client/dist ./client/dist

# Copy backend code
COPY server.js .
COPY package.json .

# Create volume directory for database persistence if needed
VOLUME /app/data

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
