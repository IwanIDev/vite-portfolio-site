import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { drupalEnv, getDrupalApiBaseUrl } from '../config/env'

export type DrupalArticle = {
  id: string
  attributes?: {
    title?: string
    status?: boolean
    created?: string
  }
}

export type DrupalArticleContent = {
  body: string
  summary?: string
}

let drupalClientInstance: ReturnType<typeof axios.create> | null = null

const getDrupalClient = () => {
  if (!drupalClientInstance) {
    const baseURL = getDrupalApiBaseUrl()
    drupalClientInstance = axios.create({
      baseURL,
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    })

    drupalClientInstance.interceptors.request.use((config) => {
      if (drupalEnv.authToken) {
        config.headers.Authorization = `Bearer ${drupalEnv.authToken}`
      }
      return config
    })
  }

  return drupalClientInstance
}

export const createDrupalParams = (): DrupalJsonApiParams => new DrupalJsonApiParams()

export const fetchDrupalResource = async <T>(
  resourcePath: string,
  options?: {
    params?: DrupalJsonApiParams
    config?: AxiosRequestConfig
  },
): Promise<T> => {
  const client = getDrupalClient();
  const queryString = options?.params?.getQueryString()
  const url = queryString ? `${resourcePath}?${queryString}` : resourcePath
  const { data } = await client.get<T>(url, options?.config)

  return data
}

export const loadArticle = async (id: string) : Promise<DrupalArticle> => {
  const response = await fetchDrupalResource<{ data: DrupalArticle }>(`/node/article/${id}`)
  return response.data
}

export const loadArticleContent = async (id: string) : Promise<DrupalArticleContent> => {
  const response = await fetchDrupalResource<{ data: { attributes: { body: { value: string, summary: string } } } }>(`/node/article/${id}`)
  return {
    body: response.data.attributes.body.value,
    summary: response.data.attributes.body.summary,
  }
}
