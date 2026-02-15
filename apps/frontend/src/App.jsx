import { useState, useEffect } from 'react'
import './App.css'
import { DynamicForm } from './components/DynamicForm'

function App() {
  const [peselFormSchema, setPeselFormSchema] = useState(null)

  useEffect(() => {
    fetch('/api/pesel-schema')
      .then(res => res.json())
      .then(data => setPeselFormSchema(data))
      .catch(err => console.error('Pesel form schema not available:', err))
  }, [])

  return (
    <div className="App">
      <header>
        <h1>Employee Form</h1>
      </header>

      <main>
        {peselFormSchema && <DynamicForm schema={peselFormSchema} />}
      </main>
    </div>
  )
}

export default App
