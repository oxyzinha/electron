const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  // Cria a janela principal
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Configurações de segurança/ambiente (essenciais para um projeto real)
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Carrega o arquivo HTML na janela
  win.loadFile('index.html');

  // Opcional: Abre as Ferramentas do Desenvolvedor automaticamente
  // win.webContents.openDevTools();
}

// Quando o Electron estiver pronto, cria a janela
app.whenReady().then(createWindow);

// Evento para fechar a aplicação quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
  // Mantém a aplicação rodando no macOS mesmo sem janelas abertas
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Evento para recriar a janela no macOS quando o ícone for clicado no dock
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});