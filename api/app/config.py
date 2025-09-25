import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    """Configuración de la aplicación utilizando variables de entorno"""
    # Configuración general
    app_name: str = "SachaTrace API"
    app_version: str = "1.0.0"
    environment: str = "production"
    debug: bool = False
    log_level: str = "INFO"
    
    # Base de datos PostgreSQL - Solo las que necesitamos
    postgres_host: str
    postgres_port: int
    postgres_user: str
    postgres_password: str
    postgres_db: str
    
    # JWT Configuration - Solo las que necesitamos
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    
    @property
    def database_url(self) -> str:
        """Construye la URL de conexión a AWS RDS PostgreSQL"""
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
    
    model_config = {
        "env_file": ".env.minimal",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore"  # Ignorar variables extra del .env
    }

def get_settings() -> Settings:
    """Factory function para obtener la configuración de la aplicación"""
    return Settings()

# Instancia global de configuración
settings = get_settings()
