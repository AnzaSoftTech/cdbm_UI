# Step 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the built app using Node.js
FROM node:18

# Set the working directory
WORKDIR /app

# Install a simple HTTP server for serving static files
RUN npm install -g serve

# Copy the built files from the build stage
COPY --from=build /app/build ./build

# Expose the port the app will run on
EXPOSE 3000

# Serve the app on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
