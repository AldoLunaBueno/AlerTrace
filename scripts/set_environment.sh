#!/bin/bash

# Script para cambiar entre entornos

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
    echo "Uso: ./scripts/set_environment.sh [development|staging|production]"
    echo "Entornos disponibles:"
    echo "  - development: Para desarrollo local"
    echo "  - staging: Para pruebas pre-producción"
    echo "  - production: Para producción"
    exit 1
fi

case $ENVIRONMENT in
    "development"|"dev")
        echo "Configurando entorno de DESARROLLO..."
        cp .env.development .env
        echo "Entorno configurado para desarrollo"
        echo "Base de datos: localhost:5432"
        echo "Debug: activado"
        ;;
    "staging"|"stage")
        echo "Configurando entorno de STAGING..."
        cp .env.staging .env
        echo "Entorno configurado para staging"
        echo "Base de datos: staging"
        echo "Debug: desactivado"
        ;;
    "production"|"prod")
        echo "Configurando entorno de PRODUCCIÓN..."
        cp .env.production .env
        echo "Entorno configurado para producción"
        echo "Base de datos: RDS Producción"
        echo "Debug: desactivado"
        echo "CUIDADO: Estás en producción!"
        ;;
    *)
        echo "Entorno '$ENVIRONMENT' no reconocido"
        echo "Entornos válidos: development, staging, production"
        exit 1
        ;;
esac

echo ""
echo "Para aplicar los cambios, reinicia tu aplicación:"
echo "  uvicorn app.main:app --reload"