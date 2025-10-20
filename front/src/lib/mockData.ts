// Datos mockeados para el frontend de SachaTrace
import type {
  SensorResponse,
  CultivoResponse,
  AlertaResponse,
  KpiData,
  TelemetriaData,
  LecturaSensorResponse
} from '@/types'

// Datos mockeados de sensores
export const mockSensores: SensorResponse[] = [
  {
    id_sensor: 1,
    device_id: 'SENSOR_001',
    nombre: 'Sensor de Temperatura - Lote A',
    tipo: 'temperatura',
    id_empresa: 1,
    activo: true,
    intervalo_lectura: 300,
    ultima_lectura: new Date('2024-01-15T10:30:00Z'),
    bateria_nivel: 85,
    ubicacion_sensor: 'Lote A - Sector Norte',
    coordenadas_lat: -12.0464,
    coordenadas_lng: -77.0428,
    fecha_instalacion: new Date('2024-01-01T00:00:00Z')
  },
  {
    id_sensor: 2,
    device_id: 'SENSOR_002',
    nombre: 'Sensor de Humedad - Lote B',
    tipo: 'humedad',
    id_empresa: 1,
    activo: true,
    intervalo_lectura: 300,
    ultima_lectura: new Date('2024-01-15T10:25:00Z'),
    bateria_nivel: 92,
    ubicacion_sensor: 'Lote B - Sector Sur',
    coordenadas_lat: -12.0500,
    coordenadas_lng: -77.0400,
    fecha_instalacion: new Date('2024-01-05T00:00:00Z')
  },
  {
    id_sensor: 3,
    device_id: 'SENSOR_003',
    nombre: 'Sensor de pH - Lote C',
    tipo: 'ph',
    id_empresa: 1,
    activo: false,
    intervalo_lectura: 600,
    ultima_lectura: new Date('2024-01-14T15:20:00Z'),
    bateria_nivel: 15,
    ubicacion_sensor: 'Lote C - Sector Este',
    coordenadas_lat: -12.0440,
    coordenadas_lng: -77.0450,
    fecha_instalacion: new Date('2024-01-10T00:00:00Z')
  },
  {
    id_sensor: 4,
    device_id: 'SENSOR_004',
    nombre: 'Sensor de Radiación - Lote A',
    tipo: 'radiacion',
    id_empresa: 1,
    activo: true,
    intervalo_lectura: 300,
    ultima_lectura: new Date('2024-01-15T10:28:00Z'),
    bateria_nivel: 78,
    ubicacion_sensor: 'Lote A - Sector Centro',
    coordenadas_lat: -12.0464,
    coordenadas_lng: -77.0428,
    fecha_instalacion: new Date('2024-01-03T00:00:00Z')
  }
]

// Datos mockeados de cultivos
export const mockCultivos: CultivoResponse[] = [
  {
    id_cultivo: 1,
    tipo_cultivo: 'Maíz',
    variedad: 'Híbrido 123',
    hectareas: 5.5,
    fecha_siembra: new Date('2024-01-01T00:00:00Z'),
    fecha_estimada_cosecha: new Date('2024-04-15T00:00:00Z'),
    estado: 'ACTIVO',
    ubicacion_especifica: 'Lote A - Sector Norte',
    coordenadas_lat: -12.0464,
    coordenadas_lng: -77.0428
  },
  {
    id_cultivo: 2,
    tipo_cultivo: 'Papa',
    variedad: 'Canchán',
    hectareas: 3.2,
    fecha_siembra: new Date('2024-01-10T00:00:00Z'),
    fecha_estimada_cosecha: new Date('2024-05-20T00:00:00Z'),
    estado: 'ACTIVO',
    ubicacion_especifica: 'Lote B - Sector Sur',
    coordenadas_lat: -12.0500,
    coordenadas_lng: -77.0400
  },
  {
    id_cultivo: 3,
    tipo_cultivo: 'Quinua',
    variedad: 'Blanca Real',
    hectareas: 2.8,
    fecha_siembra: new Date('2023-12-15T00:00:00Z'),
    fecha_estimada_cosecha: new Date('2024-03-30T00:00:00Z'),
    estado: 'EN_COSECHA',
    ubicacion_especifica: 'Lote C - Sector Este',
    coordenadas_lat: -12.0440,
    coordenadas_lng: -77.0450
  }
]

// Datos mockeados de alertas
export const mockAlertas: AlertaResponse[] = [
  {
    id_alerta: 1,
    id_sensor: 1,
    tipo_alerta: 'temperatura_alta',
    severidad: 'alta',
    titulo: 'Temperatura Elevada',
    mensaje: 'La temperatura ha superado el umbral máximo establecido',
    valor_actual: 35.5,
    valor_umbral: 30.0,
    resuelta: false,
    fecha_creacion: new Date('2024-01-15T09:30:00Z')
  },
  {
    id_alerta: 2,
    id_sensor: 2,
    tipo_alerta: 'humedad_baja',
    severidad: 'media',
    titulo: 'Humedad del Suelo Baja',
    mensaje: 'La humedad del suelo está por debajo del nivel recomendado',
    valor_actual: 25.0,
    valor_umbral: 40.0,
    resuelta: false,
    fecha_creacion: new Date('2024-01-15T08:45:00Z')
  },
  {
    id_alerta: 3,
    id_sensor: 3,
    tipo_alerta: 'sensor_inactivo',
    severidad: 'critica',
    titulo: 'Sensor Inactivo',
    mensaje: 'El sensor no ha enviado datos en las últimas 2 horas',
    valor_actual: undefined,
    valor_umbral: undefined,
    resuelta: false,
    fecha_creacion: new Date('2024-01-15T07:20:00Z')
  }
]

// Datos mockeados de KPIs
export const mockKpiData: KpiData = {
  totalSensores: 4,
  sensoresActivos: 3,
  alertasPendientes: 3,
  cultivosActivos: 3
}

// Datos mockeados de telemetría
export const mockTelemetriaData: TelemetriaData[] = [
  {
    sensorId: 1,
    variable: 'temperatura',
    valor: 28.5,
    unidad: '°C',
    timestamp: new Date().toISOString()
  },
  {
    sensorId: 2,
    variable: 'humedad_aire',
    valor: 65.2,
    unidad: '%',
    timestamp: new Date().toISOString()
  },
  {
    sensorId: 2,
    variable: 'humedad_suelo',
    valor: 45.8,
    unidad: '%',
    timestamp: new Date().toISOString()
  },
  {
    sensorId: 4,
    variable: 'radiacion_solar',
    valor: 850.5,
    unidad: 'W/m²',
    timestamp: new Date().toISOString()
  }
]

// Datos mockeados de lecturas de sensores
export const mockLecturas: LecturaSensorResponse[] = [
  {
    id_lectura: 1,
    id_sensor: 1,
    timestamp: new Date('2024-01-15T10:30:00Z'),
    temperatura: 28.5,
    humedad_aire: 65.2,
    humedad_suelo: 45.8,
    ph_suelo: 6.8,
    radiacion_solar: 850.5
  },
  {
    id_lectura: 2,
    id_sensor: 1,
    timestamp: new Date('2024-01-15T10:25:00Z'),
    temperatura: 27.8,
    humedad_aire: 67.1,
    humedad_suelo: 46.2,
    ph_suelo: 6.7,
    radiacion_solar: 820.3
  },
  {
    id_lectura: 3,
    id_sensor: 2,
    timestamp: new Date('2024-01-15T10:20:00Z'),
    temperatura: 29.1,
    humedad_aire: 63.5,
    humedad_suelo: 44.9,
    ph_suelo: 6.9,
    radiacion_solar: 875.2
  }
]

// Funciones mockeadas para simular llamadas a API
export const mockApi = {
  // Dashboard
  getKpis: async (): Promise<KpiData> => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simular delay
    return mockKpiData
  },

  // Sensores
  getSensores: async (): Promise<SensorResponse[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockSensores
  },

  getSensor: async (id: number): Promise<SensorResponse> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const sensor = mockSensores.find(s => s.id_sensor === id)
    if (!sensor) throw new Error('Sensor no encontrado')
    return sensor
  },

  getLecturas: async (id: number, limit?: number): Promise<LecturaSensorResponse[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lecturas = mockLecturas.filter(l => l.id_sensor === id)
    return limit ? lecturas.slice(0, limit) : lecturas
  },

  getTelemetria: async (): Promise<TelemetriaData[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockTelemetriaData
  },

  getStatus: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockSensores.map(sensor => ({
      id: sensor.id_sensor,
      nombre: sensor.nombre,
      tipo: sensor.tipo,
      ubicacion: sensor.ubicacion_sensor,
      estado: sensor.activo ? 'ACTIVO' : 'INACTIVO',
      ultimaActualizacion: sensor.ultima_lectura?.toISOString() || 'Nunca',
      alertasCount: mockAlertas.filter(a => a.id_sensor === sensor.id_sensor && !a.resuelta).length
    }))
  },

  // Cultivos
  getCultivos: async (): Promise<CultivoResponse[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockCultivos
  },

  getActivos: async (): Promise<CultivoResponse[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockCultivos.filter(c => c.estado === 'ACTIVO')
  },

  // Alertas
  getAlertas: async (): Promise<AlertaResponse[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockAlertas
  },

  resolveAlerta: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const alerta = mockAlertas.find(a => a.id_alerta === id)
    if (alerta) {
      alerta.resuelta = true
    }
  }
}
