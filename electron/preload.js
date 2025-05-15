import { contextBridge, ipcRenderer } from 'electron';
import directoryManager from './directoryManager';

console.log("Preload script loaded successfully");

contextBridge.exposeInMainWorld('electron', {
  setCurrentDirectory: (path) => directoryManager.setCurrentDirectory(path),

  // Exposing terminal functionality
  runCommand: (command) => ipcRenderer.send('command', command),
  runCommand: (command) => ipcRenderer.send('command', command),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
});

contextBridge.exposeInMainWorld('api', {
    greet: (message) => ipcRenderer.send("greet", message)
});
