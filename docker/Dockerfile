# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

RUN npm run build:icons
RUN npm run build

# Copy source code
COPY . .

# Build app
RUN npm run build

# Start app
CMD ["npm", "run", "start"]
