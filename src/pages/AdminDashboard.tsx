import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Clock3,
  LogOut,
  Search,
  Trash2,
  XCircle,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { PoweredBy } from '../components/PoweredBy'
import {
  deleteSubmission,
  getSubmissionStats,
  getSubmissions,
  updateSubmissionStatus,
} from '../services/submissions'
import type { AccessSubmission, SubmissionStatus } from '../types'

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
}

const TIPO_LABEL: Record<string, string> = {
  mantenimiento: 'Mantenimiento',
  reparacion: 'Reparación',
  construccion: 'Construcción',
  mobiliario: 'Mobiliario',
  otro: 'Otro',
}

const AUTORIZADO_LABEL: Record<string, string> = {
  propietario: 'Propietario',
  administrador: 'Administrador',
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso + (iso.includes('T') ? '' : 'T12:00:00')).toLocaleDateString(
    'es-MX',
    { day: '2-digit', month: 'short', year: 'numeric' },
  )
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function DetailContent({
  selected,
  onStatus,
  onDelete,
}: {
  selected: AccessSubmission
  onStatus: (id: string, status: SubmissionStatus) => void
  onDelete: (id: string) => void
}) {
  return (
    <>
      <div className="ad-detail-head">
        <div>
          <p className="ad-eyebrow">Departamento {selected.departamento}</p>
          <h2>{selected.empresa}</h2>
        </div>
        <span className={`ad-badge ad-badge-${selected.status}`}>
          {STATUS_LABEL[selected.status]}
        </span>
      </div>

      <dl className="ad-detail-grid">
        <div>
          <dt>Autorizado</dt>
          <dd>{AUTORIZADO_LABEL[selected.autorizado] ?? selected.autorizado}</dd>
        </div>
        <div>
          <dt>Trabajadores</dt>
          <dd>{selected.trabajadores || '—'}</dd>
        </div>
        <div>
          <dt>Correo</dt>
          <dd>
            <a href={`mailto:${selected.email}`}>{selected.email}</a>
          </dd>
        </div>
        <div>
          <dt>Teléfono</dt>
          <dd>
            {selected.telefono ? (
              <a href={`tel:${selected.telefono}`}>{selected.telefono}</a>
            ) : (
              '—'
            )}
          </dd>
        </div>
        <div>
          <dt>Periodo</dt>
          <dd>
            {formatDate(selected.fechaInicio)} – {formatDate(selected.fechaFin)}
          </dd>
        </div>
        <div>
          <dt>Tipo de ingreso</dt>
          <dd>{TIPO_LABEL[selected.tipoIngreso] ?? selected.tipoIngreso}</dd>
        </div>
        <div className="ad-span-2">
          <dt>Recibido</dt>
          <dd>{formatDateTime(selected.createdAt)}</dd>
        </div>
      </dl>

      <div className="ad-detail-block">
        <h3>Descripción</h3>
        <p>{selected.descripcion}</p>
      </div>

      <div className="ad-detail-actions">
        <button
          type="button"
          className="ad-btn ad-btn-ok"
          onClick={() => onStatus(selected.id, 'aprobado')}
        >
          <CheckCircle2 size={16} />
          Aprobar
        </button>
        <button
          type="button"
          className="ad-btn ad-btn-no"
          onClick={() => onStatus(selected.id, 'rechazado')}
        >
          <XCircle size={16} />
          Rechazar
        </button>
        <button
          type="button"
          className="ad-btn ad-btn-mute"
          onClick={() => onDelete(selected.id)}
        >
          <Trash2 size={16} />
          Eliminar
        </button>
      </div>
    </>
  )
}

export function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<AccessSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | SubmissionStatus>('todos')
  const [selected, setSelected] = useState<AccessSubmission | null>(null)

  const stats = useMemo(() => getSubmissionStats(items), [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      if (statusFilter !== 'todos' && item.status !== statusFilter) return false
      if (!q) return true
      return (
        item.departamento.toLowerCase().includes(q) ||
        item.empresa.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.trabajadores.toLowerCase().includes(q)
      )
    })
  }, [items, query, statusFilter])

  async function refresh() {
    setLoadError('')
    try {
      const next = await getSubmissions()
      setItems(next)
      setSelected((prev) =>
        prev ? (next.find((s) => s.id === prev.id) ?? null) : null,
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar'
      setLoadError(message)
      if (message.includes('Sesión')) {
        await logout()
        navigate('/admin/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleStatus(id: string, status: SubmissionStatus) {
    try {
      await updateSubmissionStatus(id, status)
      await refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo actualizar')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta solicitud?')) return
    try {
      await deleteSubmission(id)
      if (selected?.id === id) setSelected(null)
      await refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo eliminar')
    }
  }

  return (
    <div className="ad">
      <header className="ad-top">
        <div className="ad-top-inner">
          <div className="ad-brand">
            <p className="ad-brand-name">Península</p>
            <span className="ad-brand-sep" aria-hidden="true" />
            <p className="ad-brand-sub">Administración</p>
          </div>

          <nav className="ad-top-nav">
            <Link to="/" className="ad-nav-link">
              Formulario <ExternalLink size={14} />
            </Link>
            <button type="button" className="ad-nav-logout" onClick={logout}>
              <LogOut size={15} />
              Salir
            </button>
          </nav>
        </div>
      </header>

      <main className="ad-main">
        <div className="ad-intro">
          <h1>Solicitudes de ingreso</h1>
          <p>Revisa y gestiona los registros del residencial.</p>
        </div>

        <section className="ad-metrics">
          <button
            type="button"
            className={`ad-metric${statusFilter === 'todos' ? ' active' : ''}`}
            onClick={() => setStatusFilter('todos')}
          >
            <span>Total</span>
            <strong>{stats.total}</strong>
          </button>
          <button
            type="button"
            className={`ad-metric pending${statusFilter === 'pendiente' ? ' active' : ''}`}
            onClick={() => setStatusFilter('pendiente')}
          >
            <span>
              <Clock3 size={13} /> Pendientes
            </span>
            <strong>{stats.pendiente}</strong>
          </button>
          <button
            type="button"
            className={`ad-metric ok${statusFilter === 'aprobado' ? ' active' : ''}`}
            onClick={() => setStatusFilter('aprobado')}
          >
            <span>
              <CheckCircle2 size={13} /> Aprobadas
            </span>
            <strong>{stats.aprobado}</strong>
          </button>
          <button
            type="button"
            className={`ad-metric bad${statusFilter === 'rechazado' ? ' active' : ''}`}
            onClick={() => setStatusFilter('rechazado')}
          >
            <span>
              <XCircle size={13} /> Rechazadas
            </span>
            <strong>{stats.rechazado}</strong>
          </button>
        </section>

        <section className="ad-toolbar">
          <label className="ad-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Buscar departamento, empresa o correo…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </section>

        {loadError && (
          <div className="alert alert-error" role="alert">
            {loadError}
          </div>
        )}

        <section className="ad-workspace">
          <div className="ad-list-panel">
            <div className="ad-list-head desktop-only">
              <span>Depto</span>
              <span>Empresa</span>
              <span>Tipo</span>
              <span>Periodo</span>
              <span>Estado</span>
            </div>

            {loading ? (
              <div className="ad-empty">
                <p>Cargando solicitudes…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="ad-empty">
                <p>No hay solicitudes para mostrar</p>
                <span>Cuando envíen el formulario, aparecerán aquí.</span>
              </div>
            ) : (
              <div className="ad-list">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`ad-row${selected?.id === item.id ? ' selected' : ''}`}
                    onClick={() => setSelected(item)}
                  >
                    <span className="ad-row-depto">{item.departamento}</span>
                    <span className="ad-row-empresa">{item.empresa}</span>
                    <span className="ad-row-tipo desktop-only">
                      {TIPO_LABEL[item.tipoIngreso] ?? item.tipoIngreso}
                    </span>
                    <span className="ad-row-fechas desktop-only">
                      {formatDate(item.fechaInicio)} – {formatDate(item.fechaFin)}
                    </span>
                    <span className={`ad-badge ad-badge-${item.status}`}>
                      {STATUS_LABEL[item.status]}
                    </span>
                    <span className="ad-row-go mobile-only">
                      <ChevronRight size={16} />
                    </span>
                    <span className="ad-row-mobile-meta mobile-only">
                      {TIPO_LABEL[item.tipoIngreso] ?? item.tipoIngreso} ·{' '}
                      {formatDate(item.fechaInicio)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="ad-detail desktop-panel">
            {selected ? (
              <DetailContent
                selected={selected}
                onStatus={handleStatus}
                onDelete={handleDelete}
              />
            ) : (
              <div className="ad-empty compact">
                <p>Selecciona una solicitud</p>
                <span>El detalle completo aparecerá en este panel.</span>
              </div>
            )}
          </aside>
        </section>

        <PoweredBy />
      </main>

      {selected && (
        <div className="sheet-root mobile-only" role="dialog" aria-modal="true">
          <button
            type="button"
            className="sheet-backdrop"
            aria-label="Cerrar detalle"
            onClick={() => setSelected(null)}
          />
          <div className="sheet-panel animate-sheet">
            <div className="sheet-handle" aria-hidden="true" />
            <div className="sheet-toolbar">
              <h3>Detalle</h3>
              <button
                type="button"
                className="icon-btn"
                aria-label="Cerrar"
                onClick={() => setSelected(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="sheet-body">
              <DetailContent
                selected={selected}
                onStatus={handleStatus}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
