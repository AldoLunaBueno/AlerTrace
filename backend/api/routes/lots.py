"""
Rutas para gestión de lotes y trazabilidad blockchain
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Any
from database.connection import get_db
from database.models.database import (
    Lot, Farm, HarvestEvent, ProcessingEvent, TransferEvent
)
from api.models.schemas import (
    LotCreate, LotResponse,
    HarvestEventCreate, HarvestEventResponse,
    ProcessingEventCreate, ProcessingEventResponse,
    TransferEventCreate, TransferEventResponse
)
from api.auth.dependencies import get_current_empresa

router = APIRouter(prefix="/lots", tags=["Lots"])


@router.post("/", response_model=LotResponse, status_code=status.HTTP_201_CREATED)
def create_lot(
    lot_data: LotCreate,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Crear nuevo lote de productos"""
    if lot_data.id_farm:
        farm = db.query(Farm).filter(
            Farm.id == lot_data.id_farm,
            Farm.id_empresa == empresa.id_empresa
        ).first()
        
        if not farm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Finca no encontrada"
            )
    
    existing_lot = db.query(Lot).filter(Lot.lot_id == lot_data.lot_id).first()
    if existing_lot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un lote con este ID"
        )
    
    lot = Lot(
        id_empresa=empresa.id_empresa,
        **lot_data.model_dump()
    )
    db.add(lot)
    db.commit()
    db.refresh(lot)
    return lot


@router.get("/", response_model=List[LotResponse])
def list_lots(
    skip: int = 0,
    limit: int = 100,
    state: str = None,
    farm_id: int = None,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Listar lotes de la empresa autenticada"""
    query = db.query(Lot).filter(Lot.id_empresa == empresa.id_empresa)
    
    if state:
        query = query.filter(Lot.current_state == state)
    
    if farm_id:
        query = query.filter(Lot.id_farm == farm_id)
    
    lots = query.order_by(desc(Lot.created_at)).offset(skip).limit(limit).all()
    return lots


@router.get("/{lot_id}", response_model=LotResponse)
def get_lot(
    lot_id: int,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Obtener detalles de un lote específico"""
    lot = db.query(Lot).filter(
        Lot.lot_id == lot_id,
        Lot.id_empresa == empresa.id_empresa
    ).first()
    
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lote no encontrado"
        )
    
    return lot


@router.patch("/{lot_id}", response_model=LotResponse)
def update_lot(
    lot_id: int,
    lot_data: LotCreate,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Actualizar información de un lote"""
    lot = db.query(Lot).filter(
        Lot.lot_id == lot_id,
        Lot.id_empresa == empresa.id_empresa
    ).first()
    
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lote no encontrado"
        )
    
    update_data = lot_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lot, field, value)
    
    db.commit()
    db.refresh(lot)
    return lot


@router.get("/{lot_id}/traceability")
def get_lot_traceability(
    lot_id: int,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
) -> Dict[str, Any]:
    """Obtener trazabilidad completa de un lote"""
    lot = db.query(Lot).filter(
        Lot.lot_id == lot_id,
        Lot.id_empresa == empresa.id_empresa
    ).first()
    
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lote no encontrado"
        )
    
    harvest_events = db.query(HarvestEvent).filter(
        HarvestEvent.lot_id == lot_id
    ).order_by(HarvestEvent.event_time).all()
    
    processing_events = db.query(ProcessingEvent).filter(
        ProcessingEvent.lot_id == lot_id
    ).order_by(ProcessingEvent.event_time).all()
    
    transfer_events = db.query(TransferEvent).filter(
        TransferEvent.lot_id == lot_id
    ).order_by(TransferEvent.event_time).all()
    
    return {
        "lot": LotResponse.model_validate(lot),
        "harvest_events": [HarvestEventResponse.model_validate(e) for e in harvest_events],
        "processing_events": [ProcessingEventResponse.model_validate(e) for e in processing_events],
        "transfer_events": [TransferEventResponse.model_validate(e) for e in transfer_events],
        "total_events": len(harvest_events) + len(processing_events) + len(transfer_events)
    }


@router.post("/{lot_id}/harvest", response_model=HarvestEventResponse, status_code=status.HTTP_201_CREATED)
def register_harvest_event(
    lot_id: int,
    event_data: HarvestEventCreate,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Registrar evento de cosecha para un lote"""
    lot = db.query(Lot).filter(
        Lot.lot_id == lot_id,
        Lot.id_empresa == empresa.id_empresa
    ).first()
    
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lote no encontrado"
        )
    
    if event_data.lot_id != lot_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El lot_id del evento no coincide con el lot_id de la URL"
        )
    
    harvest_event = HarvestEvent(**event_data.model_dump())
    db.add(harvest_event)
    db.commit()
    db.refresh(harvest_event)
    return harvest_event


@router.get("/{lot_id}/harvest", response_model=List[HarvestEventResponse])
def list_harvest_events(
    lot_id: int,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Listar eventos de cosecha de un lote"""
    lot = db.query(Lot).filter(
        Lot.lot_id == lot_id,
        Lot.id_empresa == empresa.id_empresa
    ).first()
    
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lote no encontrado"
        )
    
    events = db.query(HarvestEvent).filter(
        HarvestEvent.lot_id == lot_id
    ).order_by(HarvestEvent.event_time).all()
    
    return events


@router.post("/{lot_id}/processing", response_model=ProcessingEventResponse, status_code=status.HTTP_201_CREATED)
def register_processing_event(
    lot_id: int,
    event_data: ProcessingEventCreate,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Registrar evento de procesamiento para un lote"""
    lot = db.query(Lot).filter(
        Lot.lot_id == lot_id,
        Lot.id_empresa == empresa.id_empresa
    ).first()
    
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lote no encontrado"
        )
    
    if event_data.lot_id != lot_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El lot_id del evento no coincide con el lot_id de la URL"
        )
    
    processing_event = ProcessingEvent(**event_data.model_dump())
    db.add(processing_event)
    db.commit()
    db.refresh(processing_event)
    return processing_event


@router.get("/{lot_id}/processing", response_model=List[ProcessingEventResponse])
def list_processing_events(
    lot_id: int,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Listar eventos de procesamiento de un lote"""
    lot = db.query(Lot).filter(
        Lot.lot_id == lot_id,
        Lot.id_empresa == empresa.id_empresa
    ).first()
    
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lote no encontrado"
        )
    
    events = db.query(ProcessingEvent).filter(
        ProcessingEvent.lot_id == lot_id
    ).order_by(ProcessingEvent.event_time).all()
    
    return events


@router.post("/{lot_id}/transfer", response_model=TransferEventResponse, status_code=status.HTTP_201_CREATED)
def register_transfer_event(
    lot_id: int,
    event_data: TransferEventCreate,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Registrar evento de transferencia para un lote"""
    lot = db.query(Lot).filter(
        Lot.lot_id == lot_id,
        Lot.id_empresa == empresa.id_empresa
    ).first()
    
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lote no encontrado"
        )
    
    if event_data.lot_id != lot_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El lot_id del evento no coincide con el lot_id de la URL"
        )
    
    transfer_event = TransferEvent(**event_data.model_dump())
    db.add(transfer_event)
    
    lot.current_owner = event_data.to_address
    lot.current_state = "Distribuido"
    
    db.commit()
    db.refresh(transfer_event)
    return transfer_event


@router.get("/{lot_id}/transfer", response_model=List[TransferEventResponse])
def list_transfer_events(
    lot_id: int,
    db: Session = Depends(get_db),
    empresa = Depends(get_current_empresa)
):
    """Listar eventos de transferencia de un lote"""
    lot = db.query(Lot).filter(
        Lot.lot_id == lot_id,
        Lot.id_empresa == empresa.id_empresa
    ).first()
    
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lote no encontrado"
        )
    
    events = db.query(TransferEvent).filter(
        TransferEvent.lot_id == lot_id
    ).order_by(TransferEvent.event_time).all()
    
    return events
