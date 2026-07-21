import axios, { type AxiosRequestConfig } from 'axios'
import { ENV } from '@/config/env'
import { attachAuthInterceptor } from '@/interceptors/auth.interceptor'
import { attachErrorInterceptor } from '@/interceptors/error.interceptor'
import type { ApiResponse } from '@/types/api.types'

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

attachAuthInterceptor(http)
attachErrorInterceptor(http)

export const httpClient = {
  /** GET desembrulhando `{ data }`. */
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    http.get<ApiResponse<T>>(url, config).then((r) => r.data.data),

  /** GET cru — use em endpoints paginados, que precisam de `metadata`. */
  getRaw: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    http.get<T>(url, config).then((r) => r.data),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    http.post<ApiResponse<T>>(url, body, config).then((r) => r.data.data),

  /** POST cru — use no logout, que não vem embrulhado. */
  postRaw: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    http.post<T>(url, body, config).then((r) => r.data),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    http.put<ApiResponse<T>>(url, body, config).then((r) => r.data.data),

  del: (url: string, config?: AxiosRequestConfig): Promise<void> =>
    http.delete(url, config).then(() => undefined),
}
