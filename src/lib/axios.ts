import axios, {
  isAxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios'
import { ENV } from '@/lib/env'
import { ApiError, setupInterceptors } from '@/lib/axios-interceptors'
import type { ApiErrorBody } from '@/types/api.types'
import type { HttpAdapter, HttpRequest, HttpResponse } from '@/types/http'

export class AxiosAdapter implements HttpAdapter {
  private instance: AxiosInstance

  constructor(instance: AxiosInstance) {
    this.instance = instance
  }

  public async request<TRequest, TResponse>(
    config: HttpRequest<TRequest>,
  ): Promise<HttpResponse<TResponse>> {
    const requestConfig: AxiosRequestConfig = {
      data: config.data,
      url: config.url,
      method: config.method,
      headers: config.headers ?? { 'Content-Type': 'application/json' },
      params: config.params,
    }

    const axiosResponse = await this.instance.request<TResponse>(requestConfig)

    return {
      data: axiosResponse.data,
      status: axiosResponse.status,
      headers: axiosResponse.headers as Record<string, string>,
      raw: axiosResponse,
    }
  }

  public getError(error: unknown): Error {
    if (isAxiosError<ApiErrorBody>(error)) {
      const body = error.response?.data
      const status = error.response?.status ?? 0

      const fieldErrors: Record<string, string> = {}
      for (const item of body?.errors ?? []) {
        if (item.field && !fieldErrors[item.field]) {
          fieldErrors[item.field] = item.message
        }
      }

      let message = body?.message ?? ''
      if (!message && body?.errors?.length) {
        message = body.errors.map((item) => item.message).join(', ')
      }
      if (!message) {
        message =
          status === 0
            ? 'Não foi possível conectar ao servidor. Tente novamente.'
            : error.message || 'Ocorreu um erro inesperado.'
      }

      return new ApiError(message, status, fieldErrors)
    }

    if (error instanceof Error) {
      return error
    }

    return new Error('Ocorreu um erro inesperado.')
  }
}

export const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

setupInterceptors(axiosInstance)
