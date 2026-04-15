import { Router } from 'express'

import { healthRouter } from './health.js'
import { authRouter } from './auth.js'
import { usersRouter } from './users.js'
import { ordersRouter } from './orders.js'
import { todosRouter } from './todos.js'
import { meRouter } from './me.js'

export const routes = Router()

routes.use('/api/health', healthRouter)
routes.use('/api/auth', authRouter)
routes.use('/api/users', usersRouter)
routes.use('/api/orders', ordersRouter)
routes.use('/api/todos', todosRouter)
routes.use('/api/me', meRouter)

