const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')


/*
 * Python process
 */

const PY_FOLDER = 'pycalc'
const PY_MODULE = 'api' // without .py suffix

let pyProc = null
let pyPort = null

const getScriptPath = () => {
  return path.join(__dirname, '..', PY_FOLDER, PY_MODULE + '.py')
}

const selectPort = () => {
  return 4242
}

const createPyProc = () => {
  let script = getScriptPath()
  let port = '' + selectPort()

  pyProc = require('child_process').spawn('python', [script, port])

  if (pyProc != null) {
    console.log('child process success on port ' + port)
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)


/*
 * Electron Window Management
 */

let mainWindow = null

const createWindow = () => {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL(require('url').format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})