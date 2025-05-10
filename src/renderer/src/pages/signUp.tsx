// SignUpForm.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const ipcHandle = (): void => {
    window.electron.ipcRenderer.send('sign-up', { formData })

    // Listen for a response from the main process
    window.electron.ipcRenderer.once('sign-up-response', (_event) => {
      navigate('/')
    })

    // Listen for LoginCheckError (in case you need to handle errors differently)
    window.electron.ipcRenderer.once('LoginCheckError', (_event) => {
      console.log('error')
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission (e.g., send to API)
    console.log('Form submitted:', formData)

    ipcHandle()
  }

  const handleLogIn = async () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <a className="text-blue-600 hover:underline hover:cursor-pointer" onClick={handleLogIn}>
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignUpForm
