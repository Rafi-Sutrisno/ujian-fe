# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

# Copy only necessary source files
COPY . .

# Build assets
RUN npm run build:icons
RUN npm run build

# Start the app
CMD ["npm", "run", "start"]
