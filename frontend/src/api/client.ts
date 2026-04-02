import axios, { isAxiosError } from 'axios'

const baseURL = import.meta.env.VITE_API_URL?.trim() || ''

export const api = axios.create({
  baseURL,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

export function messageFromAxiosError(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { detail?: unknown; msg?: string } | undefined
    if (typeof d?.msg === 'string') return d.msg
    if (typeof d?.detail === 'string') return d.detail
    if (Array.isArray(d?.detail)) {
      return d.detail
        .map((x: { msg?: string }) => (typeof x?.msg === 'string' ? x.msg : JSON.stringify(x)))
        .join('; ')
    }
  }
  if (err instanceof Error) return err.message
  return 'Erro na requisicao'
}

api.interceptors.response.use(
  (r) => r,
  (err) => Promise.reject(new Error(messageFromAxiosError(err))),
)
