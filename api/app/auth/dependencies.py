from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from .jwt_service import jwt_service
from ..database.connection import get_db
from ..models.database import Trabajador

# Security scheme for Bearer tokens
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Trabajador:
    """Extract and validate current user from JWT token and return User object"""
    token = credentials.credentials
    payload = jwt_service.verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    dni = payload.get("sub")
    user = db.query(Trabajador).filter(Trabajador.dni == dni).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User deactivated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

def require_admin(current_user: Trabajador = Depends(get_current_user)) -> Trabajador:
    """Validate that current user has admin role"""
    if current_user.dni != "12345678":  # Temporary admin check by DNI
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator permissions required"
        )
    
    return current_user

def optional_auth(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))) -> Optional[dict]:
    """Optional authentication that doesn't raise error if no token present"""
    if credentials is None:
        return None
        
    token = credentials.credentials
    payload = jwt_service.verify_token(token)
    
    return payload