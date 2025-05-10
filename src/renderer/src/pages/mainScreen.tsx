import { useState, useEffect } from 'react'
import { CircleUserRound, X } from 'lucide-react'

export default function MainScreen() {
  const [sessionData, setSessionData] = useState({ username: '', keys: [] })
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [keyArray, setKeyArray] = useState([]) // Initialize as an array
  const [selectedKey, setSelectedKey] = useState(null) // Default to null
  const [keyName, setKeyName] = useState('')

  const handleDirectorySelectEncrypt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await window.electron.ipcRenderer.invoke('select-directory-encrypt', 'export', keyName)
    } catch (error) {
      console.error('Error selecting directory', error)
    }
  }

  const handleDirectorySelectDecrypt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const hexKey = selectedKey.key
      const hexIv = selectedKey.iv
      await window.electron.ipcRenderer.invoke('select-directory-decrypt', 'export', hexKey, hexIv)
    } catch (error) {
      console.error('Error selecting directory', error)
    }
  }

  const getSessionData = () => {
    try {
      window.electron.ipcRenderer.send('session-data')

      // Listen for a response from the main process
      window.electron.ipcRenderer.once('session-data-response', (_event, sessionData) => {
        if (sessionData) {
          setSessionData(sessionData)
          setKeyArray(sessionData.keys || [])
        }
      })
    } catch (error) {
      console.error('Error fetching session data', error)
    }
  }

  useEffect(() => {
    getSessionData()
  }, [])

  useEffect(() => {
    console.log(keyArray)
  }, [keyArray])

  useEffect(() => {
    if (selectedKey) {
      console.log(selectedKey)
    }
  }, [selectedKey])

  const [hexKey, setInput1] = useState('')
  const [hexIv, setInput2] = useState('')

  // Handle changes to the inputs
  const handleInput1Change = (e) => {
    setInput1(e.target.value)
  }

  const handleInput2Change = (e) => {
    setInput2(e.target.value)
  }

  // Handle form submission or event to get the data
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await window.electron.ipcRenderer.invoke('decrypt-data', { hexKey, hexIv })
    } catch (error) {
      console.error('Error decrypting data', error)
    }
  }

  const handleKeyChange = (e) => {
    const selectedOption = keyArray.find((item) => item.note === e.target.value)
    setSelectedKey(selectedOption) // Set the full object
  }

  const handleEncryption = async (e) => {
    setKeyName(e.target.value)
  }

  const handleRefresh = async () => {
    window.electron.ipcRenderer.send('refresh')
    await getSessionData()
  }

  return (
    <div className="flex flex-col items-center h-screen">
      {/* Header */}
      <div className="flex flex-row w-screen h-10 mb-5 mx-10 rounded-lg items-center">
        <div
          className="w-10 flex items-center justify-center group hover:cursor-grab hover:bg-gray-400 mx-3 rounded-lg"
          onClick={() => setMenuOpen(true)}
        >
          <CircleUserRound className="size-7 text-gray-600 group-hover:text-gray-800 group-hover:size-9 transition-all duration-300" />
        </div>
        <div
          className={`w-20 h-10 flex items-center justify-center group text-center rounded-lg transition-all duration-300 select-none cursor-pointer ${
            activeTab === 'encrypt' ? 'bg-blue-100' : 'hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('encrypt')}
        >
          <p className="transition-transform duration-300 group-hover:scale-110 text-blue-600 font-medium">
            Encrypt
          </p>
        </div>
        <div
          className={`w-20 h-10 flex items-center justify-center group text-center rounded-lg transition-all duration-300 select-none cursor-pointer ${
            activeTab === 'decrypt' ? 'bg-blue-100' : 'hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('decrypt')}
        >
          <p className="transition-transform duration-300 group-hover:scale-110 text-blue-600 font-medium">
            Decrypt
          </p>
        </div>
      </div>

      {/* Modal Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-gray-700 opacity-75 transition-opacity duration-800 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Side Modal */}
      <div
        className={`fixed top-0 left-0 h-full w-1/4 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Welcome, {sessionData.username}</h2>
          <X
            onClick={() => setMenuOpen(false)}
            className="size-7 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:size-9 hover:cursor-grab"
          />
        </div>
        <div className="p-4">
          <p>{'Placeholder :)'}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-xl p-6 bg-gray-100 rounded-lg shadow-md">
        {activeTab === 'encrypt' ? (
          <div className="flex flex-col items-center gap-4">
            <form onSubmit={handleDirectorySelectEncrypt} className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <label className="text-gray-700 font-medium" htmlFor="directory">
                  Select a directory to encrypt:
                </label>
                <input
                  id="directory"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Name this key"
                  required
                  onChange={(e) => setKeyName(e.target.value)}
                  value={keyName}
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-blue-700 transition duration-200 hover:cursor-pointer"
                >
                  Select
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center text-gray-700">
            🔓 Decrypt section content placeholder
            <form>
              {/* Dropdown for selecting the note */}
              <select
                value={selectedKey ? selectedKey.note : ''}
                onChange={handleKeyChange}
                className="p-2 border border-gray-300 rounded-md mt-2"
                disabled={keyArray.length === 0}
              >
                <option value="" disabled>
                  {keyArray.length === 0 ? 'No keys available' : 'Select a note'}
                </option>
                {keyArray.map((item, index) => (
                  <option key={index} value={item.note}>
                    {item.note}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="mt-2 p-2 bg-blue-500 text-white rounded-md"
                onClick={handleDirectorySelectDecrypt}
              >
                Submit
              </button>
            </form>
            <button className="mt-2 p-2 bg-blue-500 text-white rounded-md" onClick={handleRefresh}>
              refresh
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
