import { Router } from 'express'

import { getDb } from '../db.js'

export const usersRouter = Router()

function toJsonPlaceholderUser(row) {
  const username = row.email.split('@')[0]
  const name = `${row.first_name} ${row.last_name}`.trim()
  const street = `Main st ${row.id}`
  const suite = `Apt. ${row.id}`
  const zipcode = '720000'
  const city = row.city

  return {
    id: row.id,
    name,
    username,
    email: row.email,
    address: {
      street,
      suite,
      city,
      zipcode,
    },
    phone: row.phone,
    website: 'axoft.kg',
    company: {
      name: 'AXOFT Solutions',
      catchPhrase: `IT для ${city}`,
      bs: 'AXOFT',
    },
  }
}

usersRouter.get('/', (_req, res) => {
  const db = getDb()
  const rows = db.listUsers().sort((a, b) => b.id - a.id)
  res.json(rows.map(toJsonPlaceholderUser))
})

