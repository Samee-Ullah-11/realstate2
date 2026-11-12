import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import Enquiry from '../models/Enquiry.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// Public: a visitor sends an enquiry. Only these fields are accepted from the form.
router.post('/', rateLimit({ windowMs: 60 * 60 * 1000, limit: 10 }), async (req, res) => {
  const { name, phone, message, property } = req.body ?? {}
  await Enquiry.create({ name, phone, message, property: property || undefined })
  res.status(201).json({ message: 'Enquiry sent' })
})

router.get('/', requireAdmin, async (req, res) => {
  res.json(await Enquiry.find().sort('-createdAt').limit(200).populate('property', 'title'))
})

router.patch('/:id', requireAdmin, async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { read: Boolean(req.body?.read) },
    { returnDocument: 'after' }
  )
  if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' })
  res.json(enquiry)
})

router.delete('/:id', requireAdmin, async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id)
  if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' })
  res.json({ message: 'Deleted' })
})

export default router
