from typing import Generator
from sqlalchemy.orm import Session
from ..models.database import SessionLocal

def get_db() -> Generator[Session, None, None]:
    """Dependency to get database sessions with automatic cleanup"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()