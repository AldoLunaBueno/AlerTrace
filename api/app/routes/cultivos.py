"""
Router de cultivos
Contiene endpoints CRUD para gestión de cultivos
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database.connection import get_db
from ..models.database import Usuario, Cultivo
from ..models.schemas import CultivoCreate, CultivoUpdate, CultivoResponse
from ..auth.dependencies import get_current_user

router = APIRouter(
    prefix="/cultivos",
    tags=["Cultivos"]
)


@router.get("/", response_model=List[CultivoResponse])
def get_cultivos(
    skip: int = 0, 
    limit: int = 100, 
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener lista de cultivos del usuario actual"""
    cultivos = db.query(Cultivo).filter(
        Cultivo.id_usuario == current_user.id_usuario
    ).offset(skip).limit(limit).all()
    
    return cultivos


@router.post("/", response_model=CultivoResponse)
def create_cultivo(
    cultivo: CultivoCreate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear un nuevo cultivo"""
    db_cultivo = Cultivo(
        id_usuario=current_user.id_usuario,
        tipo_cultivo=cultivo.tipo_cultivo,
        variedad=cultivo.variedad,
        hectareas=cultivo.hectareas,
        fecha_siembra=cultivo.fecha_siembra,
        fecha_estimada_cosecha=cultivo.fecha_estimada_cosecha,
        ubicacion_especifica=cultivo.ubicacion_especifica,
        coordenadas_lat=cultivo.coordenadas_lat,
        coordenadas_lng=cultivo.coordenadas_lng,
        estado="sembrado"
    )
    
    db.add(db_cultivo)
    db.commit()
    db.refresh(db_cultivo)
    
    return db_cultivo


@router.get("/{cultivo_id}", response_model=CultivoResponse)
def get_cultivo(
    cultivo_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener un cultivo específico"""
    cultivo = db.query(Cultivo).filter(
        Cultivo.id_cultivo == cultivo_id,
        Cultivo.id_usuario == current_user.id_usuario
    ).first()
    
    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo no encontrado"
        )
    
    return cultivo


@router.put("/{cultivo_id}", response_model=CultivoResponse)
def update_cultivo(
    cultivo_id: int,
    cultivo_update: CultivoUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar un cultivo específico"""
    cultivo = db.query(Cultivo).filter(
        Cultivo.id_cultivo == cultivo_id,
        Cultivo.id_usuario == current_user.id_usuario
    ).first()
    
    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo no encontrado"
        )
    
    # Actualizar solo los campos proporcionados
    update_data = cultivo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(cultivo, field, value)
    
    db.commit()
    db.refresh(cultivo)
    
    return cultivo


@router.delete("/{cultivo_id}")
def delete_cultivo(
    cultivo_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar un cultivo específico"""
    cultivo = db.query(Cultivo).filter(
        Cultivo.id_cultivo == cultivo_id,
        Cultivo.id_usuario == current_user.id_usuario
    ).first()
    
    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo no encontrado"
        )
    
    db.delete(cultivo)
    db.commit()
    
    return {"message": "Cultivo eliminado exitosamente"}