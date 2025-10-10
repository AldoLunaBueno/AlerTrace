"""
Router de autenticación
Contiene endpoints relacionados con login y verificación de tokens
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..database.connection import get_db
from ..models.database import Trabajador, Empresa
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
    """Endpoint de login unificado - detecta automáticamente si es trabajador o empresa"""
    
    # Primero intentar buscar como TRABAJADOR
    trabajador = db.query(Trabajador).filter(Trabajador.email == request.username).first()
    
    if not trabajador:
        # Fallback: buscar por DNI para trabajadores
        trabajador = db.query(Trabajador).filter(Trabajador.dni == request.username).first()
    
    # Si encontramos un trabajador, validar credenciales
    if trabajador:
        if not verify_password(trabajador.password_hash, request.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        if not trabajador.activo:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario desactivado"
            )
        
        # Token para TRABAJADOR
        subject = trabajador.email if trabajador.email else trabajador.dni
        access_token = jwt_service.create_access_token(data={
            "sub": subject, 
            "user_id": str(trabajador.id_trabajador),
            "user_type": "trabajador",
            "empresa_id": str(trabajador.id_empresa),
            "rol": trabajador.rol
        })
        
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=str(trabajador.id_trabajador),
            username=trabajador.dni
        )
    
    # Si no es trabajador, intentar buscar como EMPRESA
    empresa = db.query(Empresa).filter(Empresa.email == request.username).first()
    
    if empresa:
        if not verify_password(empresa.password_hash, request.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        if empresa.estado != "activa":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Empresa desactivada"
            )
        
        # Token para EMPRESA
        access_token = jwt_service.create_access_token(data={
            "sub": empresa.email,
            "user_id": str(empresa.id_empresa),
            "user_type": "empresa",
            "empresa_id": str(empresa.id_empresa),
            "rol": "empresa_admin"
        })
        
        return LoginResponse(
            access_token=access_token,
            token_type="bearer", 
            user_id=str(empresa.id_empresa),
            username=empresa.ruc
        )
    
    # No se encontró ni trabajador ni empresa
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales incorrectas"
    )


@router.get("/me", response_model=UserInfo)
def get_current_user_info(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Obtener información del usuario actual (trabajador o empresa)"""
    token = credentials.credentials
    payload = jwt_service.verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado"
        )
    
    user_type = payload.get("user_type", "trabajador")  # Default por compatibilidad
    user_id = payload.get("user_id")
    
    if user_type == "empresa":
        # Es una empresa
        empresa = db.query(Empresa).filter(Empresa.id_empresa == int(user_id)).first()
        if not empresa:
            raise HTTPException(status_code=404, detail="Empresa no encontrada")
            
        return UserInfo(
            user_id=str(empresa.id_empresa),
            username=empresa.ruc,
            role="empresa_admin",
            nombre=empresa.nombre_empresa,
            email=empresa.email,
            telefono=empresa.telefono,
            user_type="empresa",
            ruc=empresa.ruc,
            tipo_empresa="Manufacturera",  # Valor por defecto
            fecha_registro=empresa.fecha_registro.isoformat() if empresa.fecha_registro else None
        )
    else:
        # Es un trabajador
        trabajador = db.query(Trabajador).filter(Trabajador.id_trabajador == int(user_id)).first()
        if not trabajador:
            raise HTTPException(status_code=404, detail="Trabajador no encontrado")
            
        return UserInfo(
            user_id=str(trabajador.id_trabajador),
            username=trabajador.dni,
            role=trabajador.rol,
            nombre=trabajador.nombre_completo,
            email=trabajador.email,
            telefono=None,  # No disponible en modelo trabajador
            user_type="trabajador",
            dni=trabajador.dni,
            fecha_registro=trabajador.fecha_creacion.isoformat() if trabajador.fecha_creacion else None
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