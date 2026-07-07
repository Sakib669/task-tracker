FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source and build
COPY . .
RUN npm run build

# Install PM2 globally
RUN npm install -g pm2

# Copy PM2 config
COPY pm2.config.js .

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["pm2-runtime", "start", "pm2.config.js"]