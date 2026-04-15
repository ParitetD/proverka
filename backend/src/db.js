import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let store = null
let dbPathResolved = null

function resolveDbPath() {
  const envPath = process.env.DATABASE_URL || 'data/db.json'
  const resolved = path.isAbsolute(envPath) ? envPath : path.join(__dirname, '..', envPath)
  return resolved
}

export function getDb() {
  if (!store) throw new Error('DB not initialized. Call initDb() first.')
  return {
    listUsers: () => store.users.slice(),
    findUserByEmail: (email) => store.users.find((u) => u.email === email) || null,
    findUserById: (id) => store.users.find((u) => u.id === Number(id)) || null,

    createUser: ({ email, passwordHash, firstName, lastName, birthDate, phone, city }) => {
      const nextId = store.users.reduce((m, u) => Math.max(m, u.id), 0) + 1
      const user = {
        id: nextId,
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        phone,
        city,
        created_at: new Date().toISOString(),
      }
      store.users.push(user)
      saveStore()
      return user
    },

    listTodosByUser: (userId) =>
      store.todos
        .filter((t) => t.user_id === Number(userId))
        .slice()
        .sort((a, b) => b.id - a.id),

    createTodo: (userId, text) => {
      const nextId = store.todos.reduce((m, t) => Math.max(m, t.id), 0) + 1
      const todo = {
        id: nextId,
        user_id: Number(userId),
        text,
        completed: 0,
        created_at: new Date().toISOString(),
      }
      store.todos.push(todo)
      saveStore()
      return todo
    },

    getTodoForUser: (userId, id) =>
      store.todos.find((t) => t.user_id === Number(userId) && t.id === Number(id)) || null,

    setTodoCompleted: (userId, id, completed) => {
      const todo = store.todos.find((t) => t.user_id === Number(userId) && t.id === Number(id))
      if (!todo) return null
      todo.completed = completed ? 1 : 0
      saveStore()
      return todo
    },

    deleteTodoForUser: (userId, id) => {
      const before = store.todos.length
      store.todos = store.todos.filter((t) => !(t.user_id === Number(userId) && t.id === Number(id)))
      const after = store.todos.length
      if (after === before) return false
      saveStore()
      return true
    },

    createOrder: ({ userId, items, totalCents, currency }) => {
      const nextId = store.orders.reduce((m, o) => Math.max(m, o.id), 0) + 1
      const order = {
        id: nextId,
        user_id: Number(userId),
        items_json: JSON.stringify(items),
        total_cents: totalCents,
        currency,
        created_at: new Date().toISOString(),
      }
      store.orders.push(order)
      saveStore()
      return order
    },

    listOrdersByUser: (userId) =>
      store.orders
        .filter((o) => o.user_id === Number(userId))
        .slice()
        .sort((a, b) => b.id - a.id),
  }
}

export async function initDb() {
  if (store) return store

  dbPathResolved = resolveDbPath()
  const dbDir = path.dirname(dbPathResolved)
  fs.mkdirSync(dbDir, { recursive: true })

  if (!fs.existsSync(dbPathResolved)) {
    fs.writeFileSync(dbPathResolved, JSON.stringify({ users: [], todos: [], orders: [] }, null, 2), 'utf8')
  }

  const raw = fs.readFileSync(dbPathResolved, 'utf8')
  store = JSON.parse(raw)
  if (!store.users) store.users = []
  if (!store.todos) store.todos = []
  if (!store.orders) store.orders = []

  if (store.users.length === 0) {
    const samplePasswordHash = bcrypt.hashSync('password123', 10)

    const samples = [
      ['paritet.kg@example.com', 'Paritet', 'Axoft', '1999-04-12', '+996 700 111 222', 'Бишкек'],
      ['user2.kg@example.com', 'Aibek', 'Turdubek', '2000-01-05', '+996 701 222 333', 'Ош'],
      ['user3.kg@example.com', 'Dinara', 'Sadykova', '1998-09-20', '+996 702 333 444', 'Жалал-Абад'],
      ['user4.kg@example.com', 'Almaz', 'Karypbek', '1997-12-30', '+996 703 444 555', 'Кара-Балта'],
      ['user5.kg@example.com', 'Maksat', 'Ismailov', '2001-07-14', '+996 704 555 666', 'Талас'],
    ]

    for (const [email, firstName, lastName, birthDate, phone, city] of samples) {
      store.users.push({
        id: store.users.reduce((m, u) => Math.max(m, u.id), 0) + 1,
        email,
        password_hash: samplePasswordHash,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        phone,
        city,
        created_at: new Date().toISOString(),
      })
    }
    saveStore()
  }

  return store
}

function saveStore() {
  if (!dbPathResolved) throw new Error('DB path not resolved yet')
  fs.writeFileSync(dbPathResolved, JSON.stringify(store, null, 2), 'utf8')
}

