import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMovies } from '@/hooks/use-movies'
import { useGenres } from '@/hooks/use-genres'
import { useDebounce } from '@/hooks/use-debounce'
import { MovieCard } from '@/components/ui/MovieCard'
import { Pagination } from '@/components/ui/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { FilterChips } from '@/components/ui/FilterChips'
import { Button } from '@/components/ui/Button'
import { icons } from '@/assets/icons'
import styles from './SearchPage.module.css'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''

  const [term, setTerm] = useState(initialQ)
  const [page, setPage] = useState(1)
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [draftGenres, setDraftGenres] = useState<number[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  // Ajuste de estado durante a render quando a query da URL (header) muda
  const [prevQ, setPrevQ] = useState(initialQ)
  if (initialQ !== prevQ) {
    setPrevQ(initialQ)
    setTerm(initialQ)
    setPage(1)
  }

  const debouncedTerm = useDebounce(term, 400)
  const genres = useGenres()

  const changeTerm = (value: string) => {
    setTerm(value)
    setPage(1)
  }

  const { data, isLoading, isError } = useMovies({
    q: debouncedTerm,
    genreIds: selectedGenres,
    page,
  })

  const selectedGenreObjects = useMemo(
    () => genres.data?.filter((g) => selectedGenres.includes(g.id)) ?? [],
    [genres.data, selectedGenres],
  )

  const openFilter = () => {
    setDraftGenres(selectedGenres)
    setFilterOpen(true)
  }

  const toggleDraft = (id: number) => {
    setDraftGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    )
  }

  const applyFilters = () => {
    setSelectedGenres(draftGenres)
    setPage(1)
    setFilterOpen(false)
  }

  const clearFilters = () => {
    setDraftGenres([])
    setSelectedGenres([])
    setPage(1)
    setFilterOpen(false)
  }

  const removeGenre = (id: number) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== id))
    setPage(1)
  }

  const movies = data?.data ?? []

  return (
    <div>
      <div className={styles.searchBar}>
        <img className={styles.searchIcon} src={icons.search} alt="" />
        <input
          className={styles.searchInput}
          placeholder="Pesquisar...."
          value={term}
          onChange={(e) => changeTerm(e.target.value)}
          aria-label="Pesquisar filmes"
        />
      </div>

      <div className={styles.filterRow}>
        <button type="button" className={styles.addFilter} onClick={openFilter}>
          <span>＋</span> Adicionar Filtro
        </button>
        {selectedGenreObjects.map((genre) => (
          <button
            key={genre.id}
            type="button"
            className={styles.activeChip}
            onClick={() => removeGenre(genre.id)}
          >
            <span>−</span> {genre.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <EmptyState title="Erro" message="Não foi possível carregar os filmes." />
      ) : movies.length === 0 ? (
        <EmptyState title="Nenhum filme encontrado" message="Tente outros termos ou filtros." />
      ) : (
        <>
          <div className="grid-posters">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {data && <Pagination metadata={data.metadata} onChange={setPage} />}
        </>
      )}

      <Modal open={filterOpen} onClose={() => setFilterOpen(false)}>
        <div className={styles.modalHeader}>
          <button
            type="button"
            className={styles.modalBack}
            onClick={() => setFilterOpen(false)}
            aria-label="Voltar"
          >
            ←
          </button>
        </div>
        <h3 className={styles.modalTitle}>Gênero:</h3>
        {genres.isLoading ? (
          <Spinner />
        ) : (
          <FilterChips
            genres={genres.data ?? []}
            selectedIds={draftGenres}
            onToggle={toggleDraft}
          />
        )}
        <div className={styles.modalFooter}>
          <Button variant="danger" onClick={clearFilters}>
            Apagar Todos os Filtros
          </Button>
          <Button onClick={applyFilters}>Concluir</Button>
        </div>
      </Modal>
    </div>
  )
}
