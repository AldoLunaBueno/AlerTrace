# Issues – Backend IoT

## Sprint 1 (Semana 1-2)

### Backend Core

**Issue 1: Diseñar esquema de base de datos en PostgreSQL (RDS)**

* Descripción: Crear modelo entidad-relación con tablas para usuarios, organizaciones, agricultores, sensores y cultivos. Definir relaciones con claves foráneas. Validar consistencia del modelo y preparar script inicial de migraciones.

**Issue 2: Implementar proyecto base en FastAPI**

* Descripción: Configurar proyecto base con estructura de carpetas clara (routers, models, services). Crear endpoints CRUD para usuarios y organizaciones. Validar con pruebas rápidas en local.

**Issue 3: Implementar autenticación inicial con JWT**

* Descripción: Configurar librería para generar y validar tokens JWT. Proteger endpoints de usuarios y organizaciones con autenticación. Validar flujo de login y acceso restringido.

**Issue 4: Escribir pruebas unitarias básicas con pytest**

* Descripción: Crear conjunto inicial de pruebas unitarias para CRUD de usuarios y organizaciones. Configurar test runner y asegurar cobertura mínima de código.

### DevOps & Observabilidad

**Issue 5: Crear repositorio en GitHub/GitLab con rama principal protegida**

* Descripción: Crear repositorio central. Configurar ramas protegidas y políticas de revisión de código.

**Issue 6: Configurar CI básico**

* Descripción: Pipeline inicial con jobs para ejecutar linter (flake8/black) y correr pruebas unitarias con pytest. Validar ejecución en cada push y PR.

**Issue 7: Definir entornos (dev, staging, prod)**

* Descripción: Definir variables de configuración para cada entorno. Crear archivo de configuración inicial y documentar cómo cambiar entre entornos.

**Issue 8: Configurar RDS PostgreSQL en AWS (Terraform/CDK)**

* Descripción: Escribir definición de infraestructura como código para levantar RDS PostgreSQL. Incluir parámetros de seguridad (usuarios, contraseñas, networking). Validar conexión desde EC2.

## Sprint 2 (Semana 3-4)

### Backend Core

**Issue 9: Implementar módulo de Sensores**

* Descripción: Crear endpoints para registrar sensores y asignarlos a agricultores. Validar entradas y asegurar consistencia con la base de datos.

**Issue 10: Integrar Amazon Timestream**

* Descripción: Configurar cliente en Python para insertar datos en Timestream. Crear funciones para escritura de datos de sensores y consultas de lecturas históricas.

**Issue 11: Escribir tests de integración para RDS + Timestream**

* Descripción: Configurar pruebas que validen inserción, consulta y consistencia de datos entre RDS y Timestream. Incluir mocks cuando sea necesario.

### DevOps & Observabilidad

**Issue 12: Configurar CI/CD completo**

* Descripción: Extender pipeline para incluir build de Docker, ejecución de pruebas, validación de dependencias y despliegue. Configurar fallos si no hay conexión a BD simulada o si API no responde.

**Issue 13: Configurar Amazon Timestream (IaC)**

* Descripción: Implementar recursos de Timestream usando Terraform/CDK. Definir políticas de acceso y validación de conexión.

**Issue 14: Integrar API con API Gateway + AWS Lambda (opcional)**

* Descripción: Configurar API Gateway para ingestión de datos de sensores y delegar en Lambda para registrar en Timestream. Validar que la API responde a eventos simulados.

**Issue 15: Configurar escaneo de imágenes Docker (Trivy/Grype)**

* Descripción: Integrar escaneo de seguridad en pipeline de CI/CD. Bloquear despliegues si se encuentran vulnerabilidades críticas.

## Sprint 3 (Semana 5-6)

### Backend Core

**Issue 16: Completar módulo de métricas**

* Descripción: Exponer endpoints para consultar métricas procesadas (ej. promedio de humedad por lote). Validar consultas contra Timestream.

**Issue 17: Mejorar autenticación con roles**

* Descripción: Definir roles para agricultores, compradores y organizaciones. Implementar control de permisos en endpoints según rol.

**Issue 18: Documentación automática de API con Swagger/OpenAPI**

* Descripción: Configurar documentación automática de endpoints. Validar que la API exponga un spec en JSON y un frontend de Swagger.

### DevOps & Observabilidad

**Issue 19: Implementar monitoreo y logging con CloudWatch**

* Descripción: Configurar logs centralizados de API en CloudWatch. Exponer métricas como tiempo de respuesta y errores.

**Issue 20: Configurar alertas con AWS SNS**

* Descripción: Definir alertas para fallos de BD o API. Configurar notificaciones vía email o SMS con SNS.

**Issue 21: Integrar healthchecks automáticos en CI/CD**

* Descripción: Configurar validación automática de estado de API y BD en pipeline. Bloquear despliegues si healthchecks fallan.

**Issue 22: Refinar seguridad en despliegue**

* Descripción: Ajustar IAM roles, almacenar secretos en AWS SSM/Secrets Manager. Revisar configuración para cumplimiento de buenas prácticas.

## Sprint 4 (Semana 7-8)

### Backend Core

**Issue 23: Optimización de consultas a Timestream**

* Descripción: Revisar consultas frecuentes, crear índices o vistas optimizadas. Documentar mejoras de rendimiento.

**Issue 24: Implementación de reportes personalizados para agricultores**

* Descripción: Crear servicio para generar reportes en CSV/PDF con métricas de sensores. Validar descarga desde frontend.

**Issue 25: Soporte para métricas agregadas**

* Descripción: Implementar funciones que permitan obtener métricas agregadas (ej. humedad semanal, temperatura promedio). Validar resultados con datos simulados.

**Issue 26: Refactorización + pruebas de carga**

* Descripción: Revisar arquitectura del backend, aplicar refactor en servicios críticos y ejecutar pruebas de carga con locust o ab.

### DevOps & Observabilidad

**Issue 27: Refinar despliegue continuo (Blue/Green o Rolling Updates)**

* Descripción: Implementar estrategia de despliegue sin downtime. Validar rollback seguro.

**Issue 28: Auditoría de seguridad completa**

* Descripción: Revisar dependencias Python, configuración Docker e infraestructura. Documentar riesgos y mitigar vulnerabilidades encontradas.

**Issue 29: Preparar dashboards de monitoreo (Grafana/CloudWatch Dashboards)**

* Descripción: Configurar dashboards para métricas clave de API, BD y sensores. Compartir con equipo.

**Issue 30: Documentación del pipeline y del despliegue**

* Descripción: Documentar configuración completa de CI/CD, estrategia de despliegue, monitoreo y alertas. Incluir pasos reproducibles para nuevos integrantes.

## Entregables Finales

* API Backend en FastAPI con endpoints para: Usuarios/Organizaciones, Sensores, Métricas.
* Base de datos en RDS PostgreSQL y Timestream integradas.
* Pipeline CI/CD automatizado (tests, build, seguridad y despliegue).
* Monitoreo y alertas en AWS.
* Documentación técnica en Markdown.
