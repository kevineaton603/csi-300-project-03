const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on('tweet', (event, arg)=>{
  console.log(arg)
  win.webContents.send('update-timeline', arg);
})

ipcMain.on('new-user', (event,arg)=>{
  console.log(arg);
  win.webContents.send('account-created', arg);
})

/**
 * Once the login has been validated then 
 * users creditial are sent here where 
 * they are written to a JSON file
 * to be accessed later uses
 */
ipcMain.on('login-cred', (event,arg)=>{
  console.log(arg);
  var data = {}
  arg.forEach(element => {
    data[element.name] = element.value
  });
  data = JSON.stringify(data)
  fs.writeFile(path.join(__dirname, 'user.json'), data, (err) => {  
    if (err) throw err;
    console.log('Data written to file');
  });
  win.webContents.send('login-confirmed', arg);
})
var profileID = null;
var currentID = null;
ipcMain.on('user-info', (event, arg)=>{
  console.log(arg);
  currentID = arg[0];
  profileID = arg[1];
})

ipcMain.on("get-info", (event, arg)=>{
  win.webContents.send('profile-info', profileID)
  event.returnValue = [currentID, profileID];
})