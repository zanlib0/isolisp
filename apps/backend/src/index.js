import express from 'express'
import cors from 'cors'

import { pesel, required, visiblePesel } from './rules.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/pesel-schema', (req, res) => {
  res.json({
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'input',
        validations: [
          { rule: required, message: 'Full name is required.' },
        ],
      },
      {
        name: 'identityDocument',
        label: 'Identity Document',
        type: 'select',
        options: ['Passport', 'National Identity Document'],
        validations: [
          { rule: required, message: 'Identity document is required' },
        ],
      },
      {
        name: 'pesel',
        label: 'PESEL',
        type: 'input',
        visibility: visiblePesel,
        validations: [
          { rule: required, message: 'PESEL is required.' },
          { rule: pesel, message: 'PESEL is invalid.' },
        ],
      },
    ],
  })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
