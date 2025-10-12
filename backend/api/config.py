import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    """Configuración de la aplicación usando variables de entorno"""
    app_name: str = "SachaTrace API"
    app_version: str = "1.0.0"
    environment: str = "production"
    debug: bool = False
    log_level: str = "INFO"
    
    postgres_host: str
    postgres_port: int
    postgres_user: str
    postgres_password: str
    postgres_db: str
    
    # Configuración JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    
    @property
    def database_url(self) -> str:
        """Construir URL de conexión a PostgreSQL con SSL para Supabase"""
        base_url = f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        return f"{base_url}?sslmode=require&target_session_attrs=read-write"
    
    model_config = {
        "env_file": [
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),  # .env raíz
            ".env"  # Fallback a .env local
        ],
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore"  # Ignorar variables extra del .env
    }

def get_settings() -> Settings:
    """Factory para obtener la configuración de la aplicación"""
    return Settings()

# Instancia global de configuración
settings = get_settings()
