import { app, BrowserWindow, ipcMain } from 'electron/main'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  win.loadURL('http://localhost:3000');
}

ipcMain.on('command', (event, command) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      event.reply('command-output', `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      event.reply('command-output', `stderr: ${stderr}`);
      return;
    }
    event.reply('command-output', stdout);
  });
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data;
  } catch (err) {
    return `Error reading file: ${err.message}`;
  }
});

ipcMain.on('greet', (event, args) => {
  console.log(args);
});

app.whenReady().then(createWindow)