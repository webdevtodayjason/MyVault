# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install Node.js for database initialization
RUN apk add --no-cache nodejs npm

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy database initialization script
COPY docker-init.sh /docker-init.sh
RUN chmod +x /docker-init.sh

# Create directory for database
RUN mkdir -p /data

# Expose port 80
EXPOSE 80

# Start nginx and initialization script
CMD ["/docker-init.sh"]