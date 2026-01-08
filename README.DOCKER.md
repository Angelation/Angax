# 🐳 Guía de Dockerización - AngaX

Esta guía te ayudará a ejecutar la aplicación AngaX usando Docker.

## 📋 Requisitos Previos

- Docker Desktop instalado y ejecutándose
- Al menos 4GB de RAM disponibles
- Puertos 3000, 8000 y 3306 disponibles

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (opcional, tiene valores por defecto):

```env
# Base de datos
DB_DATABASE=angax
DB_USERNAME=angax_user
DB_PASSWORD=angax_password
DB_ROOT_PASSWORD=root_password

# Aplicación
APP_NAME=AngaX
APP_ENV=production
APP_DEBUG=false
```

### 2. Construir y Ejecutar los Contenedores

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up -d --build
```

Este comando:
- Construye las imágenes de Docker
- Crea los contenedores
- Inicia todos los servicios (MySQL, Backend, Frontend)

### 3. Verificar que Todo Funciona

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Base de datos MySQL**: localhost:3307 (puerto 3307 para evitar conflictos con XAMPP)

## 📝 Comandos Útiles

### Ver logs de todos los servicios
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Detener los contenedores
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ Esto elimina la base de datos)
```bash
docker-compose down -v
```

### Reconstruir un servicio específico
```bash
docker-compose up -d --build backend
```

### Ejecutar comandos en el contenedor del backend
```bash
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan cache:clear
```

### Acceder a la base de datos MySQL
```bash
docker-compose exec mysql mysql -u angax_user -p angax
```

O desde fuera del contenedor:
```bash
mysql -h localhost -P 3307 -u angax_user -p angax
```

## 🔧 Solución de Problemas

### El backend no se conecta a MySQL
- Verifica que el contenedor de MySQL esté saludable: `docker-compose ps`
- Revisa los logs: `docker-compose logs mysql`
- Asegúrate de que las variables de entorno en `docker-compose.yml` coincidan

### El frontend no se conecta al backend
- Verifica que `VITE_API_BASE_URL` en el Dockerfile del frontend sea `http://localhost:8000/api`
- Si estás usando Docker en Windows/Mac, puede que necesites usar `host.docker.internal` en lugar de `localhost`

### Error de permisos en storage
```bash
docker-compose exec backend chmod -R 775 storage bootstrap/cache
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
```

### Limpiar todo y empezar de nuevo
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📁 Estructura de Archivos Docker

```
AngaX/
├── docker-compose.yml          # Orquestación de servicios
├── cliente/
│   ├── Dockerfile              # Imagen del frontend
│   ├── nginx.conf              # Configuración de Nginx para frontend
│   └── .dockerignore
└── servidor/
    ├── Dockerfile              # Imagen del backend
    ├── docker/
    │   ├── entrypoint.sh       # Script de inicio
    │   ├── nginx.conf          # Configuración de Nginx para backend
    │   ├── php-fpm.conf        # Configuración de PHP-FPM
    │   └── supervisord.conf    # Configuración de Supervisor
    └── .dockerignore
```

## 🔐 Variables de Entorno Importantes

### Backend (.env en servidor/)
- `DB_HOST=mysql` (nombre del servicio en docker-compose)
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `APP_KEY` (se genera automáticamente)

### Frontend (build-time)
- `VITE_API_BASE_URL` (se pasa como ARG en el Dockerfile)

## 📊 Puertos

- **3000**: Frontend (React)
- **8000**: Backend (Laravel API)
- **3307**: MySQL (Base de datos) - Puerto 3307 para evitar conflictos con XAMPP

## 🎯 Próximos Pasos

1. Accede a http://localhost:3000
2. Registra un nuevo usuario
3. ¡Disfruta de AngaX!

## ⚠️ Notas Importantes

- Los datos de la base de datos se persisten en el volumen `mysql_data`
- Los archivos subidos se guardan en `backend_storage`
- Si cambias el código, necesitas reconstruir: `docker-compose up -d --build`

