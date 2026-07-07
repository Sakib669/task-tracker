FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files AND prisma schema (needed for prisma generate)
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev) – we need prisma for build
RUN npm ci && npm cache clean --force

# Copy the rest of the source code
COPY . .

# Build Next.js app and workers (build:workers runs via postbuild)
RUN npm run build

# Install PM2 globally
RUN npm install -g pm2

# Copy PM2 config
COPY pm2.config.js .

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["pm2-runtime", "start", "pm2.config.js"]