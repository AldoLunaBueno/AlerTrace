from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime
import boto3
import os
from decimal import Decimal
from typing import Optional

# ========================
# CONFIG
# ========================
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
DYNAMODB_TABLE = os.getenv("DYNAMODB_TABLE", "SensorData")

# DynamoDB client (usa credenciales de IAM del EC2 o variables de entorno)
dynamodb = boto3.resource(
    "dynamodb", 
    region_name=AWS_REGION,
    endpoint_url="http://db:8000")
table = dynamodb.Table(DYNAMODB_TABLE)

# FASTAPI
app = FastAPI(
    title="Sumaq Tree API",
    description="API que recolecta datos de sensores y los expone a una aplicación cliente",
    version="1.0"
)

# ========================
# CORS
# ========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tarpuqkuna.lat"],  # dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],  # permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # permite todos los headers
)

# ========================
# MODELOS
# ========================
class SensorData(BaseModel):
    sensorId: str
    temperature: float
    humidity: float
    soilMoisture: float
    timestamp: Optional[str] = None


# ========================
# ENDPOINTS
# ========================
@app.get("/")
async def index():
    return {"message": "Hola mundo desde Sumaq Tree API"}


@app.post("/data")
async def receive_data(data: SensorData):
    if not data.timestamp:
        data.timestamp = datetime.datetime.utcnow().isoformat()

    # Convertir floats a Decimal
    item = {
        k: Decimal(str(v)) if isinstance(v, float) else v
        for k, v in data.dict().items()
    }

    # Guardar en DynamoDB
    table.put_item(Item=item)

    print(f"Datos recibidos: {item}")  # Para verlos en logs

    return {"status": "ok", "data": data.dict()}


@app.get("/latest")
async def get_latest():
    """
    Devuelve el último registro ingresado.
    Nota: DynamoDB no garantiza orden natural en 'scan', 
    se recomienda tener una PK/SK que permita ordenar.
    """
    response = table.scan(Limit=1)
    items = response.get("Items", [])
    if not items:
        return {"message": "No hay datos disponibles"}
    return items[0]
