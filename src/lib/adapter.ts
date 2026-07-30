import { AxiosAdapter, axiosInstance } from '@/lib/axios'

export const httpAdapter = new AxiosAdapter(axiosInstance)
