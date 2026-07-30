import axios from 'axios'
import { ENV } from '@/lib/env'
import {
  attachAuthInterceptor,
  attachErrorInterceptor,
} from '@/lib/axios-interceptors'

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

attachAuthInterceptor(http)
attachErrorInterceptor(http)
