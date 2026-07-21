import { AxiosError, type AxiosInstance } from 'axios'
import type { ApiErrorBody, NormalizedError } from '@/types/api.types'

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

export function isNormalizedError(value: unknown): value is NormalizedError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'message' in value &&
    'fieldErrors' in value
  )
}

export function getErrorMessage(error: unknown): string {
  if (isNormalizedError(error)) return error.message
  if (error instanceof Error) return error.message
  return 'Ocorreu um erro inesperado.'
}

export function getFieldErrors(error: unknown): Record<string, string> {
  return isNormalizedError(error) ? error.fieldErrors : {}
}

function normalize(error: AxiosError<ApiErrorBody>): NormalizedError {
  const status = error.response?.status ?? 0
  const body = error.response?.data

  const fieldErrors: Record<string, string> = {}
  if (body?.errors?.length) {
    for (const item of body.errors) {
      if (item.field && !fieldErrors[item.field]) {
        fieldErrors[item.field] = item.message
      }
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

  return { status, message, fieldErrors }
}

export function attachErrorInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (!(error instanceof AxiosError)) {
        const fallback: NormalizedError = {
          status: 0,
          message: 'Ocorreu um erro inesperado.',
          fieldErrors: {},
        }
        return Promise.reject(fallback)
      }

      const normalized = normalize(error as AxiosError<ApiErrorBody>)
      if (normalized.status === 401) {
        unauthorizedHandler?.()
      }
      return Promise.reject(normalized)
    },
  )
}
