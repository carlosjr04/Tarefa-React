export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TOKEN_STORAGE_KEY: import.meta.env.VITE_TOKEN_STORAGE_KEY ?? 'filminhos.token',
  USER_STORAGE_KEY: import.meta.env.VITE_USER_STORAGE_KEY ?? 'filminhos.user',
} as const

/** 'development' | 'production' — vindo do Vite. */
export const nodeEnv = import.meta.env.MODE

if (!ENV.API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL não definida. Copie o .env.example para .env')
}

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
