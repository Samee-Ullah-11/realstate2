import jwt from 'jsonwebtoken'

const prod = process.env.NODE_ENV === 'production'
// In production the site and API may be on different domains, which needs sameSite 'none' + https.
export const cookieOptions = { httpOnly: true, secure: prod, sameSite: prod ? 'none' : 'lax' }

// The admin is logged out after this long without doing anything.
const SESSION_MINUTES = 30

export function setLoginCookie(res, id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: `${SESSION_MINUTES}m` })
  res.cookie('token', token, { ...cookieOptions, maxAge: SESSION_MINUTES * 60 * 1000 })
}

// Blocks the request unless a valid admin login cookie is present.
export function requireAdmin(req, res, next) {
  try {
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
  } catch {
    return res.status(401).json({ message: 'Please log in again' })
  }
  setLoginCookie(res, req.user.id) // every admin action restarts the 30-minute clock
  next()
}
