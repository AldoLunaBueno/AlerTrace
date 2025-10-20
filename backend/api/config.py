import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Configuración centralizada de la aplicación que carga variables de entorno.
    """
    app_name: str = "Alertrace API"
    app_version: str = "2.1.0"
    environment: str = "production"
    
    # --- Credenciales para la conexión directa a la Base de Datos PostgreSQL ---
    postgres_host: str
    postgres_port: int
    postgres_user: str
    postgres_password: str
    postgres_db: str
    
    # --- Credenciales para los servicios de la API de Supabase (Autenticación) ---
    supabase_url: str
    supabase_key: str

    # --- Configuración JWT (manejada por Supabase, pero útil tenerla si es necesario) ---
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    @property
    def database_url(self) -> str:
        """
        Construye la URL de conexión a PostgreSQL.
        """
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"

    class Config:
        # Busca el archivo .env en la raíz del proyecto
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
        env_file_encoding = "utf-8"
        extra = "ignore" # Ignora variables extra en el .env que no estén definidas aquí

# Instancia global de la configuración para ser usada en toda la aplicación
settings = Settings()