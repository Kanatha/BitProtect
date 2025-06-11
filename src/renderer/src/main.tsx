import './assets/main.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { router as Router, Routes, Route } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
)
