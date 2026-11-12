import { connectDB } from './config/db.js'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import propertyRoutes from './routes/properties.js'
import enquiryRoutes from './routes/enquiries.js'
import uploadRoutes from './routes/uploads.js'
import subscriberRoutes from './routes/subscribers.js'




if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing. Copy .env.example to .env and fill it in.')

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())
// Connect to MongoDB before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    next(error)
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/subscribers', subscriberRoutes)

app.use((req, res) => res.status(404).json({ message: 'Not found' }))

// One place that turns any error into a clean JSON reply.
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ')
    return res.status(400).json({ message })
  }
  if (err.name === 'CastError') return res.status(404).json({ message: 'Not found' })
  if (err.status && err.status < 500) return res.status(err.status).json({ message: err.message })
  console.error(err)
  res.status(500).json({ message: 'Server error' })
})

export default app
