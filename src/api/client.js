const TOKEN_KEY = 'axoft_token'
const USER_KEY = 'axoft_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setAuthSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function resolveUrl(path) {
  if (path.startsWith('http')) return path
  if (path.startsWith('/api')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return `/api${p}`
}

/**
 * @param {string} path — например '/auth/login' или '/users'
 * @param {{ method?: string, body?: unknown, auth?: boolean }} [options]
 */
export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const t = getToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }

  const res = await fetch(resolveUrl(path), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || res.statusText
    const err = new Error(typeof msg === 'string' ? msg : 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}
