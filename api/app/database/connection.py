from sqlalchemy.orm import Session
from ..models.database import SessionLocal

def get_db() -> Session:
    """Dependency para obtener sesiones de base de datos con cleanup automático"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()