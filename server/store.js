import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'submissions.json')

async function ensure() {
  await mkdir(DATA_DIR, { recursive: true })
  try {
    await readFile(FILE, 'utf8')
  } catch {
    await writeFile(FILE, '[]', 'utf8')
  }
}

async function readAll() {
  await ensure()
  try {
    const raw = await readFile(FILE, 'utf8')
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function writeAll(items) {
  await ensure()
  const tmp = `${FILE}.${process.pid}.tmp`
  await writeFile(tmp, JSON.stringify(items, null, 2), 'utf8')
  await rename(tmp, FILE)
}

export async function listSubmissions() {
  const items = await readAll()
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function createSubmission(payload) {
  const submission = {
    id: randomUUID(),
    departamento: String(payload.departamento || '').trim(),
    empresa: String(payload.empresa || '').trim(),
    trabajadores: String(payload.trabajadores || '').trim(),
    autorizado: String(payload.autorizado || '').trim(),
    email: String(payload.email || '').trim(),
    telefono: String(payload.telefono || '').trim(),
    fechaInicio: String(payload.fechaInicio || '').trim(),
    fechaFin: String(payload.fechaFin || '').trim(),
    tipoIngreso: String(payload.tipoIngreso || '').trim(),
    descripcion: String(payload.descripcion || '').trim(),
    status: 'pendiente',
    createdAt: new Date().toISOString(),
  }

  const required = [
    'departamento',
    'empresa',
    'autorizado',
    'email',
    'fechaInicio',
    'fechaFin',
    'tipoIngreso',
    'descripcion',
  ]
  for (const key of required) {
    if (!submission[key]) {
      const err = new Error(`Campo requerido: ${key}`)
      err.status = 400
      throw err
    }
  }

  const all = await readAll()
  all.push(submission)
  await writeAll(all)
  return submission
}

export async function updateStatus(id, status) {
  const allowed = ['pendiente', 'aprobado', 'rechazado']
  if (!allowed.includes(status)) {
    const err = new Error('Estado no válido')
    err.status = 400
    throw err
  }

  const all = await readAll()
  const index = all.findIndex((s) => s.id === id)
  if (index === -1) return null
  all[index] = { ...all[index], status }
  await writeAll(all)
  return all[index]
}

export async function removeSubmission(id) {
  const all = await readAll()
  const next = all.filter((s) => s.id !== id)
  if (next.length === all.length) return false
  await writeAll(next)
  return true
}
