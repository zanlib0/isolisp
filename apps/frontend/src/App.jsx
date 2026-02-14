import { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import TextInput from './components/TextInput'
import SelectInput from './components/SelectInput'
import './App.css'
import { DynamicForm } from './components/DynamicForm'

function App() {
  const [backendStatus, setBackendStatus] = useState(null)

  const [peselFormSchema, setPeselFormSchema] = useState(null)

  useEffect(() => {
    // Check backend health on mount
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data))
      .catch(err => console.error('Backend not available:', err))
  }, [])

  useEffect(() => {
    fetch('/api/pesel-schema')
      .then(res => res.json())
      .then(data => setPeselFormSchema(data))
      .catch(err => console.error('Pesel form schema not available:', err))
  }, [])

  return (
    <div className="App">
      <header>
        <h1>IsoLisp Form Builder</h1>
        {backendStatus && (
          <p className="status">
            Backend Status: ✅
            {backendStatus.status}
          </p>
        )}
      </header>

      <main>
        {peselFormSchema && <DynamicForm schema={peselFormSchema} />}
      </main>
    </div>
  )
}

export default App
