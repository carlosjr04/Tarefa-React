import { httpClient } from '@/lib/adapter'
import type { AuthResponse, LoginPayload, SignupPayload } from '@/lib/types/auth.types'
import type { AccountProfile } from '@/lib/types/user.types'

export const authService = {
  signup: (payload: SignupPayload): Promise<AuthResponse> =>
    httpClient.post<AuthResponse>('/auth/signup', payload),

  login: (payload: LoginPayload): Promise<AuthResponse> =>
    httpClient.post<AuthResponse>('/auth/login', payload),

  logout: (): Promise<{ message: string }> =>
    httpClient.postRaw<{ message: string }>('/account/logout'),

  getProfile: (): Promise<AccountProfile> =>
    httpClient.get<AccountProfile>('/account/profile'),
}
