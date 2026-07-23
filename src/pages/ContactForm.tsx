import { useState, type FormEvent } from 'react'
import { InputField, SelectField, TextAreaField } from '../components/FormField'
import { addSubmission } from '../services/submissions'
import { sendSubmissionEmail } from '../services/email'
import {
  IconBuilding,
  IconBriefcase,
  IconUsers,
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconClipboard,
  IconSend,
  IconReset,
  IconCheck,
  IconDoor,
} from '../components/Icons'
import { PoweredBy } from '../components/PoweredBy'

const AUTORIZADO_OPTIONS = [
  { value: 'propietario', label: 'Propietario' },
  { value: 'administrador', label: 'Administrador' },
]

const TIPO_INGRESO_OPTIONS = [
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'reparacion', label: 'Reparación' },
  { value: 'construccion', label: 'Construcción' },
  { value: 'mobiliario', label: 'Mobiliario' },
  { value: 'otro', label: 'Otro' },
]

const INITIAL = {
  departamento: '',
  empresa: '',
  trabajadores: '',
  autorizado: '',
  email: '',
  telefono: '',
  fechaInicio: '',
  fechaFin: '',
  tipoIngreso: '',
  descripcion: '',
}

type FormErrors = Partial<Record<keyof typeof INITIAL, string>>

export function ContactForm() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function setField<K extends keyof typeof INITIAL>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setSuccess(false)
    setSubmitError('')
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!form.departamento.trim()) next.departamento = 'Indica el departamento'
    if (!form.empresa.trim()) next.empresa = 'Indica la empresa o proveedor'
    if (!form.autorizado) next.autorizado = 'Selecciona quién autoriza'
    if (!form.email.trim()) next.email = 'El correo es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Correo no válido'
    if (!form.fechaInicio) next.fechaInicio = 'Indica la fecha de inicio'
    if (!form.fechaFin) next.fechaFin = 'Indica la fecha de fin'
    if (form.fechaInicio && form.fechaFin && form.fechaFin < form.fechaInicio)
      next.fechaFin = 'La fecha fin debe ser posterior al inicio'
    if (!form.tipoIngreso) next.tipoIngreso = 'Selecciona el tipo de ingreso'
    if (!form.descripcion.trim()) next.descripcion = 'Describe las actividades'
    return next
  }

  function handleClear() {
    setForm(INITIAL)
    setErrors({})
    setSuccess(false)
    setSubmitError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      document.querySelector('.fx-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      await addSubmission({ ...form })
      try {
        await sendSubmissionEmail({ ...form })
      } catch {
        // La solicitud ya quedó guardada; el correo es secundario
      }
      setForm(INITIAL)
      setSuccess(true)
      document.querySelector('.gate-form')?.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo enviar el correo. Revisa la conexión o FormSubmit.'
      setSubmitError(message)
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
        </div>

        <div className="gate-hero-copy">
          <p className="gate-eyebrow">Nuevo Vallarta · México</p>
          <h1 className="gate-title">
            Solicitud de ingreso
            <em> al residencial</em>
          </h1>
          <p className="gate-lead">
            Completa el formulario. La administración revisará y autorizará cada
            solicitud.
          </p>
        </div>
      </aside>

      <main className="gate-form">
        <div className="gate-form-inner">
          <header className="gate-form-head">
            <h2>Formulario de contacto</h2>
            <p>Todos los campos marcados son obligatorios.</p>
          </header>

          {success && (
            <div className="gate-success" role="status">
              <IconCheck size={20} />
              <div>
                <strong>Solicitud enviada</strong>
                <span>Se notificó por correo a la administración.</span>
              </div>
            </div>
          )}

          {submitError && (
            <div className="alert alert-error" role="alert">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="fx-grid">
              <InputField
                label="Departamento"
                required
                icon={<IconBuilding />}
                placeholder="Ej. Torre A · 1204"
                value={form.departamento}
                onChange={(e) => setField('departamento', e.target.value)}
                error={errors.departamento}
              />

              <InputField
                label="Empresa / Proveedor"
                required
                icon={<IconBriefcase />}
                placeholder="Nombre de la empresa"
                value={form.empresa}
                onChange={(e) => setField('empresa', e.target.value)}
                error={errors.empresa}
              />

              <InputField
                label="Nombre de trabajadores"
                icon={<IconUsers />}
                placeholder="Quiénes ingresarán"
                value={form.trabajadores}
                onChange={(e) => setField('trabajadores', e.target.value)}
              />

              <SelectField
                label="Autorizado"
                required
                icon={<IconUser />}
                options={AUTORIZADO_OPTIONS}
                value={form.autorizado}
                onChange={(e) => setField('autorizado', e.target.value)}
                error={errors.autorizado}
              />

              <InputField
                label="Correo electrónico"
                required
                type="email"
                inputMode="email"
                icon={<IconMail />}
                placeholder="nombre@ejemplo.com"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                error={errors.email}
                autoComplete="email"
              />

              <InputField
                label="Teléfono autorizado"
                type="tel"
                inputMode="tel"
                icon={<IconPhone />}
                placeholder="+52 55 0000 0000"
                value={form.telefono}
                onChange={(e) => setField('telefono', e.target.value)}
                autoComplete="tel"
              />

              <InputField
                label="Fecha inicio"
                required
                type="date"
                icon={<IconCalendar />}
                value={form.fechaInicio}
                onChange={(e) => setField('fechaInicio', e.target.value)}
                error={errors.fechaInicio}
              />

              <InputField
                label="Fecha fin"
                required
                type="date"
                icon={<IconCalendar />}
                value={form.fechaFin}
                onChange={(e) => setField('fechaFin', e.target.value)}
                error={errors.fechaFin}
              />

              <div className="fx-span-2">
                <SelectField
                  label="Tipo de ingreso solicitado"
                  required
                  icon={<IconDoor />}
                  options={TIPO_INGRESO_OPTIONS}
                  value={form.tipoIngreso}
                  onChange={(e) => setField('tipoIngreso', e.target.value)}
                  error={errors.tipoIngreso}
                />
              </div>

              <div className="fx-span-2">
                <TextAreaField
                  label="Descripción de actividades"
                  required
                  icon={<IconClipboard />}
                  rows={4}
                  placeholder="Describe el trabajo o motivo del ingreso…"
                  value={form.descripcion}
                  onChange={(e) => setField('descripcion', e.target.value)}
                  error={errors.descripcion}
                />
              </div>
            </div>

            <div className="gate-actions">
              <button type="button" className="gate-btn gate-btn-ghost" onClick={handleClear}>
                <IconReset size={17} />
                Limpiar
              </button>
              <button
                type="submit"
                className="gate-btn gate-btn-solid"
                disabled={submitting}
              >
                <IconSend size={17} />
                {submitting ? 'Enviando…' : 'Enviar'}
              </button>
            </div>
          </form>

          <PoweredBy />
        </div>
      </main>
    </div>
  )
}
