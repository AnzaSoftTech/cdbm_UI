# Use a larger base image for building
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Update and install dependencies
RUN npm install

# Copy source files after installing dependencies
COPY . .

# Increase memory limit for build process
RUN NODE_OPTIONS=--max_old_space_size=512 npm run build

# Production stage
FROM node:18-alpine

# Install serve with minimal dependencies
RUN npm install -g serve

# Copy only necessary files from build stage
WORKDIR /app
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Use a process manager for better resource management
CMD ["serve", "-s", "build", "-l", "3000"]