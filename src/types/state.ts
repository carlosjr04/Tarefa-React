import type { AuthResponse, LoginPayload, SignupPayload } from './auth.types'
import type { AuthUser } from './user.types'

export interface ApiHookState<TPayload, TData> {
  data?: TData
  error?: Error
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  execute: (payload: TPayload) => void
  reset: () => void
}

export type LoginState = ApiHookState<LoginPayload, AuthResponse>
export type RegisterState = ApiHookState<SignupPayload, AuthResponse>
export type ProfileState = ApiHookState<void, AuthUser>
