-- 1. CREACIÓN DE ESQUEMAS
CREATE SCHEMA IF NOT EXISTS identity_schema;
CREATE SCHEMA IF NOT EXISTS device_schema;
CREATE SCHEMA IF NOT EXISTS alerting_schema;
CREATE SCHEMA IF NOT EXISTS crops_schema;
-- Agrega más esquemas si defines más servicios

-- 2. ASIGNACIÓN DE PERMISOS ESTRICTOS
-- Revocamos cualquier permiso público para mayor seguridad
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- Permisos para identity-service
GRANT USAGE ON SCHEMA identity_schema TO identity_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA identity_schema TO identity_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA identity_schema GRANT ALL ON TABLES TO identity_user;

-- Permisos para device-service
GRANT USAGE ON SCHEMA device_schema TO device_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA device_schema TO device_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA device_schema GRANT ALL ON TABLES TO device_user;

-- Permisos para alerting-service
GRANT USAGE ON SCHEMA alerting_schema TO alerting_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA alerting_schema TO alerting_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA alerting_schema GRANT ALL ON TABLES TO alerting_user;

-- Permisos para crops-service
GRANT USAGE ON SCHEMA crops_schema TO crops_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA crops_schema TO crops_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA crops_schema GRANT ALL ON TABLES TO crops_user;

-- 3. ASIGNACIÓN DE ROLES
-- Un rol por cada microservicio
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'identity_user') THEN
        CREATE ROLE identity_user;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'device_user') THEN
        CREATE ROLE device_user;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'alerting_user') THEN
        CREATE ROLE alerting_user;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'crops_user') THEN
        CREATE ROLE crops_user;
    END IF;
END
$$;

-- Otorgamos los roles al super-rol 'postgres' para que pueda administrarlos
GRANT identity_user TO postgres;
GRANT device_user TO postgres;
GRANT alerting_user TO postgres;
GRANT crops_user TO postgres;


SELECT 'Roles creados exitosamente.';