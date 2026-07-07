FROM node:20-alpine

RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with longer timeout and legacy peer deps
RUN npm install --legacy-peer-deps --no-optional --fetch-timeout=60000 && npm cache clean --force

# Copy source code
COPY . .

# Build Next.js app and workers
RUN npm run build

# Install PM2
RUN npm install -g pm2

COPY pm2.config.js .

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["pm2-runtime", "start", "pm2.config.js"]