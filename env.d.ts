/// <reference types="vite/client" />

// Расширяем типы переменных окружения
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_STORE_ID: string
  readonly VITE_PUBLIC_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
