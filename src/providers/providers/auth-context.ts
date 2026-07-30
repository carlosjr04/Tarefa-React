import { createContext } from 'react'
import type { LoginPayload, SignupPayload } from '@/lib/types/auth.types'
import type { AuthUser } from '@/lib/types/user.types'

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  signup: (payload: SignupPayload) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
