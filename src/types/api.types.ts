export interface ApiResponse<T> {
  data: T
}

export interface Metadata {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
  firstPageUrl: string
  lastPageUrl: string
  nextPageUrl: string | null
  previousPageUrl: string | null
}

export interface Paginated<T> {
  data: T[]
  metadata: Metadata
}

export interface ApiFieldError {
  message: string
  rule?: string
  field?: string
  meta?: Record<string, unknown>
}

export interface ApiErrorBody {
  errors?: ApiFieldError[]
  message?: string
}

export interface NormalizedError {
  status: number
  message: string
  fieldErrors: Record<string, string>
}
