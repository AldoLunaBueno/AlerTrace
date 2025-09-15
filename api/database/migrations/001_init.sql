-- Schema

-- ======================
-- TABLA: ORGANIZACIONES
-- ======================
CREATE TABLE organizaciones (
    id_organizacion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'cooperativa', 'empresa', 'independiente'
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- ======================
-- TABLA: USUARIOS
-- ======================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('agricultor', 'comprador', 'admin', 'organizacion')),
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    id_organizacion INTEGER REFERENCES organizaciones(id_organizacion) ON DELETE SET NULL
);

-- ======================
-- TABLA: AGRICULTORES
-- ======================
CREATE TABLE agricultores (
    id_agricultor SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    cedula VARCHAR(20) UNIQUE,
    ubicacion_finca TEXT,
    coordenadas_lat DECIMAL(10, 8),
    coordenadas_lng DECIMAL(11, 8),
    hectareas_totales DECIMAL(8, 2),
    experiencia_anos INTEGER,
    id_organizacion INTEGER REFERENCES organizaciones(id_organizacion) ON DELETE SET NULL,
    fecha_vinculacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- TABLA: CULTIVOS
-- ======================
CREATE TABLE cultivos (
    id_cultivo SERIAL PRIMARY KEY,
    id_agricultor INTEGER NOT NULL REFERENCES agricultores(id_agricultor) ON DELETE CASCADE,
    tipo_cultivo VARCHAR(50) NOT NULL, -- 'cacao', 'sacha_inchi', 'cafe'
    variedad VARCHAR(100),
    hectareas DECIMAL(8, 2) NOT NULL,
    fecha_siembra DATE,
    fecha_estimada_cosecha DATE,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'cosechado', 'suspendido')),
    ubicacion_especifica TEXT,
    coordenadas_lat DECIMAL(10, 8),
    coordenadas_lng DECIMAL(11, 8)
);

-- ======================
-- TABLA: SENSORES
-- ======================
CREATE TABLE sensores (
    id_sensor SERIAL PRIMARY KEY,
    codigo_sensor VARCHAR(50) UNIQUE NOT NULL, -- código físico del dispositivo
    nombre_sensor VARCHAR(100), -- nombre descriptivo
    marca VARCHAR(50),
    modelo VARCHAR(50),
    fecha_instalacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_comunicacion TIMESTAMP, -- última vez que envió datos
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'mantenimiento', 'dañado')),
    id_cultivo INTEGER REFERENCES cultivos(id_cultivo) ON DELETE SET NULL,
    coordenadas_lat DECIMAL(10, 8),
    coordenadas_lng DECIMAL(11, 8),
    configuracion JSONB, -- parámetros específicos del sensor
    certificado_iot TEXT, -- Certificado AWS IoT Core
    intervalo_lectura INTEGER DEFAULT 3600 -- segundos entre lecturas
);

-- ======================
-- TABLA: SENSOR-METRICAS
-- ======================
CREATE TABLE sensor_metricas (
    id_sensor INTEGER NOT NULL REFERENCES sensores(id_sensor) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    temperature FLOAT,
    humidity FLOAT,
    soil_moisture FLOAT,
    light FLOAT,
    ph_level FLOAT,
    PRIMARY KEY (id_sensor, timestamp)
);

-- ======================
-- TABLA: COMPRADORES
-- ======================
CREATE TABLE compradores (
    id_comprador SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    empresa VARCHAR(100),
    tipo_comprador VARCHAR(50), -- 'mayorista', 'exportador', 'procesador'
    certificaciones TEXT[], -- array de certificaciones que requiere
    volumen_demanda_mensual DECIMAL(10, 2),
    precio_maximo_kg DECIMAL(8, 2)
);


CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_sensores_estado ON sensores(estado);
CREATE INDEX idx_cultivos_tipo ON cultivos(tipo_cultivo);
CREATE INDEX idx_agricultores_organizacion ON agricultores(id_organizacion);

-- Índice para búsquedas rápidas por timestamp
CREATE INDEX idx_sensor_metricas_timestamp ON sensor_metricas(timestamp);

-- ======================
-- DATOS DE EJEMPLO
-- ======================
-- Organizaciones
INSERT INTO organizaciones (nombre, tipo, email) VALUES 
('Cooperativa San Martin', 'cooperativa', 'contacto@coopsanmartin.pe'), -- id_organizacion = 1
('Independientes', 'independiente', 'admin@sachastrace.com');          -- id_organizacion = 2

-- Usuarios
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol, id_organizacion) VALUES 
('Admin', 'Sistema', 'admin@sachastrace.com', '$2b$12$hash_example', 'admin', 2), -- pertenece a "Independientes"
('Juan', 'Perez', 'juanperez@example.com', '$2b$12$hash_example', 'agricultor', 1); -- pertenece a "Cooperativa San Martin"

-- Agricultores
INSERT INTO agricultores (id_usuario, cedula, ubicacion_finca, hectareas_totales, experiencia_anos, id_organizacion) VALUES
(1, '12345678', 'Finca El Paraíso, Tarapoto', 5.5, 10, 1); -- agricultor vinculado a "Cooperativa San Martin"

-- Cultivos
INSERT INTO cultivos (id_agricultor, tipo_cultivo, variedad, hectareas, fecha_siembra) VALUES
(1, 'cacao', 'criollo', 2.0, '2024-06-01'),
(1, 'sacha_inchi', 'nativa', 1.5, '2024-07-15');

-- Sensores
INSERT INTO sensores (codigo_sensor, nombre_sensor, marca, modelo, id_cultivo, intervalo_lectura) VALUES
('SN-001', 'Sensor Cacao #1', 'AgroTech', 'AT-1000', 1, 1800),
('SN-002', 'Sensor Sacha #1', 'AgroTech', 'AT-2000', 2, 3600);

-- Sensor métricas (ejemplo de datos en distintos momentos)
INSERT INTO sensor_metricas (id_sensor, timestamp, temperature, humidity, soil_moisture, light, ph_level) VALUES
(1, NOW() - INTERVAL '2 hour', 28.5, 75.0, 32.1, 800, 6.2),
(1, NOW() - INTERVAL '1 hour', 29.1, 73.5, 30.8, 820, 6.3),
(1, NOW(), 30.0, 72.0, 31.0, 850, 6.1),

(2, NOW() - INTERVAL '1 hour', 26.8, 80.0, 40.2, 700, 5.8),
(2, NOW(), 27.2, 78.5, 38.9, 720, 5.9);