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

# Change ownership of files to non-root user (node)
RUN chown -R node:node /app

# Use non-root user for running the app
USER node

# Start the app
CMD ["npm", "run", "start"]
