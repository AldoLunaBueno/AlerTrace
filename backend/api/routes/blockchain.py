"""
Rutas para integración y sincronización blockchain
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Dict, Any
from datetime import datetime, timedelta
from database.connection import get_db
from database.models.database import BlockchainSync, Lot
from api.models.schemas import BlockchainSyncResponse

router = APIRouter(prefix="/blockchain", tags=["Blockchain"])


@router.get("/sync/status")
def get_sync_status(
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Obtener estado de sincronización blockchain"""
    total_events = db.query(func.count(BlockchainSync.id)).scalar()
    
    processed_events = db.query(func.count(BlockchainSync.id)).filter(
        BlockchainSync.processed == True
    ).scalar()
    
    pending_events = db.query(func.count(BlockchainSync.id)).filter(
        BlockchainSync.processed == False
    ).scalar()
    
    failed_events = db.query(func.count(BlockchainSync.id)).filter(
        BlockchainSync.processed == False,
        BlockchainSync.error_message.isnot(None)
    ).scalar()
    
    last_sync = db.query(BlockchainSync).order_by(
        desc(BlockchainSync.block_timestamp)
    ).first()
    
    last_block = db.query(func.max(BlockchainSync.block_number)).scalar()
    
    return {
        "total_events": total_events or 0,
        "processed_events": processed_events or 0,
        "pending_events": pending_events or 0,
        "failed_events": failed_events or 0,
        "last_sync_time": last_sync.created_at if last_sync else None,
        "last_block_number": last_block or 0,
        "sync_health": "healthy" if failed_events == 0 else "degraded"
    }


@router.get("/sync/events", response_model=List[BlockchainSyncResponse])
def list_sync_events(
    skip: int = 0,
    limit: int = 100,
    processed: bool = None,
    event_name: str = None,
    db: Session = Depends(get_db)
):
    """Listar eventos de sincronización blockchain"""
    query = db.query(BlockchainSync)
    
    if processed is not None:
        query = query.filter(BlockchainSync.processed == processed)
    
    if event_name:
        query = query.filter(BlockchainSync.event_name == event_name)
    
    events = query.order_by(desc(BlockchainSync.block_timestamp)).offset(skip).limit(limit).all()
    return events


@router.get("/sync/events/{tx_hash}", response_model=BlockchainSyncResponse)
def get_sync_event(
    tx_hash: str,
    db: Session = Depends(get_db)
):
    """Obtener detalles de un evento específico por transaction hash"""
    event = db.query(BlockchainSync).filter(
        BlockchainSync.tx_hash == tx_hash
    ).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evento no encontrado"
        )
    
    return event


@router.post("/sync/retry/{sync_id}")
def retry_failed_sync(
    sync_id: int,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Reintentar procesamiento de evento fallido"""
    sync_event = db.query(BlockchainSync).filter(
        BlockchainSync.id == sync_id
    ).first()
    
    if not sync_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evento de sincronización no encontrado"
        )
    
    if sync_event.processed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este evento ya fue procesado exitosamente"
        )
    
    sync_event.error_message = None
    sync_event.processed = False
    
    db.commit()
    
    return {
        "message": "Evento marcado para reintento",
        "sync_id": sync_id,
        "tx_hash": sync_event.tx_hash
    }


@router.get("/lots/{lot_id}/blockchain-history")
def get_lot_blockchain_history(
    lot_id: int,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Obtener historial blockchain de un lote específico"""
    lot = db.query(Lot).filter(Lot.lot_id == lot_id).first()
    
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lote no encontrado"
        )
    
    blockchain_events = db.query(BlockchainSync).filter(
        BlockchainSync.lot_id == lot_id
    ).order_by(BlockchainSync.block_timestamp).all()
    
    events_by_type = {}
    for event in blockchain_events:
        event_type = event.event_name
        if event_type not in events_by_type:
            events_by_type[event_type] = []
        events_by_type[event_type].append({
            "tx_hash": event.tx_hash,
            "block_number": event.block_number,
            "timestamp": event.block_timestamp,
            "processed": event.processed
        })
    
    return {
        "lot_id": lot_id,
        "product_name": lot.product_name,
        "current_state": lot.current_state,
        "total_blockchain_events": len(blockchain_events),
        "events_by_type": events_by_type,
        "blockchain_events": [BlockchainSyncResponse.model_validate(e) for e in blockchain_events]
    }


@router.get("/stats/daily")
def get_daily_stats(
    days: int = 7,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Obtener estadísticas diarias de eventos blockchain"""
    since_date = datetime.utcnow() - timedelta(days=days)
    
    events = db.query(
        func.date(BlockchainSync.block_timestamp).label('date'),
        func.count(BlockchainSync.id).label('count'),
        func.count(func.nullif(BlockchainSync.processed, False)).label('processed_count')
    ).filter(
        BlockchainSync.block_timestamp >= since_date
    ).group_by(
        func.date(BlockchainSync.block_timestamp)
    ).order_by(
        func.date(BlockchainSync.block_timestamp)
    ).all()
    
    daily_stats = []
    for event in events:
        daily_stats.append({
            "date": event.date.isoformat(),
            "total_events": event.count,
            "processed_events": event.processed_count or 0,
            "pending_events": event.count - (event.processed_count or 0)
        })
    
    return {
        "period_days": days,
        "daily_stats": daily_stats
    }


@router.get("/contracts/activity")
def get_contract_activity(
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Obtener actividad por contrato inteligente"""
    contracts = db.query(
        BlockchainSync.contract_address,
        func.count(BlockchainSync.id).label('event_count'),
        func.max(BlockchainSync.block_timestamp).label('last_activity')
    ).group_by(
        BlockchainSync.contract_address
    ).order_by(
        desc('event_count')
    ).all()
    
    contract_stats = []
    for contract in contracts:
        contract_stats.append({
            "contract_address": contract.contract_address,
            "total_events": contract.event_count,
            "last_activity": contract.last_activity
        })
    
    return {
        "total_contracts": len(contract_stats),
        "contracts": contract_stats
    }
