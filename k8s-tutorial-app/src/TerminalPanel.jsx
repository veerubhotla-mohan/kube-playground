import { useCallback, useEffect, useRef, useState } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

const WS_URL = 'ws://localhost:3001'

// Manages a single xterm instance + WebSocket connection.
// Always stays mounted; hidden tabs use opacity:0 so xterm can still measure.
function TerminalInstance({ isActive }) {
  const containerRef = useRef(null)
  const fitAddonRef = useRef(null)

  // Boot the terminal once on mount
  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 14,
      lineHeight: 1.45,
      theme: {
        background: '#101a1a',
        foreground: '#def3ef',
        cursor: '#1f7a59',
        selectionBackground: 'rgba(31, 122, 89, 0.3)',
        black: '#101a1a',
        brightBlack: '#2a4040',
        green: '#28c840',
        brightGreen: '#1f7a59',
        cyan: '#def3ef',
        brightCyan: '#8ab5b0',
      },
    })

    const fitAddon = new FitAddon()
    fitAddonRef.current = fitAddon
    term.loadAddon(fitAddon)
    term.open(containerRef.current)
    fitAddon.fit()

    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      const { cols, rows } = term
      ws.send(JSON.stringify({ type: 'resize', cols, rows }))

      term.onData((data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'input', data }))
        }
      })

      term.onResize(({ cols, rows }) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', cols, rows }))
        }
      })
    }

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      if (msg.type === 'output') term.write(msg.data)
    }

    ws.onerror = () => {
      term.write('\r\n\x1b[31mCould not connect to the terminal server.\x1b[0m\r\n')
      term.write('\x1b[33mMake sure it is running:\x1b[0m\r\n')
      term.write('  npm run dev:all\r\n\r\n')
    }

    const handleWindowResize = () => fitAddonRef.current?.fit()
    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      term.dispose()
      ws.close()
    }
  }, [])

  // Re-fit whenever this tab becomes the active one
  useEffect(() => {
    if (isActive && fitAddonRef.current) {
      requestAnimationFrame(() => fitAddonRef.current?.fit())
    }
  }, [isActive])

  return (
    <div
      ref={containerRef}
      className={`terminal-instance${isActive ? ' active' : ''}`}
    />
  )
}

export function TerminalPanel({ onClose }) {
  const counterRef = useRef(1)
  const [tabs, setTabs] = useState([{ id: 1, label: 'Terminal 1' }])
  const [activeTabId, setActiveTabId] = useState(1)

  const addTab = useCallback(() => {
    counterRef.current += 1
    const id = counterRef.current
    setTabs((prev) => [...prev, { id, label: `Terminal ${id}` }])
    setActiveTabId(id)
  }, [])

  const closeTab = useCallback((tabId) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === tabId)
      const next = prev.filter((t) => t.id !== tabId)
      if (next.length > 0) {
        setActiveTabId((current) => {
          if (current !== tabId) return current
          return (prev[idx - 1] ?? prev[idx + 1]).id
        })
      }
      return next
    })
  }, [])

  // Close the whole panel when the last tab is removed
  useEffect(() => {
    if (tabs.length === 0) onClose()
  }, [tabs.length, onClose])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="terminal-overlay" onClick={onClose}>
      <div className="terminal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
          </div>

          <div className="terminal-tabs">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`terminal-tab${tab.id === activeTabId ? ' active' : ''}`}
              >
                <button
                  type="button"
                  className="terminal-tab-btn"
                  onClick={() => setActiveTabId(tab.id)}
                >
                  {tab.label}
                </button>
                <button
                  type="button"
                  className="terminal-tab-close"
                  onClick={() => closeTab(tab.id)}
                  aria-label={`Close ${tab.label}`}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              className="terminal-tab-add"
              onClick={addTab}
              aria-label="New terminal tab"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="terminal-close"
            onClick={onClose}
            aria-label="Close terminal"
          >
            ✕
          </button>
        </div>

        <div className="terminal-body">
          {tabs.map((tab) => (
            <TerminalInstance
              key={tab.id}
              isActive={tab.id === activeTabId}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
