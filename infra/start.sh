#!/bin/bash

# Change to the directory where this script is located
cd "$(dirname "$0")"

echo "Iniciando SachaTrace - Sistema de Trazabilidad Agrícola"

# Verificar si existe .env
if [ ! -f ../.env ]; then
    echo "Creando archivo .env desde .env.example..."
    cp ../.env.example ../.env
    echo "IMPORTANTE: Edita el archivo .env con tus configuraciones"
    echo ""
fi

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "Docker no está instalado. Por favor instala Docker primero."
    echo "   Visita: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    echo "   Visita: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "Construyendo y levantando servicios..."
echo ""

# Levantar PostgreSQL primero
echo "Iniciando base de datos PostgreSQL..."
docker-compose up -d postgres

# Esperar a que PostgreSQL esté listo
echo "Esperando que PostgreSQL esté listo..."
timeout=60
counter=0
until docker-compose exec postgres pg_isready -U postgres -q; do
    if [ $counter -eq $timeout ]; then
        echo "Timeout esperando PostgreSQL"
        exit 1
    fi
    sleep 2
    counter=$((counter + 2))
    echo "   ... esperando ($counter/${timeout}s)"
done
echo "PostgreSQL está listo!"

# Levantar Redis
echo "Iniciando Redis..."
docker-compose up -d redis
sleep 3
echo "Redis iniciado!"

# Construir y levantar la API
echo "Construyendo y levantando API..."
docker-compose up -d --build api

# Verificar que la API esté funcionando
echo "Esperando que la API esté lista..."
timeout=60
counter=0
until curl -s http://localhost:8000/health > /dev/null 2>&1; do
    if [ $counter -eq $timeout ]; then
        echo "Timeout esperando API"
        echo "Verifica los logs con: docker-compose logs api"
        exit 1
    fi
    sleep 3
    counter=$((counter + 3))
    echo "   ... esperando API ($counter/${timeout}s)"
done

echo ""
echo "SachaTrace está funcionando!"
echo "API: http://localhost:8000"
echo "Documentación: http://localhost:8000/docs"
echo "Health Check: http://localhost:8000/health"
echo "Información: http://localhost:8000/info"
echo ""
echo "Servicios disponibles:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
echo "Comandos útiles:"
echo "   - Ver logs: docker-compose logs -f api"
echo "   - Detener: docker-compose down"
echo "   - Reiniciar: docker-compose restart api"
echo ""

# Mostrar el estado de los servicios
echo "Estado de los servicios:"
docker-compose ps

echo ""
echo "Listo para desarrollar!"