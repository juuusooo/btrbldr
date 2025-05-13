import { create } from 'zustand'

export type DirectoryFileItem = {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: DirectoryFileItem[]
  open?: boolean
  content?: string
}

type DirectoryState = {
  root: DirectoryFileItem | null
  currentFile: DirectoryFileItem | null

  setRoot: (root: DirectoryFileItem) => void
  toggleFolder: (id: string) => void
  setCurrentFile: (file: DirectoryFileItem) => void
  updateFileContent: (id: string, content: string) => void
}

export const useDirectoryStore = create<DirectoryState>((set, get) => ({
  root: null,
  currentFile: null,

  setRoot: (root) => set({ root }),

  toggleFolder: (id) => {
    const toggle = (node: DirectoryFileItem): DirectoryFileItem => {
      if (node.id === id && node.type === 'folder') {
        return { ...node, open: !node.open }
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(toggle),
        }
      }
      return node
    }

    const root = get().root
    if (root) set({ root: toggle(root) })
  },

  setCurrentFile: (file) => set({ currentFile: file }),

  updateFileContent: (id, content) => {
    const update = (node: DirectoryFileItem): DirectoryFileItem => {
      if (node.id === id && node.type === 'file') {
        return { ...node, content }
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(update),
        }
      }
      return node
    }

    const root = get().root
    if (root) set({ root: update(root) })

    const current = get().currentFile
    if (current?.id === id) {
      set({ currentFile: { ...current, content } })
    }
  },
}))
