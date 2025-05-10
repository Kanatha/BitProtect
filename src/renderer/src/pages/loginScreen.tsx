import logo from './../assets/electron.svg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function LoginScreen(): React.JSX.Element {
  const navigate = useNavigate()

  const ipcHandle = (): void => {
    window.electron.ipcRenderer.send('LoginCheck', { email, password })

    // Listen for a response from the main process
    window.electron.ipcRenderer.once('LoginCheckResponse', (_event) => {
      navigate('/home')
    })

    // Listen for LoginCheckError (in case you need to handle errors differently)
    window.electron.ipcRenderer.once('LoginCheckError', (_event) => {
      console.log('error')
    })
  }

  const handleSignUp = async () => {
    navigate('/signUp')
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div class="flex flex-col items-center h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mt-4 mb-2">Bitprotect</h2>

      <input
        placeholder="E-mail"
        className="w-100 h-10 border border-gray-300 focus:border-2 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 mt-50 mb-5 transition-all duration-300 hover:w-105 hover:h-12 focus:duration-0"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <input
        placeholder="Password"
        type="password"
        className="w-100 h-10 border border-gray-300 focus:border-2 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 transition-all duration-300 hover:w-105 hover:h-12 focus:duration-0"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button
        class="w-100 h-10 my-8 bg-blue-500 rounded-lg text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-gray-600 hover:shadow-2xl hover:h-12 hover:w-105 hover:cursor-pointer"
        onClick={ipcHandle}
      >
        Log in
      </button>

      <hr class="h-1 w-100 my-8 border-t-2 border-gray-300" />

      <div class="flex mt-0">
        <p class="mr-5 select-none text-gray-800">Don't have an Account? </p>
        <p
          class="text-blue-600 select-none cursor-pointer transition-all duration-300 hover:text-blue-800 hover:text-lg"
          onClick={handleSignUp}
        >
          {' '}
          Sign up
        </p>
      </div>
    </div>
  )
}

export default LoginScreen
