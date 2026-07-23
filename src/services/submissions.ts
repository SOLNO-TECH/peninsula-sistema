import type { AccessSubmission, SubmissionStatus } from '../types'

const STORAGE_KEY = 'peninsula_submissions'

function readAll(): AccessSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as AccessSubmission[]
  } catch {
    return []
  }
}

function writeAll(items: AccessSubmission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getSubmissions(): AccessSubmission[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function addSubmission(
  data: Omit<AccessSubmission, 'id' | 'status' | 'createdAt'>,
): AccessSubmission {
  const submission: AccessSubmission = {
    ...data,
    id: crypto.randomUUID(),
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  }
  const all = readAll()
  all.push(submission)
  writeAll(all)
  return submission
}

export function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): AccessSubmission | null {
  const all = readAll()
  const index = all.findIndex((s) => s.id === id)
  if (index === -1) return null
  all[index] = { ...all[index], status }
  writeAll(all)
  return all[index]
}

export function deleteSubmission(id: string): boolean {
  const all = readAll()
  const next = all.filter((s) => s.id !== id)
  if (next.length === all.length) return false
  writeAll(next)
  return true
}

export function getSubmissionStats() {
  const all = getSubmissions()
  return {
    total: all.length,
    pendiente: all.filter((s) => s.status === 'pendiente').length,
    aprobado: all.filter((s) => s.status === 'aprobado').length,
    rechazado: all.filter((s) => s.status === 'rechazado').length,
  }
}
