import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto'

const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'peninsula2026'
const LOBBY_USER = process.env.LOBBY_USER || 'lobby'
const LOBBY_PASSWORD = process.env.LOBBY_PASSWORD || 'lobby2026'
const TOKEN_SECRET =
  process.env.ADMIN_TOKEN_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'peninsula-dev-secret'

const USERS = {
  [ADMIN_USER]: { password: ADMIN_PASSWORD, role: 'admin' },
  [LOBBY_USER]: { password: LOBBY_PASSWORD, role: 'lobby' },
}

const revoked = new Set()

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url')
  return `${body}.${sig}`
}

function verify(token) {
  if (!token || revoked.has(token)) return null
  const [body, sig] = String(token).split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', TOKEN_SECRET).update(body).digest('base64url')
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    if (!payload?.exp || Date.now() > payload.exp) return null
    if (!USERS[payload.u]) return null
    if (payload.role !== USERS[payload.u].role) return null
    return payload
  } catch {
    return null
  }
}

function safeEqualString(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA)
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

export function login(username, password) {
  const account = USERS[username]
  if (!account) {
    // comparación dummy para no filtrar usuarios por timing
    safeEqualString(password, ADMIN_PASSWORD)
    return null
  }
  if (!safeEqualString(password, account.password)) return null

  const token = sign({
    u: username,
    role: account.role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    n: randomBytes(8).toString('hex'),
  })
  return { token, username, role: account.role }
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const payload = verify(token)
  if (!payload) {
    res.status(401).json({ error: 'No autorizado' })
    return
  }
  req.admin = payload
  req.token = token
  next()
}

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.admin?.role !== 'admin') {
      res.status(403).json({ error: 'Solo administración puede modificar' })
      return
    }
    next()
  })
}

export function logout(token) {
  if (token) revoked.add(token)
}
