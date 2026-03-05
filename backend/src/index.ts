import express from 'express'
import cors from 'cors'
import db from './db'

const app = express()
const PORT = parseInt(process.env.PORT || '3001', 10)

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]

app.use(cors({ origin: allowedOrigins }))

app.get('/api/health', (_req, res) => {
  try {
    const tables = db.query("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[]
    res.json({ status: 'ok', tables: tables.map(t => t.name) })
  } catch {
    res.json({ status: 'ok', db: 'error' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
