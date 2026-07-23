import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  IconUser,
  IconLock,
  IconSend,
} from '../components/Icons'
import { PoweredBy } from '../components/PoweredBy'

export function AdminLogin() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const ok = await login(username.trim(), password)
      if (ok) navigate('/admin')
      else setError('Usuario o contraseña incorrectos')
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="gate">
      <aside className="gate-hero">
        <div className="gate-hero-media" aria-hidden="true" />
        <div className="gate-hero-veil" aria-hidden="true" />

        <div className="gate-hero-top">
          <p className="gate-brand">Península</p>
          <Link to="/" className="gate-admin">
            Formulario <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="gate-hero-copy">
          <p className="gate-eyebrow">Nuevo Vallarta · México</p>
          <h1 className="gate-title">
            Acceso
            <em> administración</em>
          </h1>
          <p className="gate-lead">
            Panel exclusivo para el personal autorizado del residencial.
          </p>
        </div>
      </aside>

      <main className="gate-form">
        <div className="gate-form-inner login-inner">
          <header className="gate-form-head">
            <h2>Administración</h2>
            <p>Ingresa con tu usuario autorizado.</p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="fx-grid login-fields">
              <div className="fx-span-2">
                <label className="fx">
                  <span className="fx-label">Usuario</span>
                  <span className="fx-control has-icon">
                    <span className="fx-icon">
                      <IconUser />
                    </span>
                    <input
                      className="fx-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Tu usuario"
                      autoComplete="username"
                      required
                    />
                  </span>
                </label>
              </div>

              <div className="fx-span-2">
                <label className="fx">
                  <span className="fx-label">Contraseña</span>
                  <span className="fx-control has-icon">
                    <span className="fx-icon">
                      <IconLock />
                    </span>
                    <input
                      className="fx-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="alert alert-error" role="alert">
                {error}
              </div>
            )}

            <div className="gate-actions">
              <button
                type="submit"
                className="gate-btn gate-btn-solid"
                style={{ flex: 1 }}
                disabled={submitting}
              >
                <IconSend size={17} />
                {submitting ? 'Ingresando…' : 'Ingresar'}
              </button>
            </div>

            <p className="login-back">
              <Link to="/">← Volver al formulario</Link>
            </p>
          </form>

          <PoweredBy />
        </div>
      </main>
    </div>
  )
}
