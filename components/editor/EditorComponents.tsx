'use client'

import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { useDirectoryStore } from '@/stores/directoryStore'

const EditorComponent: React.FC = () => {
    const currentFile = useDirectoryStore((s) => s.currentFile)

    // Helper function to determine the language of the file
    const getLanguage = (filename: string) => {
        if (filename.endsWith('.tsx')) return 'typescript'
        if (filename.endsWith('.ts')) return 'typescript'
        if (filename.endsWith('.js')) return 'javascript'
        if (filename.endsWith('.jsx')) return 'javascript'
        if (filename.endsWith('.html')) return 'html'
        if (filename.endsWith('.css')) return 'css'
        return 'plaintext'
    }

    const updateFileContent = useDirectoryStore((s) => s.updateFileContent)

    const [value, setValue] = useState(currentFile?.content || '')

    // useEffect to update Monaco settings and content
    useEffect(() => {
        setValue(currentFile?.content || '')
    }, [currentFile?.id])  // Reset content when file changes

    // Handler for updating content
    const handleChange = (newValue: string | undefined) => {
        if (!currentFile || newValue === undefined) return
        setValue(newValue)
        updateFileContent(currentFile.id, newValue)
    }

    // Early return if no file is selected
    if (!currentFile || currentFile.type !== 'file') {
        return <div className="p-4 text-gray-500">Select a file to start editing</div>
    }

    return (
        <div className="h-full w-full">
            <MonacoEditor
                height="100%"
                language={getLanguage(currentFile.name)}
                value={value}
                onChange={handleChange}
                theme="vs-dark"
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    wordWrap: 'on',
                }}
            />
        </div>
    )
}

export default EditorComponent
