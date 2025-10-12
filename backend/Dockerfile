FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y gcc postgresql-client && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias de Python
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copiar código de la aplicación
COPY api/ ./api/
COPY database/ ./database/

# Exponer puerto
EXPOSE 8000

# Usar variable de entorno PORT de Railway
CMD uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips='*'