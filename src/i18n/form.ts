export type Lang = 'es' | 'en'

export const LANG_KEY = 'peninsula_form_lang'

export function readLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    /* ignore */
  }
  return 'es'
}

const copy = {
  es: {
    brandPlace: 'Nuevo Vallarta · México',
    heroTitle: 'Solicitud de ingreso',
    heroTitleEm: ' al residencial',
    heroLead:
      'Completa el formulario. La administración revisará y autorizará cada solicitud.',
    formTitle: 'Formulario de contacto',
    formIntro: 'Todos los campos marcados son obligatorios.',
    successTitle: 'Solicitud enviada',
    successBody: 'Se notificó por correo a la administración.',
    departamento: 'Departamento',
    departamentoPh: 'Ej. Torre A · 1204',
    empresa: 'Empresa / Proveedor',
    empresaPh: 'Nombre de la empresa',
    trabajadores: 'Nombre de trabajadores',
    trabajadoresPh: 'Quiénes ingresarán',
    autorizado: 'Autorizado',
    email: 'Correo electrónico',
    emailPh: 'nombre@ejemplo.com',
    telefono: 'Teléfono autorizado',
    telefonoPh: '+52 55 0000 0000',
    fechaInicio: 'Fecha inicio',
    fechaFin: 'Fecha fin',
    tipoIngreso: 'Tipo de ingreso solicitado',
    descripcion: 'Descripción de actividades',
    descripcionPh: 'Describe el trabajo o motivo del ingreso…',
    selectPlaceholder: 'Selecciona una opción',
    clear: 'Limpiar',
    send: 'Enviar',
    sending: 'Enviando…',
    errDepartamento: 'Indica el departamento',
    errEmpresa: 'Indica la empresa o proveedor',
    errAutorizado: 'Selecciona quién autoriza',
    errEmail: 'El correo es obligatorio',
    errEmailInvalid: 'Correo no válido',
    errFechaInicio: 'Indica la fecha de inicio',
    errFechaFin: 'Indica la fecha de fin',
    errFechaOrden: 'La fecha fin debe ser posterior al inicio',
    errTipo: 'Selecciona el tipo de ingreso',
    errDescripcion: 'Describe las actividades',
    errSubmit: 'No se pudo enviar. Revisa la conexión e intenta de nuevo.',
    propietario: 'Propietario',
    administrador: 'Administrador',
    mantenimiento: 'Mantenimiento',
    reparacion: 'Reparación',
    construccion: 'Construcción',
    mobiliario: 'Mobiliario',
    otro: 'Otro',
  },
  en: {
    brandPlace: 'Nuevo Vallarta · Mexico',
    heroTitle: 'Access request',
    heroTitleEm: ' to the residential',
    heroLead:
      'Complete the form. Management will review and authorize each request.',
    formTitle: 'Contact form',
    formIntro: 'All marked fields are required.',
    successTitle: 'Request submitted',
    successBody: 'Management was notified by email.',
    departamento: 'Unit / Department',
    departamentoPh: 'E.g. Tower A · 1204',
    empresa: 'Company / Vendor',
    empresaPh: 'Company name',
    trabajadores: 'Worker names',
    trabajadoresPh: 'Who will enter',
    autorizado: 'Authorized by',
    email: 'Email',
    emailPh: 'name@example.com',
    telefono: 'Authorized phone',
    telefonoPh: '+52 55 0000 0000',
    fechaInicio: 'Start date',
    fechaFin: 'End date',
    tipoIngreso: 'Type of access requested',
    descripcion: 'Activity description',
    descripcionPh: 'Describe the work or reason for access…',
    selectPlaceholder: 'Select an option',
    clear: 'Clear',
    send: 'Submit',
    sending: 'Sending…',
    errDepartamento: 'Enter the unit / department',
    errEmpresa: 'Enter the company or vendor',
    errAutorizado: 'Select who authorizes',
    errEmail: 'Email is required',
    errEmailInvalid: 'Invalid email',
    errFechaInicio: 'Enter the start date',
    errFechaFin: 'Enter the end date',
    errFechaOrden: 'End date must be after start date',
    errTipo: 'Select the type of access',
    errDescripcion: 'Describe the activities',
    errSubmit: 'Could not submit. Check your connection and try again.',
    propietario: 'Owner',
    administrador: 'Administrator',
    mantenimiento: 'Maintenance',
    reparacion: 'Repair',
    construccion: 'Construction',
    mobiliario: 'Furnishings',
    otro: 'Other',
  },
} as const

export type FormCopy = {
  [K in keyof (typeof copy)['es']]: string
}

export function getFormCopy(lang: Lang): FormCopy {
  return copy[lang]
}

export function autorizadoOptions(lang: Lang) {
  const t = copy[lang]
  return [
    { value: 'propietario', label: t.propietario },
    { value: 'administrador', label: t.administrador },
  ]
}

export function tipoIngresoOptions(lang: Lang) {
  const t = copy[lang]
  return [
    { value: 'mantenimiento', label: t.mantenimiento },
    { value: 'reparacion', label: t.reparacion },
    { value: 'construccion', label: t.construccion },
    { value: 'mobiliario', label: t.mobiliario },
    { value: 'otro', label: t.otro },
  ]
}
