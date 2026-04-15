import { Router } from 'express'

import { authRequired } from '../middleware/auth.js'
import { getDb } from '../db.js'

export const meRouter = Router()

meRouter.get('/', authRequired, (req, res, next) => {
  try {
    const db = getDb()
    const row = db.findUserById(req.user.id)

    if (!row) return next({ statusCode: 404, message: 'User not found' })

    res.json({
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      birthDate: row.birth_date,
      phone: row.phone,
      city: row.city,
    })
  } catch (err) {
    return next(err)
  }
})

