# ---- Stage 1: build the static site ----
FROM node:20-alpine AS build
WORKDIR /app

# Cache deps: only re-run npm install when package files change
COPY package*.json ./
RUN npm install

# Build-time API URL. Pass with --build-arg VITE_API_URL=https://your-api...
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ---- Stage 2: serve with nginx ----
FROM nginx:alpine
# Our SPA routing config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# The built static files from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
