import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

interface FieldShellProps {
  label: string
  required?: boolean
  error?: string
  icon?: ReactNode
  children: ReactNode
}

function FieldShell({ label, required, error, icon, children }: FieldShellProps) {
  return (
    <label className={`fx${error ? ' fx-error' : ''}`}>
      <span className="fx-label">
        {label}
        {required && <span className="fx-req">*</span>}
      </span>
      <span className={`fx-control${icon ? ' has-icon' : ''}`}>
        {icon && <span className="fx-icon">{icon}</span>}
        {children}
      </span>
      {error && (
        <span className="fx-error-text" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: ReactNode
}

export function InputField({ label, error, required, icon, ...props }: InputFieldProps) {
  return (
    <FieldShell label={label} required={required} error={error} icon={icon}>
      <input className="fx-input" required={required} aria-invalid={!!error} {...props} />
    </FieldShell>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  icon?: ReactNode
  placeholder?: string
  options: { value: string; label: string }[]
}

export function SelectField({
  label,
  error,
  required,
  icon,
  placeholder = 'Selecciona una opción',
  options,
  ...props
}: SelectFieldProps) {
  return (
    <FieldShell label={label} required={required} error={error} icon={icon}>
      <select className="fx-input fx-select" required={required} aria-invalid={!!error} {...props}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  icon?: ReactNode
}

export function TextAreaField({ label, error, required, icon, ...props }: TextAreaFieldProps) {
  return (
    <FieldShell label={label} required={required} error={error} icon={icon}>
      <textarea
        className="fx-input fx-area"
        required={required}
        aria-invalid={!!error}
        {...props}
      />
    </FieldShell>
  )
}
