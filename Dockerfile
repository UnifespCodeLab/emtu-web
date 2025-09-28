FROM node:16-alpine

WORKDIR /app

# Set memory limit for Node.js
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Install curl for health check
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --verbose

# Copy source code
COPY . .

# garanta que o .env entre na imagem
COPY .env .

# Build the application
RUN npm run build

# Clean dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start command
CMD ["npm", "run", "start"]