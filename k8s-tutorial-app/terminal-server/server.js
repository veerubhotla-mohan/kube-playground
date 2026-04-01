const { WebSocketServer } = require('ws')
const pty = require('node-pty')
const http = require('http')

const PORT = 3001

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Kubernetes Playground terminal server\n')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  const shell = pty.spawn('/bin/bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME || '/root',
    env: process.env,
  })

  shell.onData((data) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: 'output', data }))
    }
  })

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString())
      if (msg.type === 'input') {
        shell.write(msg.data)
      } else if (msg.type === 'resize') {
        shell.resize(msg.cols, msg.rows)
      }
    } catch (_) {
      // ignore malformed messages
    }
  })

  ws.on('close', () => {
    try { shell.kill() } catch (_) {}
  })
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Terminal WebSocket server listening on ws://localhost:${PORT}`)
})
