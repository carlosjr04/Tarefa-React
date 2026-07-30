import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'
import { nodeEnv } from '@/lib/env'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 60_000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={client}>
      {children}
      {nodeEnv === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
