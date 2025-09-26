"""
Router de autenticación
Contiene endpoints relacionados con login y verificación de tokens
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..database.connection import get_db
from ..models.database import Trabajador
from ..models.schemas import LoginRequest, LoginResponse, UserInfo
from ..auth.jwt_service import jwt_service
from ..auth.dependencies import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

security = HTTPBearer()


def verify_password(stored_password: str, provided_password: str) -> bool:
    """Verificar password hasheado"""
    return jwt_service.verify_password(provided_password, stored_password)


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Endpoint de login para obtener token JWT - Use DNI as username"""
    user = db.query(Trabajador).filter(Trabajador.dni == request.username).first()
    
    if not user or not verify_password(user.password_hash, request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario desactivado"
        )
    
    # Crear token
    access_token = jwt_service.create_access_token(data={"sub": user.dni, "user_id": str(user.id_trabajador)})
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=str(user.id_trabajador),
        username=user.dni
    )


@router.get("/me", response_model=UserInfo)
def get_current_user_info(current_user: Trabajador = Depends(get_current_user)):
    """Obtener información del usuario actual"""
    return UserInfo(
        user_id=str(current_user.id_trabajador),
        username=current_user.dni,
        role=current_user.rol
    )


@router.post("/verify-token")
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verificar si un token es válido"""
    try:
        token = credentials.credentials
        payload = jwt_service.verify_token(token)
        if payload:
            return {"valid": True, "username": payload.get("sub")}
        else:
            return {"valid": False}
    except:
        return {"valid": False}