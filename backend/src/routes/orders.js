import { Router } from 'express'

import { authRequired } from '../middleware/auth.js'
import { getDb } from '../db.js'
import { z } from 'zod'
// (no httpError usage)

export const ordersRouter = Router()

const orderItemSchema = z.object({
  productId: z.union([z.number(), z.string()]),
  name: z.string().min(1).max(200),
  price: z.union([z.number(), z.string()]),
  quantity: z.union([z.number(), z.string()]).refine((v) => Number(v) > 0),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  currency: z.string().min(2).max(10).optional(),
  total: z.union([z.number(), z.string()]).optional(),
})

function toCents(v) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 100)
}

ordersRouter.use(authRequired)

ordersRouter.post('/', (req, res, next) => {
  const parsed = createOrderSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation error', issues: parsed.error.issues })
  }

  try {
    const db = getDb()
    const { items, currency } = parsed.data

    const normalizedItems = items.map((it) => ({
      productId: Number(it.productId),
      name: it.name,
      price: Number(it.price),
      quantity: Number(it.quantity),
    }))

    const totalCents = normalizedItems.reduce((acc, it) => acc + toCents(it.price) * it.quantity, 0)
    const created = db.createOrder({
      userId: req.user.id,
      items: normalizedItems,
      totalCents,
      currency: currency || 'KGS',
    })

    res.status(201).json({
      order: {
        id: created.id,
        items: normalizedItems,
        total: totalCents / 100,
        currency: currency || 'KGS',
        createdAt: created.created_at,
      },
    })
  } catch (err) {
    next(err)
  }
})

ordersRouter.get('/', (req, res, next) => {
  try {
    const db = getDb()
    const orders = db.listOrdersByUser(req.user.id)
    res.json(
      orders.map((o) => ({
        id: o.id,
        items: JSON.parse(o.items_json),
        total: o.total_cents / 100,
        currency: o.currency,
        createdAt: o.created_at,
      }))
    )
  } catch (err) {
    next(err)
  }
})

