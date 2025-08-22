# Etapa 1: Instalar dependencias y preparar código
FROM python:3.9-slim AS builder

# Instalar dependencias del sistema necesarias para compilar
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

COPY . .

# Etapa 2: Imagen optimizada
FROM python:3.9-slim AS deploy

# Copiar dependencias instaladas desde builder
COPY --from=builder /root/.local /home/app/.local

# Copiar código de aplicación
COPY --from=builder /app /home/app/

# Configurar PATH para que encuentre los paquetes instalados
ENV PATH=/home/app/.local/bin:$PATH

# Cambiar al usuario no-root
USER app
WORKDIR /home/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]