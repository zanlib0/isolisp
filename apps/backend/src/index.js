import express from 'express'
import cors from 'cors'

import { peselSchema } from './schemas'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/pesel-schema', (req, res) => {
  res.json(peselSchema)
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
