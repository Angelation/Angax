#!/bin/sh
set -e

# Obtener VITE_API_BASE_URL de variable de entorno o usar valor por defecto
VITE_API_BASE_URL=${VITE_API_BASE_URL:-https://angax-backend.onrender.com/api}

echo "Building frontend with VITE_API_BASE_URL=$VITE_API_BASE_URL"

docker build --build-arg VITE_API_BASE_URL="$VITE_API_BASE_URL" -t angax-frontend .

