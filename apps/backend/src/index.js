import cors from 'cors'
import express from 'express'

import { onboardingSchema } from './onboardingForm/schemas.js'
import { peselSchema } from './peselForm/schemas.js'
import { dynamicValidate } from './validate.js'

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

app.get('/api/onboarding-schema', (req, res) => {
  res.json(onboardingSchema)
})

app.post('/api/pesel', (req, res) => {
  console.log(req.body)
  const result = dynamicValidate(req.body, peselSchema)

  if (result.ok) {
    res.json(result)
  }
  else {
    res.status(400).json(result)
  }
})

app.post('/api/onboarding', (req, res) => {
  console.log(req.body)
  const result = dynamicValidate(req.body, onboardingSchema)

  if (result.ok) {
    res.json(result)
  }
  else {
    res.status(400).json(result)
  }
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
