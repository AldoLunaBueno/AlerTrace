const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type FetchOptions = RequestInit & {
  token?: string
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Error de red',
    }))
    throw new Error(error.message || 'Error en la solicitud')
  }

  return response.json()
}

// Re-export individual API modules
export * from './sensors'