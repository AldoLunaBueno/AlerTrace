from typing import Generator
from sqlalchemy.orm import Session
from database.models.database import SessionLocal

def get_db() -> Generator[Session, None, None]:
    """Obtener sesiones de la base de datos"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()