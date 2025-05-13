'use client'

import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useDirectoryStore } from '@/stores/directoryStore'

const EditorComponent: React.FC = () => {
    const currentFile = useDirectoryStore((s) => s.currentFile)
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

    useEffect(() => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.React,
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            allowNonTsExtensions: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            allowJs: true,
        });

        setValue(currentFile?.content || '')
    }, [currentFile?.id]) // reset content when file changes

    const handleChange = (newValue: string | undefined) => {
        if (!currentFile || newValue === undefined) return
        setValue(newValue)
        updateFileContent(currentFile.id, newValue)
    }

    if (!currentFile || currentFile.type !== 'file') {
        return <div className="p-4 text-gray-500">Select a file to start editing</div>
    }

    return (
        <div className="h-full w-full">
            <Editor
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
