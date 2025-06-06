import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc' // AES encryption algorithm
const KEY_LENGTH = 32 // 256-bit key length
const IV_LENGTH = 16 // Initialization vector length

function encryptData(data) {
  // Generate random key and IV
  const key = crypto.randomBytes(KEY_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  let encryptedData = cipher.update(data, 'utf8', 'hex')
  encryptedData += cipher.final('hex')

  // Return the encrypted data, key, and IV
  return {
    encryptedData: encryptedData,
    key: key,
    iv: iv
  }
}

// Function to decrypt data
function decryptData(encryptedData, key, iv) {
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8')
  decryptedData += decipher.final('utf8')
  return decryptedData
}
// Function to encrypt all files in a directory
export function encryptDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath) // Read all files in the directory
  const encryptionResults = [] // To store the keys and IVs of encrypted files

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file)
    if (fs.statSync(filePath).isFile()) {
      // Check if it's a file
      const fileContent = fs.readFileSync(filePath, 'utf8') // Read file content
      const result = encryptData(fileContent) // Encrypt content

      const encryptedFilePath = filePath + '.enc' // Create new file path for encrypted file
      fs.writeFileSync(encryptedFilePath, result.encryptedData) // Write encrypted content to new file

      console.log(`Encrypted: ${filePath} -> ${encryptedFilePath}`)
      console.log({ file: file, key: result.key.toString('hex'), iv: result.iv.toString('hex') })

      encryptionResults.push([file, result.key.toString('hex'), result.iv.toString('hex')])
    }
  })

  return encryptionResults // Return the array of keys and IVs for all files
}

// Function to decrypt all files in a directory
export function decryptDirectory(directoryPath, key, iv) {
  const files = fs.readdirSync(directoryPath) // Read all files in the directory

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file)
    if (fs.statSync(filePath).isFile() && file.endsWith('.enc')) {
      // Check if it's an encrypted file
      const encryptedContent = fs.readFileSync(filePath, 'utf8') // Read encrypted content
      const decrypted = decryptData(encryptedContent, key, iv) // Decrypt content

      const decryptedFilePath = filePath.replace('.enc', '') // Remove .enc from file name
      fs.writeFileSync(decryptedFilePath, decrypted) // Write decrypted content to new file

      console.log(`Decrypted: ${filePath} -> ${decryptedFilePath}`)
    }
  })
}
