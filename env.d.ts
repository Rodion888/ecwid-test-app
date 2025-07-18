/// <reference types="vite/client" />
/// <reference lib="dom" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_STORE_ID: string;
  readonly VITE_PUBLIC_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    __PINIA_STATE__?: Record<string, unknown>;
  }
}
