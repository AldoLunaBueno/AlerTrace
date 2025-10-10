# SachaTrace Frontend

Frontend para SachaTrace - Sistema de Trazabilidad Agrícola con tecnología IoT.

## 🚀 Características

- **Dashboard en tiempo real** con métricas y KPIs
- **Gestión de sensores IoT** con monitoreo continuo
- **Administración de cultivos** con seguimiento de progreso
- **Sistema de alertas inteligentes** con notificaciones
- **Mapas interactivos** para visualización geográfica
- **Reportes y análisis** detallados
- **Diseño responsivo** optimizado para móviles
- **PWA** (Progressive Web App) para acceso offline

## 🛠️ Tecnologías

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Axios** para peticiones HTTP
- **pnpm** como gestor de paquetes
- **Leaflet** para mapas (pendiente de implementación)

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd SachaTrace/front
```

2. **Configuración automática (recomendado)**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

3. **Configuración manual**
```bash
# Instalar pnpm globalmente (si no está instalado)
npm install -g pnpm@8.15.0

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
```

Editar `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

4. **Ejecutar en modo desarrollo**
```bash
pnpm dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                          # App Router de Next.js
│   ├── dashboard/               # Páginas del dashboard
│   ├── login/                   # Página de login
│   ├── registro/                # Página de registro
│   ├── globals.css              # Estilos globales
│   └── layout.tsx               # Layout raíz
├── components/                   # Componentes reutilizables
│   ├── dashboard/               # Componentes del dashboard
│   ├── landing/                 # Componentes de landing page
│   ├── mobile/                  # Componentes móviles
│   └── shared/                  # Componentes compartidos
├── lib/                         # Utilidades y configuración
│   ├── api.ts                   # Cliente de API
│   └── utils.ts                 # Funciones utilitarias
└── types/                       # Definiciones de tipos TypeScript
```

## 📦 pnpm - Gestor de Paquetes

Este proyecto utiliza **pnpm** como gestor de paquetes por las siguientes ventajas:

- **🚀 Velocidad**: Instalación más rápida que npm/yarn
- **💾 Espacio**: Ahorro de espacio en disco con symlinks
- **🔒 Seguridad**: Mejor manejo de dependencias
- **⚡ Eficiencia**: Caché inteligente y deduplicación

### Comandos pnpm principales:

```bash
# Instalar dependencias
pnpm install

# Agregar dependencia
pnpm add <package-name>

# Agregar dependencia de desarrollo
pnpm add -D <package-name>

# Remover dependencia
pnpm remove <package-name>

# Actualizar dependencias
pnpm update

# Ejecutar script
pnpm run <script-name>

# Verificar dependencias
pnpm audit
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Preview (build + start)
pnpm preview

# Linting
pnpm lint

# Verificación de tipos
pnpm type-check

# Limpiar archivos generados
pnpm clean

# Instalar dependencias
pnpm install

# Agregar dependencia
pnpm add <package-name>

# Agregar dependencia de desarrollo
pnpm add -D <package-name>

# Remover dependencia
pnpm remove <package-name>

# Actualizar dependencias
pnpm update
```

## 🌐 API Backend

El frontend se conecta con el backend de SachaTrace a través de:

- **Base URL**: `http://localhost:8000`
- **Autenticación**: JWT tokens
- **Documentación**: `/docs` (Swagger UI)

### Endpoints Principales

- `POST /auth/login` - Autenticación
- `GET /sensores` - Lista de sensores
- `GET /cultivos` - Lista de cultivos
- `GET /alertas` - Lista de alertas
- `GET /dashboard` - Datos del dashboard

## 📱 PWA

La aplicación está configurada como PWA (Progressive Web App) con:

- **Manifest** configurado para instalación
- **Service Worker** para caché offline
- **Responsive design** para dispositivos móviles
- **Iconos** optimizados para diferentes tamaños

## 🎨 Temas

El sistema soporta temas claro y oscuro con:

- **Variables CSS** para colores
- **Tailwind CSS** con configuración personalizada
- **Componentes** adaptativos a ambos temas

## 📊 Componentes Principales

### Dashboard
- **KPI Cards**: Métricas principales del sistema
- **Telemetría en Tiempo Real**: Datos de sensores actualizados
- **Cultivos Activos**: Estado de los cultivos
- **Alertas Resumen**: Notificaciones importantes
- **Estado de Sensores**: Lista de sensores y su estado

### Gestión
- **Sensores**: CRUD completo de sensores IoT
- **Cultivos**: Administración de cultivos
- **Alertas**: Centro de gestión de alertas
- **Mapa**: Visualización geográfica
- **Reportes**: Generación de reportes

## 🔒 Autenticación

Sistema de autenticación implementado con:

- **JWT tokens** para sesiones
- **Protección de rutas** del dashboard
- **Redirección automática** a login
- **Almacenamiento seguro** en localStorage

## 📈 Performance

Optimizaciones implementadas:

- **Lazy loading** de componentes
- **Código splitting** automático
- **Imágenes optimizadas** con Next.js Image
- **Caché de API** para datos estáticos
- **Debounce** en búsquedas

## 🧪 Testing

Estructura preparada para testing:

- **Jest** para unit tests
- **React Testing Library** para componentes
- **Playwright** para E2E tests (pendiente)

## 🚀 Deployment

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Docker

```bash
# Build de la imagen de desarrollo
docker build -t sachatrace-frontend .

# Build de la imagen de producción
docker build -f Dockerfile.prod -t sachatrace-frontend:prod .

# Ejecutar contenedor de desarrollo
docker run -p 3000:8080 sachatrace-frontend

# Ejecutar contenedor de producción
docker run -p 3000:3000 sachatrace-frontend:prod

# Usar docker-compose (recomendado)
docker-compose up --build
```

### Manual

```bash
# Build
pnpm build

# Iniciar servidor
pnpm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:

- **Email**: soporte@sachatrace.com
- **Documentación**: [docs.sachatrace.com](https://docs.sachatrace.com)
- **Issues**: [GitHub Issues](https://github.com/sachatrace/frontend/issues)

## 🔄 Changelog

### v1.0.0
- ✅ Dashboard principal con KPIs
- ✅ Gestión de sensores IoT
- ✅ Administración de cultivos
- ✅ Sistema de alertas
- ✅ Autenticación JWT
- ✅ PWA configurado
- ✅ Diseño responsivo
- ✅ Temas claro/oscuro

### Próximas versiones
- 🗺️ Mapas interactivos con Leaflet
- 📊 Gráficos avanzados
- 🔔 Notificaciones push
- 📱 App móvil nativa
- 🌐 Internacionalización (i18n)
- 🧪 Testing completo