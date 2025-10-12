import asyncio
import threading
from api.services.sensor_service import SensorService
from database.connection import SessionLocal

async def polling_worker():
    """Worker que consulta todos los sensores cada 10 segundos"""
    sensor_service = SensorService()
    print("Worker de polling de sensores iniciado")
    
    while True:
        try:
            db = SessionLocal()
            await sensor_service.poll_all_sensors(db)
            db.close()
        except Exception as e:
            print(f"Error en el ciclo de polling: {str(e)}")
        
        await asyncio.sleep(10)  # Consulta cada 10 segundos

def start_polling_worker():
    """Función para iniciar el worker en un hilo separado"""
    asyncio.run(polling_worker())

def init_worker():
    """Inicializa el worker en un hilo separado"""
    worker_thread = threading.Thread(target=start_polling_worker, daemon=True)
    worker_thread.start()
    return worker_thread

if __name__ == "__main__":
    print("Iniciando worker de polling de sensores manualmente...")
    start_polling_worker()