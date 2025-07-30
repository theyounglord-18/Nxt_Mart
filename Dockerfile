# --- Stage 1: Build React App ---
FROM node:18-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy rest of the source code
COPY . .

# Build the app
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:stable-alpine

# Copy build output from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

