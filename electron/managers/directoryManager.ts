// directoryManager.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { EventEmitter } from 'events';

export interface DirectoryFileItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
}

export interface DirectoryManagerState {
  currentDirectory: string | null;
  fileList: DirectoryFileItem[];
  selectedItems: string[];
}

class DirectoryManager extends EventEmitter {
  private state: DirectoryManagerState = {
    currentDirectory: null,
    fileList: [],
    selectedItems: [],
  };

  constructor() {
    super();
  }

  setCurrentDirectory(path: string | null): void {
    if (this.state.currentDirectory !== path) {
      this.state.currentDirectory = path;
      this.state.fileList = [];
      this.state.selectedItems = [];
      console.log('Current directory set to:', path);
      if (path) {
        this.readDirectoryContents(path);
      } else {
        this.emit('fileListUpdated', []);
      }
      this.emit('currentDirectoryChanged', path);
    }
  }

  getCurrentDirectory(): string | null {
    return this.state.currentDirectory;
  }

  setFileList(files: DirectoryFileItem[]): void {
    this.state.fileList = files;
    this.emit('fileListUpdated', [...this.state.fileList]);
  }

  getFileList(): DirectoryFileItem[] {
    return [...this.state.fileList];
  }

  setSelectedItems(ids: string[]): void {
    this.state.selectedItems = ids;
    this.emit('selectionChanged', [...this.state.selectedItems]);
  }

  addSelectedItem(id: string): void {
    if (!this.state.selectedItems.includes(id)) {
      this.state.selectedItems = [...this.state.selectedItems, id];
      this.emit('selectionChanged', [...this.state.selectedItems]);
    }
  }

  removeSelectedItem(id: string): void {
    this.state.selectedItems = this.state.selectedItems.filter(itemId => itemId !== id);
    this.emit('selectionChanged', [...this.state.selectedItems]);
  }

  getSelectedItems(): string[] {
    return [...this.state.selectedItems];
  }

  private async readDirectoryContents(directoryPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(directoryPath);
      const filesAndFolders: DirectoryFileItem[] = [];

      for (const entry of entries) {
        const fullPath = path.join(directoryPath, entry);
        const stats = await fs.stat(fullPath);
        const type: DirectoryFileItem['type'] = stats.isDirectory() ? 'directory' : 'file';
        filesAndFolders.push({ id: fullPath, name: entry, type });
      }

      this.setFileList(filesAndFolders);
    } catch (error) {
      console.error('Error reading directory:', error);
      this.setFileList([]);
      this.emit('fileListUpdated', []); // Notify UI of error
    }
  }

  async createFile(name: string): Promise<DirectoryFileItem | null> {
    if (!this.state.currentDirectory) {
      console.error('Cannot create file: No current directory selected.');
      return null;
    }
    const newFilePath = path.join(this.state.currentDirectory, name);
    try {
      await fs.writeFile(newFilePath, '');
      const newFile: DirectoryFileItem = { id: newFilePath, name, type: 'file' };
      this.state.fileList.push(newFile);
      this.setFileList([...this.state.fileList]);
      return newFile;
    } catch (error) {
      console.error('Error creating file:', error);
      return null;
    }
  }

  async createFolder(name: string): Promise<DirectoryFileItem | null> {
    if (!this.state.currentDirectory) {
      console.error('Cannot create folder: No current directory selected.');
      return null;
    }
    const newFolderPath = path.join(this.state.currentDirectory, name);
    try {
      await fs.mkdir(newFolderPath);
      const newFolder: DirectoryFileItem = { id: newFolderPath, name, type: 'directory' };
      this.state.fileList.push(newFolder);
      this.setFileList([...this.state.fileList]);
      return newFolder;
    } catch (error) {
      console.error('Error creating folder:', error);
      return null;
    }
  }

  async deleteFile(id: string): Promise<boolean> {
    try {
      await fs.unlink(id);
      this.state.fileList = this.state.fileList.filter(file => file.id !== id);
      this.setFileList([...this.state.fileList]);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async deleteFolder(id: string): Promise<boolean> {
    try {
      await fs.rm(id, { recursive: true });
      this.state.fileList = this.state.fileList.filter(item => item.id !== id);
      this.setFileList([...this.state.fileList]);
      return true;
    } catch (error) {
      console.error('Error deleting folder:', error);
      return false;
    }
  }
}

const directoryManagerInstance = new DirectoryManager();
export default directoryManagerInstance;