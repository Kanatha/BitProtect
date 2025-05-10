// src/App.tsx or App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import LoginScreen from './pages/loginScreen'
import HomeScreen from './pages/mainScreen'
import SignUpForm from './pages/signUp'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/signUp" element={<SignUpForm />} />
      </Routes>
    </Router>
  )
}
export default App
