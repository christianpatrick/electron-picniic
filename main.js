const {app, Menu, BrowserWindow, shell, clipboard} = require('electron')

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    titleBarStyle: 'hiddenInset',
    width: 1000,
    minWidth: 800,
    height: 650,
    minHeight: 650,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: false,
    },
  })

  $cssInclude = 'body{overflow-x:hidden;}.nav-top,.nav-side{-webkit-app-region:drag;}.nav-side{min-width:78px;}.nav-side ul{margin-top:20px;}.nav-side .icon-nav-picniic{margin-left:5px;margin-right:5px;}.nav-top,.nav-action-menu{margin-left:15px;}.container{padding-left:15px;}.cal-container{padding-right:15px;}.cal-area{border-top-right-radius: 3px;border-bottom-right-radius: 3px;}';

  mainWindow.loadURL('https://picniic.com/signin/main/')

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.insertCSS($cssInclude)
  })

  mainWindow.webContents.on('did-navigate', function() {
    mainWindow.webContents.insertCSS($cssInclude)
  })

  mainWindow.webContents.on('dom-ready', function(e) {
    setTimeout(function(){splash.destroy();mainWindow.show();}, 500)
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.on('close', function(e){
    e.preventDefault()
    mainWindow.hide()
  })
}

function createMenu() {
  // Creates the App Menu
  if (Menu.getApplicationMenu()) {
    return;
  }

  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Back',
          accelerator: 'Shift+CmdOrCtrl+Left',
          click: () => {
            mainWindow.webContents.goBack()
          },
        },
        {
          label: 'Forward',
          accelerator: 'Shift+CmdOrCtrl+Right',
          click: () => {
            mainWindow.webContents.goForward()
          },
        },
        {
          label: 'Reload',
          accelerator: 'Shift+CmdOrCtrl+R',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.reload();
            }
          },
        },
      ],
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close',
        },
      ],
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: `Built by christianpatrick`,
          click: () => {
            shell.openExternal('https://github.com/christianpatrick/electron-picniic');
          },
        },
        {
          label: 'Have an Issue?',
          click: () => {
            shell.openExternal('https://github.com/christianpatrick/electron-picniic/issues');
          },
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'Electron',
      submenu: [
        {
          label: 'Services',
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: 'Hide App',
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers',
        },
        {
          label: 'Show All',
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          },
        },
      ],
    });
    template[3].submenu.push(
      {
        type: 'separator',
      },
      {
        label: 'Bring All to Front',
        role: 'front',
      },
    );
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function splashWindow () {
    splash = new BrowserWindow({
    width: 350,
    minWidth: 350,
    height: 350,
    minHeight: 350,
    frame: false,
    alwaysOnTop: true,
    movable: false,
    closable: false,
  })

  splash.loadURL(`file://${__dirname}/splash.html`)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  splashWindow()
  createMenu()
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', function () {
  mainWindow.destroy()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
    mainWindow.show()
})
