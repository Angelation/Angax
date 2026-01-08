# Dockerfile para el frontend (React/Vite)
FROM node:20-alpine AS builder

WORKDIR /app

# Argumento para la URL de la API (Render pasará esto como build arg desde envVars)
# Usar variable de entorno si está disponible, sino usar el valor por defecto
ARG VITE_API_BASE_URL=https://angax-backend.onrender.com/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

