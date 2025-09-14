#!/bin/bash
cd "$(dirname "$0")"

# Verificar si existe .env
if [ ! -f ../.env ]; then
    echo "Error: Archivo .env no encontrado"
    echo "Crea el archivo .env con tu configuración de AWS RDS"
    exit 1
fi

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "Error: Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose no está instalado"
    exit 1
fi

# Verificar que el .env tenga la configuración de AWS RDS
if ! grep -q "POSTGRES_HOST.*rds" ../.env; then
    echo "Advertencia: Verifica que POSTGRES_HOST apunte a tu RDS endpoint"
fi

echo "Iniciando API con Docker conectando a AWS RDS..."
echo "Construyendo y levantando servicios..."

# Solo levantar Redis y API (sin PostgreSQL local)
docker-compose up --build redis api