import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function MainScreen() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div class="flex flex-col items-center h-screen">
      <div class="flex flex-row w-screen h-10 mb-5 mx-10 rounded-lg content-center ">
        <div class="flex col-span-1 w-10 items-center content-center justify-center group hover:cursor-grab hover:bg-gray-400 mx-3 rounded-lg">
          <Menu
            class="size-7 text-gray-600 group-hover:text-gray-800 group-hover:size-9 transition-all duration-300"
            onClick={setMenuOpen}
          />
        </div>
        <div class="w-20 h-10 flex items-center justify-center group hover:bg-gray-200 text-center rounded-lg transition-all duration-300 select-none">
          <p class="transition-transform duration-300 group-hover:scale-110 group-hover:cursor-grab text-blue-600 font-medium">
            Encrypt
          </p>
        </div>
        <div class="w-20 h-10 flex items-center justify-center group hover:bg-gray-200 text-center rounded-lg transition-all duration-300 select-none">
          <p class="transition-transform duration-300 group-hover:scale-110 group-hover:cursor-grab text-blue-600 font-medium">
            Decrypt
          </p>
        </div>
      </div>
      {menuOpen && (
        <div
          className={'fixed inset-0 bg-gray-700 opacity-75 transition-opacity duration-800 z-40 '}
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

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
    </div>
  )
}
