import type { HttpAdapter, HttpRequest, HttpResponse } from '@/types/http'

export abstract class BaseService {
  private readonly httpAdapter: HttpAdapter

  constructor(httpAdapter: HttpAdapter) {
    this.httpAdapter = httpAdapter
  }

  protected async execute<TRequest, TResponse>(
    config: HttpRequest<TRequest>,
  ): Promise<HttpResponse<TResponse>> {
    try {
      return await this.httpAdapter.request<TRequest, TResponse>(config)
    } catch (error: unknown) {
      throw this.httpAdapter.getError(error)
    }
  }
}
