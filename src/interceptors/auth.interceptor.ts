import type { AxiosInstance } from 'axios'
import { tokenStorage } from '@/config/env'

export function attachAuthInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use((config) => {
    const token = tokenStorage.get()
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
  })
}
