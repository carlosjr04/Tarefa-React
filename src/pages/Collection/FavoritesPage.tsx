import { useState } from 'react'
import { useFavorites, useToggleFavorite } from '@/hooks/use-favorites'
import { useDebounce } from '@/hooks/use-debounce'
import { MovieCard } from '@/components/ui/MovieCard'
import { Pagination } from '@/components/ui/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import type { MovieLite } from '@/lib/types/movie.types'
import { icons } from '@/assets/icons'
import styles from './CollectionPage.module.css'

function FavoriteCard({ movie }: { movie: MovieLite }) {
  const toggle = useToggleFavorite(movie.id)
  return (
    <MovieCard
      movie={movie}
      showMeta={false}
      badge="favorite"
      onBadgeClick={() => toggle.mutate(true)}
    />
  )
}

export function FavoritesPage() {
  const [term, setTerm] = useState('')
  const [page, setPage] = useState(1)
  const search = useDebounce(term, 400)

  const changeTerm = (value: string) => {
    setTerm(value)
    setPage(1)
  }

  const { data, isLoading, isError } = useFavorites(page, search)
  const movies = data?.data ?? []

  return (
    <div>
      <h1 className="page-title">Curtidos</h1>

      <div className={styles.searchBar}>
        <img className={styles.searchIcon} src={icons.search} alt="" />
        <input
          className={styles.searchInput}
          placeholder="Pesquisar...."
          value={term}
          onChange={(e) => changeTerm(e.target.value)}
          aria-label="Pesquisar favoritos"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <EmptyState title="Erro" message="Não foi possível carregar seus favoritos." />
      ) : movies.length === 0 ? (
        <EmptyState
          title="Nenhum favorito"
          message="Os filmes que você curtir aparecerão aqui."
        />
      ) : (
        <>
          <div className="grid-posters">
            {movies.map((movie) => (
              <FavoriteCard key={movie.id} movie={movie} />
            ))}
          </div>
          {data && <Pagination metadata={data.metadata} onChange={setPage} />}
        </>
      )}
    </div>
  )
}
