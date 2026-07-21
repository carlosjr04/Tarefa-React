import { httpClient } from "@/adapters/http.adapter";
import type { Paginated } from "@/types/api.types";
import type {
  MovieDetail,
  MovieLite,
  MovieListParams,
} from "@/types/movie.types";

/** A API espera `genreIds[]=1&genreIds[]=2`, que não é o formato padrão do axios. */
function buildListQuery(params: MovieListParams): string {
  const search = new URLSearchParams();
  if (params.q?.trim()) search.set("q", params.q.trim());
  if (params.page) search.set("page", String(params.page));
  if (params.perPage) search.set("perPage", String(params.perPage));
  for (const id of params.genreIds ?? []) {
    search.append("genreIds[]", String(id));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const movieService = {
  list: (params: MovieListParams = {}): Promise<Paginated<MovieLite>> =>
    httpClient.getRaw<Paginated<MovieLite>>(`/movies${buildListQuery(params)}`),

  featured: (count = 10): Promise<MovieLite[]> =>
    httpClient.get<MovieLite[]>("/movies/featured", { params: { count } }),

  detail: (id: number): Promise<MovieDetail> =>
    httpClient.get<MovieDetail>(`/movies/${id}`).then((movie) => ({
      ...movie,
      // a API alterna entre number e string em campos decimais
      avgRating: movie.avgRating === null ? null : Number(movie.avgRating),
    })),
};
