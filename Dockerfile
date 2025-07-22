# --- Stage 1: Build React App with Vite ---
FROM node:18-alpine AS builder

WORKDIR /app

# Only copy package files first to cache npm install
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy the rest of the app (includes vite.config.js and source code)
COPY . .

# Build the React app
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:stable-alpine

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to Nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html



# Expose default Nginx port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
