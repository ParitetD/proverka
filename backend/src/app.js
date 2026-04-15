import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { routes } from './routes/index.js'

dotenv.config()

export const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json({ limit: '1mb' }))

app.use(routes)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, _next) => {
  const status = err?.statusCode || 500
  const message = err?.message || 'Internal server error'
  res.status(status).json({ error: message })
})

