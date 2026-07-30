import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState/EmptyState'

export function NotFoundPage() {
  return (
    <EmptyState title="Página não encontrada" message="O conteúdo que você procura não existe.">
      <p style={{ marginTop: 16 }}>
        <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Voltar para a Home
        </Link>
      </p>
    </EmptyState>
  )
}
