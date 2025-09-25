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
- `POST /sensores/data` - Receive IoT sensor readings
- `GET /sensores/{id}/lecturas` - Historical sensor data
- `POST /sensores/umbrales` - Configure alert thresholds

### Authentication
- `POST /auth/login` - User authentication
- `GET /auth/me` - Current user profile

### Dashboard
- `GET /dashboard/stats` - Real-time monitoring stats
- `GET /dashboard/alerts` - Active alert summary

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