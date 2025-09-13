const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

// 引入 main-process.js 以註冊 IPC 處理程序
require('./main-process.js');

let settingsWindow = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('index.html').catch(error => {
    console.error('Failed to load index.html:', error);
    dialog.showErrorBox('錯誤', '無法載入主視窗: ' + error.message);
  });

  // 創建選單
  const menuTemplate = [
    {
      label: '設置',
      submenu: [
        {
          label: '開啟設置視窗',
          click: () => {
            if (!settingsWindow || settingsWindow.isDestroyed()) {
              settingsWindow = new BrowserWindow({
                width: 400,
                height: 300,
                parent: win,
                modal: true,
                webPreferences: {
                  nodeIntegration: false,
                  contextIsolation: true
                }
              });
              const settingsPath = path.resolve(__dirname, 'settings.html');
              console.log('Attempting to load settings window from:', settingsPath);
              settingsWindow.loadFile(settingsPath).catch(error => {
                console.error('Failed to load settings.html:', error);
                dialog.showErrorBox('錯誤', '無法載入設置視窗: ' + error.message);
              });
              settingsWindow.on('closed', () => {
                console.log('Settings window closed');
                settingsWindow = null;
              });
            } else {
              settingsWindow.focus();
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});