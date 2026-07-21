import { useState } from 'react'
import { useWatched, useToggleWatched } from '@/hooks/useWatched'
import { useDebounce } from '@/hooks/useDebounce'
import { MovieCard } from '@/components/ui/MovieCard'
import { Pagination } from '@/components/ui/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import type { MovieLite } from '@/types/movie.types'
import { icons } from '@/assets/icons'
import styles from './CollectionPage.module.css'

function WatchedCard({ movie }: { movie: MovieLite }) {
  const toggle = useToggleWatched(movie.id)
  return (
    <MovieCard
      movie={movie}
      showMeta={false}
      badge="remove"
      onBadgeClick={() => toggle.mutate(true)}
    />
  )
}

export function WatchedPage() {
  const [term, setTerm] = useState('')
  const [page, setPage] = useState(1)
  const search = useDebounce(term, 400)

  const changeTerm = (value: string) => {
    setTerm(value)
    setPage(1)
  }

  const { data, isLoading, isError } = useWatched(page, search)
  const movies = data?.data ?? []

  return (
    <div>
      <h1 className="page-title">Assistidos</h1>

      <div className={styles.searchBar}>
        <img className={styles.searchIcon} src={icons.search} alt="" />
        <input
          className={styles.searchInput}
          placeholder="Pesquisar...."
          value={term}
          onChange={(e) => changeTerm(e.target.value)}
          aria-label="Pesquisar assistidos"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <EmptyState title="Erro" message="Não foi possível carregar seus assistidos." />
      ) : movies.length === 0 ? (
        <EmptyState
          title="Nenhum assistido"
          message="Os filmes que você marcar como assistido aparecerão aqui."
        />
      ) : (
        <>
          <div className="grid-posters">
            {movies.map((movie) => (
              <WatchedCard key={movie.id} movie={movie} />
            ))}
          </div>
          {data && <Pagination metadata={data.metadata} onChange={setPage} />}
        </>
      )}
    </div>
  )
}
