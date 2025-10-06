// Servicio de API para conectar con las APIs reales
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002'
const WRITE_API_URL = process.env.NEXT_PUBLIC_WRITE_API_URL || 'http://localhost:8002'

export interface KpiData {
  rendimientoExtraccion: number
  tiempoEnRango: number
  mermas: number
  lotesProcesados: number
  alertasAbiertas: number
}

export interface TelemetriaData {
  equipoId: string
  variable: string
  valor: number
  unidad: string
  timestamp: string
}

export interface LoteData {
  id: string
  codigo: string
  proveedor: string
  producto: string
  estado: string
  progreso: number
  pesoInicial: number
  pesoActual: number
  merma: number
  tiempoTranscurrido: number
}

export interface AlertaData {
  id: string
  titulo: string
  nivel: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'
  descripcion: string
  equipo: string
  valor: number
  limite: number
  unidad: string
  estado: 'ABIERTA' | 'ACK' | 'CERRADA'
  timestamp: string
}

export interface EquipoStatus {
  id: string
  nombre: string
  ubicacion: string
  estado: 'ACTIVO' | 'ADVERTENCIA' | 'ALERTA' | 'INACTIVO'
  ultimaActualizacion: string
  alertasCount: number
}

// Función para hacer requests con manejo de errores y autenticación automática
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    // Obtener token del localStorage si existe
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Agregar headers adicionales si existen
    if (options?.headers) {
      Object.assign(headers, options.headers)
    }
    
    // Agregar Authorization header si hay token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(url, {
      headers,
      ...options,
    })

    if (!response.ok) {
      // Si el token es inválido, limpiar localStorage
      if (response.status === 401 && token) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request failed for ${url}:`, error)
    throw error
  }
}

// API Read (puerto 3002)
export const readApi = {
  // KPIs
  async getKpis(): Promise<KpiData> {
    try {
      // Intentar obtener datos reales de la API
      const response = await apiRequest<any>(`${API_BASE_URL}/api/v1/read/kpi/rendimiento`)
      
      // Mapear respuesta de la API a nuestro formato
      return {
        rendimientoExtraccion: response.rendimiento || 87.5,
        tiempoEnRango: response.tiempoEnRango || 94.2,
        mermas: response.mermas || 12.5,
        lotesProcesados: response.lotesProcesados || 24,
        alertasAbiertas: response.alertasAbiertas || 3
      }
    } catch (error) {
      console.warn('No se pudieron obtener KPIs de la API, usando datos por defecto:', error)
      // Fallback a datos por defecto
      return {
        rendimientoExtraccion: 87.5,
        tiempoEnRango: 94.2,
        mermas: 12.5,
        lotesProcesados: 24,
        alertasAbiertas: 3
      }
    }
  },

  // Telemetría
  async getTelemetriaReciente(): Promise<TelemetriaData[]> {
    try {
      // Obtener datos de telemetría de diferentes equipos
      const equipos = ['secador-principal', 'prensa-cold-press', 'secador-secundario']
      const telemetriaPromises = equipos.map(equipoId => 
        apiRequest<any>(`${API_BASE_URL}/api/v1/read/equipos/${equipoId}/telemetria-reciente`)
      )
      
      const responses = await Promise.all(telemetriaPromises)
      
      // Flatten y mapear los datos
      return responses.flat().map((item: any) => ({
        equipoId: item.equipoId,
        variable: item.variable,
        valor: item.valor,
        unidad: item.unidad,
        timestamp: item.timestamp
      }))
    } catch (error) {
      console.warn('No se pudo obtener telemetría de la API, usando datos por defecto:', error)
      // Fallback a datos simulados
      return [
        {
          equipoId: 'secador-principal',
          variable: 'temp aire',
          valor: 45.2,
          unidad: '°C',
          timestamp: new Date('2025-01-15T19:00:00').toISOString()
        },
        {
          equipoId: 'secador-principal',
          variable: 'humedad producto',
          valor: 8.5,
          unidad: '%',
          timestamp: new Date('2025-01-15T19:00:00').toISOString()
        },
        {
          equipoId: 'prensa-cold-press',
          variable: 'temp camara',
          valor: 42.1,
          unidad: '°C',
          timestamp: new Date('2025-01-15T19:00:00').toISOString()
        },
        {
          equipoId: 'prensa-cold-press',
          variable: 'presion prensa',
          valor: 285.3,
          unidad: 'bar',
          timestamp: new Date('2025-01-15T19:00:00').toISOString()
        }
      ]
    }
  },

  // Lotes
  async getLotesActivos(): Promise<LoteData[]> {
    try {
      const response = await apiRequest<any>(`${API_BASE_URL}/api/v1/read/lotes`)
      
      return response.map((lote: any) => ({
        id: lote.id,
        codigo: lote.codigo,
        proveedor: lote.proveedor,
        producto: lote.producto,
        estado: lote.estado,
        progreso: lote.progreso || 0,
        pesoInicial: lote.pesoInicial || 0,
        pesoActual: lote.pesoActual || 0,
        merma: lote.merma || 0,
        tiempoTranscurrido: lote.tiempoTranscurrido || 0
      }))
    } catch (error) {
      console.warn('No se pudieron obtener lotes de la API, usando datos por defecto:', error)
      // Fallback a datos simulados
      return [
        {
          id: '1',
          codigo: 'LOT-2024-015',
          proveedor: 'Cooperativa San Martín',
          producto: 'Sacha Inchi Orgánico',
          estado: 'SECADO',
          progreso: 75,
          pesoInicial: 2500,
          pesoActual: 2350,
          merma: 6.0,
          tiempoTranscurrido: 2
        },
        {
          id: '2',
          codigo: 'LOT-2024-016',
          proveedor: 'Finca Los Alpes',
          producto: 'Sacha Inchi Premium',
          estado: 'PRENSADO',
          progreso: 60,
          pesoInicial: 1800,
          pesoActual: 1650,
          merma: 8.3,
          tiempoTranscurrido: 4
        },
        {
          id: '3',
          codigo: 'LOT-2024-017',
          proveedor: 'Asociación Agropecuaria',
          producto: 'Sacha Inchi Tradicional',
          estado: 'RECEPCIONADO',
          progreso: 5,
          pesoInicial: 3200,
          pesoActual: 3200,
          merma: 0.0,
          tiempoTranscurrido: 0
        }
      ]
    }
  },

  // Alertas
  async getAlertasAbiertas(): Promise<AlertaData[]> {
    try {
      const response = await apiRequest<any>(`${API_BASE_URL}/api/v1/read/alertas/abiertas`)
      
      return response.map((alerta: any) => ({
        id: alerta.id,
        titulo: alerta.titulo,
        nivel: alerta.nivel,
        descripcion: alerta.descripcion,
        equipo: alerta.equipo,
        valor: alerta.valor,
        limite: alerta.limite,
        unidad: alerta.unidad,
        estado: alerta.estado,
        timestamp: alerta.timestamp
      }))
    } catch (error) {
      console.warn('No se pudieron obtener alertas de la API, usando datos por defecto:', error)
      // Fallback a datos simulados
      return [
        {
          id: '1',
          titulo: 'Temperatura alta en secador',
          nivel: 'ALTA',
          descripcion: 'Secador Principal • 58.2 °C (límite: 55 °C)',
          equipo: 'Secador Principal',
          valor: 58.2,
          limite: 55,
          unidad: '°C',
          estado: 'ABIERTA',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          titulo: 'Humedad producto alta',
          nivel: 'MEDIA',
          descripcion: 'Secador Secundario • 9.5 % (límite: 9 %)',
          equipo: 'Secador Secundario',
          valor: 9.5,
          limite: 9,
          unidad: '%',
          estado: 'ACK',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          titulo: 'Oxígeno en cabeza alto',
          nivel: 'BAJA',
          descripcion: 'Envasadora Automática • 2.8 % (límite: 2 %)',
          equipo: 'Envasadora Automática',
          valor: 2.8,
          limite: 2,
          unidad: '%',
          estado: 'ABIERTA',
          timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString()
        }
      ]
    }
  },

  // Estado de equipos
  async getEquiposStatus(): Promise<EquipoStatus[]> {
    try {
      // Obtener estado de diferentes equipos
      const equipos = ['secador-principal', 'secador-secundario', 'prensa-cold-press', 'envasadora-automatica', 'filtro-principal']
      const equiposPromises = equipos.map(equipoId => 
        apiRequest<any>(`${API_BASE_URL}/api/v1/read/equipos/${equipoId}`)
      )
      
      const responses = await Promise.all(equiposPromises)
      
      return responses.map((equipo: any) => ({
        id: equipo.id,
        nombre: equipo.nombre,
        ubicacion: equipo.ubicacion,
        estado: equipo.estado,
        ultimaActualizacion: equipo.ultimaActualizacion,
        alertasCount: equipo.alertasCount || 0
      }))
    } catch (error) {
      console.warn('No se pudo obtener estado de equipos de la API, usando datos por defecto:', error)
      // Fallback a datos simulados
      return [
        {
          id: 'secador-principal',
          nombre: 'Secador Principal',
          ubicacion: 'Zona Secado - Nivel 1',
          estado: 'ACTIVO',
          ultimaActualizacion: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          alertasCount: 1
        },
        {
          id: 'secador-secundario',
          nombre: 'Secador Secundario',
          ubicacion: 'Zona Secado - Nivel 2',
          estado: 'ACTIVO',
          ultimaActualizacion: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          alertasCount: 0
        },
        {
          id: 'prensa-cold-press',
          nombre: 'Prensa Cold-Press',
          ubicacion: 'Zona Extracción',
          estado: 'ACTIVO',
          ultimaActualizacion: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
          alertasCount: 0
        },
        {
          id: 'envasadora-automatica',
          nombre: 'Envasadora Automática',
          ubicacion: 'Zona Envasado',
          estado: 'ADVERTENCIA',
          ultimaActualizacion: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          alertasCount: 1
        },
        {
          id: 'filtro-principal',
          nombre: 'Filtro Principal',
          ubicacion: 'Zona Filtrado',
          estado: 'INACTIVO',
          ultimaActualizacion: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          alertasCount: 0
        }
      ]
    }
  }
}

// API Write (puerto 3001)
export const writeApi = {
  async createLote(data: Partial<LoteData>) {
    return apiRequest(`${WRITE_API_URL}/api/v1/write/lotes`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async updateLoteEstado(id: string, estado: string) {
    return apiRequest(`${WRITE_API_URL}/api/v1/write/lotes/${id}/estado/${estado}`, {
      method: 'PATCH'
    })
  },

  async sendTelemetria(data: TelemetriaData) {
    return apiRequest(`${WRITE_API_URL}/api/v1/write/telemetria`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  async ackAlerta(id: string) {
    return apiRequest(`${WRITE_API_URL}/api/v1/write/alertas/${id}/ack`, {
      method: 'PATCH'
    })
  }
}

// Exportación principal para compatibilidad
export const api = {
  ...readApi,
  ...writeApi,
  // Métodos de autenticación
  auth: {
    async login(username: string, password: string) {
      return apiRequest(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })
    },
    
    async getMe() {
      return apiRequest(`${API_BASE_URL}/auth/me`)
    },
    
    async verifyToken() {
      return apiRequest(`${API_BASE_URL}/auth/verify-token`)
    }
  },
  
  // Métodos de alertas
  alertas: {
    async getAlertas() {
      return apiRequest(`${API_BASE_URL}/alertas`)
    },
    
    async resolveAlerta(id: string) {
      return apiRequest(`${API_BASE_URL}/alertas/${id}/resolve`, {
        method: 'POST'
      })
    },
    
    async markAsRead(id: string) {
      return apiRequest(`${API_BASE_URL}/alertas/${id}/read`, {
        method: 'POST'
      })
    }
  },
  
  // Métodos de dashboard
  dashboard: {
    async getTrabajadores() {
      return apiRequest(`${API_BASE_URL}/dashboard/trabajadores`)
    },
    
    async getKpis() {
      return apiRequest(`${API_BASE_URL}/dashboard/kpis`)
    }
  },
  
  // Métodos de sensores
  sensors: {
    async getSensors() {
      return apiRequest(`${API_BASE_URL}/sensores`)
    },
    
    async getSensorData(sensorId: string) {
      return apiRequest(`${API_BASE_URL}/sensores/${sensorId}/lecturas`)
    }
  }
}
