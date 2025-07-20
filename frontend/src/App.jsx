import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    fetch('/api/ping')
      .then(res => res.json())
      .then(data => console.log(data.message))
  }, [])

  return (
    <div>
      <h1>Cofrinho 🐷</h1>
      <p>Verifique o console para ver a resposta da API.</p>
    </div>
  )
}


export default App
