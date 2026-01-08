#!/bin/sh

set -e

echo "Esperando a que MySQL esté listo..."
until php -r "try { new PDO('mysql:host=mysql;dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}'); exit(0); } catch (PDOException \$e) { exit(1); }" 2>/dev/null; do
  echo "MySQL no está listo aún, esperando..."
  sleep 2
done

echo "MySQL está listo!"

# Crear .env si no existe
if [ ! -f .env ]; then
    echo "Creando archivo .env desde .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "APP_NAME=AngaX" > .env
        echo "APP_ENV=production" >> .env
        echo "APP_KEY=" >> .env
        echo "APP_DEBUG=false" >> .env
        echo "APP_URL=http://localhost:8000" >> .env
        echo "DB_CONNECTION=mysql" >> .env
        echo "DB_HOST=mysql" >> .env
        echo "DB_PORT=3306" >> .env
        echo "DB_DATABASE=${DB_DATABASE}" >> .env
        echo "DB_USERNAME=${DB_USERNAME}" >> .env
        echo "DB_PASSWORD=${DB_PASSWORD}" >> .env
    fi
fi

# Generar clave de aplicación si no existe
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    echo "Generando clave de aplicación..."
    php artisan key:generate --force || true
fi

# Ejecutar migraciones
echo "Ejecutando migraciones..."
php artisan migrate --force || true

# Limpiar caché
echo "Limpiando caché..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Optimizar Laravel (solo en producción)
if [ "$APP_ENV" = "production" ]; then
    echo "Optimizando Laravel..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

echo "Laravel está listo!"

exec "$@"

