const BASE_URL =
  import.meta.env.VITE_RASTRO_API_BASE ?? 'https://teste.rastrosystem.com.br'

type LoginPayload = {
  login: string
  senha: string
  app: number
}

type SearchVehiclePayload = {
  tag_search?: string
  pessoa_id?: string
}

export type RastroVehicle = {
  id?: number
  veiculo_id?: number
  name?: string
  modelo?: string
  placa?: string
  unique_id?: string
  status?: string | boolean | number
  km_total?: number | string
  time?: string
}

type ApiObject = Record<string, unknown>

function resolveDataArray(value: unknown): ApiObject[] {
  if (Array.isArray(value)) return value as ApiObject[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? (parsed as ApiObject[]) : []
    } catch {
      return []
    }
  }
  if (value && typeof value === 'object') {
    const maybeData = (value as ApiObject).data
    if (Array.isArray(maybeData)) return maybeData as ApiObject[]
  }
  return []
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, init)
  const contentType = response.headers.get('content-type') ?? ''
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const errorMessage =
      typeof body === 'object' && body && 'msg' in (body as ApiObject)
        ? String((body as ApiObject).msg)
        : `Erro HTTP ${response.status}`
    throw new Error(errorMessage)
  }

  return body as T
}

export async function loginRastro(payload: LoginPayload): Promise<{ token: string }> {
  return request<{ token: string }>('/api_v2/login/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export async function searchVehicles(
  token: string,
  payload: SearchVehiclePayload,
): Promise<RastroVehicle[]> {
  const response = await request<ApiObject>('/api_v2/veiculos/buscar/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `token ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const items = resolveDataArray(response.data ?? response)
  return items as RastroVehicle[]
}

export async function updateVehicle(
  token: string,
  vehicleId: number,
  payload: { km_total: number },
): Promise<ApiObject> {
  return request<ApiObject>(`/api_v2/veiculo-update/${vehicleId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `token ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

