// src/App.tsx or App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import LoginScreen from './pages/loginScreen'
import HomeScreen from './pages/mainScreen'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
      </Routes>
    </Router>
  )
}
export default App
