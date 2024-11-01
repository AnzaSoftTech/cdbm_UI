# Use a smaller base image and multi-stage build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the application with less memory-intensive options
RUN NODE_OPTIONS=--max_old_space_size=256 npm run build

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