import { useState, useEffect } from 'react'
import { DynamicForm } from './components/DynamicForm'

export const OnboardingForm = () => {
  const [formSchema, setFormSchema] = useState(null)
  const [response, setResponse] = useState('')

  useEffect(() => {
    fetch('/api/onboarding-schema')
      .then(res => res.json())
      .then(data => setFormSchema(data))
      .catch(err => console.error('Onboarding form schema not available:', err))
  }, [])

  const handleResponse = async (res) => {
    const body = await res.json()
    setResponse(JSON.stringify(body, null, 2))
  }

  if (formSchema) {
    return (
      <>
        <header>
          <h1>Onboarding Form</h1>
        </header>
        <DynamicForm schema={formSchema} onSubmit={handleResponse} />
        <pre className="response">{response}</pre>
      </>
    )
  }

  return <span>Loading...</span>
}
