/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DRUPAL_BASE_URL?: string
  readonly VITE_DRUPAL_API_PREFIX?: string
  readonly VITE_DRUPAL_AUTH_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
