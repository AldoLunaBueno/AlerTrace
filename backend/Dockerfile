# Build stage
FROM python:3.11-slim as builder

WORKDIR /app

# Instalar dependencias del sistema necesarias para compilación
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias Python en ambiente virtual
COPY requirements.txt ./
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt


# Production stage
FROM python:3.11-slim

# Instalar solo runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root para seguridad
RUN useradd -m -u 1000 appuser

WORKDIR /app

# Copiar venv desde builder
COPY --from=builder /opt/venv /opt/venv

# Copiar código de la aplicación
COPY --chown=appuser:appuser api/ ./api/
COPY --chown=appuser:appuser database/ ./database/

# Cambiar a usuario no-root
USER appuser

# Configurar PATH para usar venv
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Exponer puerto
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Usar variable de entorno PORT de Railway
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips", "*"]