-- Empresas
CREATE TABLE empresas (
    id_empresa SERIAL PRIMARY KEY,
    ruc VARCHAR(11) UNIQUE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    estado VARCHAR(20) DEFAULT 'activo',
    smart_account_address VARCHAR(42),
    signer_address VARCHAR(42),
    blockchain_active BOOLEAN DEFAULT false,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (estado IN ('activo', 'inactivo', 'suspendido'))
);

-- Trabajadores
CREATE TABLE trabajadores (
    id_trabajador SERIAL PRIMARY KEY,
    id_empresa INTEGER REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    dni VARCHAR(8) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(50) NOT NULL,
    smart_account_address VARCHAR(42),
    blockchain_role VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    fecha_contratacion DATE DEFAULT CURRENT_DATE,
    CHECK (blockchain_role IN ('admin', 'farmer', 'processor', 'distributor'))
);

-- Sensores IoT
CREATE TABLE sensores (
    id_sensor SERIAL PRIMARY KEY,
    id_empresa INTEGER REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    nombre_sensor VARCHAR(255) NOT NULL,
    tipo_sensor VARCHAR(100) NOT NULL,
    device_id VARCHAR(255) UNIQUE NOT NULL,
    estado VARCHAR(20) DEFAULT 'activo',
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    fecha_instalacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (estado IN ('activo', 'inactivo', 'mantenimiento'))
);

-- Asignaciones de sensores
CREATE TABLE asignaciones_sensores (
    id_asignacion SERIAL PRIMARY KEY,
    id_sensor INTEGER REFERENCES sensores(id_sensor) ON DELETE CASCADE,
    id_trabajador INTEGER REFERENCES trabajadores(id_trabajador) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_desasignacion TIMESTAMP,
    observaciones TEXT,
    UNIQUE (id_sensor, id_trabajador, fecha_asignacion)
);

-- Lecturas de sensores con alta volumetría
CREATE TABLE lecturas_sensores (
    id_lectura BIGSERIAL PRIMARY KEY,
    id_sensor INTEGER NOT NULL REFERENCES sensores(id_sensor) ON DELETE CASCADE,
    temperatura DECIMAL(5,2),
    humedad DECIMAL(5,2),
    ph DECIMAL(4,2),
    conductividad DECIMAL(10,2),
    nitrogeno DECIMAL(10,2),
    fosforo DECIMAL(10,2),
    potasio DECIMAL(10,2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (humedad >= 0 AND humedad <= 100),
    CHECK (ph >= 0 AND ph <= 14)
);

-- Sistema de alertas
CREATE TABLE alertas (
    id_alerta SERIAL PRIMARY KEY,
    id_sensor INTEGER REFERENCES sensores(id_sensor) ON DELETE CASCADE,
    tipo_alerta VARCHAR(100) NOT NULL,
    severidad VARCHAR(20) NOT NULL,
    mensaje TEXT NOT NULL,
    valor_actual DECIMAL(10,2),
    valor_umbral DECIMAL(10,2),
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    CHECK (severidad IN ('baja', 'media', 'alta', 'critica')),
    CHECK (estado IN ('pendiente', 'en_proceso', 'resuelta', 'ignorada'))
);

-- Configuración de umbrales
CREATE TABLE configuracion_umbrales (
    id_configuracion SERIAL PRIMARY KEY,
    id_sensor INTEGER REFERENCES sensores(id_sensor) ON DELETE CASCADE,
    parametro VARCHAR(50) NOT NULL,
    valor_minimo DECIMAL(10,2),
    valor_maximo DECIMAL(10,2),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_sensor, parametro)
);

-- Granjas con datos geoespaciales
CREATE TABLE farms (
    id_farm SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    geohash VARCHAR(12),
    area_hectares DECIMAL(10,2),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificaciones orgánicas
CREATE TABLE farm_certifications (
    id_certification SERIAL PRIMARY KEY,
    id_farm INTEGER NOT NULL REFERENCES farms(id_farm) ON DELETE CASCADE,
    certification_type VARCHAR(100) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    certification_number VARCHAR(100) UNIQUE NOT NULL,
    document_url TEXT,
    is_valid BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (certification_type IN ('organic', 'fair_trade', 'rainforest', 'global_gap'))
);

-- Lotes de productos con trazabilidad blockchain
CREATE TABLE lots (
    id_lot BIGSERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    id_farm INTEGER NOT NULL REFERENCES farms(id_farm) ON DELETE CASCADE,
    lot_code VARCHAR(100) UNIQUE NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    quantity_kg DECIMAL(12,2) NOT NULL,
    state VARCHAR(20) DEFAULT 'harvested',
    current_owner_id INTEGER REFERENCES trabajadores(id_trabajador),
    harvest_date DATE NOT NULL,
    ipfs_hash VARCHAR(100),
    blockchain_tx_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (state IN ('harvested', 'processed', 'in_transit', 'delivered', 'rejected')),
    CHECK (quantity_kg > 0)
);

-- Eventos de cosecha
CREATE TABLE harvest_events (
    id_harvest_event BIGSERIAL PRIMARY KEY,
    id_lot BIGINT NOT NULL REFERENCES lots(id_lot) ON DELETE CASCADE,
    harvester_id INTEGER NOT NULL REFERENCES trabajadores(id_trabajador),
    harvest_date TIMESTAMP NOT NULL,
    quantity_kg DECIMAL(12,2) NOT NULL,
    weather_conditions TEXT,
    notes TEXT,
    blockchain_tx_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (quantity_kg > 0)
);

-- Eventos de procesamiento
CREATE TABLE processing_events (
    id_processing_event BIGSERIAL PRIMARY KEY,
    id_lot BIGINT NOT NULL REFERENCES lots(id_lot) ON DELETE CASCADE,
    processor_id INTEGER NOT NULL REFERENCES trabajadores(id_trabajador),
    processing_date TIMESTAMP NOT NULL,
    processing_type VARCHAR(100) NOT NULL,
    input_quantity_kg DECIMAL(12,2) NOT NULL,
    output_quantity_kg DECIMAL(12,2) NOT NULL,
    waste_percentage DECIMAL(5,2),
    notes TEXT,
    blockchain_tx_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (input_quantity_kg > 0),
    CHECK (output_quantity_kg > 0),
    CHECK (output_quantity_kg <= input_quantity_kg)
);

-- Eventos de transferencia
CREATE TABLE transfer_events (
    id_transfer_event BIGSERIAL PRIMARY KEY,
    id_lot BIGINT NOT NULL REFERENCES lots(id_lot) ON DELETE CASCADE,
    from_actor_id INTEGER REFERENCES trabajadores(id_trabajador),
    to_actor_id INTEGER REFERENCES trabajadores(id_trabajador),
    transfer_date TIMESTAMP NOT NULL,
    from_location TEXT,
    to_location TEXT,
    transport_method VARCHAR(100),
    temperature_range VARCHAR(50),
    notes TEXT,
    blockchain_tx_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Control de sincronización blockchain
CREATE TABLE blockchain_sync (
    id_sync BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    transaction_hash VARCHAR(66) NOT NULL,
    block_number BIGINT,
    sync_status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP,
    synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (entity_type IN ('lot', 'harvest', 'processing', 'transfer')),
    CHECK (sync_status IN ('pending', 'processing', 'confirmed', 'failed'))
);
