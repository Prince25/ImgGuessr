const path = require('node:path')
const print = require((path.join(__dirname, 'src', 'printToConsole.js')));

const { app, BrowserWindow, ipcMain } = require('electron/main');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'electron', 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,     // protect against prototype pollution
            enableRemoteModule: false,  // turn off remote
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'electron', 'index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    print("info", "Welcome to ImgGuessr!\n")
    createWindow()
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
        print("info", "Thanks for playing!\n")
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});
