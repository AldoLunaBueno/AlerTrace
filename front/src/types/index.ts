// Tipos para la API de SachaTrace

export interface SensorData {
  device_id: string
  temperatura?: number
  humedad_aire?: number
  humedad_suelo?: number
  ph_suelo?: number
  radiacion_solar?: number
  timestamp?: string
}

export interface SensorCreate {
  device_id: string
  nombre: string
  tipo: string
  id_cultivo: number
  ubicacion_sensor?: string
  coordenadas_lat?: number
  coordenadas_lng?: number
  intervalo_lectura?: number
}

export interface SensorUpdate {
  nombre?: string
  activo?: boolean
  intervalo_lectura?: number
  ubicacion_sensor?: string
  coordenadas_lat?: number
  coordenadas_lng?: number
}

export interface SensorResponse {
  id_sensor: number
  device_id: string
  nombre: string
  tipo: string
  id_empresa: number
  activo: boolean
  intervalo_lectura: number
  ultima_lectura?: Date
  bateria_nivel?: number
  ubicacion_sensor?: string
  coordenadas_lat?: number
  coordenadas_lng?: number
  fecha_instalacion: Date
}

export interface LecturaSensorResponse {
  id_lectura: number
  id_sensor: number
  timestamp: Date
  temperatura?: number
  humedad_aire?: number
  humedad_suelo?: number
  ph_suelo?: number
  radiacion_solar?: number
}

export interface AlertaResponse {
  id_alerta: number
  id_sensor: number
  tipo_alerta: string
  severidad: string
  titulo: string
  mensaje: string
  valor_actual?: number
  valor_umbral?: number
  resuelta: boolean
  fecha_creacion: Date
}

export interface ConfiguracionUmbralCreate {
  id_cultivo: number
  temp_min?: number
  temp_max?: number
  humedad_aire_min?: number
  humedad_aire_max?: number
  humedad_suelo_min?: number
  humedad_suelo_max?: number
  ph_min?: number
  ph_max?: number
  radiacion_min?: number
  radiacion_max?: number
}

export interface ConfiguracionUmbralResponse {
  id_configuracion: number
  id_cultivo: number
  temp_min: number
  temp_max: number
  humedad_aire_min: number
  humedad_aire_max: number
  humedad_suelo_min: number
  humedad_suelo_max: number
  ph_min: number
  ph_max: number
  radiacion_min: number
  radiacion_max: number
  activo: boolean
  fecha_creacion: Date
}

export interface DashboardResponse {
  total_cultivos: number
  cultivos_activos: number
  alertas_pendientes: number
}

// Modelos de autenticación
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user_id: string
  username: string
}

export interface UserInfo {
  user_id: string
  username: string
  role: string
}

// Modelos para CRUD de cultivos
export interface CultivoCreate {
  tipo_cultivo: string
  variedad?: string
  hectareas: number
  fecha_siembra?: string
  fecha_estimada_cosecha?: string
  ubicacion_especifica?: string
  coordenadas_lat?: number
  coordenadas_lng?: number
}

export interface CultivoUpdate {
  tipo_cultivo?: string
  variedad?: string
  hectareas?: number
  fecha_siembra?: string
  fecha_estimada_cosecha?: string
  estado?: string
  ubicacion_especifica?: string
  coordenadas_lat?: number
  coordenadas_lng?: number
}

export interface CultivoResponse {
  id_cultivo: number
  tipo_cultivo: string
  variedad?: string
  hectareas: number
  fecha_siembra?: Date
  fecha_estimada_cosecha?: Date
  estado: string
  ubicacion_especifica?: string
  coordenadas_lat?: number
  coordenadas_lng?: number
}

// Modelos para usuarios
export interface UserCreate {
  username: string
  nombre: string
  email: string
  password: string
  rol: string
}

export interface UserUpdate {
  nombre?: string
  email?: string
  rol?: string
  activo?: boolean
}

// Tipos para el frontend
export interface KpiData {
  totalSensores: number
  sensoresActivos: number
  alertasPendientes: number
  cultivosActivos: number
}

export interface TelemetriaData {
  sensorId: number
  variable: string
  valor: number
  unidad: string
  timestamp: string
}

export interface LoteData {
  id: number
  codigo: string
  tipo: string
  variedad: string
  hectareas: number
  estado: string
  progreso: number
  fechaSiembra: Date
  fechaEstimadaCosecha: Date
}

export interface EquipoStatus {
  id: number
  nombre: string
  tipo: string
  ubicacion: string
  estado: 'ACTIVO' | 'ADVERTENCIA' | 'ALERTA' | 'INACTIVO'
  ultimaActualizacion: string
  alertasCount: number
}
