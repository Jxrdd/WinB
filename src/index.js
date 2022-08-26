const { app, BrowserWindow, autoUpdater } = require('electron')
const path = require('path')
const fetch = require('node-fetch')
const client = require('discord-rich-presence')('960308016190750730')
const time = Math.floor(Date.now() / 1000)
const server = "https://win-bounce.vercel.app"
const url = `${server}/update/${process.platform}/${app.getVersion()}`


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const updateSong = async () => {
  try {
    const data = await (await fetch('https://itsbounce.net/api/stats')).json()
    client.updatePresence({
      details: `🎵 | ${data.song.title} by ${data.song.artist}`,
      state: `🎙️ | ${data.live.presenter}`,
      largeImageKey: 'icon',
      largeImageText: 'itsbounce.net',
      instance: true,
      startTimestamp: time
    })
  } catch (err) {
    console.error(err)
  };
}

updateSong()
setInterval(updateSong, 5000)
autoUpdater.setFeedURL({ url })