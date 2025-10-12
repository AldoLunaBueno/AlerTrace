from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    """Verificación de salud del servicio"""
    return {"status": "healthy", "service": "alertrace-api"}