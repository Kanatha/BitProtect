# BitProtect

BitProtect is a cross-platform desktop application built using **Electron** and **React**. It provides a secure and user-friendly interface for managing your sensitive data.

## Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (latest LTS recommended)
- **Yarn** (package manager)

### Installation
Clone the repository and install dependencies:
```sh
# Clone the repository
git clone https://github.com/your-repo/bitprotect.git
cd bitprotect

# Install dependencies
yarn install
```

## Running the Application
Since BitProtect consists of both a React frontend and an Electron backend, you need to run two separate terminal sessions:

### 1. Start the React Development Server
```sh
yarn start
```
This will start the React application on `http://localhost:3000/`.

### 2. Start Electron
Open another terminal in the project root directory and run:
```sh
yarn run electron
```
This will launch the Electron application.

## Build
To create a production build of the application, run:
```sh
yarn build
```
Then, package the Electron app:
```sh
yarn run electron-pack
```

## License
This project is licensed under the MIT License.