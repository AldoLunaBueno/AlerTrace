"""
Router de administración de usuarios
Contiene endpoints para gestión de usuarios (solo admin)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database.connection import get_db
from ..models.database import Usuario
from ..models.schemas import UserCreate, UserUpdate
from ..auth.dependencies import get_current_user
from ..auth.jwt_service import jwt_service

router = APIRouter(
    prefix="/usuarios",
    tags=["Gestión de Usuarios"]
)


def require_admin(current_user: Usuario = Depends(get_current_user)):
    """Dependency para verificar que el usuario sea admin"""
    if current_user.rol != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado. Se requieren permisos de administrador"
        )
    return current_user


@router.get("/", response_model=List[dict])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    admin_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Obtener lista de todos los usuarios (solo admin)"""
    users = db.query(Usuario).offset(skip).limit(limit).all()
    
    return [{
        "id_usuario": user.id_usuario,
        "username": user.username,
        "nombre": user.nombre,
        "email": user.email,
        "rol": user.rol,
        "activo": user.activo,
        "fecha_creacion": str(user.fecha_registro)
    } for user in users]


@router.post("/create")
def create_user(
    user_data: UserCreate,
    admin_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Crear un nuevo usuario (solo admin)"""
    # Verificar si ya existe el username
    existing_user = db.query(Usuario).filter(Usuario.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya existe"
        )
    
    # Verificar si ya existe el email
    existing_email = db.query(Usuario).filter(Usuario.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya existe"
        )
    
    # Hashear password
    hashed_password = jwt_service.hash_password(user_data.password)
    
    # Crear nuevo usuario
    new_user = Usuario(
        username=user_data.username,
        password_hash=hashed_password,
        nombre=user_data.nombre,
        email=user_data.email,
        rol=user_data.rol
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "Usuario creado exitosamente",
        "user_id": new_user.id_usuario,
        "username": new_user.username
    }


@router.get("/{user_id}")
def get_user(
    user_id: int,
    admin_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Obtener información de un usuario específico (solo admin)"""
    user = db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return {
        "id_usuario": user.id_usuario,
        "username": user.username,
        "nombre": user.nombre,
        "email": user.email,
        "rol": user.rol,
        "activo": user.activo,
        "fecha_creacion": str(user.fecha_registro)
    }


@router.put("/{user_id}")
def update_user(
    user_id: int,
    user_update: UserUpdate,
    admin_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Actualizar un usuario específico (solo admin)"""
    user = db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Actualizar solo los campos proporcionados
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return {
        "message": "Usuario actualizado exitosamente",
        "user_id": user.id_usuario,
        "username": user.username
    }


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    admin_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Desactivar un usuario (soft delete) (solo admin)"""
    user = db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # No permitir eliminar admin
    if user.rol == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede desactivar un usuario administrador"
        )
    
    user.activo = False
    db.commit()
    
    return {"message": "Usuario desactivado exitosamente"}


@router.post("/{user_id}/activate")
def activate_user(
    user_id: int,
    admin_user: Usuario = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Reactivar un usuario desactivado (solo admin)"""
    user = db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    user.activo = True
    db.commit()
    
    return {"message": "Usuario activado exitosamente"}