# MallkiTrace API

FastAPI backend for agricultural traceability system with IoT monitoring capabilities.

## Architecture

- **FastAPI**: Modern Python web framework with automatic API documentation
- **PostgreSQL**: AWS RDS database for users and crops management
- **JWT Authentication**: Secure token-based authentication system
- **SQLAlchemy**: ORM for database operations
- **Docker**: Containerized deployment with Redis cache
- **Terraform**: Infrastructure as Code for AWS resources provisioning
- **Pydantic**: Data validation and serialization

## Quick Start

### Prerequisites

- Docker and Docker Compose
- AWS RDS PostgreSQL configured
- Environment variables configured in `.env`
- **For production**: AWS CLI configured and Terraform installed

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

### Production Infrastructure Setup

**Using Terraform for AWS infrastructure provisioning:**

1. **Navigate to Terraform directory:**
   ```bash
   cd infra/terraform
   ```

2. **Initialize Terraform:**
   ```bash
   terraform init
   ```

3. **Plan infrastructure changes:**
   ```bash
   terraform plan
   ```

4. **Apply infrastructure:**
   ```bash
   terraform apply
   ```

5. **Configure environment with Terraform outputs:**
   ```bash
   # Terraform will output RDS endpoint and other resources
   terraform output rds_endpoint
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

## Infrastructure Management

### Terraform Configuration (`infra/terraform/`)

The project includes Infrastructure as Code configuration for AWS resources:

```
infra/terraform/
├── envs/                   # Environment-specific configurations
│   └── dev/               # Development environment
├── modules/               # Reusable Terraform modules
│   ├── api/              # API infrastructure module
│   ├── cache/            # Redis cache module
│   ├── db/               # Database module
│   └── network/          # VPC and networking module
├── main.tf               # Main Terraform configuration
├── variables.tf          # Input variables
└── outputs.tf           # Output values
```

### AWS Resources Managed by Terraform

- **RDS PostgreSQL**: Database instance with backup and monitoring
- **VPC & Networking**: Private subnets and security groups
- **IAM Roles**: Service roles and permissions
- **Security Groups**: Firewall rules for database access
- **ElastiCache Redis**: Cache layer for sessions
- **CloudWatch**: Logging and monitoring
- **Application Load Balancer**: Traffic distribution
- **ECS/Fargate**: Container orchestration (optional)

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
# Database Configuration (AWS RDS - Managed by Terraform)
POSTGRES_HOST=your-rds-endpoint.amazonaws.com  # From terraform output
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database

# JWT Configuration  
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Settings
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# AWS Configuration (for Terraform)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
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

infra/
├── terraform/               # Infrastructure as Code
│   ├── envs/               # Environment-specific configs
│   │   └── dev/           # Development environment
│   ├── modules/           # Reusable Terraform modules
│   │   ├── api/          # API infrastructure
│   │   ├── cache/        # Redis cache
│   │   ├── db/           # Database module
│   │   └── network/      # VPC and networking
│   ├── main.tf           # Main Terraform configuration
│   └── variables.tf      # Configuration variables
├── docker-compose.yml     # Development containers
└── scripts/              # Deployment scripts
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
### Development Environment
- **API Container**: FastAPI application (Port 8000)
- **Redis Container**: Cache and session storage (Port 6379)  
- **Database**: AWS RDS PostgreSQL (External)

### Production Deployment Workflow

1. **Infrastructure Provisioning:**
   ```bash
   cd infra/terraform/envs/dev  # or prod
   terraform init
   terraform plan
   terraform apply
   ```

2. **Environment Configuration:**
   ```bash
   # Update .env with Terraform outputs
   export POSTGRES_HOST=$(terraform output -raw rds_endpoint)
   export REDIS_ENDPOINT=$(terraform output -raw redis_endpoint)
   ```

3. **Application Deployment:**
   ```bash
   # Deploy containers to production
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Database Initialization:**
   ```bash
   python api/database/init_db.py
   ```

### Production Checklist
- [ ] **Terraform infrastructure**: RDS, VPC, Security Groups, ElastiCache created
- [ ] Update JWT_SECRET_KEY in production
- [ ] Configure AWS RDS security groups via Terraform
- [ ] Set appropriate CORS origins
- [ ] Enable SSL/HTTPS with ALB
- [ ] Configure log aggregation with CloudWatch
- [ ] Set up monitoring and alerts via Terraform
- [ ] **Backup strategy**: RDS automated backups enabled
- [ ] **Security**: VPC endpoints and private subnets configured

## Development Commands

```bash
# View logs
docker-compose -f infra/docker-compose.yml logs -f api

# Rebuild containers  
docker-compose -f infra/docker-compose.yml build --no-cache

# Stop all services
docker-compose -f infra/docker-compose.yml down

# Infrastructure Management
cd infra/terraform/envs/dev          # Navigate to environment
terraform init                       # Initialize Terraform
terraform plan                       # Review changes
terraform apply                      # Apply infrastructure changes
terraform destroy                    # Destroy infrastructure (careful!)
terraform output                     # Show resource outputs

# Database operations
python api/database/init_db.py       # Initialize database schema
```

## Security Features

- **JWT Authentication**: Secure token-based auth with configurable expiration
- **Password Hashing**: Bcrypt for secure password storage
- **Role-based Access**: Admin, agricultor, comprador roles
- **CORS Configuration**: Configurable cross-origin resource sharing
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries
- **AWS Security**: VPC, Security Groups, and IAM managed by Terraform
- **Infrastructure Security**: Network isolation and encrypted databases
- **Load Balancer**: SSL termination and traffic distribution

---

**Version**: 1.0.0  
**Technology Stack**: FastAPI + PostgreSQL + JWT + Docker + Terraform  
**License**: Proprietary - MallkiTrace Project
