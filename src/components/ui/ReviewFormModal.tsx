import { useState, type ReactNode } from 'react'
import { Modal } from './Modal'
import { StarRating } from './StarRating'
import { Button } from './Button'
import styles from './ReviewFormModal.module.css'

interface ReviewFormModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  initialRating?: number
  initialText?: string
  submitting?: boolean
  error?: string
  onSubmit: (data: { rating: number; text: string }) => void
}

export function ReviewFormModal({
  open,
  onClose,
  title,
  initialRating = 0,
  initialText = '',
  submitting = false,
  error,
  onSubmit,
}: ReviewFormModalProps) {
  const [rating, setRating] = useState(initialRating)
  const [text, setText] = useState(initialText)
  const [localError, setLocalError] = useState('')

  // Reinicia o formulário quando o modal abre (ajuste de estado durante a render)
  const [wasOpen, setWasOpen] = useState(false)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setRating(initialRating)
      setText(initialText)
      setLocalError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating <= 0) {
      setLocalError('Selecione uma nota.')
      return
    }
    setLocalError('')
    onSubmit({ rating, text: text.trim() })
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.stars}>
          <StarRating value={rating} onChange={setRating} size={34} />
        </div>
        <textarea
          className={styles.textarea}
          placeholder="Escrever avaliação..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className={styles.footer}>
          {(localError || error) && (
            <span className={styles.error}>{localError || error}</span>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Concluir'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
