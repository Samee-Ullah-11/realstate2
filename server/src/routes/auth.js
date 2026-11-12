import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import User from '../models/User.js'
import { cookieOptions, requireAdmin, setLoginCookie } from '../middleware/auth.js'

const router = Router()

router.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 }), async (req, res) => {
  const { email, password } = req.body ?? {}
  const user = await User.findOne({ email: String(email ?? '').toLowerCase() })
  if (!user || !(await bcrypt.compare(String(password ?? ''), user.passwordHash))) {
    return res.status(401).json({ message: 'Wrong email or password' })
  }
  setLoginCookie(res, user.id)
  res.json({ email: user.email })
})

router.post('/logout', (req, res) => {
  res.clearCookie('token', cookieOptions).json({ message: 'Logged out' })
})

router.get('/me', requireAdmin, async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(401).json({ message: 'Please log in again' })
  res.json({ email: user.email })
})

export default router
