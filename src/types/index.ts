export type SubmissionStatus = 'pendiente' | 'aprobado' | 'rechazado'

export interface AccessSubmission {
  id: string
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
  status: SubmissionStatus
  createdAt: string
}

export interface AdminUser {
  username: string
  password: string
}
