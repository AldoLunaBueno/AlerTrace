"""
Rutas para gestión de fincas y certificaciones
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.connection import get_db
from database.models.database import Farm, FarmCertification
from api.models.schemas import (
    FarmCreate, FarmResponse,
    FarmCertificationCreate, FarmCertificationResponse
)
from api.auth.dependencies import get_current_empresa

router = APIRouter(prefix="/farms", tags=["Farms"])


@router.post("/", response_model=FarmResponse, status_code=status.HTTP_201_CREATED)
def create_farm(
    farm_data: FarmCreate,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Crear nueva finca para la empresa autenticada"""
    farm = Farm(
        id_empresa=empresa.id_empresa,
        **farm_data.model_dump()
    )
    db.add(farm)
    db.commit()
    db.refresh(farm)
    return farm


@router.get("/", response_model=List[FarmResponse])
def list_farms(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Listar fincas de la empresa autenticada"""
    query = db.query(Farm).filter(Farm.id_empresa == empresa.id_empresa)
    
    if active_only:
        query = query.filter(Farm.active == True)
    
    farms = query.offset(skip).limit(limit).all()
    return farms


@router.get("/{farm_id}", response_model=FarmResponse)
def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Obtener detalles de una finca específica"""
    farm = db.query(Farm).filter(
        Farm.id == farm_id,
        Farm.id_empresa == empresa.id_empresa
    ).first()
    
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finca no encontrada"
        )
    
    return farm


@router.patch("/{farm_id}", response_model=FarmResponse)
def update_farm(
    farm_id: int,
    farm_data: FarmCreate,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Actualizar información de una finca"""
    farm = db.query(Farm).filter(
        Farm.id == farm_id,
        Farm.id_empresa == empresa.id_empresa
    ).first()
    
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finca no encontrada"
        )
    
    update_data = farm_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(farm, field, value)
    
    db.commit()
    db.refresh(farm)
    return farm


@router.delete("/{farm_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Desactivar una finca"""
    farm = db.query(Farm).filter(
        Farm.id == farm_id,
        Farm.id_empresa == empresa.id_empresa
    ).first()
    
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finca no encontrada"
        )
    
    farm.active = False
    db.commit()
    return None


@router.post("/{farm_id}/certifications", response_model=FarmCertificationResponse, status_code=status.HTTP_201_CREATED)
def create_certification(
    farm_id: int,
    cert_data: FarmCertificationCreate,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Agregar certificación a una finca"""
    farm = db.query(Farm).filter(
        Farm.id == farm_id,
        Farm.id_empresa == empresa.id_empresa
    ).first()
    
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finca no encontrada"
        )
    
    if cert_data.id_farm != farm_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El id_farm no coincide con el farm_id de la URL"
        )
    
    certification = FarmCertification(**cert_data.model_dump())
    db.add(certification)
    db.commit()
    db.refresh(certification)
    return certification


@router.get("/{farm_id}/certifications", response_model=List[FarmCertificationResponse])
def list_certifications(
    farm_id: int,
    active_only: bool = True,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Listar certificaciones de una finca"""
    farm = db.query(Farm).filter(
        Farm.id == farm_id,
        Farm.id_empresa == empresa.id_empresa
    ).first()
    
    if not farm:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finca no encontrada"
        )
    
    query = db.query(FarmCertification).filter(FarmCertification.id_farm == farm_id)
    
    if active_only:
        query = query.filter(FarmCertification.active == True)
    
    certifications = query.all()
    return certifications


@router.patch("/certifications/{cert_id}", response_model=FarmCertificationResponse)
def update_certification(
    cert_id: int,
    cert_data: FarmCertificationCreate,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Actualizar una certificación"""
    certification = db.query(FarmCertification).join(Farm).filter(
        FarmCertification.id == cert_id,
        Farm.id_empresa == empresa.id_empresa
    ).first()
    
    if not certification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificación no encontrada"
        )
    
    update_data = cert_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(certification, field, value)
    
    db.commit()
    db.refresh(certification)
    return certification


@router.delete("/certifications/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certification(
    cert_id: int,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Desactivar una certificación"""
    certification = db.query(FarmCertification).join(Farm).filter(
        FarmCertification.id == cert_id,
        Farm.id_empresa == empresa.id_empresa
    ).first()
    
    if not certification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificación no encontrada"
        )
    
    certification.active = False
    db.commit()
    return None
