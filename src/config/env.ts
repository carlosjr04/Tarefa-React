export const ENV = {
  API_BASE_URL: 'https://tarefaapi.onrender.com/api/v1',
  TOKEN_STORAGE_KEY: 'filminhos.token',
  USER_STORAGE_KEY: 'filminhos.user',
} as const

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
