const { app, BrowserWindow } = require('electron');
const path = require('path');

// Declarar win fora para usar noutras funções
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1300,
    height: 850,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Permite comunicação IPC fácil (dev)
    },
  });

  // Em desenvolvimento: abre React em localhost (certifica-te que npm start está a correr em app-react)
  win.loadURL('http://localhost:3000');
  // Para produção depois do build:
  // win.loadFile(path.join(__dirname, 'app-react/build/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // No Windows/Linux fecha tudo, no Mac não fecha logo
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // No Mac: reabrir janela se não existir
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Simular detecção automática de tarefas: envia evento para React a cada 15 segundos
const tasks = ['estudo', 'foco', 'relax', 'happy'];
setInterval(() => {
  if (win && win.webContents) {
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    win.webContents.send('task-changed', task);
    console.log(`Task changed (simulada): ${task}`);
  }
}, 15000);
