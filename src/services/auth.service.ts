import { httpAdapter } from '@/lib/adapter'
import { apiRoutes } from '@/lib/config'
import { BaseService } from '@/services/base-service'
import type { ApiResponse } from '@/types/api.types'
import type { AuthResponse, LoginPayload, SignupPayload } from '@/types/auth.types'
import type { AccountProfile } from '@/types/user.types'

class AuthService extends BaseService {
  public async signup(payload: SignupPayload): Promise<AuthResponse> {
    const res = await this.execute<SignupPayload, ApiResponse<AuthResponse>>({
      method: 'POST',
      url: apiRoutes.SIGNUP,
      data: payload,
    })
    return res.data.data
  }

  public async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await this.execute<LoginPayload, ApiResponse<AuthResponse>>({
      method: 'POST',
      url: apiRoutes.LOGIN,
      data: payload,
    })
    return res.data.data
  }

  /** Logout não vem embrulhado em `{ data }`. */
  public async logout(): Promise<{ message: string }> {
    const res = await this.execute<void, { message: string }>({
      method: 'POST',
      url: apiRoutes.LOGOUT,
    })
    return res.data
  }

  public async getProfile(): Promise<AccountProfile> {
    const res = await this.execute<void, ApiResponse<AccountProfile>>({
      method: 'GET',
      url: apiRoutes.PROFILE,
    })
    return res.data.data
  }
}

export const authService = new AuthService(httpAdapter)
