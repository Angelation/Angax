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
  # En Render, usar /tmp para la base de datos SQLite para evitar problemas de permisos
  # Si DB_DATABASE no está configurado o es el valor por defecto, usar /tmp
  if [ -z "$DB_DATABASE" ] || [ "$DB_DATABASE" = "/var/www/html/database/database.sqlite" ]; then
    DB_DATABASE="/tmp/database.sqlite"
    export DB_DATABASE
    # Actualizar .env si existe
    if [ -f .env ]; then
      sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|" .env || true
    fi
  fi
  
  # Asegurarse de que el directorio de la base de datos existe
  DB_DIR=$(dirname "$DB_DATABASE")
  mkdir -p "$DB_DIR" 2>/dev/null || true
  
  # Crear el archivo SQLite si no existe y establecer permisos
  touch "$DB_DATABASE" 2>/dev/null || {
    # Si falla, intentar en /tmp
    DB_DATABASE="/tmp/database.sqlite"
    export DB_DATABASE
    DB_DIR="/tmp"
    mkdir -p "$DB_DIR" 2>/dev/null || true
    touch "$DB_DATABASE" 2>/dev/null || true
  }
  
  # Establecer permisos de escritura
  chmod 666 "$DB_DATABASE" 2>/dev/null || true
  chmod 777 "$DB_DIR" 2>/dev/null || true
  echo "Base de datos SQLite configurada en: $DB_DATABASE"
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
          echo "DB_DATABASE=${DB_DATABASE:-/tmp/database.sqlite}" >> .env
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
  # Asegurarse de que la base de datos existe y tiene permisos de escritura
  if [ -z "$DB_DATABASE" ] || [ "$DB_DATABASE" = "/var/www/html/database/database.sqlite" ]; then
    DB_DATABASE="/tmp/database.sqlite"
    export DB_DATABASE
  fi
  
  DB_DIR=$(dirname "$DB_DATABASE")
  mkdir -p "$DB_DIR" 2>/dev/null || true
  
  # Crear archivo si no existe
  if [ ! -f "$DB_DATABASE" ]; then
    touch "$DB_DATABASE" 2>/dev/null || {
      # Si falla, usar /tmp
      DB_DATABASE="/tmp/database.sqlite"
      export DB_DATABASE
      touch "$DB_DATABASE" 2>/dev/null || true
    }
  fi
  
  # Establecer permisos de escritura (666 = rw-rw-rw-)
  chmod 666 "$DB_DATABASE" 2>/dev/null || true
  chmod 777 "$DB_DIR" 2>/dev/null || true
  
  # Verificar permisos
  if [ -w "$DB_DATABASE" ]; then
    echo "Base de datos SQLite lista en: $DB_DATABASE (permisos OK)"
  else
    echo "ADVERTENCIA: La base de datos puede no tener permisos de escritura: $DB_DATABASE"
    # Intentar crear en /tmp como último recurso
    DB_DATABASE="/tmp/database.sqlite"
    export DB_DATABASE
    touch "$DB_DATABASE" 2>/dev/null || true
    chmod 666 "$DB_DATABASE" 2>/dev/null || true
    echo "Base de datos SQLite alternativa en: $DB_DATABASE"
  fi
  
  # Actualizar .env con la ruta correcta
  if [ -f .env ]; then
    sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|" .env || true
  fi
fi
php artisan migrate --force || echo "Error al ejecutar migraciones, pero continuando..."

# Limpiar caché
echo "Limpiando caché..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Asegurarse de que SQLite esté configurado correctamente después de limpiar caché
if [ "$DB_CONNECTION" = "sqlite" ]; then
  # Verificar nuevamente que la base de datos esté en /tmp y tenga permisos
  if [ -z "$DB_DATABASE" ] || [ "$DB_DATABASE" != "/tmp/database.sqlite" ]; then
    DB_DATABASE="/tmp/database.sqlite"
    export DB_DATABASE
    if [ -f .env ]; then
      sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|" .env || true
    fi
  fi
  
  # Crear base de datos si no existe y establecer permisos
  touch "$DB_DATABASE" 2>/dev/null || true
  chmod 666 "$DB_DATABASE" 2>/dev/null || true
  echo "Base de datos SQLite verificada en: $DB_DATABASE"
fi

# Registrar rutas antes de cachear
echo "Registrando rutas..."
php artisan route:list || true

# Optimizar Laravel (solo en producción)
if [ "$APP_ENV" = "production" ]; then
    echo "Optimizando Laravel..."
    # Para SQLite, NO cachear config para evitar problemas con la ruta de la base de datos
    if [ "$DB_CONNECTION" != "sqlite" ]; then
      php artisan config:cache || true
    else
      echo "Saltando cache de configuración para SQLite (evitar problemas de ruta)"
    fi
    # NO cachear rutas en producción si hay problemas, mejor sin cache
    # php artisan route:cache || true
    php artisan view:cache || true
fi

echo "Laravel está listo!"

exec "$@"

