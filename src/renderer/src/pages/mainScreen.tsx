import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function MainScreen() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt')

  const handleDirectorySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await window.electron.ipcRenderer.invoke('select-directory', 'export')
  }

  const handleEncryption = async () => {}

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
    await window.electron.ipcRenderer.invoke('decrypt-data', { hexKey, hexIv })
  }

  return (
    <div className="flex flex-col items-center h-screen">
      {/* Header */}
      <div className="flex flex-row w-screen h-10 mb-5 mx-10 rounded-lg items-center">
        <div
          className="w-10 flex items-center justify-center group hover:cursor-grab hover:bg-gray-400 mx-3 rounded-lg"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="size-7 text-gray-600 group-hover:text-gray-800 group-hover:size-9 transition-all duration-300" />
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
          <h2 className="text-xl font-semibold">Modal Title</h2>
          <X
            onClick={() => setMenuOpen(false)}
            className="size-7 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:size-9 hover:cursor-grab"
          />
        </div>
        <div className="p-4">
          <p>This is the modal content.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-xl p-6 bg-gray-100 rounded-lg shadow-md">
        {activeTab === 'encrypt' ? (
          <div className="flex flex-col items-center gap-4">
            <label className="text-gray-700 font-medium">Select a directory to encrypt:</label>
            <button onClick={handleDirectorySelect}>select</button>
          </div>
        ) : (
          <div className="text-center text-gray-700">
            🔓 Decrypt section content placeholder
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={hexKey}
                onChange={handleInput1Change}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter text here"
              />
              <input
                type="text"
                value={hexIv}
                onChange={handleInput2Change}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Enter more text"
              />
              <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded-md">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
