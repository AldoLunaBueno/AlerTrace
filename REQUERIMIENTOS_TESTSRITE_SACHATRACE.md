# 📋 Documento de Requerimientos - SachaTrace para TestSprite

## 🎯 Información General del Proyecto

### **Nombre del Proyecto**: SachaTrace
### **Descripción**: Plataforma integral de trazabilidad agrícola para la cadena de valor del Sacha Inchi en Perú
### **Tipo de Aplicación**: Web Application (Frontend + Backend)
### **Tecnologías**: Next.js 14, TypeScript, Tailwind CSS, FastAPI, PostgreSQL
### **URL del Proyecto**: `http://localhost:3000` (Frontend) | `http://localhost:8000` (Backend)

---

## 🏗️ Arquitectura del Sistema

### **Frontend (Next.js 14)**
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Estado**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Puerto**: 3000

### **Backend (FastAPI)**
- **Framework**: FastAPI (Python)
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT
- **Documentación**: Swagger UI
- **Puerto**: 8000

---

## 👥 Usuarios y Roles

### **1. Agricultores**
- **Acceso**: `/dashboard-agricultor`
- **Funcionalidades**:
  - Monitoreo de sensores IoT (5 parámetros: temperatura, humedad aire/suelo, pH, radiación solar)
  - Dashboard con KPIs en tiempo real
  - Gestión de cultivos
  - Sistema de alertas
  - Reportes básicos

### **2. Empresas Manufactureras**
- **Acceso**: `/dashboard-empresa`
- **Funcionalidades**:
  - Todo lo de agricultores +
  - Conversión de sensores analógicos a digitales
  - Gestión de múltiples sensores por ubicación
  - Generación de reportes CSV/PDF
  - Dashboard de KPIs avanzados
  - Gestión de personal
  - Gestión de áreas de producción

### **3. Administradores del Sistema**
- **Acceso**: Panel de administración (a implementar)
- **Funcionalidades**: Gestión completa del sistema

---

## 🔐 Autenticación y Autorización

### **Sistema de Login**
- **URL**: `/login`
- **Tipos de Usuario**: `industria` | `agricultor`
- **Credenciales de Prueba**:
  - **Industria**: `demo@industria.com` / `demo123`
  - **Agricultor**: `demo@agricultor.com` / `demo123`

### **Flujo de Autenticación**
1. Usuario selecciona tipo de usuario (industria/agricultor)
2. Ingresa email y contraseña
3. Sistema valida credenciales
4. Redirección según tipo:
   - Industria → `/dashboard-empresa`
   - Agricultor → `/dashboard-agricultor`

### **Gestión de Sesiones**
- Token JWT almacenado en localStorage
- Redirección automática si no está autenticado
- Persistencia de tipo de usuario

---

## 📱 Páginas y Funcionalidades Principales

### **1. Landing Page (`/`)**
- **Componentes**: Navbar, Hero Section, Features, About, CTA, Footer
- **Funcionalidad**: Página de presentación del producto
- **Navegación**: Links a Login y Registro

### **2. Autenticación**

#### **Login (`/login`)**
- **Campos**: Email, Password, Tipo de Usuario (selector)
- **Validaciones**: Email válido, contraseña requerida
- **Estados**: Loading, error, success
- **Responsive**: Mobile-first design

#### **Registro (`/registro`)**
- **Campos**: Nombre, Email, Password, Confirm Password, Tipo de Usuario, Empresa (si es industria)
- **Validaciones**: Todos los campos requeridos, email válido, contraseñas coinciden
- **Flujo**: Registro → Login automático → Redirección

### **3. Dashboard Agricultor (`/dashboard-agricultor`)**

#### **Página Principal**
- **Layout**: Sidebar + Content + Bottom Navigation (móvil)
- **Componentes**:
  - Header con información del usuario
  - KPIs principales (sensores activos, alertas, cultivos)
  - Telemetría en tiempo real
  - Cultivos activos
  - Resumen de alertas
  - Estado de sensores

#### **Subpáginas**:
- **Clima (`/dashboard-agricultor/clima`)**: Monitoreo climático
- **Configuración (`/dashboard-agricultor/configuracion-agricultor`)**: Configuración personal
- **Alertas (`/dashboard-agricultor/alertas-agricultor`)**: Gestión de alertas

### **4. Dashboard Empresa (`/dashboard-empresa`)**

#### **Página Principal**
- **Layout**: Sidebar específico para empresas
- **Componentes**:
  - KPIs empresariales
  - Resumen de alertas
  - Estado de equipos/sensores
  - Última actualización en tiempo real

#### **Subpáginas**:
- **Áreas (`/dashboard-empresa/areas`)**: Gestión de áreas de producción
- **Personal (`/dashboard-empresa/personal`)**: Gestión de empleados
- **Configuración (`/dashboard-empresa/configuracion-empresa`)**: Configuración empresarial
- **Alertas (`/dashboard-empresa/alertas-empresa`)**: Gestión de alertas empresariales

### **5. Dashboard General (`/dashboard`)**
- **Funcionalidad**: Dashboard compartido con funcionalidades básicas
- **Subpáginas**:
  - **Sensores (`/dashboard/sensores`)**: Gestión de sensores
  - **Cultivos (`/dashboard/cultivos`)**: Gestión de cultivos
  - **Alertas (`/dashboard/alertas`)**: Sistema de alertas
  - **Mapa (`/dashboard/mapa`)**: Visualización geográfica
  - **Reportes (`/dashboard/reportes`)**: Generación de reportes
  - **Configuración (`/dashboard/configuracion`)**: Configuración general

---

## 🎨 Diseño y UX

### **Sistema de Colores**
- **Agricultores**: Verde (`#16a34a`)
- **Empresas**: Azul (`#2563eb`)
- **Tema**: Soporte para modo claro/oscuro
- **Responsive**: Mobile-first approach

### **Componentes Reutilizables**
- **Sidebar**: Navegación principal (desktop)
- **Bottom Navigation**: Navegación móvil
- **KPI Cards**: Métricas principales
- **Loading Spinner**: Estados de carga
- **Sensor Cards**: Información de sensores
- **Notification Dropdown**: Sistema de notificaciones

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 📊 Datos y Modelos

### **Sensores IoT**
```typescript
interface SensorData {
  device_id: string
  temperatura?: number      // °C
  humedad_aire?: number     // %
  humedad_suelo?: number    // %
  ph_suelo?: number         // pH
  radiacion_solar?: number  // W/m²
  timestamp?: string
}
```

### **Cultivos**
```typescript
interface CultivoResponse {
  id_cultivo: number
  tipo_cultivo: string      // "Sacha Inchi"
  variedad?: string
  hectareas: number
  fecha_siembra?: Date
  fecha_estimada_cosecha?: Date
  estado: string
  ubicacion_especifica?: string
  coordenadas_lat?: number
  coordenadas_lng?: number
}
```

### **Alertas**
```typescript
interface AlertaResponse {
  id_alerta: number
  id_sensor: number
  tipo_alerta: string
  severidad: string         // "alta" | "media" | "baja"
  titulo: string
  mensaje: string
  valor_actual?: number
  valor_umbral?: number
  resuelta: boolean
  fecha_creacion: Date
}
```

---

## 🔧 APIs y Endpoints

### **Autenticación**
- `POST /auth/login` - Login de usuarios
- `GET /auth/me` - Información del usuario actual

### **Sensores**
- `GET /sensores` - Lista de sensores del usuario
- `POST /sensores` - Crear nuevo sensor
- `POST /sensores/data` - Enviar datos del sensor
- `GET /sensores/{id}/lecturas` - Historial de lecturas
- `POST /sensores/umbrales` - Configurar umbrales de alerta

### **Cultivos**
- `GET /cultivos` - Lista de cultivos
- `POST /cultivos` - Crear cultivo
- `PUT /cultivos/{id}` - Actualizar cultivo
- `DELETE /cultivos/{id}` - Eliminar cultivo

### **Alertas**
- `GET /alertas` - Lista de alertas
- `PUT /alertas/{id}/resolver` - Resolver alerta

### **Dashboard**
- `GET /dashboard/stats` - Estadísticas del dashboard
- `GET /dashboard/alerts` - Resumen de alertas

---

## 🧪 Casos de Prueba Prioritarios

### **1. Autenticación y Autorización**
- [ ] Login exitoso para agricultor
- [ ] Login exitoso para empresa manufacturera
- [ ] Validación de credenciales incorrectas
- [ ] Redirección según tipo de usuario
- [ ] Persistencia de sesión
- [ ] Logout y limpieza de tokens
- [ ] Protección de rutas privadas

### **2. Navegación y Layout**
- [ ] Sidebar funcional en desktop
- [ ] Bottom navigation en móvil
- [ ] Responsive design en todos los breakpoints
- [ ] Navegación entre páginas
- [ ] Breadcrumbs y navegación contextual

### **3. Dashboard Principal**
- [ ] Carga de KPIs en tiempo real
- [ ] Visualización de telemetría
- [ ] Estado de sensores actualizado
- [ ] Cultivos activos mostrados
- [ ] Resumen de alertas funcional

### **4. Gestión de Sensores**
- [ ] Lista de sensores del usuario
- [ ] Creación de nuevos sensores
- [ ] Visualización de datos históricos
- [ ] Configuración de umbrales
- [ ] Estados de sensores (activo/inactivo)

### **5. Gestión de Cultivos**
- [ ] Lista de cultivos
- [ ] Creación de cultivos
- [ ] Edición de información de cultivos
- [ ] Asociación de sensores a cultivos
- [ ] Eliminación de cultivos

### **6. Sistema de Alertas**
- [ ] Visualización de alertas pendientes
- [ ] Filtrado por severidad
- [ ] Resolución de alertas
- [ ] Notificaciones en tiempo real
- [ ] Historial de alertas

### **7. Funcionalidades Empresariales**
- [ ] Gestión de áreas de producción
- [ ] Gestión de personal
- [ ] Dashboard empresarial específico
- [ ] Múltiples sensores por ubicación
- [ ] Reportes avanzados

### **8. Responsive y Mobile**
- [ ] Funcionalidad completa en móvil
- [ ] Touch interactions
- [ ] Optimización de carga en móvil
- [ ] PWA functionality
- [ ] Offline capabilities

### **9. Performance y Carga**
- [ ] Tiempo de carga de páginas < 3 segundos
- [ ] Lazy loading de componentes
- [ ] Optimización de imágenes
- [ ] Bundle size optimization
- [ ] Memory leaks prevention

### **10. Integración API**
- [ ] Comunicación exitosa con backend
- [ ] Manejo de errores de API
- [ ] Fallback a datos mock
- [ ] Timeout handling
- [ ] Retry mechanisms

---

## 🎯 Objetivos de Testing

### **Funcionalidad**
- Verificar que todas las funcionalidades principales trabajen correctamente
- Validar flujos completos de usuario (end-to-end)
- Asegurar compatibilidad entre diferentes tipos de usuario

### **Usabilidad**
- Verificar navegación intuitiva
- Validar responsive design
- Asegurar accesibilidad básica

### **Performance**
- Verificar tiempos de carga aceptables
- Validar funcionamiento en diferentes dispositivos
- Asegurar estabilidad en uso prolongado

### **Seguridad**
- Verificar autenticación y autorización
- Validar protección de rutas privadas
- Asegurar manejo seguro de tokens

---

## 🚀 Configuración de TestSprite

### **Información del Proyecto**
- **Tipo**: Frontend
- **Puerto**: 3000
- **URL Base**: `http://localhost:3000`
- **Framework**: Next.js 14
- **Lenguaje**: TypeScript

### **Usuarios de Prueba**
1. **Agricultor**:
   - Email: `demo@agricultor.com`
   - Password: `demo123`
   - Dashboard: `/dashboard-agricultor`

2. **Empresa**:
   - Email: `demo@industria.com`
   - Password: `demo123`
   - Dashboard: `/dashboard-empresa`

### **Páginas Críticas para Testing**
1. `/` - Landing page
2. `/login` - Autenticación
3. `/registro` - Registro de usuarios
4. `/dashboard-agricultor` - Dashboard agricultor
5. `/dashboard-empresa` - Dashboard empresa
6. `/dashboard/sensores` - Gestión de sensores
7. `/dashboard/cultivos` - Gestión de cultivos
8. `/dashboard/alertas` - Sistema de alertas

### **Flujos de Usuario Principales**
1. **Registro → Login → Dashboard**
2. **Gestión de Sensores (Crear → Configurar → Monitorear)**
3. **Gestión de Cultivos (Crear → Asociar Sensores → Monitorear)**
4. **Sistema de Alertas (Recibir → Revisar → Resolver)**
5. **Navegación Responsive (Desktop → Mobile)**

---

## 📝 Notas Adicionales

### **Estado Actual del Proyecto**
- Frontend completamente funcional con datos mock
- Backend API implementado con FastAPI
- Sistema de autenticación básico implementado
- Diseño responsive funcional
- Componentes reutilizables implementados

### **Próximas Funcionalidades (No incluir en testing actual)**
- Integración con blockchain para trazabilidad
- Panel de distribuidores
- Analytics avanzados de mercado
- App móvil nativa
- Integración con sensores analógicos reales

### **Consideraciones Especiales**
- El proyecto está enfocado en Sacha Inchi pero es escalable
- Soporte para múltiples tipos de cultivos
- Sistema preparado para internacionalización
- Arquitectura preparada para microservicios

---

**Documento generado**: Enero 2025  
**Versión**: 1.0  
**Estado**: Listo para implementación de testing con TestSprite
