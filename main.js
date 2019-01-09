const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path')
const url = require('url')

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1080,
    height: 920,
    backgroundColor: '#ffffff',
    allowEval: true,
    webPreferences: {
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'resources/installer/icon.png')
  })


  win.loadURL('https://partners.da-gym.net');

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', function() {
    createWindow();
    autoUpdater.checkForUpdates();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', (info) => {
    alert('최신 버전으로 업데이트합니다.');
    autoUpdater.quitAndInstall();
});
