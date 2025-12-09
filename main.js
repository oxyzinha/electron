const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config(); // para ler SUNO_API_KEY do .env

console.log('SUNO_API_KEY no main:', process.env.SUNO_API_KEY ? 'OK' : 'NÃO LIDA');

const { generateSunoTrack, getMusicDetails } = require('./electron/sunoClient');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1300,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, 'electron', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Dev
  win.loadURL('http://localhost:3000');
  // Prod:
  // win.loadFile(path.join(__dirname, 'app-react/build/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC para Suno - criar tarefa
ipcMain.handle('suno:generate', async (event, { prompt, options }) => {
  try {
    const result = await generateSunoTrack(prompt, options);
    return result;
  } catch (err) {
    console.error('Erro no IPC Suno generate:', err);
    throw err;
  }
});

// IPC para Suno - obter detalhes da música
ipcMain.handle('suno:getDetails', async (event, taskId) => {
  try {
    const result = await getMusicDetails(taskId);
    return result;
  } catch (err) {
    console.error('Erro no IPC Suno getDetails:', err);
    throw err;
  }
});

// Simular detecção automática de tarefas
const tasks = ['estudo', 'foco', 'relax', 'happy'];
setInterval(() => {
  if (win && win.webContents) {
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    win.webContents.send('task-changed', task);
    console.log(`Task changed (simulada): ${task}`);
  }
}, 15000);
