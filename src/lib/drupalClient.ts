import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalEnv, getDrupalApiBaseUrl } from '../config/env'

export const drupalClient = axios.create({
  baseURL: getDrupalApiBaseUrl(),
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
})

drupalClient.interceptors.request.use((config) => {
  if (drupalEnv.authToken) {
    config.headers.Authorization = `Bearer ${drupalEnv.authToken}`
  }

  return config
})

export const createDrupalParams = (): DrupalJsonApiParams => new DrupalJsonApiParams()

export const fetchDrupalResource = async <T>(
  resourcePath: string,
  options?: {
    params?: DrupalJsonApiParams
    config?: AxiosRequestConfig
  },
): Promise<T> => {
  const queryString = options?.params?.getQueryString()
  const url = queryString ? `${resourcePath}?${queryString}` : resourcePath
  const { data } = await drupalClient.get<T>(url, options?.config)

  return data
}
