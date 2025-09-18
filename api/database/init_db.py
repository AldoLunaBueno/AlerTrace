#!/usr/bin/env python3
"""
Script de inicialización de base de datos para MallkiTrace
Crea la estructura de tablas y datos de prueba
"""

import os
import psycopg2
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def get_db_connection():
    """Establece conexión con PostgreSQL usando variables de entorno"""
    try:
        return psycopg2.connect(
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            port=os.getenv('POSTGRES_PORT', '5432'),
            user=os.getenv('POSTGRES_USER', 'postgres'),
            password=os.getenv('POSTGRES_PASSWORD', ''),
            database=os.getenv('POSTGRES_DB', 'mallkitrace_dev')
        )
    except Exception as e:
        logger.error(f"Error conectando a la base de datos: {e}")
        sys.exit(1)

# SQL para crear la estructura de base de datos
INIT_SQL = """
-- Eliminar tablas existentes para recrear estructura
DROP TABLE IF EXISTS sensor_metricas CASCADE;
DROP TABLE IF EXISTS sensores CASCADE;
DROP TABLE IF EXISTS compradores CASCADE;
DROP TABLE IF EXISTS agricultores CASCADE;
DROP TABLE IF EXISTS cultivos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS organizaciones CASCADE;
DROP TABLE IF EXISTS lecturas_sensores CASCADE;
DROP TABLE IF EXISTS fincas CASCADE;

-- ======================
-- TABLA: USUARIOS
-- ======================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'agricultor', 'comprador')),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ======================  
-- TABLA: CULTIVOS
-- ======================
CREATE TABLE cultivos (
    id_cultivo SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    tipo_cultivo VARCHAR(50) NOT NULL,
    variedad VARCHAR(100),
    hectareas DECIMAL(8, 2) NOT NULL,
    fecha_siembra TIMESTAMP,
    fecha_estimada_cosecha TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo',
    ubicacion_especifica TEXT,
    coordenadas_lat DECIMAL(10, 8),
    coordenadas_lng DECIMAL(11, 8)
);

-- Índices para mejor performance
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_cultivos_usuario ON cultivos(id_usuario);
CREATE INDEX idx_cultivos_tipo ON cultivos(tipo_cultivo);
CREATE INDEX idx_cultivos_estado ON cultivos(estado);

-- Datos de prueba
INSERT INTO usuarios (username, nombre, email, password_hash, rol) VALUES
('admin', 'Administrador', 'admin@sachatrace.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin'),
('agricultor1', 'Juan Pérez', 'juan@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'agricultor'),
('comprador1', 'María García', 'maria@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'comprador');

-- Cultivos de ejemplo
INSERT INTO cultivos (id_usuario, tipo_cultivo, variedad, hectareas, fecha_siembra, estado) VALUES
(2, 'Café', 'Arábica', 2.5, '2024-01-15', 'activo'),
(2, 'Cacao', 'Trinitario', 1.8, '2024-02-01', 'activo');
"""

def init_database():
    """Ejecuta la inicialización completa de la base de datos"""
    logger.info("Iniciando configuración de base de datos...")
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            logger.info("Ejecutando SQL de inicialización...")
            cur.execute(INIT_SQL)
        
        conn.commit()
        logger.info("Base de datos inicializada correctamente")
        
    except Exception as e:
        logger.error(f"Error inicializando base de datos: {e}")
        conn.rollback()
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    init_database()