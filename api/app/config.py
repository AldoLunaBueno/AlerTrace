import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    # Configuración general
    app_name: str = "MallkiTrace API"
    app_version: str = "1.0.0"
    # ENVIRONMENT solo informativo; no cambia archivos ni plantillas
    environment: str = os.getenv("ENVIRONMENT", "default")
    debug: bool = False
    
    # Base de datos PostgreSQL (RDS)
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = "postgres"
    postgres_password: str = ""
    postgres_db: str = "postgres"
    
    # Amazon Timestream (para datos de sensores)
    aws_region: str = "us-east-1"
    timestream_database: str = "SensorData"
    timestream_table: str = "Measurements"
    
    # AWS Credentials (para Timestream)
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    
    # JWT Configuration
    jwt_secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    
    # CORS - será parseado desde string con comas
    cors_origins: List[str] = ["http://localhost:3000"]
    
    # Logging
    log_level: str = "INFO"
    
    # API Keys y servicios externos
    sensor_api_key: Optional[str] = None
    
    # debug ahora se controla solo por la variable DEBUG en .env
    
    @field_validator("cors_origins", mode="before")
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    @property
    def postgres_url(self) -> str:
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

def get_settings() -> Settings:
    return Settings()

# Instancia global de configuración
settings = get_settings()
