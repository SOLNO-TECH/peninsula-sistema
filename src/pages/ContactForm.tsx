import { useMemo, useState, type FormEvent } from 'react'
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
import {
  autorizadoOptions,
  getFormCopy,
  LANG_KEY,
  readLang,
  tipoIngresoOptions,
  type Lang,
} from '../i18n/form'

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
  const [lang, setLang] = useState<Lang>(readLang)
  const t = useMemo(() => getFormCopy(lang), [lang])
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function switchLang(next: Lang) {
    setLang(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      /* ignore */
    }
    setErrors({})
  }

  function setField<K extends keyof typeof INITIAL>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setSuccess(false)
    setSubmitError('')
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!form.departamento.trim()) next.departamento = t.errDepartamento
    if (!form.empresa.trim()) next.empresa = t.errEmpresa
    if (!form.autorizado) next.autorizado = t.errAutorizado
    if (!form.email.trim()) next.email = t.errEmail
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = t.errEmailInvalid
    if (!form.fechaInicio) next.fechaInicio = t.errFechaInicio
    if (!form.fechaFin) next.fechaFin = t.errFechaFin
    if (form.fechaInicio && form.fechaFin && form.fechaFin < form.fechaInicio)
      next.fechaFin = t.errFechaOrden
    if (!form.tipoIngreso) next.tipoIngreso = t.errTipo
    if (!form.descripcion.trim()) next.descripcion = t.errDescripcion
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
      const message = err instanceof Error ? err.message : t.errSubmit
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="gate" lang={lang}>
      <aside className="gate-hero">
        <div className="gate-hero-media" aria-hidden="true" />
        <div className="gate-hero-veil" aria-hidden="true" />

        <div className="gate-hero-top">
          <p className="gate-brand">Península</p>
          <div className="lang-switch" role="group" aria-label="Language">
            <button
              type="button"
              className={`lang-btn${lang === 'es' ? ' active' : ''}`}
              onClick={() => switchLang('es')}
            >
              ES
            </button>
            <button
              type="button"
              className={`lang-btn${lang === 'en' ? ' active' : ''}`}
              onClick={() => switchLang('en')}
            >
              EN
            </button>
          </div>
        </div>

        <div className="gate-hero-copy">
          <p className="gate-eyebrow">{t.brandPlace}</p>
          <h1 className="gate-title">
            {t.heroTitle}
            <em>{t.heroTitleEm}</em>
          </h1>
          <p className="gate-lead">{t.heroLead}</p>
        </div>
      </aside>

      <main className="gate-form">
        <div className="gate-form-inner">
          <header className="gate-form-head">
            <div className="gate-form-head-row">
              <div>
                <h2>{t.formTitle}</h2>
                <p>{t.formIntro}</p>
              </div>
              <div className="lang-switch lang-switch-form" role="group" aria-label="Language">
                <button
                  type="button"
                  className={`lang-btn${lang === 'es' ? ' active' : ''}`}
                  onClick={() => switchLang('es')}
                >
                  ES
                </button>
                <button
                  type="button"
                  className={`lang-btn${lang === 'en' ? ' active' : ''}`}
                  onClick={() => switchLang('en')}
                >
                  EN
                </button>
              </div>
            </div>
          </header>

          {success && (
            <div className="gate-success" role="status">
              <IconCheck size={20} />
              <div>
                <strong>{t.successTitle}</strong>
                <span>{t.successBody}</span>
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
                label={t.departamento}
                required
                icon={<IconBuilding />}
                placeholder={t.departamentoPh}
                value={form.departamento}
                onChange={(e) => setField('departamento', e.target.value)}
                error={errors.departamento}
              />

              <InputField
                label={t.empresa}
                required
                icon={<IconBriefcase />}
                placeholder={t.empresaPh}
                value={form.empresa}
                onChange={(e) => setField('empresa', e.target.value)}
                error={errors.empresa}
              />

              <InputField
                label={t.trabajadores}
                icon={<IconUsers />}
                placeholder={t.trabajadoresPh}
                value={form.trabajadores}
                onChange={(e) => setField('trabajadores', e.target.value)}
              />

              <SelectField
                label={t.autorizado}
                required
                icon={<IconUser />}
                placeholder={t.selectPlaceholder}
                options={autorizadoOptions(lang)}
                value={form.autorizado}
                onChange={(e) => setField('autorizado', e.target.value)}
                error={errors.autorizado}
              />

              <InputField
                label={t.email}
                required
                type="email"
                inputMode="email"
                icon={<IconMail />}
                placeholder={t.emailPh}
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                error={errors.email}
                autoComplete="email"
              />

              <InputField
                label={t.telefono}
                type="tel"
                inputMode="tel"
                icon={<IconPhone />}
                placeholder={t.telefonoPh}
                value={form.telefono}
                onChange={(e) => setField('telefono', e.target.value)}
                autoComplete="tel"
              />

              <InputField
                label={t.fechaInicio}
                required
                type="date"
                icon={<IconCalendar />}
                value={form.fechaInicio}
                onChange={(e) => setField('fechaInicio', e.target.value)}
                error={errors.fechaInicio}
              />

              <InputField
                label={t.fechaFin}
                required
                type="date"
                icon={<IconCalendar />}
                value={form.fechaFin}
                onChange={(e) => setField('fechaFin', e.target.value)}
                error={errors.fechaFin}
              />

              <div className="fx-span-2">
                <SelectField
                  label={t.tipoIngreso}
                  required
                  icon={<IconDoor />}
                  placeholder={t.selectPlaceholder}
                  options={tipoIngresoOptions(lang)}
                  value={form.tipoIngreso}
                  onChange={(e) => setField('tipoIngreso', e.target.value)}
                  error={errors.tipoIngreso}
                />
              </div>

              <div className="fx-span-2">
                <TextAreaField
                  label={t.descripcion}
                  required
                  icon={<IconClipboard />}
                  rows={4}
                  placeholder={t.descripcionPh}
                  value={form.descripcion}
                  onChange={(e) => setField('descripcion', e.target.value)}
                  error={errors.descripcion}
                />
              </div>
            </div>

            <div className="gate-actions">
              <button type="button" className="gate-btn gate-btn-ghost" onClick={handleClear}>
                <IconReset size={17} />
                {t.clear}
              </button>
              <button
                type="submit"
                className="gate-btn gate-btn-solid"
                disabled={submitting}
              >
                <IconSend size={17} />
                {submitting ? t.sending : t.send}
              </button>
            </div>
          </form>

          <PoweredBy />
        </div>
      </main>
    </div>
  )
}
