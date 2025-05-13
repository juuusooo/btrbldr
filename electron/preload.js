import { contextBridge } from 'electron';
import directoryManager from './directoryManager';

contextBridge.exposeInMainWorld('api', {
  setCurrentDirectory: (path) => directoryManager.setCurrentDirectory(path),
  // expose more as needed
});
