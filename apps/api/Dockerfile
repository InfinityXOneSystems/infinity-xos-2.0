FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json turbo.json ./
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

# Copy package files from root for production install
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/turbo.json ./turbo.json

# Copy built API app
COPY --from=builder /app/apps/api ./apps/api

# Copy contracts package
COPY --from=builder /app/packages/contracts ./packages/contracts

# Install production dependencies only
RUN npm ci --production --workspace=@infinity-xos/api

# Run as non-root
USER node

EXPOSE 8080

CMD ["node", "apps/api/dist/index.js"]
