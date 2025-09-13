# SachaTrace API

API backend para sistema IoT de monitoreo agrícola especializado en cultivos de cacao, sacha inchi y café.

## Arquitectura

- **FastAPI**: Framework web moderno y rápido
- **PostgreSQL**: Base de datos principal (usuarios, agricultores, sensores)
- **Amazon Timestream**: Base de datos temporal para datos de sensores IoT
- **SQLAlchemy**: ORM para manejo de base de datos

## 🚀 Desarrollo Local

### Prerrequisitos

```bash
# Python 3.9+
python --version

# PostgreSQL corriendo
psql --version
```

### Configuración

1. **Configurar entorno:**
   ```bash
   # Desde la raíz del proyecto
   ./scripts/set_environment.sh development
   ```

2. **Instalar dependencias:**
   ```bash
   cd api
   pip install -r requirements.txt
   ```

3. **Configurar base de datos:**
   ```bash
   # Crear base de datos
   createdb sachatrace_dev
   
   # Aplicar migraciones
   python database/migrate.py
   ```

4. **Ejecutar API:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## 📁 Estructura del Proyecto

```
api/
├── app/
│   ├── config.py           # Configuración centralizada
│   ├── main.py            # Aplicación FastAPI principal
│   ├── models/            # Modelos de SQLAlchemy
│   │   └── database.py    # Definiciones de tablas
│   └── routers/           # Endpoints organizados por módulo
├── database/
│   ├── migrate.py         # Script de migraciones
│   └── migrations/        # Archivos SQL de migración
│       └── 001_init.sql   # Schema inicial
├── Dockerfile             # Imagen de contenedor
└── requirements.txt       # Dependencias Python
```

## 🔧 API Endpoints

### Endpoints Principales

- `GET /` - Información de la API
- `GET /health` - Estado de salud de la API
- `POST /sensor/data` - Recibir datos de sensores IoT
- `GET /sensor/latest` - Obtener últimos datos de sensores

### Documentación Automática

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🌍 Entornos

| Entorno | Base de Datos | Debug | Descripción |
|---------|---------------|-------|-------------|
| development | Local PostgreSQL | ✅ | Desarrollo local |
| staging | Staging DB | ❌ | Testing pre-producción |
| production | AWS RDS | ❌ | Producción |

```bash
# Cambiar entre entornos
./scripts/set_environment.sh [development|staging|production]
```

## 🔒 Variables de Entorno

Ver archivos `.env.development`, `.env.staging`, `.env.production` para configuraciones específicas.

### Variables Principales

```bash
POSTGRES_HOST=localhost
POSTGRES_DB=sachatrace_dev
TIMESTREAM_DATABASE=SensorDataDev
JWT_SECRET_KEY=tu-clave-secreta
```

## 🐳 Docker

```bash
# Construir imagen
docker build -t sachatrace-api .

# Ejecutar contenedor
docker run -p 8000:8000 --env-file .env sachatrace-api
```

## Datos de Prueba

Para desarrollo local, el sistema incluye datos de ejemplo:
- Organizaciones cooperativas
- Usuario administrador
- Estructura base de agricultores y sensores

## 🧪 Testing

```bash
# Ejecutar tests (cuando se implementen)
pytest

# Coverage
pytest --cov=app
```

## 📝 Logging

Los logs se configuran según el entorno:
- **Development**: DEBUG level, salida a consola
- **Staging**: INFO level
- **Production**: WARNING level

## 🚀 Deployment

El deployment se realiza usando:
- **Docker containers** en AWS ECS/Fargate
- **AWS RDS** para PostgreSQL
- **Amazon Timestream** para datos de sensores
- **Application Load Balancer** para tráfico HTTP

---

**Versión**: 1.0.0  
**Licencia**: Propietaria - SachaTrace Project
