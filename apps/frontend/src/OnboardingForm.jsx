import { useState, useEffect } from 'react'
import { DynamicForm } from './components/DynamicForm'

export const OnboardingForm = () => {
  const [formSchema, setFormSchema] = useState(null)

  useEffect(() => {
    fetch('/api/onboarding-schema')
      .then(res => res.json())
      .then(data => setFormSchema(data))
      .catch(err => console.error('Onboarding form schema not available:', err))
  }, [])

  if (formSchema) {
    return (
      <>
        <header>
          <h1>Onboarding Form</h1>
        </header>
        <DynamicForm schema={formSchema} />
      </>
    )
  }

  return <span>Loading...</span>
}
