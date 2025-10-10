from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    """simple health check"""
    return {"status": "healthy", "service": "mallkitrace-api"}