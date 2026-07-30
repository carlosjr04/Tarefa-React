import { httpAdapter } from '@/lib/adapter'
import { apiRoutes, DEFAULT_PER_PAGE } from '@/lib/config'
import { BaseService } from '@/services/base-service'
import {
  normalizePaginatedReviews,
  normalizeReview,
  normalizeReviews,
} from '@/services/review.normalizer'
import type { ApiResponse, Paginated } from '@/types/api.types'
import type { Review, UpdateReviewPayload, UpsertReviewPayload } from '@/types/review.types'

class ReviewService extends BaseService {
  public async listByMovie(
    movieId: number,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  ): Promise<Paginated<Review>> {
    const res = await this.execute<void, Paginated<Review>>({
      method: 'GET',
      url: apiRoutes.REVIEWS,
      params: { movieId: String(movieId), page: String(page), perPage: String(perPage) },
    })
    return normalizePaginatedReviews(res.data)
  }

  public async random(count = 10): Promise<Review[]> {
    const res = await this.execute<void, ApiResponse<Review[]>>({
      method: 'GET',
      url: apiRoutes.REVIEWS_RANDOM,
      params: { count: String(count) },
    })
    return normalizeReviews(res.data.data)
  }

  public async upsert(payload: UpsertReviewPayload): Promise<Review> {
    const res = await this.execute<UpsertReviewPayload, ApiResponse<Review>>({
      method: 'POST',
      url: apiRoutes.REVIEWS,
      data: payload,
    })
    return normalizeReview(res.data.data)
  }

  public async update(id: number, payload: UpdateReviewPayload): Promise<Review> {
    const res = await this.execute<UpdateReviewPayload, ApiResponse<Review>>({
      method: 'PUT',
      url: apiRoutes.review(id),
      data: payload,
    })
    return normalizeReview(res.data.data)
  }

  public async remove(id: number): Promise<void> {
    await this.execute<void, unknown>({
      method: 'DELETE',
      url: apiRoutes.review(id),
    })
  }
}

export const reviewService = new ReviewService(httpAdapter)
