import { httpClient } from '@/adapters/http.adapter'
import type { Genre } from '@/types/genre.types'

export const genreService = {
  list: (): Promise<Genre[]> => httpClient.get<Genre[]>('/genres'),
}
