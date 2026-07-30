import { httpAdapter } from '@/lib/adapter'
import { apiRoutes } from '@/lib/config'
import { BaseService } from '@/services/base-service'
import type { ApiResponse, Paginated } from '@/types/api.types'
import type { MovieDetail, MovieLite, MovieListParams } from '@/types/movie.types'

/** A API espera `genreIds[]=1&genreIds[]=2`, que não é o formato padrão do axios. */
function buildListQuery(params: MovieListParams): string {
  const search = new URLSearchParams()
  if (params.q?.trim()) search.set('q', params.q.trim())
  if (params.page) search.set('page', String(params.page))
  if (params.perPage) search.set('perPage', String(params.perPage))
  for (const id of params.genreIds ?? []) {
    search.append('genreIds[]', String(id))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

class MovieService extends BaseService {
  public async list(params: MovieListParams = {}): Promise<Paginated<MovieLite>> {
    const res = await this.execute<void, Paginated<MovieLite>>({
      method: 'GET',
      url: `${apiRoutes.MOVIES}${buildListQuery(params)}`,
    })
    return res.data
  }

  public async featured(count = 10): Promise<MovieLite[]> {
    const res = await this.execute<void, ApiResponse<MovieLite[]>>({
      method: 'GET',
      url: apiRoutes.MOVIES_FEATURED,
      params: { count: String(count) },
    })
    return res.data.data
  }

  public async detail(id: number): Promise<MovieDetail> {
    const res = await this.execute<void, ApiResponse<MovieDetail>>({
      method: 'GET',
      url: apiRoutes.movieDetail(id),
    })
    const movie = res.data.data
    return {
      ...movie,
      // a API alterna entre number e string em campos decimais
      avgRating: movie.avgRating === null ? null : Number(movie.avgRating),
    }
  }
}

export const movieService = new MovieService(httpAdapter)
