from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from .jwt_service import jwt_service
from ..database.connection import get_db
from ..models.database import Usuario

# Esquema de seguridad para Bearer tokens
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Usuario:
    """Extrae y valida el usuario actual desde el token JWT y retorna el objeto Usuario"""
    token = credentials.credentials
    payload = jwt_service.verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Obtener el usuario de la base de datos
    username = payload.get("sub")
    user = db.query(Usuario).filter(Usuario.username == username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario desactivado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

def require_admin(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    """Valida que el usuario actual tenga rol de administrador"""
    if current_user.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador"
        )
    
    return current_user

def optional_auth(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))) -> Optional[dict]:
    """Autenticación opcional que no genera error si no hay token presente"""
    if credentials is None:
        return None
        
    token = credentials.credentials
    payload = jwt_service.verify_token(token)
    
    return payload