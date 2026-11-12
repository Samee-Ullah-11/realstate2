import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import Subscriber from '../models/Subscriber.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// Public: a visitor signs up for updates.
router.post('/', rateLimit({ windowMs: 60 * 60 * 1000, limit: 10 }), async (req, res) => {
  try {
    await Subscriber.create({ email: String(req.body?.email ?? '') })
  } catch (err) {
    // 11000 = already subscribed. Answer the same way, so nobody can test which emails are on the list.
    if (err.code !== 11000) throw err
  }
  res.status(201).json({ message: 'Subscribed' })
})

router.get('/', requireAdmin, async (req, res) => {
  res.json(await Subscriber.find().sort('-createdAt').limit(1000))
})

router.delete('/:id', requireAdmin, async (req, res) => {
  const subscriber = await Subscriber.findByIdAndDelete(req.params.id)
  if (!subscriber) return res.status(404).json({ message: 'Subscriber not found' })
  res.json({ message: 'Deleted' })
})

export default router
