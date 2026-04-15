import { Router } from 'express'
import { z } from 'zod'

import { authRequired } from '../middleware/auth.js'
import { getDb } from '../db.js'

export const todosRouter = Router()

const createTodoSchema = z.object({
  text: z.string().min(1).max(500),
})

const updateTodoSchema = z.object({
  completed: z.boolean().optional(),
})

todosRouter.use(authRequired)

todosRouter.get('/', (req, res, next) => {
  try {
    const db = getDb()
    const rows = db.listTodosByUser(req.user.id)

    res.json(
      rows.map((r) => ({
        id: r.id,
        text: r.text,
        completed: Boolean(r.completed),
        createdAt: r.created_at,
      }))
    )
  } catch (err) {
    next(err)
  }
})

todosRouter.post('/', (req, res, next) => {
  const parsed = createTodoSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation error', issues: parsed.error.issues })
  }

  try {
    const db = getDb()
    const created = db.createTodo(req.user.id, parsed.data.text)
    res.status(201).json({
      todo: { id: created.id, text: parsed.data.text, completed: false, createdAt: created.created_at },
    })
  } catch (err) {
    next(err)
  }
})

todosRouter.patch('/:id', (req, res, next) => {
  const parsed = updateTodoSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation error', issues: parsed.error.issues })
  }

  try {
    const db = getDb()
    const id = Number(req.params.id)

    const row = db.getTodoForUser(req.user.id, id)

    if (!row) return res.status(404).json({ error: 'Todo not found' })

    const nextCompleted = typeof parsed.data.completed === 'boolean' ? parsed.data.completed : !Boolean(row.completed)

    db.setTodoCompleted(req.user.id, id, nextCompleted)

    res.json({
      todo: { id, completed: nextCompleted },
    })
  } catch (err) {
    next(err)
  }
})

todosRouter.delete('/:id', (req, res, next) => {
  try {
    const db = getDb()
    const id = Number(req.params.id)
    db.deleteTodoForUser(req.user.id, id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

