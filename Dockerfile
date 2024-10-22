# Step 1: Build the React app using a Node.js alpine image
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --silent

# Copy the rest of the application files
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the built app using Node.js
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install a simple HTTP server for serving static files
RUN npm install -g serve

# Copy the build artifacts from the build stage
COPY --from=build /app/build ./build

# Expose the port the app will run on
EXPOSE 3000

# Start the server and serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
