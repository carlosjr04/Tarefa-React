import type { AxiosInstance } from 'axios'
import { tokenStorage } from '@/lib/env'

/** Erro da aplicação: mensagem única + erros por campo (validação). */
export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>

  constructor(
    message: string,
    status: number,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

// --- 401 handler --------------------------------------------------------

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

/**
 * O AuthProvider registra aqui o que fazer num 401 (limpar sessão).
 * Evita importar o provider neste módulo e criar ciclo de dependência.
 */
export function onUnauthorized(handler: UnauthorizedHandler): () => void {
  unauthorizedHandler = handler
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null
  }
}

// --- Interceptors -------------------------------------------------------

export function setupInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use((config) => {
    const token = tokenStorage.get()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        unauthorizedHandler?.()
      }
      return Promise.reject(error)
    },
  )
}

// --- Helpers de erro (usados nas telas) ---------------------------------

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Ocorreu um erro inesperado.'
}

export function getFieldErrors(error: unknown): Record<string, string> {
  return error instanceof ApiError ? error.fieldErrors : {}
}
