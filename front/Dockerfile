# Imagen base ligera de Node
FROM node:20-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copiar archivos de configuración de pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instalar dependencias usando pnpm
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Variables de entorno para Next.js
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

# Exponemos el puerto
EXPOSE 8080

# Iniciamos en modo desarrollo
CMD ["pnpm", "dev"]
