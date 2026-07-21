export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TOKEN_STORAGE_KEY: import.meta.env.VITE_TOKEN_STORAGE_KEY ?? 'filminhos.token',
  USER_STORAGE_KEY: import.meta.env.VITE_USER_STORAGE_KEY ?? 'filminhos.user',
} as const

if (!ENV.API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL não definida. Copie o .env.example para .env')
}

export const DEFAULT_PER_PAGE = 12

export const RATING_VALUES = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(ENV.TOKEN_STORAGE_KEY)
  },
  set(token: string): void {
    localStorage.setItem(ENV.TOKEN_STORAGE_KEY, token)
  },
  clear(): void {
    localStorage.removeItem(ENV.TOKEN_STORAGE_KEY)
  },
}
