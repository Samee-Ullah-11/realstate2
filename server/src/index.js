// import mongoose from 'mongoose'
// import app from './app.js'

// const port = process.env.PORT || 5000

// await mongoose.connect(process.env.MONGO_URI)
// app.listen(port, () => console.log(`API running on http://localhost:${port}`))


import 'dotenv/config'
import app from './app.js'

const port = process.env.PORT || 5000

// Local development server
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`)
  })
}

// Vercel uses this Express application
export default app
