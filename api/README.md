# MallkiTrace API

FastAPI backend for agricultural traceability system with IoT monitoring capabilities.

## Architecture

- **FastAPI**: Modern Python web framework with automatic API documentation
- **PostgreSQL**: AWS RDS database for users and crops management
- **JWT Authentication**: Secure token-based authentication system
- **SQLAlchemy**: ORM for database operations
- **Docker**: Containerized deployment with Redis cache
- **Pydantic**: Data validation and serialization

## Quick Start

### Prerequisites

- Docker and Docker Compose
- AWS RDS PostgreSQL configured
- Environment variables configured in `.env`

### Development Setup

1. **Clone and navigate to project:**
   ```bash
   git clone <repository>
   cd SachaTrace/infra
   ```

2. **Start services:**
   ```bash
   docker-compose up -d
   ```

3. **Verify API is running:**
   ```bash
   curl http://localhost:8000/health
   ```

### Authentication Testing

```bash
# Login as admin
curl -X POST "http://localhost:8000/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"secret"}'

# Use the returned token to access protected endpoints
curl -X GET "http://localhost:8000/api/v1/cultivos" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Database Schema

### Users Table (`usuarios`)
- `id_usuario` - Primary key
- `username` - Unique username  
- `nombre` - Full name
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `rol` - Role: admin, agricultor, comprador
- `activo` - Active status
- `fecha_registro` - Registration timestamp

### Crops Table (`cultivos`)  
- `id_cultivo` - Primary key
- `id_usuario` - Foreign key to usuarios
- `tipo_cultivo` - Crop type (Café, Cacao, etc.)
- `variedad` - Crop variety
- `hectareas` - Hectares amount
- `fecha_siembra` - Planting date
- `fecha_estimada_cosecha` - Estimated harvest date
- `estado` - Current status
- `ubicacion_especifica` - Specific location
- `coordenadas_lat/lng` - GPS coordinates

## API Endpoints

### Public Endpoints
- `GET /` - API information and status
- `GET /health` - Health check for monitoring
- `GET /info` - Detailed application information

### Authentication  
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/auth/me` - Current user information

### Protected Endpoints (Require JWT)
- `GET /api/v1/cultivos` - Get user's crops
- `GET /api/v1/protected` - Protected endpoint example

### IoT Sensors (Future)
- `POST /api/v1/sensor/data` - Receive sensor data
- `GET /api/v1/sensor/{id}/status` - Sensor status
- `GET /api/v1/sensors` - List all sensors

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Configuration

The application uses environment variables loaded from `.env` file:

```env
# Database Configuration (AWS RDS)
POSTGRES_HOST=your-rds-endpoint.amazonaws.com
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database

# JWT Configuration  
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Settings
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO
```

## Project Structure

```
api/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── auth/                # Authentication system
│   │   ├── jwt_service.py   # JWT token handling
│   │   └── dependencies.py  # Auth dependencies
│   ├── models/              # Database models
│   │   └── database.py      # SQLAlchemy models
│   ├── services/            # Business logic services  
│   │   └── user_service.py  # User management
│   └── database/            # Database utilities
│       └── connection.py    # Database connection
├── database/
│   └── init_db.py           # Database initialization script
├── Dockerfile               # Container configuration
└── requirements.txt         # Python dependencies
```

## Default Test Users

The system comes with pre-configured test users:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | secret | admin | System administrator |
| agricultor1 | secret | agricultor | Farmer with sample crops |
| comprador1 | secret | comprador | Buyer account |

## Deployment

### Docker Services
- **API Container**: FastAPI application (Port 8000)
- **Redis Container**: Cache and session storage (Port 6379)  
- **Database**: AWS RDS PostgreSQL (External)

### Production Checklist
- [ ] Update JWT_SECRET_KEY in production
- [ ] Configure AWS RDS security groups
- [ ] Set appropriate CORS origins
- [ ] Enable SSL/HTTPS
- [ ] Configure log aggregation
- [ ] Set up monitoring and alerts

## Development Commands

```bash
# View logs
docker-compose -f infra/docker-compose.yml logs -f api

# Rebuild containers  
docker-compose -f infra/docker-compose.yml build --no-cache

# Stop all services
docker-compose -f infra/docker-compose.yml down

# Run database initialization
python api/database/init_db.py
```

## Security Features

- **JWT Authentication**: Secure token-based auth with configurable expiration
- **Password Hashing**: Bcrypt for secure password storage
- **Role-based Access**: Admin, agricultor, comprador roles
- **CORS Configuration**: Configurable cross-origin resource sharing
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries

---

**Version**: 1.0.0  
**Technology Stack**: FastAPI + PostgreSQL + JWT + Docker  
**License**: Proprietary - MallkiTrace Project
