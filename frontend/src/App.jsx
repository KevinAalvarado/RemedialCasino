import { useState } from 'react'
import './App.css'
import Casino from './pages/Casino'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Casino/>
  )
}

export default App
