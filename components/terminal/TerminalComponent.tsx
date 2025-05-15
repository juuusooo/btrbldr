import React, { useState, useEffect } from 'react';

declare global {
    interface Window {
      electron: any;
    }
  }
const TerminalComponent = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [output, setOutput] = useState<string>('');

  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  };

  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newHistory = [...history, `> ${command}`];
      setHistory(newHistory);
      setCommand('');

      // Send the command to the main process using the exposed `electron` API
      window.electron.command(command);

      // You can also request file reading like this (e.g., to `cat somefile.txt`)
      // window.electron.readFile('path/to/file.txt');
    }
  };

  useEffect(() => {
    // Listen for command output from the main process
    // Listen for command output from the main process
    window.electron.command(command);
  
    // Optionally, you can also read a file
    window.electron.readFile('path/to/file.txt')
      .then((data: string) => setOutput(data))
      .catch((err: string) => setOutput(err));

    // Optionally, listen for file or other data
    window.electron.readFile('path/to/file.txt')
      .then((data: string) => setOutput(data))
      .catch((err: string) => setOutput(err));
  }, [command]);

  return (
    <div className="w-full h-full p-4 bg-black text-white font-mono text-lg overflow-y-auto rounded-lg" style={{ border: '2px solid #333' }}>
      <div className="mb-4">
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div>{output}</div>
      </div>
      <div className="flex items-center">
        <span className="text-green-400">user@localhost:~$</span>
        <input
          type="text"
          value={command}
          onChange={handleCommandChange}
          onKeyDown={handleCommandSubmit}
          className="bg-transparent text-white border-none outline-none w-full"
          placeholder="Type command"
        />
        <span className="text-white">{command ? '|' : ' '}</span>
      </div>
    </div>
  );
};

export default TerminalComponent;
