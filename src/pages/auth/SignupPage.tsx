import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getErrorMessage, getFieldErrors } from '@/lib/axios-interceptors'
import styles from './Auth.module.css'

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!fullName.trim()) errors.fullName = 'Informe seu nome.'
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'E-mail inválido.'
    if (password.length < 8 || password.length > 32)
      errors.password = 'A senha deve ter entre 8 e 32 caracteres.'
    if (password !== passwordConfirmation)
      errors.passwordConfirmation = 'As senhas não coincidem.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      await signup({
        fullName: fullName.trim(),
        email,
        password,
        passwordConfirmation,
      })
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
        <h1 className={styles.title}>Cadastro</h1>
        <p className={styles.switch}>
          Já possui uma conta? <Link to="/login">Login</Link>
        </p>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {formError && <div className={styles.formError}>{formError}</div>}
          <Input
            label="Nome completo"
            placeholder="Nome completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={fieldErrors.fullName}
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          <Input
            label="Confirmar senha"
            type="password"
            placeholder="••••••••"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            error={fieldErrors.passwordConfirmation}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            block
            className={styles.submit}
            disabled={submitting}
          >
            {submitting ? 'Cadastrando...' : 'Cadastre-se'}
          </Button>
        </form>
      </div>
    </div>
  )
}
