const { createServer } = require('http')
const WebSocket = require('ws')
const { spawn } = require('child_process')
const { WebSocketMessageReader, WebSocketMessageWriter } = require('vscode-ws-jsonrpc')

const PORT = 3001

const server = createServer()
const wss = new WebSocket.Server({ noServer: true })

wss.on('connection', (socket) => {
  const reader = new WebSocketMessageReader(socket)
  const writer = new WebSocketMessageWriter(socket)

  // Spawn tsserver
  const tsServer = spawn('npx', ['typescript-language-server', '--stdio'])

  tsServer.stderr.on('data', (data) => {
    console.error('[tsserver error]', data.toString())
  })

  tsServer.on('exit', (code) => {
    console.log('tsserver exited with code', code)
  })

  // Pipe messages
  const { createMessageConnection, StreamMessageReader, StreamMessageWriter } = require('vscode-jsonrpc')
  const connection = createMessageConnection(
    reader,
    writer
  )

  const serverReader = new StreamMessageReader(tsServer.stdout)
  const serverWriter = new StreamMessageWriter(tsServer.stdin)
  const serverConnection = createMessageConnection(serverReader, serverWriter)

  connection.listen()
  serverConnection.listen()

  connection.onRequest((method, params) => serverConnection.sendRequest(method, params))
  serverConnection.onRequest((method, params) => connection.sendRequest(method, params))

  connection.onNotification((method, params) => serverConnection.sendNotification(method, params))
  serverConnection.onNotification((method, params) => connection.sendNotification(method, params))
})

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req)
  })
})

server.listen(PORT, () => {
  console.log(`🧠 TSServer WebSocket running on ws://localhost:${PORT}`)
})
