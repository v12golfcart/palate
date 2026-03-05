import { Router } from 'express'
import db from '../db'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  const existing = db.query('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) {
    res.status(409).json({ error: 'Email already registered' })
    return
  }

  const passwordHash = await Bun.password.hash(password)

  const result = db.run(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)',
    [email, passwordHash]
  )

  res.status(201).json({ id: Number(result.lastInsertRowid), email })
})

export default router
