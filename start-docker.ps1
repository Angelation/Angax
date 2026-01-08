# Script de PowerShell para iniciar Docker en Windows
Write-Host "🐳 Iniciando AngaX con Docker..." -ForegroundColor Cyan

# Verificar que Docker esté ejecutándose
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Docker Desktop no está ejecutándose. Por favor, inicia Docker Desktop primero." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker está ejecutándose" -ForegroundColor Green

# Construir y levantar los contenedores
Write-Host "`n📦 Construyendo imágenes..." -ForegroundColor Yellow
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Contenedores iniciados correctamente!" -ForegroundColor Green
    Write-Host "`n📍 URLs de acceso:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:8000/api" -ForegroundColor White
    Write-Host "   MySQL:    localhost:3306" -ForegroundColor White
    Write-Host "`n📊 Para ver los logs, ejecuta: docker-compose logs -f" -ForegroundColor Yellow
    Write-Host "🛑 Para detener, ejecuta: docker-compose down" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Error al iniciar los contenedores. Revisa los logs con: docker-compose logs" -ForegroundColor Red
    exit 1
}

