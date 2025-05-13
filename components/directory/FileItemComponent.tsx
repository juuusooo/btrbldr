'use client'

import { DirectoryFileItem, useDirectoryStore } from '@/stores/directoryStore'

interface FileItemProps {
  item: DirectoryFileItem
}

const FileItemComponent: React.FC<FileItemProps> = ({ item }) => {
  const currentFile = useDirectoryStore((s) => s.currentFile)
  const setCurrentFile = useDirectoryStore((s) => s.setCurrentFile)
  const toggleFolder = useDirectoryStore((s) => s.toggleFolder)

  const isSelected = currentFile?.id === item.id
  const isDir = item.type === 'folder'

  const handleClick = () => {
    if (isDir) {
      toggleFolder(item.id)
    } else {
      setCurrentFile(item)
    }
  }

  const className = `py-1 cursor-pointer select-none ${
  isSelected ? 'bg-white/7' : ''
} ${isDir ? 'font-semibold' : ''}`

  return (
    <div>
      <div className={className} onClick={handleClick}>
        {isDir ? (item.open ? '📂 ' : '📁 ') : '📄 '}
        {item.name}
      </div>

      {isDir && item.open && Array.isArray(item.children) && item.children.length > 0 && (
        <div className="pl-4">
          {item.children.map((child) => (
            <FileItemComponent key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FileItemComponent
