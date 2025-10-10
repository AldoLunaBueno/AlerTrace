#!/bin/bash

# Script de configuración para SachaTrace Frontend
echo "🚀 Configurando SachaTrace Frontend con pnpm..."

# Verificar si pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm no está instalado. Instalando..."
    npm install -g pnpm@8.15.0
else
    echo "✅ pnpm ya está instalado"
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js 18 o superior. Versión actual: $(node -v)"
    exit 1
else
    echo "✅ Node.js versión: $(node -v)"
fi

# Instalar dependencias
echo "📦 Instalando dependencias con pnpm..."
pnpm install

# Configurar variables de entorno si no existen
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creando archivo de configuración..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Environment
NODE_ENV=development
EOF
    echo "✅ Archivo .env.local creado"
else
    echo "✅ Archivo .env.local ya existe"
fi

# Verificar configuración
echo "🔍 Verificando configuración..."
pnpm type-check

if [ $? -eq 0 ]; then
    echo "✅ Configuración verificada correctamente"
    echo ""
    echo "🎉 ¡Configuración completada!"
    echo ""
    echo "Para iniciar el servidor de desarrollo:"
    echo "  pnpm dev"
    echo ""
    echo "Para hacer build:"
    echo "  pnpm build"
    echo ""
    echo "Para más comandos:"
    echo "  pnpm run --help"
else
    echo "❌ Error en la verificación de tipos"
    exit 1
fi
