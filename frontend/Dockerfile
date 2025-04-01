
    # FROM node:22-alpine AS builder

    # WORKDIR /frontend

    # COPY ../package.json /package.json

    # RUN npm install --verbose

    # COPY .. /frontend/
    # RUN npm run build


    # FROM nginx:stable-alpine

    # COPY --from=builder /frontend/dist /usr/share/nginx/html


    # CMD ["nginx", "-g", "daemon off;"]

# --- Builder Stage ---
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY frontend/package*.json ./
    RUN npm install
    COPY frontend/ ./
    RUN npm run build
    
    
    # --- Production Stage ---
    FROM nginx:stable-alpine
    COPY --from=builder /app/dist /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]