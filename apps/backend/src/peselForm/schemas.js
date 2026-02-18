import { peselDsl as pesel, requiredDsl as required, visiblePeselDsl as visiblePesel } from './rules.js'

export const peselSchema = {
  submit: { method: 'POST', url: '/api/pesel' },
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
      options: [
        { label: 'Passport', value: 'passport' },
        { label: 'National Identity Document', value: 'nationalId' },
      ],
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
}
