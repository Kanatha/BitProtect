import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { encryptDirectory, decryptDirectory } from './encryption'

let sessionInfo = null

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('LoginCheck', async (event, { email, password }) => {
    try {
      // Placeholder URL
      const url = 'http://127.0.0.1:3000/auth'

      // Placeholder request body
      const body = {
        username: email,
        password: password
      }

      // Send POST request
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.status === 200) {
        const result = await response.json()

        const { username, uuid, keys } = result
        sessionInfo = { username, uuid, keys }
        console.log(sessionInfo)
        //Send response back to renderer process
        event.sender.send('LoginCheckResponse')
      } else {
        // Send response back to renderer process
        event.sender.send('LoginCheckError')
        console.log('error')
      }
    } catch (error) {
      console.error('LoginCheck error:', error)
      event.sender.send('LoginCheckResponse', { error: 'Request failed' })
    }
  })

  ipcMain.on('sign-up', async (event, { formData }) => {
    try {
      // Placeholder URL
      const url = 'http://127.0.0.1:3000/createuser'

      // Placeholder request body
      const body = {
        username: formData.email,
        password: formData.password
      }

      // Send POST request
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.status === 200) {
        event.sender.send('sign-up-response')
      } else {
        event.sender.send('sign-up-error')
        console.log('error')
      }
    } catch (error) {
      console.error('sign-up-error', error)
      event.sender.send('sign-up-error')
    }
  })

  ipcMain.on('session-data', async (event) => {
    event.sender.send('session-data-response', sessionInfo)
  })

  ipcMain.handle('select-directory-encrypt', async (event, operation, keyNote) => {
    const properties =
      operation === 'export' ? ['openDirectory', 'createDirectory'] : ['openDirectory']
    const result = await dialog.showOpenDialog({
      properties: properties
    })
    if (result.canceled) {
      console.log('canceled')
      return null
    } else {
      const encryptionResult = encryptDirectory(result.filePaths[0])
      try {
        // Placeholder URL
        const url = 'http://127.0.0.1:3000/insertkey'

        // Placeholder request body
        const body = {
          uuid: sessionInfo.uuid,
          key: encryptionResult[0][1],
          iv: encryptionResult[0][2],
          note: keyNote
        }

        // Send POST request
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

        if (response.status === 200) {
          console.log('key inserted')
        } else {
          console.log('error inserting the key')
        }
      } catch (error) {
        console.error('LoginCheck error:', error)
        event.sender.send('LoginCheckResponse', { error: 'Request failed' })
      }
      return result.filePaths[0]
    }
  })

  ipcMain.handle('select-directory-decrypt', async (event, operation, hexKey, hexIv) => {
    const properties =
      operation === 'export' ? ['openDirectory', 'createDirectory'] : ['openDirectory']
    const result = await dialog.showOpenDialog({
      properties: properties
    })
    if (result.canceled) {
      console.log('canceled')
      return null
    } else {
      console.log(result.filePaths[0])

      const key = Buffer.from(hexKey, 'hex')
      const iv = Buffer.from(hexIv, 'hex')

      decryptDirectory(result.filePaths[0], key, iv)
      return result.filePaths[0]
    }
  })

  ipcMain.on('refresh', async (event) => {
    try {
      // Placeholder URL
      const url = 'http://127.0.0.1:3000/getkeys'

      // Placeholder request body
      const body = {
        username: sessionInfo.username
      }

      // Send POST request
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.status === 200) {
        const res = await response.json()
        const { username, uuid, keys } = res
        sessionInfo = { username, uuid, keys }
        console.log(sessionInfo.keys)
        console.log('recieved keys')
      } else {
        console.log('error recieving keys')
      }
    } catch (error) {
      console.error('Error getting keys:', error)
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
