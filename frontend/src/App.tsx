import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'unreachable'>('loading')

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setBackendStatus('connected')
        else setBackendStatus('unreachable')
      })
      .catch(() => setBackendStatus('unreachable'))
  }, [])

  return (
    <div className="app">
      <h1>Palate</h1>
      <p>Your wine discovery companion.</p>
      <p className={`status ${backendStatus}`}>
        {backendStatus === 'loading' && 'Connecting to backend...'}
        {backendStatus === 'connected' && 'Backend connected'}
        {backendStatus === 'unreachable' && 'Backend unreachable'}
      </p>
    </div>
  )
}

export default App
