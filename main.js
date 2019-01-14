const { app, BrowserWindow, dialog, protocol, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path')
const url = require('url')

let win, updateWin;

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
function sendStatusToWindow(text) {
    updateWin.webContents.send('message', text);
}

function createUpdateCheckerWindow() {
    updateWin = new BrowserWindow({parent: win});
    updateWin.on('closed', () => {
        updateWin = null;
    });
    updateWin.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
    autoUpdater.checkForUpdates();
    return updateWin;
}

autoUpdater.on('update-available', (info) => {
    console.log(dialog.showMessageBox({
        title: 'DagymPartners',
        message: '새로운 업데이트가 있습니다.',
        buttons: ['확인']
    }));
});
autoUpdater.on('update-not-available', (info) => {
    // createWindow();
    updateWin.close();
})
autoUpdater.on('error', (err) => {
    // createWindow();
    updateWin.close();
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "다운로드 속도: " + Math.round(progressObj.bytesPerSecond / 1024 / 1024) + "Mb/s";
    log_message = log_message + ' - 업데이트 진행: ' + Math.round(progressObj.percent) + '%';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    autoUpdater.quitAndInstall();
});

// Create window on electron intialization
app.on('ready', function() {
    createWindow();
    createUpdateCheckerWindow();
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

