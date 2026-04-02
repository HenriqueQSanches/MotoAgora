/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_RASTRO_API_BASE?: string
  readonly VITE_RASTRO_APP_ID?: string
  /** When `"true"`, API calls are mocked locally (no credentials needed). */
  readonly VITE_RASTRO_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
