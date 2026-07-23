import type { AccessSubmission, SubmissionStatus } from '../types'

const TOKEN_KEY = 'peninsula_admin_token'

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

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<boolean> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    setAdminToken(null)
    return false
  }
  const data = (await res.json()) as { token?: string }
  if (!data.token) return false
  setAdminToken(data.token)
  return true
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
  setAdminToken(null)
}

export async function getSubmissions(): Promise<AccessSubmission[]> {
  const res = await fetch('/api/submissions', { headers: authHeaders() })
  if (res.status === 401) {
    setAdminToken(null)
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
    setAdminToken(null)
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
    setAdminToken(null)
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
