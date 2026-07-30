import { useState } from 'react'
import { useMyReviews } from '@/hooks/use-my-reviews'
import { useUpdateReview, useDeleteReview } from '@/hooks/use-review-mutations'
import { ReviewCard } from '@/components/ui/ReviewCard'
import { Pagination } from '@/components/ui/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { ReviewFormModal } from '@/components/ui/ReviewFormModal'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { getErrorMessage } from '@/lib/axios-interceptors'
import type { Review } from '@/lib/types/review.types'
import styles from './MyReviewsPage.module.css'

export function MyReviewsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useMyReviews(page)

  const [editing, setEditing] = useState<Review | null>(null)
  const [deleting, setDeleting] = useState<Review | null>(null)

  const updateReview = useUpdateReview()
  const deleteReview = useDeleteReview()

  const handleUpdate = (values: { rating: number; text: string }) => {
    if (!editing) return
    updateReview.mutate(
      { id: editing.id, payload: { rating: values.rating, text: values.text } },
      { onSuccess: () => setEditing(null) },
    )
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteReview.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
  }

  const reviews = data?.data ?? []

  return (
    <div>
      <h1 className="page-title">Minhas Avaliações</h1>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <EmptyState title="Erro" message="Não foi possível carregar suas avaliações." />
      ) : reviews.length === 0 ? (
        <EmptyState
          title="Nenhuma avaliação"
          message="As reviews que você escrever aparecerão aqui."
        />
      ) : (
        <>
          <div className={styles.list}>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onEdit={setEditing}
                onDelete={setDeleting}
                linkUser={false}
              />
            ))}
          </div>
          {data && <Pagination metadata={data.metadata} onChange={setPage} />}
        </>
      )}

      <ReviewFormModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={
          <span>
            Editar Review:{' '}
            <span style={{ color: 'var(--color-success)' }}>{editing?.movie.title}</span>
          </span>
        }
        initialRating={editing?.rating ?? 0}
        initialText={editing?.text ?? ''}
        submitting={updateReview.isPending}
        error={updateReview.isError ? getErrorMessage(updateReview.error) : undefined}
        onSubmit={handleUpdate}
      />

      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)}>
        <div className={styles.confirm}>
          <p className={styles.confirmTitle}>
            Deseja apagar essa avaliação? Esta ação é{' '}
            <span className={styles.danger}>irreversível!</span>
          </p>
          {deleteReview.isError && (
            <p style={{ color: 'var(--color-danger)', fontSize: 13 }}>
              {getErrorMessage(deleteReview.error)}
            </p>
          )}
          <div className={styles.confirmActions}>
            <Button variant="danger" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
            <Button onClick={handleDelete} disabled={deleteReview.isPending}>
              {deleteReview.isPending ? 'Apagando...' : 'Apagar Avaliação'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
