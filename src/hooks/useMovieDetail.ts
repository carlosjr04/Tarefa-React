import { useQuery } from '@tanstack/react-query'
import { movieService } from '@/services/movie.service'
import { useAuth } from '@/hooks/useAuth'

export function useMovieDetail(id: number) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['movie', id, isAuthenticated],
    queryFn: () => movieService.detail(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}
