import {
  getEmailSubject,
  resolveEmailLabels,
  type FormPayload,
} from '../emails/submissionEmailHtml'

export type { FormPayload }

const NOTIFY_EMAIL =
  import.meta.env.VITE_NOTIFY_EMAIL || 'proveedores@peninsulanvo.com'

/** Hash de FormSubmit (oculta el correo). Si está vacío, usa el email. */
const FORMSUBMIT_ID = import.meta.env.VITE_FORMSUBMIT_ID || ''

/**
 * Envía por FormSubmit (como ya tenías).
 * El contenido va en un solo bloque compacto para que no se vea tan grande.
 */
export async function sendSubmissionEmail(data: FormPayload): Promise<void> {
  const labels = resolveEmailLabels(data)
  const endpoint = FORMSUBMIT_ID || NOTIFY_EMAIL

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

  const response = await fetch(`https://formsubmit.co/ajax/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: getEmailSubject(),
      _template: 'table',
      _captcha: 'false',
      _honey: '',
      'Nueva solicitud': 'Registro de ingreso — Península Accesos',
      Datos: resumen,
    }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || 'No se pudo enviar el correo')
  }

  const result = (await response.json().catch(() => null)) as {
    success?: string | boolean
    message?: string
  } | null

  if (result && result.success === false) {
    throw new Error(result.message || 'No se pudo enviar el correo')
  }
}

export function getNotifyEmail() {
  return NOTIFY_EMAIL
}
