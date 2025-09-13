#!/bin/bash

# Change to the directory where this script is located
cd "$(dirname "$0")"

echo "Iniciando SachaTrace en modo desarrollo local"

# Verificar si existe .env
if [ ! -f ../.env ]; then
    echo "Creando archivo .env desde .env.example..."
    cp ../.env.example ../.env
    echo "IMPORTANTE: Edita el archivo .env con tus configuraciones"
    echo ""
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "Python 3 no está instalado."
    exit 1
fi

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "Instalando dependencias..."
cd ../api
pip install -r requirements.txt

# Verificar base de datos
echo "Verificando PostgreSQL..."
if ! pg_isready -h localhost -p 5432 -U postgres &> /dev/null; then
    echo "PostgreSQL no está corriendo o no es accesible."
    echo "Opciones:"
    echo "1. Ejecuta: docker run --name postgres-dev -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres"
    echo "2. O usa el entorno completo: ./start.sh"
    exit 1
fi

# Cambiar al directorio de la API
cd ../api

# Instalar dependencias
echo "Instalando dependencias..."
pip install -r requirements.txt

# Ejecutar migraciones
echo "Ejecutando migraciones..."
python database/migrate.py

# Iniciar servidor
echo "Iniciando servidor de desarrollo..."

echo ""
echo "🚀 Iniciando servidor de desarrollo..."
echo "   URL: http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo ""
echo "   Presiona Ctrl+C para detener"
echo ""

# Iniciar la aplicación
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload