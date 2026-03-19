const trimTrailingSlashes = (value: string): string => value.replace(/\/+$/, '')

const normalizePathPrefix = (value: string): string => {
  if (!value) {
    return '/jsonapi'
  }

  return value.startsWith('/') ? value : `/${value}`
}

export const drupalEnv = {
  baseUrl: trimTrailingSlashes(import.meta.env.VITE_DRUPAL_BASE_URL ?? ''),
  apiPrefix: normalizePathPrefix(import.meta.env.VITE_DRUPAL_API_PREFIX ?? '/jsonapi'),
  authToken: import.meta.env.VITE_DRUPAL_AUTH_TOKEN ?? '',
}

export const getDrupalApiBaseUrl = (): string => {
  if (!drupalEnv.baseUrl) {
    throw new Error('Missing VITE_DRUPAL_BASE_URL. Set it in your environment before using the Drupal client.')
  }

  return `${drupalEnv.baseUrl}${drupalEnv.apiPrefix}`
}
