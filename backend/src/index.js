import { app } from './app.js'
import { initDb } from './db.js'

const port = Number(process.env.PORT || 4000)

await initDb()

app.listen(port, () => {
  console.log(`[backend] listening on http://localhost:${port}`)
})

