import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getErrorMessage, getFieldErrors } from '@/lib/axios-interceptors'
import styles from './Auth.module.css'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'E-mail inválido.'
    if (password.length < 8) errors.password = 'A senha deve ter ao menos 8 caracteres.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setFieldErrors(getFieldErrors(err))
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.brand}>
        Film<span className={styles.brace}>{'{IN}'}</span>hos
      </div>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.switch}>
          Não possui uma conta? <Link to="/signup">Cadastre-se</Link>
        </p>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {formError && <div className={styles.formError}>{formError}</div>}
          <Input
            label="Email"
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            autoComplete="email"
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            block
            className={styles.submit}
            disabled={submitting}
          >
            {submitting ? 'Entrando...' : 'Log In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
