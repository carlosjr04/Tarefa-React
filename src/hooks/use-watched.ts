import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { accountService } from '@/lib/services/account.service'

export function useWatched(page = 1, search = '') {
  return useQuery({
    queryKey: ['watched', page, search],
    queryFn: () => accountService.watched(page, undefined, search),
    placeholderData: keepPreviousData,
  })
}

export function useToggleWatched(movieId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (isWatched: boolean) =>
      isWatched
        ? accountService.removeWatched(movieId)
        : accountService.addWatched(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie', movieId] })
      queryClient.invalidateQueries({ queryKey: ['watched'] })
    },
  })
}
