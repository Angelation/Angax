#!/bin/sh

set -e

# Solo esperar a MySQL si DB_CONNECTION es mysql
if [ "$DB_CONNECTION" = "mysql" ] || [ -z "$DB_CONNECTION" ]; then
  echo "Esperando a que MySQL esté listo..."
  until php -r "try { new PDO('mysql:host=mysql;dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}'); exit(0); } catch (PDOException \$e) { exit(1); }" 2>/dev/null; do
    echo "MySQL no está listo aún, esperando..."
    sleep 2
  done
  echo "MySQL está listo!"
elif [ "$DB_CONNECTION" = "sqlite" ]; then
  echo "Usando SQLite, no es necesario esperar a MySQL."
  # Asegurarse de que el directorio de la base de datos existe
  mkdir -p $(dirname "$DB_DATABASE")
  # Crear el archivo SQLite si no existe
  touch "$DB_DATABASE" 2>/dev/null || true
else
  echo "Usando conexión de base de datos: $DB_CONNECTION"
fi

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
        if [ "$DB_CONNECTION" = "sqlite" ]; then
          echo "DB_CONNECTION=sqlite" >> .env
          echo "DB_DATABASE=${DB_DATABASE:-/var/www/html/database/database.sqlite}" >> .env
        else
          echo "DB_CONNECTION=mysql" >> .env
          echo "DB_HOST=mysql" >> .env
          echo "DB_PORT=3306" >> .env
          echo "DB_DATABASE=${DB_DATABASE:-angax}" >> .env
          echo "DB_USERNAME=${DB_USERNAME:-angax_user}" >> .env
          echo "DB_PASSWORD=${DB_PASSWORD:-angax_password}" >> .env
        fi
    fi
fi

# Generar clave de aplicación si no existe
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    echo "Generando clave de aplicación..."
    php artisan key:generate --force || true
fi

# Ejecutar migraciones (solo si la base de datos está configurada)
echo "Ejecutando migraciones..."
if [ "$DB_CONNECTION" = "sqlite" ]; then
  # Para SQLite, asegurarse de que el archivo existe y tiene permisos
  mkdir -p $(dirname "$DB_DATABASE")
  touch "$DB_DATABASE" 2>/dev/null || true
  chmod 664 "$DB_DATABASE" 2>/dev/null || true
fi
php artisan migrate --force || true

# Limpiar caché
echo "Limpiando caché..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Registrar rutas antes de cachear
echo "Registrando rutas..."
php artisan route:list || true

# Optimizar Laravel (solo en producción)
if [ "$APP_ENV" = "production" ]; then
    echo "Optimizando Laravel..."
    php artisan config:cache || true
    # NO cachear rutas en producción si hay problemas, mejor sin cache
    # php artisan route:cache || true
    php artisan view:cache || true
fi

echo "Laravel está listo!"

exec "$@"

