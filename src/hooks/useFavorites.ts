import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { accountService } from '@/services/account.service'

export function useFavorites(page = 1, search = '') {
  return useQuery({
    queryKey: ['favorites', page, search],
    queryFn: () => accountService.favorites(page, undefined, search),
    placeholderData: keepPreviousData,
  })
}

export function useToggleFavorite(movieId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (isFavorite: boolean) =>
      isFavorite
        ? accountService.removeFavorite(movieId)
        : accountService.addFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie', movieId] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
