FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY quiz-frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY quiz-frontend/ .

# Build application
RUN npm run build

# Use nginx to serve the app
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
