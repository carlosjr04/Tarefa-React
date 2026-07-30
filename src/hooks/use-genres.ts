import { useQuery } from '@tanstack/react-query'
import { genreService } from '@/services/genre.service'

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: genreService.list,
    staleTime: 5 * 60_000,
  })
}
