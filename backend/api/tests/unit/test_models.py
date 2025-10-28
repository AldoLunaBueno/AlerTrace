import pytest
from pydantic import ValidationError
from api.models.schemas import (
    UserCreate, FarmCreate, SensorCreate, AlertaCreate, LotCreate,
    HealthCheck, SensorData, EmpresaCreate
)


def test_empresa_create_schema():
    """Test EmpresaCreate schema validation."""
    empresa = EmpresaCreate(
        ruc="12345678",
        razon_social="Test Company",
        email="test@example.com"
    )
    assert empresa.ruc == "12345678"
    assert empresa.razon_social == "Test Company"
    assert empresa.email == "test@example.com"


def test_user_create_schema():
    """Test UserCreate schema validation."""
    user = UserCreate(
        username="testuser",
        nombre="Test",
        email="test@example.com",
        password="SecurePass123!",
        rol="agricultor"
    )
    assert user.username == "testuser"
    assert user.nombre == "Test"
    assert user.email == "test@example.com"
    assert user.rol == "agricultor"


def test_farm_create_schema():
    """Test FarmCreate schema validation."""
    farm = FarmCreate(
        farm_name="Test Farm",
        location_address="Test Location",
        area_hectares=100.5
    )
    assert farm.farm_name == "Test Farm"
    assert farm.location_address == "Test Location"
    assert farm.area_hectares == 100.5


def test_sensor_create_schema():
    """Test SensorCreate schema validation."""
    sensor = SensorCreate(
        device_id="SENSOR001",
        nombre="Temperature Sensor",
        tipo="temperature",
        id_cultivo=1,
        ubicacion_sensor="Field A"
    )
    assert sensor.device_id == "SENSOR001"
    assert sensor.nombre == "Temperature Sensor"
    assert sensor.tipo == "temperature"
    assert sensor.id_cultivo == 1


def test_health_check_schema():
    """Test HealthCheck schema validation."""
    health = HealthCheck(
        status="healthy",
        timestamp=1234567890,
        version="1.0.0",
        environment="development"
    )
    assert health.status == "healthy"
    assert health.version == "1.0.0"


def test_sensor_data_schema():
    """Test SensorData schema validation."""
    data = SensorData(
        device_id="SENSOR001",
        temperatura=25.5,
        humedad_aire=65.0,
        humedad_suelo=45.0,
        ph_suelo=6.8
    )
    assert data.device_id == "SENSOR001"
    assert data.temperatura == 25.5
    assert data.humedad_aire == 65.0
