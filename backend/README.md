# 🌱 Alertrace API - Backend

Sistema backend para monitoreo agrícola IoT basado en FastAPI. Gestiona sensores ambientales, trabajadores, empresas y generación automática de alertas.

---

## 📑 Índice

1. [Descripción General](#-descripción-general)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Modelos de Datos](#-modelos-de-datos)
6. [Endpoints de la API](#-endpoints-de-la-api)
7. [Sistema de Autenticación](#-sistema-de-autenticación)
8. [Sistema de Sensores IoT](#-sistema-de-sensores-iot)
9. [Sistema de Alertas](#-sistema-de-alertas)
10. [Configuración](#-configuración)
11. [Despliegue](#-despliegue)
12. [Seguridad](#-seguridad)
13. [Mantenimiento](#-mantenimiento)

---

## Descripción General

Alertrace API es un sistema backend robusto diseñado para la gestión integral de operaciones agrícolas mediante monitoreo IoT. El sistema permite:

- **Gestión de Empresas y Trabajadores**: Modelo jerárquico donde empresas gestionan múltiples trabajadores
- **Monitoreo de Sensores en Tiempo Real**: Captura y almacenamiento de datos ambientales
- **Sistema de Alertas Automático**: Generación inteligente de alertas basadas en umbrales configurables
- **Control de Acceso Granular**: Asignación específica de sensores a trabajadores
- **Análisis de Datos Históricos**: Almacenamiento y consulta de lecturas históricas

---

## Arquitectura del Sistema

### Componentes Principales

**API REST (FastAPI)**
- Punto de entrada para todas las operaciones
- Validación automática de datos con Pydantic
- Documentación interactiva OpenAPI/Swagger
- Gestión asíncrona de operaciones

**Base de Datos (PostgreSQL)**
- Almacenamiento relacional de datos
- Integridad referencial con foreign keys
- Índices optimizados para consultas frecuentes
- Soporte para datos geoespaciales

**Worker de Polling**
- Proceso en segundo plano para consulta de sensores
- Integración con API de Tuya IoT
- Almacenamiento automático de lecturas
- Verificación periódica de umbrales

**Sistema de Autenticación**
- Tokens JWT para autenticación stateless
- Soporte para dos tipos de usuarios: Empresas y Trabajadores
- Renovación automática de tokens
- Gestión de sesiones seguras

---

## Tecnologías Utilizadas

### Framework y Lenguaje
- **Python 3.11+**: Lenguaje de programación principal
- **FastAPI**: Framework web moderno y de alto rendimiento
- **Uvicorn**: Servidor ASGI para producción

### Base de Datos
- **PostgreSQL**: Sistema de gestión de base de datos relacional
- **SQLAlchemy**: ORM para Python con soporte completo
- **Alembic**: Sistema de migraciones de base de datos (opcional)

### Validación y Seguridad
- **Pydantic v2**: Validación de datos y serialización
- **python-jose**: Manejo de tokens JWT
- **passlib**: Hashing seguro de contraseñas con bcrypt
- **python-multipart**: Manejo de formularios y archivos

### Infraestructura
- **Docker**: Containerización de la aplicación
- **Docker Compose**: Orquestación de servicios
- **Tuya IoT**: Integración con sensores inteligentes

---

## Estructura del Proyecto

### Organización de Directorios

```
backend/
│
├── api/                          # Lógica de aplicación
│   ├── __init__.py
│   ├── config.py                 # Configuración centralizada
│   ├── main.py                   # Aplicación FastAPI principal
│   ├── worker.py                 # Worker de polling de sensores
│   │
│   ├── auth/                     # Autenticación y autorización
│   │   ├── dependencies.py       # Dependencias de auth
│   │   └── jwt_service.py        # Servicio de tokens JWT
│   │
│   ├── routes/                   # Endpoints de la API
│   │   ├── auth.py              # Autenticación de usuarios
│   │   ├── sensores.py          # Gestión de sensores
│   │   ├── alertas.py           # Gestión de alertas
│   │   ├── cultivos.py          # Gestión de cultivos
│   │   ├── dashboard.py         # Métricas y estadísticas
│   │   └── health.py            # Health checks
│   │
│   ├── models/                   # Modelos Pydantic
│   │   └── schemas.py           # Schemas de validación
│   │
│   └── services/                 # Lógica de negocio
│       └── sensor_service.py    # Servicio de sensores
│
├── database/                     # Gestión de base de datos
│   ├── __init__.py
│   ├── connection.py            # Conexión a BD
│   │
│   ├── models/                   # Modelos SQLAlchemy
│   │   └── database.py          # Definición de tablas
│   │
│   └── scripts/                  # Scripts de utilidad
│       └── manage.py            # Gestión de BD
│
├── Dockerfile                    # Imagen Docker
├── requirements.txt              # Dependencias Python
└── README.md                     # Documentación
```

### Separación de Responsabilidades

- **`api/`**: Contiene toda la lógica de la aplicación web
- **`database/`**: Gestiona modelos de datos y conexiones
- **Configuración**: Centralizada en `api/config.py`
- **Modelos**: Separados en Pydantic (validación) y SQLAlchemy (persistencia)

---

## Modelos de Datos

### Modelo de Empresa
Entidad principal que representa organizaciones agrícolas.

**Atributos clave:**
- Identificación única por RUC
- Gestión de estado (activa, suspendida, inactiva)
- Límite de sensores disponibles
- Relaciones con trabajadores y sensores

### Modelo de Trabajador
Empleados vinculados a una empresa con acceso a sensores asignados.

**Atributos clave:**
- Identificación por DNI único
- Roles diferenciados (admin, supervisor, worker)
- Estado activo/inactivo
- Asignaciones de sensores específicas

### Modelo de Sensor
Dispositivos IoT que capturan datos ambientales.

**Atributos clave:**
- ID físico del dispositivo (device_id)
- Pertenencia a empresa
- Tipo de sensor (multisensor, temperatura, etc.)
- Configuración de intervalo de lectura
- Ubicación geográfica (coordenadas)

### Modelo de Asignación de Sensor
Relación entre trabajadores y sensores.

**Características:**
- Vinculación trabajador-sensor
- Estado activo/inactivo
- Restricción de unicidad (un trabajador-sensor único)

### Modelo de Lectura de Sensor
Almacena datos capturados por sensores.

**Parámetros monitoreados:**
- Temperatura del aire (°C)
- Humedad del aire (%)
- Humedad del suelo (%)
- pH del suelo
- Radiación solar (W/m²)

### Modelo de Alerta
Notificaciones generadas automáticamente.

**Atributos clave:**
- Tipo de alerta (temperatura, humedad, batería, offline)
- Severidad (baja, media, alta, crítica)
- Valores actuales vs umbrales
- Estado de resolución

### Modelo de Configuración de Umbrales
Define límites para generación de alertas.

**Configuraciones:**
- Umbrales de temperatura
- Umbrales de humedad (aire y suelo)
- Umbrales de pH
- Umbrales de radiación solar
- Configuración por empresa

---

## Endpoints de la API

### Autenticación
**Prefijo:** `/auth`

- Inicio de sesión de usuarios
- Verificación de tokens
- Obtención de perfil de usuario
- Soporte para empresas y trabajadores

### Sensores
**Prefijo:** `/sensores`

- Recepción de datos de sensores IoT
- Consulta de sensores asignados
- Gestión de sensores (CRUD)
- Consulta de lecturas históricas
- Configuración de umbrales

### Alertas
**Prefijo:** `/alertas`

- Listado de alertas activas
- Filtrado por severidad y tipo
- Resolución de alertas
- Consulta de historial

### Dashboard
**Prefijo:** `/dashboard`

- KPIs generales del sistema
- Estadísticas de sensores
- Resumen de alertas
- Métricas de producción

### Cultivos
**Prefijo:** `/cultivos`

- Gestión de cultivos
- Vinculación con sensores
- Seguimiento de estado

### Health Check
**Prefijo:** `/health`

- Verificación de estado del servicio
- Diagnóstico de conectividad

**Documentación Interactiva:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 🔐 Sistema de Autenticación

### Tipos de Usuario

**Empresa**
- Entidad administrativa principal
- Gestiona trabajadores y sensores
- Configuración de umbrales globales
- Acceso completo a todos los sensores

**Trabajador**
- Empleado de una empresa
- Acceso limitado a sensores asignados
- Roles diferenciados (admin, supervisor, worker)
- Permisos basados en asignaciones

### Flujo de Autenticación

1. Usuario envía credenciales (DNI/RUC + contraseña)
2. Sistema valida credenciales contra base de datos
3. Generación de token JWT con información de usuario
4. Cliente incluye token en header Authorization
5. Sistema valida token en cada petición protegida

### Seguridad de Tokens

- **Algoritmo**: HS256 (HMAC con SHA-256)
- **Expiración**: Configurable (default 30 minutos)
- **Información incluida**: user_id, user_type, rol
- **Renovación**: Mediante re-autenticación

### Control de Acceso

- Validación de token en endpoints protegidos
- Verificación de permisos por rol
- Filtrado automático de datos por asignaciones
- Segregación de datos por empresa

---

## Sistema de Sensores IoT

### Parámetros Monitoreados

**Temperatura del Aire**
- Rango típico: 10°C - 35°C
- Frecuencia de lectura: Configurable
- Alertas por valores fuera de rango

**Humedad del Aire**
- Rango típico: 40% - 90%
- Medición de humedad relativa
- Crítico para prevención de enfermedades

**Humedad del Suelo**
- Rango típico: 30% - 80%
- Indicador de necesidad de riego
- Optimización de uso de agua

**pH del Suelo**
- Rango típico: 6.0 - 7.5
- Indicador de salud del suelo
- Afecta absorción de nutrientes

**Radiación Solar**
- Rango típico: 200 - 1000 W/m²
- Medición de intensidad lumínica
- Relevante para fotosíntesis

### Integración con Tuya IoT

- Conexión mediante API REST de Tuya
- Autenticación con Access ID y Access Key
- Consulta periódica de estado de dispositivos
- Mapeo automático de datos a formato interno

### Worker de Polling

- Ejecución en thread separado
- Consulta cada 10 segundos por defecto
- Almacenamiento automático en base de datos
- Actualización de timestamp de última lectura
- Manejo de errores y reintentos

---

## Sistema de Alertas

### Tipos de Alertas

**Por Parámetro Ambiental**
- Temperatura fuera de rango
- Humedad excesiva o insuficiente
- pH inadecuado
- Radiación solar anormal

**Por Estado del Sensor**
- Sensor desconectado (offline)
- Batería baja
- Error de lectura

### Niveles de Severidad

- **Baja**: Desviaciones menores, no urgente
- **Media**: Requiere atención en plazo corto
- **Alta**: Requiere atención inmediata
- **Crítica**: Situación de emergencia

### Generación Automática

- Verificación tras cada lectura de sensor
- Comparación contra umbrales configurados
- Prevención de alertas duplicadas (ventana de 2 horas)
- Inclusión de valores actuales y umbrales

### Gestión de Alertas

- Listado filtrable por estado, severidad, tipo
- Resolución manual con notas
- Historial completo de alertas
- Estadísticas de alertas por período

---

---

## Despliegue

### Requisitos del Sistema

**Servidor**
- Sistema operativo: Linux (Ubuntu/Debian recomendado)
- RAM mínima: 2GB
- Espacio en disco: 10GB
- Python 3.11 o superior

**Base de Datos**
- PostgreSQL 13 o superior
- Conexión de red estable
- Credenciales de acceso configuradas

### Ejecución

Orquestación de múltiples servicios (API, base de datos, Redis) con configuración unificada.

### Despliegue en Producción

**Consideraciones:**
- Uso de servidor ASGI (Uvicorn/Gunicorn)
- Configuración de reverse proxy (Nginx)
- Certificados SSL/TLS
- Monitoreo y logging
- Backups automáticos de base de datos
- Escalamiento horizontal si es necesario

---

## Seguridad

### Medidas Implementadas

**Autenticación y Autorización**
- Tokens JWT con expiración configurable
- Hashing seguro de contraseñas (bcrypt)
- Validación de permisos en cada endpoint
- Segregación de datos por empresa

**Protección de Datos**
- Uso de ORM para prevenir inyección SQL
- Validación exhaustiva de entrada con Pydantic
- Sanitización de datos de usuario
- Encriptación de contraseñas en reposo

**Comunicación**
- Soporte para HTTPS en producción
- Configuración CORS restrictiva
- Headers de seguridad apropiados
- Rate limiting (recomendado)

**Base de Datos**
- Conexiones mediante variables de entorno
- No exposición de credenciales en código
- Permisos de base de datos limitados
- Backups encriptados

### Mejores Prácticas

- Rotación periódica de claves secretas
- Auditoría de accesos
- Logging de operaciones sensibles
- Actualización regular de dependencias
- Escaneo de vulnerabilidades

---

## Mantenimiento

### Gestión de Base de Datos

**Scripts Disponibles:**
- `database/scripts/manage.py verify`: Verificar existencia de tablas
- `database/scripts/manage.py summary`: Resumen de datos almacenados

### Monitoreo

**Puntos de Verificación:**
- Health check endpoint activo
- Conexión a base de datos estable
- Worker de polling funcionando
- Tiempo de respuesta de endpoints
- Uso de recursos del servidor

### Logs

**Información Registrada:**
- Errores de aplicación
- Accesos a endpoints
- Operaciones de base de datos
- Resultados de polling de sensores
- Generación de alertas

### Backups

**Estrategia Recomendada:**
- Backups automáticos diarios de base de datos
- Retención de backups por 30 días mínimo
- Pruebas periódicas de restauración
- Almacenamiento en ubicación separada

### Actualizaciones

**Proceso:**
- Revisión de changelog de dependencias
- Pruebas en entorno de staging
- Actualización de requirements.txt
- Despliegue gradual en producción
- Monitoreo post-actualización

---

## Recursos Adicionales

### Documentación Técnica
- Documentación interactiva de API: `/docs`
- Especificación OpenAPI: `/openapi.json`
- ReDoc alternativo: `/redoc`

### Soporte y Contacto
- Repositorio: GitHub (AldoLunaBueno/SachaTrace)
- Branch actual: aldo-sensor-data

---

**Versión:** 2.1
**Última actualización:** Octubre 2025  
**Licencia:** Consultar archivo LICENSE  

---

🌱 **Alertrace** - Tecnología al servicio de la agricultura sostenible