# SachaTrace

SachaTrace es una plataforma integral para el monitoreo agrícola e industrial. Integra sensores que envían datos vía HTTP, una API para procesar la información en tiempo real y una interfaz web para visualizar y analizar los resultados.

---

## Estructura del repositorio

- **frontend/** → Aplicación en React (interfaz de usuario).  
- **api/** → API en FastAPI (procesamiento de datos y lógica del sistema).  
- **infra/** → Infraestructura para entorno local (Docker Compose, base de datos simulada y simulador de sensor).  

---

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) instalado
- Git  
- (Opcional) Python 3.9 y Node.js 18+ si quieres correr `api/` o `frontend/` directamente fuera de Docker  

---

## Cómo correr las pruebas de integración local

Desde la carpeta raíz del proyecto:

```bash
cd infra
docker compose up --build
```
