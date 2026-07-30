import { httpClient } from '@/lib/adapter'
import type { Genre } from '@/lib/types/genre.types'

export const genreService = {
  list: (): Promise<Genre[]> => httpClient.get<Genre[]>('/genres'),
}
