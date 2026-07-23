export interface FormPayload {
  departamento: string
  empresa: string
  trabajadores: string
  autorizado: string
  email: string
  telefono: string
  fechaInicio: string
  fechaFin: string
  tipoIngreso: string
  descripcion: string
}

const AUTORIZADO_LABEL: Record<string, string> = {
  propietario: 'Propietario',
  administrador: 'Administrador',
}

const TIPO_LABEL: Record<string, string> = {
  mantenimiento: 'Mantenimiento',
  reparacion: 'Reparación',
  construccion: 'Construcción',
  mobiliario: 'Mobiliario',
  otro: 'Otro',
}

export const SAMPLE_EMAIL_DATA: FormPayload = {
  departamento: 'Torre A · 1204',
  empresa: 'Fumigación del Pacífico',
  trabajadores: 'Alfredo Villa Molina y Alfredo Villa',
  autorizado: 'administrador',
  email: 'contacto@ejemplo.com',
  telefono: '3331665553',
  fechaInicio: '2026-07-11',
  fechaFin: '2026-07-11',
  tipoIngreso: 'mantenimiento',
  descripcion: 'Fumigación preventiva en áreas comunes y departamento.',
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #e8eef4;width:34%;vertical-align:top;background:#f7fafc;">
        <span style="font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#607080;">
          ${escapeHtml(label)}
        </span>
      </td>
      <td style="padding:7px 10px;border-bottom:1px solid #e8eef4;vertical-align:top;font-size:13px;color:#15202b;line-height:1.3;">
        ${escapeHtml(value || '—')}
      </td>
    </tr>
  `
}

/** HTML compacto del correo (inline CSS para Outlook). */
export function buildSubmissionEmailHtml(data: FormPayload): string {
  const autorizado = AUTORIZADO_LABEL[data.autorizado] ?? data.autorizado
  const motivo = TIPO_LABEL[data.tipoIngreso] ?? data.tipoIngreso

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nueva solicitud de ingreso</title>
</head>
<body style="margin:0;padding:0;background:#eef2f6;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f6;padding:16px 8px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background:#ffffff;border:1px solid #d7dee6;">
          <tr>
            <td style="background:#0c2340;padding:14px 16px;">
              <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.7);">
                Península · Accesos
              </p>
              <h1 style="margin:0;font-size:17px;line-height:1.2;font-weight:700;color:#ffffff;">
                Nueva solicitud de ingreso
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px 4px;">
              <p style="margin:0;font-size:12px;line-height:1.4;color:#5c6b7a;">
                Se recibió una nueva solicitud desde el formulario del condominio.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 16px 14px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e8eef4;">
                ${row('Departamento', data.departamento)}
                ${row('Proveedor', data.empresa)}
                ${row('Trabajadores', data.trabajadores || '—')}
                ${row('Autorizado', autorizado)}
                ${row('Correo', data.email)}
                ${row('Teléfono', data.telefono || '—')}
                ${row('Fecha inicio', data.fechaInicio)}
                ${row('Fecha fin', data.fechaFin)}
                ${row('Tipo de ingreso', motivo)}
                ${row('Descripción', data.descripcion)}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 16px 12px;">
              <p style="margin:0;font-size:10px;color:#8a96a3;">
                Mensaje automático del sistema de accesos Península.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function getEmailSubject() {
  return 'Nueva solicitud de ingreso — Península'
}

export function getEmailFromName() {
  return 'Península Accesos'
}

export function resolveEmailLabels(data: FormPayload) {
  return {
    autorizado: AUTORIZADO_LABEL[data.autorizado] ?? data.autorizado,
    motivo: TIPO_LABEL[data.tipoIngreso] ?? data.tipoIngreso,
  }
}
