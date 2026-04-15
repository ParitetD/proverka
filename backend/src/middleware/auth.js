import jwt from 'jsonwebtoken'

const getSecret = () => process.env.JWT_SECRET || 'dev-secret-change-me'

export function authRequired(req, res, next) {
  const header = req.headers.authorization || ''
  const [type, token] = header.split(' ')

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const payload = jwt.verify(token, getSecret())
    req.user = { id: Number(payload.sub), email: payload.email }
    return next()
  } catch (_err) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

