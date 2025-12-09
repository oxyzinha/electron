    const { contextBridge, ipcRenderer } = require('electron');

    contextBridge.exposeInMainWorld('suno', {
    generate: (prompt, options = {}) =>
        ipcRenderer.invoke('suno:generate', { prompt, options }),
    getDetails: (taskId) =>
        ipcRenderer.invoke('suno:getDetails', taskId)
    });
