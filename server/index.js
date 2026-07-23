import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { login, logout, requireAuth } from './auth.js'
import {
  createSubmission,
  listSubmissions,
  removeSubmission,
  updateStatus,
} from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dist = path.join(root, 'dist')
const PORT = Number(process.env.PORT || 3000)

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '256kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {}
  const result = login(String(username || ''), String(password || ''))
  if (!result) {
    res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
    return
  }
  res.json(result)
})

app.post('/api/auth/logout', requireAuth, (req, res) => {
  logout(req.token)
  res.json({ ok: true })
})

app.get('/api/submissions', requireAuth, async (_req, res) => {
  try {
    const items = await listSubmissions()
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'No se pudieron leer las solicitudes' })
  }
})

app.post('/api/submissions', async (req, res) => {
  try {
    const item = await createSubmission(req.body || {})
    res.status(201).json(item)
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Error al guardar' })
  }
})

app.patch('/api/submissions/:id', requireAuth, async (req, res) => {
  try {
    const item = await updateStatus(req.params.id, req.body?.status)
    if (!item) {
      res.status(404).json({ error: 'No encontrada' })
      return
    }
    res.json(item)
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Error al actualizar' })
  }
})

app.delete('/api/submissions/:id', requireAuth, async (req, res) => {
  try {
    const ok = await removeSubmission(req.params.id)
    if (!ok) {
      res.status(404).json({ error: 'No encontrada' })
      return
    }
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al eliminar' })
  }
})

app.use(express.static(dist, { index: false, maxAge: '1h' }))

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    next()
    return
  }
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'No encontrado' })
    return
  }
  res.sendFile(path.join(dist, 'index.html'), (err) => {
    if (err) next(err)
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Península listening on :${PORT}`)
  console.log(`Data dir: ${process.env.DATA_DIR || path.join(root, 'data')}`)
})
