FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json turbo.json ./
COPY packages ./packages

# Copy API app
COPY apps/api ./apps/api

# Install dependencies
RUN npm ci

# Build
RUN npm run build --workspace=@infinity-xos/api

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/packages/contracts ./packages/contracts

# Install production dependencies only
RUN npm ci --production

# Run as non-root
USER node

EXPOSE 8080

CMD ["node", "dist/index.js"]
