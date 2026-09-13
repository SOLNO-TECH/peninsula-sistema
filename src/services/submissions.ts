import type { AccessSubmission, SubmissionStatus } from '../types'

const TOKEN_KEY = 'peninsula_admin_token'
const ROLE_KEY = 'peninsula_admin_role'

export type UserRole = 'admin' | 'lobby'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY)
  return token
    ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    : { Accept: 'application/json' }
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string }
    if (data?.error) return data.error
  } catch {
    /* ignore */
  }
  return `Error ${res.status}`
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAdminRole(): UserRole | null {
  const role = localStorage.getItem(ROLE_KEY)
  return role === 'admin' || role === 'lobby' ? role : null
}

export function setAdminSession(token: string | null, role: UserRole | null) {
  if (token && role) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(ROLE_KEY, role)
  } else {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
  }
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<{ ok: true; role: UserRole } | { ok: false; role: null }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    setAdminSession(null, null)
    return { ok: false, role: null }
  }
  const data = (await res.json()) as { token?: string; role?: UserRole }
  if (!data.token || (data.role !== 'admin' && data.role !== 'lobby')) {
    setAdminSession(null, null)
    return { ok: false, role: null }
  }
  setAdminSession(data.token, data.role)
  return { ok: true, role: data.role }
}

export async function logoutAdmin() {
  const token = getAdminToken()
  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: authHeaders(),
      })
    } catch {
      /* ignore */
    }
  }
  setAdminSession(null, null)
}

export async function getSubmissions(): Promise<AccessSubmission[]> {
  const res = await fetch('/api/submissions', { headers: authHeaders() })
  if (res.status === 401) {
    setAdminSession(null, null)
    throw new Error('Sesión expirada')
  }
  if (!res.ok) throw new Error(await parseError(res))
  return (await res.json()) as AccessSubmission[]
}

export async function addSubmission(
  data: Omit<AccessSubmission, 'id' | 'status' | 'createdAt'>,
): Promise<AccessSubmission> {
  const res = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return (await res.json()) as AccessSubmission
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<AccessSubmission> {
  const res = await fetch(`/api/submissions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  })
  if (res.status === 401) {
    setAdminSession(null, null)
    throw new Error('Sesión expirada')
  }
  if (!res.ok) throw new Error(await parseError(res))
  return (await res.json()) as AccessSubmission
}

export async function deleteSubmission(id: string): Promise<void> {
  const res = await fetch(`/api/submissions/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (res.status === 401) {
    setAdminSession(null, null)
    throw new Error('Sesión expirada')
  }
  if (!res.ok) throw new Error(await parseError(res))
}

export function getSubmissionStats(items: AccessSubmission[]) {
  return {
    total: items.length,
    pendiente: items.filter((s) => s.status === 'pendiente').length,
    aprobado: items.filter((s) => s.status === 'aprobado').length,
    rechazado: items.filter((s) => s.status === 'rechazado').length,
  }
}
