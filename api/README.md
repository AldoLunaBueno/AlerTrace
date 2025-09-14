# MallkiTrace API

FastAPI backend for agricultural IoT monitoring system specialized in cocoa, sacha inchi and coffee crops.

## Architecture

- **FastAPI**: Modern and fast web framework
- **AWS RDS PostgreSQL**: Main database (users, farmers, sensors)
- **Amazon Timestream**: Time-series database for IoT sensor data
- **SQLAlchemy**: ORM for database management
- **Docker**: Containerized deployment

## Quick Start

### Prerequisites

- Docker and Docker Compose
- AWS RDS PostgreSQL instance configured
- `.env` file with AWS credentials

### Setup

1. **Configure environment variables:**
   ```bash
   # Create .env file in project root with:
   POSTGRES_HOST=your-rds-endpoint.rds.amazonaws.com
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=postgres
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
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
