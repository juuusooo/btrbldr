'use client'

import FileItemComponent from './FileItemComponent'
import { useDirectoryStore } from '@/stores/directoryStore'

const DirectoryComponent: React.FC = () => {
  const root = useDirectoryStore((s) => s.root)
  const setRoot = useDirectoryStore((s) => s.setRoot)
  const currentFile = useDirectoryStore((s) => s.currentFile)
  const setCurrentFile = useDirectoryStore((s) => s.setCurrentFile)

  const handleOpenDirectory = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.webkitdirectory = true as any
    input.multiple = true

    input.onchange = async (event: Event) => {
      const files = (event.target as HTMLInputElement).files
      if (!files) return

      const rootFolderName = files[0].webkitRelativePath.split('/')[0]

      const fileTree = await buildFileTreeFromFileList(files)

      setRoot({
        id: 'root',
        name: rootFolderName,
        type: 'folder',
        children: fileTree,
        open: true,
      })
    }

    input.click()
  }

  const buildFileTreeFromFileList = async (fileList: FileList): Promise<any[]> => {
    const tree: any = {}

    const fileReadPromises = Array.from(fileList).map(async (file) => {
      const content = await file.text()
      const parts = file.webkitRelativePath.split('/')

      parts.reduce((acc, part, i) => {
        if (!acc[part]) {
          acc[part] = i === parts.length - 1
            ? { id: file.name, name: file.name, type: 'file', content, path: file.webkitRelativePath }
            : {}
        }
        return acc[part]
      }, tree)
    })

    await Promise.all(fileReadPromises)

    const toTree = (obj: any): any[] =>
      Object.entries(obj).map(([key, value]: any) =>
        value.type === 'file'
          ? value
          : {
              id: key,
              name: key,
              type: 'folder',
              open: false,
              children: toTree(value),
            }
      )

    return toTree(tree)
  }


  const handleFileItemSelect = (file: any) => {
    if (file.type === 'file') {
      setCurrentFile(file)
    }
  }

  const renderItems = (items: any[]) => {
    return items.map((item) => (
      <FileItemComponent key={item.id} item={item} />
    ))
  }

  return (
    <div className="border border-gray-300 p-2 mb-4">
      <h2 className="text-xl font-semibold mb-2">File Browser</h2>
      {!root ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleOpenDirectory}
        >
          Open Directory
        </button>
      ) : (
        <div>
          <p className="mb-2">Current Directory: <span className="font-mono">{root.name}</span></p>
          <div className="mt-2">{renderItems(root.children || [])}</div>
        </div>
      )}
    </div>
  )
}

export default DirectoryComponent
