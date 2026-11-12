import { Router } from 'express'
import { createHash } from 'node:crypto'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// Cloudinary's signing rule: sort the parameters, join as a=1&b=2, add the secret, SHA-1 the result.
export function sign(params, secret) {
  const text = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join('&')
  return createHash('sha1').update(text + secret).digest('hex')
}

// The admin's browser uploads photos straight to Cloudinary. This gives it a short-lived
// signed permission slip, so the Cloudinary secret never leaves the server.
router.get('/signature', requireAdmin, (req, res) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(503).json({
      message: 'Photo upload is not set up yet. Add the Cloudinary keys to server/.env, or paste an image link instead.',
    })
  }
  const params = { folder: 'shan-property', timestamp: Math.floor(Date.now() / 1000) }
  res.json({
    ...params,
    api_key: CLOUDINARY_API_KEY,
    cloudName: CLOUDINARY_CLOUD_NAME,
    signature: sign(params, CLOUDINARY_API_SECRET),
  })
})

export default router
