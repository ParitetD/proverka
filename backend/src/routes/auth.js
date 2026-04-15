import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { getDb } from '../db.js'
import { httpError } from '../utils/httpError.js'

export const authRouter = Router()

const phoneSchema = z
  .string()
  .regex(/^\+996\s?\d{3}\s?\d{3}\s?\d{3}$/, 'Некорректный телефон (пример: +996 XXX XXX XXX)')

const nameSchema = z.string().min(2).max(80)

const registerSchema = z
  .object({
    firstName: nameSchema.regex(/^[а-яА-ЯёЁa-zA-Z\s]+$/, 'Имя содержит только буквы'),
    lastName: nameSchema.regex(/^[а-яА-ЯёЁa-zA-Z\s]+$/, 'Фамилия содержит только буквы'),
    birthDate: z.string().min(8),
    email: z.string().min(5).email(),
    phone: phoneSchema,
    city: z.string().min(2).max(80),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
      })
    }
    if (!/\d/.test(val.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Пароль должен содержать хотя бы одну цифру',
        path: ['password'],
      })
    }
  })

const loginSchema = z.object({
  email: z.string().min(5).email(),
  password: z.string().min(6),
})

function getSecret() {
  return process.env.JWT_SECRET || 'dev-secret-change-me'
}

authRouter.post('/register', (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation error', issues: parsed.error.issues })
  }

  const { firstName, lastName, birthDate, email, phone, city, password } = parsed.data

  try {
    const db = getDb()
    const existing = db.findUserByEmail(email)
    if (existing) {
      return next(httpError(409, 'Email already exists'))
    }

    const passwordHash = bcrypt.hashSync(password, 10)
    const created = db.createUser({ email, passwordHash, firstName, lastName, birthDate, phone, city })
    const userId = created.id

    const token = jwt.sign({ sub: userId, email }, getSecret(), { expiresIn: '7d' })

    return res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        birthDate,
        phone,
        city,
      },
    })
  } catch (err) {
    return next(err)
  }
})

authRouter.post('/login', (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation error', issues: parsed.error.issues })
  }

  const { email, password } = parsed.data

  try {
    const db = getDb()
    const row = db.findUserByEmail(email)

    if (!row) return next(httpError(401, 'Invalid credentials'))

    const ok = bcrypt.compareSync(password, row.password_hash)
    if (!ok) return next(httpError(401, 'Invalid credentials'))

    const token = jwt.sign({ sub: row.id, email: row.email }, getSecret(), { expiresIn: '7d' })

    return res.json({
      token,
      user: {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        birthDate: row.birth_date,
        phone: row.phone,
        city: row.city,
      },
    })
  } catch (err) {
    return next(err)
  }
})

