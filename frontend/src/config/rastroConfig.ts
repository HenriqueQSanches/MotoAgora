/** Default Rastrosystem host when `VITE_RASTRO_API_BASE` is not set. */
export const RASTRO_DEFAULT_REMOTE_ORIGIN = 'https://teste.rastrosystem.com.br'

/**
 * Base URL for Rastrosystem API calls (no trailing slash).
 * - Production / direct: full origin, e.g. https://teste.rastrosystem.com.br
 * - Local dev behind Vite proxy: /api/rastro (see vite.config proxy + .env.local.example)
 */
export function getRastroApiBase(): string {
  const raw = import.meta.env.VITE_RASTRO_API_BASE
  if (typeof raw === 'string' && raw.trim() !== '') {
    return raw.trim().replace(/\/$/, '')
  }
  return RASTRO_DEFAULT_REMOTE_ORIGIN
}

/** `app` field sent to POST /api_v2/login/ */
export function getRastroLoginAppId(): number {
  const raw = import.meta.env.VITE_RASTRO_APP_ID
  const n = raw != null && raw !== '' ? Number(raw) : NaN
  return Number.isFinite(n) ? n : 9
}

/** When true, login/search/update short-circuit to local mocks (no network). */
export function isRastroMockMode(): boolean {
  return import.meta.env.VITE_RASTRO_MOCK === 'true'
}

export function buildRastroUrl(path: string): string {
  const base = getRastroApiBase()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
