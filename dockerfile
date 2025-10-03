# ---- Build Stage ----
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy package.json and lock file from the root
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code from the root
COPY . .

# Build the Vue app
RUN npm run build

# ---- Production Stage ----
FROM nginx:stable-alpine as production-stage

# Copy the built 'dist' folder from the build stage to nginx's web root
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 83

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]