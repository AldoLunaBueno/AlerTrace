import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    """Configuración de la aplicación utilizando variables de entorno"""
    # Configuración general
    app_name: str = "MallkiTrace API"
    app_version: str = "1.0.0"
    environment: str = os.getenv("ENVIRONMENT", "default")
    debug: bool = False
    
    # Base de datos PostgreSQL
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_user: str = "postgres"
    postgres_password: str = ""
    postgres_db: str = "postgres"
    
    # JWT Configuration
    jwt_secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    
    # Logging
    log_level: str = "INFO"
    
    # API Keys y servicios externos
    sensor_api_key: Optional[str] = None
    
    @property
    def postgres_url(self) -> str:
        """Genera la URL de conexión a PostgreSQL"""
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

def get_settings() -> Settings:
    """Factory function para obtener la configuración de la aplicación"""
    return Settings()

# Instancia global de configuración
settings = get_settings()
