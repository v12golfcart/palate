import { Router } from 'express'
import jwt from 'jsonwebtoken'
import db from '../db'
import { requireAuth } from '../middleware/auth'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  const user = db.query('SELECT id, email, password_hash FROM users WHERE email = ?').get(email) as {
    id: number
    email: string
    password_hash: string
  } | null

  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }

  const valid = await Bun.password.verify(password, user.password_hash)
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })

  res.json({ token })
})

router.get('/me', requireAuth, (req, res) => {
  const user = db.query(
    'SELECT id, email, instagram_username FROM users WHERE id = ?'
  ).get(req.user!.userId) as { id: number; email: string; instagram_username: string | null } | null

  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  res.json(user)
})

export default router
