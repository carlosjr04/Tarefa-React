import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ENV, tokenStorage } from '@/config/env'
import { onUnauthorized } from '@/interceptors/error.interceptor'
import { authService } from '@/services/auth.service'
import type { LoginPayload, SignupPayload } from '@/types/auth.types'
import type { AuthUser } from '@/types/user.types'
import { AuthContext, type AuthContextValue } from '@/providers/auth-context'

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(ENV.USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function persistUser(user: AuthUser | null): void {
  if (user) {
    localStorage.setItem(ENV.USER_STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(ENV.USER_STORAGE_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStorage.get())
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [loading, setLoading] = useState(false)

  const clearSession = useCallback(() => {
    tokenStorage.clear()
    persistUser(null)
    setToken(null)
    setUser(null)
  }, [])

  const persistSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    tokenStorage.set(nextToken)
    persistUser(nextUser)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true)
      try {
        const res = await authService.login(payload)
        persistSession(res.token, res.user)
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const signup = useCallback(
    async (payload: SignupPayload) => {
      setLoading(true)
      try {
        const res = await authService.signup(payload)
        persistSession(res.token, res.user)
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // mesmo se falhar, limpamos a sessão local
    } finally {
      clearSession()
    }
  }, [clearSession])

  // 401 vindo do interceptor => encerra a sessão local
  useEffect(() => onUnauthorized(clearSession), [clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      signup,
      logout,
    }),
    [user, token, loading, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
