# Build stage - Imagen ligera
FROM node:20-alpine as builder

# Instalar pnpm
RUN npm install -g pnpm@8.15.0

WORKDIR /app

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build de Next.js
RUN pnpm build


# Production stage - Imagen optimizada
FROM node:20-alpine

# Instalar pnpm
RUN npm install -g pnpm@8.15.0

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

# Copiar package.json y node_modules desde builder
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copiar build artifacts desde builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Cambiar a usuario no-root
USER nextjs

# Variables de entorno
ENV PORT=8080 \
    HOSTNAME=0.0.0.0 \
    NODE_ENV=production

# Exponer puerto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Comando para iniciar la aplicación
CMD ["pnpm", "start"]
