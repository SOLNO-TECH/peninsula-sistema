import { Link } from 'react-router-dom'
import {
  SAMPLE_EMAIL_DATA,
  buildSubmissionEmailHtml,
  getEmailFromName,
  getEmailSubject,
} from '../emails/submissionEmailHtml'
import { getNotifyEmail } from '../services/email'

export function EmailPreview() {
  const html = buildSubmissionEmailHtml(SAMPLE_EMAIL_DATA)
  const subject = getEmailSubject()
  const from = getEmailFromName()
  const to = getNotifyEmail()

  return (
    <div className="mail-preview-page">
      <header className="mail-preview-bar">
        <div>
          <p className="mail-preview-kicker">Vista previa</p>
          <h1>Correo de notificación</h1>
          <p>
            Así se verá el mensaje en Outlook: compacto, en español y sin texto de
            FormSubmit.
          </p>
        </div>
        <div className="mail-preview-actions">
          <Link to="/" className="gate-btn gate-btn-ghost">
            Ir al formulario
          </Link>
          <Link to="/admin" className="gate-btn gate-btn-solid">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mail-preview-meta">
        <div>
          <span>De</span>
          <strong>{from}</strong>
        </div>
        <div>
          <span>Para</span>
          <strong>{to}</strong>
        </div>
        <div>
          <span>Asunto</span>
          <strong>{subject}</strong>
        </div>
      </div>

      <div className="mail-preview-frame">
        <iframe
          title="Vista previa del correo"
          className="mail-preview-iframe"
          srcDoc={html}
        />
      </div>
    </div>
  )
}
