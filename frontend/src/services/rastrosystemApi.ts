import { buildRastroUrl, isRastroMockMode } from '../config/rastroConfig'
import type { ApiObject, LoginPayload, RastroVehicle, SearchVehiclePayload } from './rastroTypes'
import { getMockRastroVehicles, MOCK_RASTRO_TOKEN } from './rastrosystemApiMock'

export type { LoginPayload, RastroVehicle, SearchVehiclePayload } from './rastroTypes'

const mockDelay = () => new Promise((r) => window.setTimeout(r, 120))

/** Exported for tests — normalizes various API list shapes. */
export function resolveDataArray(value: unknown): ApiObject[] {
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
  const response = await fetch(buildRastroUrl(path), init)
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
  if (isRastroMockMode()) {
    await mockDelay()
    return { token: MOCK_RASTRO_TOKEN }
  }

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
  if (isRastroMockMode()) {
    await mockDelay()
    void token
    void payload
    return getMockRastroVehicles()
  }

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
  if (isRastroMockMode()) {
    await mockDelay()
    void token
    void vehicleId
    void payload
    return { ok: true }
  }

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
