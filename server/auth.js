import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto'

const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'peninsula2026'
const TOKEN_SECRET =
  process.env.ADMIN_TOKEN_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'peninsula-dev-secret'

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
    if (payload.u !== ADMIN_USER) return null
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
  const userOk = safeEqualString(username, ADMIN_USER)
  const passOk = safeEqualString(password, ADMIN_PASSWORD)
  if (!userOk || !passOk) return null

  const token = sign({
    u: ADMIN_USER,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    n: randomBytes(8).toString('hex'),
  })
  return { token, username: ADMIN_USER }
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

export function logout(token) {
  if (token) revoked.add(token)
}
