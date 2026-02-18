import { useState, useEffect } from 'react'
import { DynamicForm } from './components/DynamicForm'

export const PeselForm = () => {
  const [formSchema, setFormSchema] = useState(null)

  useEffect(() => {
    fetch('/api/pesel-schema')
      .then(res => res.json())
      .then(data => setFormSchema(data))
      .catch(err => console.error('Pesel form schema not available:', err))
  }, [])

  if (formSchema) {
    return (
      <>
        <header>
          <h1>Employee Form</h1>
        </header>
        <DynamicForm schema={formSchema} />
      </>
    )
  }

  return <span>Loading...</span>
}
