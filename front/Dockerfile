# Imagen base ligera de Node
FROM node:20-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copiar archivos de configuración de pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instalar dependencias usando pnpm
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .

# Exponemos el puerto
EXPOSE 8080

# Iniciamos en modo desarrollo
CMD ["pnpm", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
