# Use an official Node.js image to build the React app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.* ./
COPY . .

RUN npm install
RUN npm run build

# Use Nginx to serve the static build files
FROM nginx:stable-alpine

# Remove default nginx static assets and replace with our build
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
