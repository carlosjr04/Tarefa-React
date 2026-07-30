import { BrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { QueryProvider } from '@/lib/providers/query'
import { AuthProvider } from '@/lib/providers/AuthProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  )
}
