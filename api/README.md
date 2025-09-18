# SachaTrace API

FastAPI backend for agricultural monitoring system specialized in cocoa, sacha inchi and coffee crops.

## Architecture Simplified

- **FastAPI**: Modern and fast web framework
- **PostgreSQL**: Single database for all data (users, crops)
- **SQLAlchemy**: ORM for database management
- **JWT Authentication**: Secure user authentication
- **Docker**: Containerized deployment

## Quick Start

### Prerequisites

- Docker and Docker Compose
- PostgreSQL database configured

### Setup

1. **Start services with Docker Compose:**
   ```bash
   cd infra/
   docker-compose up -d
   ```

2. **Initialize database:**
   ```bash
   ./init-simple-db.sh
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:8000
   ```

### Login Test

```bash
# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"secret"}'

# Get user info (replace TOKEN with the returned access_token)
curl -X GET "http://localhost:8000/api/v1/auth/me" \
     -H "Authorization: Bearer TOKEN"
```

## Database Structure

### Tables

**usuarios** - User accounts
- `id_usuario` (PK)
- `username` (unique)
- `nombre`
- `email` (unique)
- `password_hash`
- `rol` (admin, agricultor, comprador)
- `activo`
- `fecha_registro`

**cultivos** - Crops information
- `id_cultivo` (PK)
- `id_usuario` (FK → usuarios)
- `tipo_cultivo`
- `variedad`
- `hectareas`
- `fecha_siembra`
- `fecha_estimada_cosecha`
- `estado`
- `ubicacion_especifica`
- `coordenadas_lat`
- `coordenadas_lng`

### Test Users

- **admin** / secret (Administrator)
- **agricultor1** / secret (Farmer with 2 crops)
- **comprador1** / secret (Buyer)
   JWT_SECRET_KEY=your_jwt_secret
   ```

2. **Start the application:**
   ```bash
   cd infra
   ./start.sh
   ```

3. **Access the API:**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs
   - Health: http://localhost:8000/health

## Project Structure

```
api/
├── app/
│   ├── config.py           # Configuration management
│   ├── main.py            # FastAPI main application
│   ├── models/            # SQLAlchemy models
│   │   └── database.py    # Database definitions
│   └── services/          # Business logic
│       └── timestream.py  # AWS Timestream integration
├── database/
│   ├── migrate.py         # Migration script
│   └── migrations/        # SQL migration files
│       └── 001_init.sql   # Initial schema
├── Dockerfile             # Container image
└── requirements.txt       # Python dependencies
```

## API Endpoints

### Core Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /sensor/data` - Receive IoT sensor data
- `GET /sensor/latest` - Get latest sensor readings

### Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_HOST` | RDS endpoint | `your-db.rds.amazonaws.com` |
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `your_password` |
| `POSTGRES_DB` | Database name | `postgres` |
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `your_secret` |
| `JWT_SECRET_KEY` | JWT signing key | `your_jwt_secret` |
| `TIMESTREAM_DATABASE` | Timestream DB name | `SensorData` |
| `TIMESTREAM_TABLE` | Timestream table | `Measurements` |

## Deployment

The application runs in Docker containers connecting to AWS services:
- **API**: FastAPI in Docker container
- **Database**: AWS RDS PostgreSQL
- **Time-series data**: Amazon Timestream
- **Cache**: Redis (local container)

## Development

### Logs
```bash
docker-compose logs -f api
```

### Database migrations
```bash
python database/migrate.py
```

### Stop services
```bash
docker-compose down
```

---

**Version**: 1.0.0  
**License**: Proprietary - MallkiTrace Project
