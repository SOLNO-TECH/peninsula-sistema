import {
  getEmailSubject,
  resolveEmailLabels,
  type FormPayload,
} from '../emails/submissionEmailHtml'

export type { FormPayload }

const NOTIFY_EMAIL =
  import.meta.env.VITE_NOTIFY_EMAIL || 'proveedores@peninsulanvo.com'

/** Hash de FormSubmit (oculta el correo principal). Si está vacío, usa el email. */
const FORMSUBMIT_ID = import.meta.env.VITE_FORMSUBMIT_ID || ''

/** Correos extra (coma-separados). Por defecto incluye recepción. */
const EXTRA_EMAILS = String(
  import.meta.env.VITE_NOTIFY_EXTRA_EMAILS || 'recepcion@peninsulanvo.com',
)
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean)

function buildPayload(data: FormPayload) {
  const labels = resolveEmailLabels(data)
  const resumen = [
    `Departamento: ${data.departamento}`,
    `Proveedor: ${data.empresa}`,
    `Trabajadores: ${data.trabajadores || '—'}`,
    `Autorizado: ${labels.autorizado}`,
    `Correo: ${data.email}`,
    `Teléfono: ${data.telefono || '—'}`,
    `Fecha inicio: ${data.fechaInicio}`,
    `Fecha fin: ${data.fechaFin}`,
    `Tipo de ingreso: ${labels.motivo}`,
    `Descripción: ${data.descripcion}`,
  ].join('\n')

  return {
    _subject: getEmailSubject(),
    _template: 'table',
    _captcha: 'false',
    _honey: '',
    'Nueva solicitud': 'Registro de ingreso — Península Accesos',
    Datos: resumen,
  }
}

async function postToFormSubmit(endpoint: string, body: object): Promise<void> {
  const response = await fetch(`https://formsubmit.co/ajax/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `No se pudo enviar a ${endpoint}`)
  }

  const result = (await response.json().catch(() => null)) as {
    success?: string | boolean
    message?: string
  } | null

  if (result && result.success === false) {
    throw new Error(result.message || `No se pudo enviar a ${endpoint}`)
  }
}

/**
 * Envía a proveedores (hash o email) y también a recepción / extras.
 */
export async function sendSubmissionEmail(data: FormPayload): Promise<void> {
  const primary = FORMSUBMIT_ID || NOTIFY_EMAIL
  const endpoints = Array.from(new Set([primary, ...EXTRA_EMAILS]))
  const body = buildPayload(data)

  const results = await Promise.allSettled(
    endpoints.map((endpoint) => postToFormSubmit(endpoint, body)),
  )

  const failed = results.filter((r) => r.status === 'rejected')
  if (failed.length === results.length) {
    const first = failed[0] as PromiseRejectedResult
    throw first.reason instanceof Error
      ? first.reason
      : new Error('No se pudo enviar el correo')
  }
}

export function getNotifyEmail() {
  return NOTIFY_EMAIL
}

export function getNotifyRecipients() {
  return Array.from(new Set([FORMSUBMIT_ID || NOTIFY_EMAIL, ...EXTRA_EMAILS]))
}
