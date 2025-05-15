declare global {
    interface Window {
      electron: {
        runCommand: (command: string) => void;
        readFile: (filePath: string) => Promise<string>;
      };
    }
  }
  
  // This is necessary to make the file a module.
  export {};