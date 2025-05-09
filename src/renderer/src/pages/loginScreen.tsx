import Input from './../components/Input'
import logo from './../assets/electron.svg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function LoginScreen(): React.JSX.Element {
  const navigate = useNavigate()

  const ipcHandle = (): void => {
    window.electron.ipcRenderer.send('LoginCheck', { email, password })

    // Listen for a response from main process
    window.electron.ipcRenderer.once('LoginCheckResponse', (_event, response) => {
      console.log('Response from main:', response)
      navigate('/home')

      // handle response, e.g., show error, redirect, etc.
    })
  }

  const [email, setEmail] = useState('Lsuka')
  const [password, setPassword] = useState('lukaPass')

  const checkLogin = async () => {}

  return (
    <div class="flex flex-col items-center h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mt-4 mb-2">Bitprotect</h2>

      <Input
        placeholder="E-mail"
        class="mt-50 mb-5 transition-all duration-300 hover:w-105 hover:h-12 focus:duration-0"
        type="email"
      />
      <Input
        placeholder="password"
        type="password"
        class="transition-all duration-300 hover:w-105 hover:h-12 focus:duration-0"
      />

      <button
        class="w-100 h-10 my-8 bg-blue-500 rounded-lg text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-gray-600 hover:shadow-2xl hover:h-12 hover:w-105 hover:cursor-grab"
        onClick={ipcHandle}
      >
        Log in
      </button>

      <hr class="h-1 w-100 my-8 border-t-2 border-gray-300" />

      <div class="flex mt-0">
        <p class="mr-5 select-none text-gray-800">Don't have an Account? </p>
        <p class="text-blue-600 select-none cursor-pointer transition-all duration-300 hover:text-blue-800 hover:text-lg">
          {' '}
          Sign up
        </p>
      </div>
      <a href="./src/pages/mainScreen.tsx">here</a>
    </div>
  )
}

export default LoginScreen
