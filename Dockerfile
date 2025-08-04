# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Add cache busting
ARG CACHEBUST=1

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create directory for data persistence
RUN mkdir -p /data

# Create a simple entrypoint script inline to avoid line ending issues
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'echo "Starting My Vault..."' >> /docker-entrypoint.sh && \
    echo 'echo "Data directory: /data"' >> /docker-entrypoint.sh && \
    echo 'mkdir -p /data' >> /docker-entrypoint.sh && \
    echo 'echo "Starting nginx..."' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use the inline script to avoid Windows line ending issues
CMD ["/docker-entrypoint.sh"]