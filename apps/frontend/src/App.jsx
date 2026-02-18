import { useState } from 'react'
import './App.css'
import { PeselForm } from './PeselForm'
import { OnboardingForm } from './OnboardingForm'

function App() {
  const [tab, setTab] = useState('')

  return (
    <div className="App">
      <nav>
        <button onClick={() => setTab('pesel')}>PeselForm</button>
        <button onClick={() => setTab('onboarding')}>OnboardingForm</button>
      </nav>
      <main>
        {tab === 'pesel' && (<PeselForm />)}
        {tab === 'onboarding' && (<OnboardingForm />)}
      </main>
    </div>
  )
}

export default App
