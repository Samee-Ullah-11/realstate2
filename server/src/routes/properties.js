import { Router } from 'express'
import Property from '../models/Property.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// GET /api/properties?purpose=&type=&area=&status=&featured=true&minPrice=&maxPrice=&beds=&q=&page=&limit=
router.get('/', async (req, res) => {
  const filter = {}
  for (const key of ['purpose', 'type', 'area', 'status']) {
    if (req.query[key]) filter[key] = String(req.query[key])
  }
  if (req.query.featured === 'true') filter.featured = true

  const min = Number(req.query.minPrice)
  const max = Number(req.query.maxPrice)
  if (min > 0 || max > 0) {
    filter.price = {}
    if (min > 0) filter.price.$gte = min
    if (max > 0) filter.price.$lte = max
  }
  const beds = Number(req.query.beds)
  if (beds > 0) filter.bedrooms = { $gte: beds }

  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 100)), 'i')
    filter.$or = [{ title: rx }, { area: rx }, { address: rx }]
  }

  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12))
  const [items, total] = await Promise.all([
    Property.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit),
    Property.countDocuments(filter),
  ])
  res.json({ items, total, page, pages: Math.ceil(total / limit) })
})

// Areas with how many listings each has, for "Explore top areas" on the home page.
router.get('/areas', async (req, res) => {
  const areas = await Property.aggregate([
    { $group: { _id: '$area', count: { $sum: 1 }, image: { $first: { $first: '$images' } } } },
    { $sort: { count: -1, _id: 1 } },
    { $project: { _id: 0, area: '$_id', count: 1, image: 1 } },
  ])
  res.json(areas)
})

router.get('/:id', async (req, res) => {
  const property = await Property.findById(req.params.id)
  if (!property) return res.status(404).json({ message: 'Property not found' })
  res.json(property)
})

router.post('/', requireAdmin, async (req, res) => {
  res.status(201).json(await Property.create(req.body))
})

router.put('/:id', requireAdmin, async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  })
  if (!property) return res.status(404).json({ message: 'Property not found' })
  res.json(property)
})

router.delete('/:id', requireAdmin, async (req, res) => {
  const property = await Property.findByIdAndDelete(req.params.id)
  if (!property) return res.status(404).json({ message: 'Property not found' })
  res.json({ message: 'Deleted' })
})

export default router
