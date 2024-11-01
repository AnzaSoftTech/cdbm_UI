# Use a larger base image for building
FROM node:18-alpine AS builder

# Install pnpm globally in the builder stage
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package and lock files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN pnpm install

# Copy source files after installing dependencies
COPY . .

# Increase memory limit for build process
RUN pnpm run build --max_old_space_size=4096

# Production stage
FROM node:18-alpine

# Install pnpm and serve globally in the production stage
RUN npm install -g pnpm serve

# Set working directory and copy build files
WORKDIR /app
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Use a process manager for better resource management
CMD ["serve", "-s", "build", "-l", "3000"]
