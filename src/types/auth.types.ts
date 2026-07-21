import type { AuthUser } from '@/types/user.types'

export interface SignupPayload {
  fullName?: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}
