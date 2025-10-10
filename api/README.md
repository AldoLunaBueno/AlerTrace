# SachaTrace API

A FastAPI backend for IoT agricultural monitoring focused on key environmental parameters. Collects sensor data for temperature, air humidity, soil humidity, pH, and solar radiation with automated alert system.

## Quick Start

```bash
# Start with Docker
cd ../infra && docker-compose up -d

# Or run locally
pip install -r requirements.txt
python database/init_db.py
python -m app.main
```

## IoT Sensor System

Monitors 5 critical agricultural parameters:
- **Temperature** (°C) - Air temperature monitoring
- **Air Humidity** (%) - Atmospheric moisture levels  
- **Soil Humidity** (%) - Ground moisture content
- **pH Level** - Soil acidity/alkalinity
- **Solar Radiation** (W/m²) - Light intensity measurement

### Key Features
- Real-time sensor data ingestion
- Configurable alert thresholds
- Automated notifications when values exceed limits
- Historical data analytics and reporting
- Multi-sensor farm management

## API Endpoints

### Sensor Data
- `POST /sensores/data` - Receive IoT sensor readings (using device_id)
- `GET /sensores/{id_sensor}/lecturas` - Historical sensor data (using database ID)
- `POST /sensores/umbrales` - Configure alert thresholds
- `POST /sensores/` - Register new IoT sensor
- `GET /sensores/` - List user's sensors

### Authentication
- `POST /auth/login` - User authentication
- `GET /auth/me` - Current user profile

### Dashboard
- `GET /dashboard/stats` - Real-time monitoring stats
- `GET /dashboard/alerts` - Active alert summary

**Documentation:** http://localhost:8000/docs

## IoT Data Format

### Sensor Data Input (POST /sensores/data)
```json
{
  "device_id": "TEMP_001",
  "temperatura": 25.5,
  "humedad_aire": 65.2,
  "humedad_suelo": 45.8,
  "ph_suelo": 6.5,
  "radiacion_solar": 850.0,
  "timestamp": "2025-09-25T10:30:00Z"
}
```

### Sensor Registration (POST /sensores/)
```json
{
  "device_id": "TEMP_001",
  "nombre": "Sensor Temperatura Principal",
  "tipo": "multisensor",
  "id_cultivo": 1,
  "ubicacion_sensor": "Zona Norte",
  "intervalo_lectura": 300
}
```

## Configuration

Uses `.env.minimal` for simplified setup:

```env
# Database (AWS RDS)
POSTGRES_HOST=your-rds-endpoint.amazonaws.com
POSTGRES_DB=sachaitrace
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# JWT Security
JWT_SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256

# Environment
ENVIRONMENT=development
```

## Tech Stack

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - AWS RDS database
- **SQLAlchemy** - Database ORM
- **Pydantic v2** - Data validation
- **JWT** - Authentication
- **Docker** - Containerization

## Structure

```
api/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── models/              # Database models
│   ├── routes/              # API endpoints
│   │   ├── sensores.py      # IoT sensor routes
│   │   ├── auth.py          # Authentication
│   │   └── dashboard.py     # Monitoring dashboard
│   └── services/            # Business logic
├── database/init_db.py      # DB initialization
└── .env.minimal             # Configuration
```

## Security

- JWT token authentication
- Role-based access control
- Environment-based configuration
- SQL injection protection via ORM
- CORS configuration

---

**Version**: 2.0.0 - IoT  
**Stack**: FastAPI + PostgreSQL + JWT