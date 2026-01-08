#!/bin/bash

# Script de Bash para iniciar Docker en Linux/Mac
echo "🐳 Iniciando AngaX con Docker..."

# Verificar que Docker esté ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose. Por favor, inicia Docker primero."
    exit 1
fi

echo "✅ Docker está ejecutándose"

# Construir y levantar los contenedores
echo ""
echo "📦 Construyendo imágenes..."
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Contenedores iniciados correctamente!"
    echo ""
    echo "📍 URLs de acceso:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000/api"
    echo "   MySQL:    localhost:3306"
    echo ""
    echo "📊 Para ver los logs, ejecuta: docker-compose logs -f"
    echo "🛑 Para detener, ejecuta: docker-compose down"
else
    echo ""
    echo "❌ Error al iniciar los contenedores. Revisa los logs con: docker-compose logs"
    exit 1
fi

