import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resolveDataArray, loginRastro, searchVehicles } from './rastrosystemApi'
import { MOCK_RASTRO_TOKEN } from './rastrosystemApiMock'

describe('resolveDataArray', () => {
  it('returns array as-is', () => {
    expect(resolveDataArray([{ a: 1 }])).toEqual([{ a: 1 }])
  })

  it('parses json string of array', () => {
    expect(resolveDataArray('[{"id":1}]')).toEqual([{ id: 1 }])
  })

  it('reads .data when object wraps array', () => {
    expect(resolveDataArray({ data: [{ x: 1 }] })).toEqual([{ x: 1 }])
  })

  it('returns empty on invalid input', () => {
    expect(resolveDataArray(null)).toEqual([])
    expect(resolveDataArray('not json')).toEqual([])
  })
})

describe('rastrosystemApi (fetch)', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.stubEnv('VITE_RASTRO_MOCK', 'false')
    vi.stubEnv('VITE_RASTRO_API_BASE', 'https://api.example.test')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    globalThis.fetch = originalFetch
  })

  it('loginRastro posts JSON and returns token', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ token: 'real-token' }),
    } as Response)

    const out = await loginRastro({ login: 'u', senha: 'p', app: 9 })
    expect(out.token).toBe('real-token')
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.example.test/api_v2/login/',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('loginRastro throws with API msg on error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ msg: 'Usuário não encontrado.' }),
    } as Response)

    await expect(loginRastro({ login: 'u', senha: 'p', app: 9 })).rejects.toThrow(
      'Usuário não encontrado.',
    )
  })

  it('searchVehicles uses Authorization header', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ data: [{ veiculo_id: 1, placa: 'AAA0000' }] }),
    } as Response)

    const list = await searchVehicles('tok', { tag_search: '' })
    expect(list).toHaveLength(1)
    expect(list[0]?.placa).toBe('AAA0000')
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.example.test/api_v2/veiculos/buscar/',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'token tok',
        }),
      }),
    )
  })
})

describe('rastrosystemApi (mock mode)', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_RASTRO_MOCK', 'true')
    vi.stubEnv('VITE_RASTRO_API_BASE', 'https://ignored.test')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('loginRastro returns mock token without fetch', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const out = await loginRastro({ login: 'x', senha: 'y', app: 9 })
    expect(out.token).toBe(MOCK_RASTRO_TOKEN)
    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })

  it('searchVehicles returns mock vehicles', async () => {
    const list = await searchVehicles('any', {})
    expect(list.length).toBeGreaterThan(0)
  })
})
