// lib/monaco.ts
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    if (label === 'json') return '/monaco/json.worker.js'
    if (label === 'css' || label === 'scss' || label === 'less') return '/monaco/css.worker.js'
    if (label === 'html' || label === 'handlebars' || label === 'razor') return '/monaco/html.worker.js'
    if (label === 'typescript' || label === 'javascript') return '/monaco/ts.worker.js'
    return '/monaco/editor.worker.js'
  },
}

export default monaco