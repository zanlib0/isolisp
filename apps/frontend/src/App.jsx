import { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import TextInput from './components/TextInput'
import SelectInput from './components/SelectInput'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState(null)

  useEffect(() => {
    // Check backend health on mount
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data))
      .catch(err => console.error('Backend not available:', err))
  }, [])

  const sampleOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

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
        <Formik
          initialValues={{
            textField: '',
            selectField: '',
          }}
          onSubmit={() => {
            // No-op: submission logic to be added later
          }}
        >
          <Form>
            <TextInput
              name="textField"
              label="Text Input Example"
              placeholder="Enter some text..."
            />

            <SelectInput
              name="selectField"
              label="Select Input Example"
              options={sampleOptions}
            />

            {/* No submit button - just demonstrating components */}
          </Form>
        </Formik>
      </main>
    </div>
  )
}

export default App
