import { httpAdapter } from '@/lib/adapter'
import { apiRoutes } from '@/lib/config'
import { BaseService } from '@/services/base-service'
import type { ApiResponse } from '@/types/api.types'
import type { Genre } from '@/types/genre.types'

class GenreService extends BaseService {
  public async list(): Promise<Genre[]> {
    const res = await this.execute<void, ApiResponse<Genre[]>>({
      method: 'GET',
      url: apiRoutes.GENRES,
    })
    return res.data.data
  }
}

export const genreService = new GenreService(httpAdapter)
