-- Schema para SachaTrace - Solo datos de usuarios y configuración
-- Los datos de sensores van a Amazon Timestream

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
-- TABLA: SENSORES (solo configuración, datos van a Timestream)
-- ======================
CREATE TABLE sensores (
    id_sensor SERIAL PRIMARY KEY,
    codigo_sensor VARCHAR(50) UNIQUE NOT NULL, -- código físico del dispositivo
    nombre_sensor VARCHAR(100), -- nombre descriptivo
    tipo_sensor VARCHAR(50) NOT NULL, -- 'humedad', 'temperatura', 'ph_suelo', 'luminosidad'
    marca VARCHAR(50),
    modelo VARCHAR(50),
    fecha_instalacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_comunicacion TIMESTAMP, -- última vez que envió datos
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'mantenimiento', 'dañado')),
    id_cultivo INTEGER REFERENCES cultivos(id_cultivo) ON DELETE SET NULL,
    coordenadas_lat DECIMAL(10, 8),
    coordenadas_lng DECIMAL(11, 8),
    configuracion JSONB, -- parámetros específicos del sensor
    timestream_device_id VARCHAR(100), -- ID para relacionar con datos en Timestream
    certificado_iot TEXT, -- Certificado AWS IoT Core
    intervalo_lectura INTEGER DEFAULT 3600 -- segundos entre lecturas
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
CREATE INDEX idx_sensores_tipo ON sensores(tipo_sensor);
CREATE INDEX idx_sensores_estado ON sensores(estado);
CREATE INDEX idx_cultivos_tipo ON cultivos(tipo_cultivo);
CREATE INDEX idx_agricultores_organizacion ON agricultores(id_organizacion);

-- ======================
-- DATOS DE EJEMPLO
-- ======================
INSERT INTO organizaciones (nombre, tipo, email) VALUES 
('Cooperativa San Martin', 'cooperativa', 'contacto@coopsanmartin.pe'),
('Independientes', 'independiente', 'admin@sachastrace.com');

INSERT INTO usuarios (nombre, apellido, email, password_hash, rol) VALUES 
('Admin', 'Sistema', 'admin@sachastrace.com', '$2b$12$hash_example', 'admin');