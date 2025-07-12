FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S indexer -u 1001

# Change ownership of the app directory
RUN chown -R indexer:nodejs /app
USER indexer

# Expose health check port (optional)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('./dist/indexer').healthCheck().then(h => process.exit(h.status === 'healthy' ? 0 : 1))"

# Start the indexer
CMD ["npm", "start"]