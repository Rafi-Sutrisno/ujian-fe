# ---------- Stage 1: Build ----------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    COPY package.json package-lock.json ./
    RUN npm install --ignore-scripts
    
    COPY . .
    
    # Run postinstall manually if needed
    RUN npm run build:icons
    RUN npm run build
    
    # ---------- Stage 2: Production ----------
    FROM node:18-alpine AS runner
    
    WORKDIR /app
    
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/.next .next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules ./node_modules
    
    ENV NODE_ENV production
    EXPOSE 3000
    
    CMD ["npm", "start"]
    