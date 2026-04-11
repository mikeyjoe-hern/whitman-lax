import { useState, useCallback, useEffect, useRef } from 'react'
import Field from './components/Field'
import Toolbar from './components/Toolbar'
import ColorMenu from './components/ColorMenu'
import type { Token, ArrowPath, Mode, TokenType } from './types'
import './App.css'

let _id = 1
const uid = () => String(_id++)

// Default 10-man single-team formation (1G 3D 3M 3A)
const DEFAULT_TOKENS: Token[] = [
  { id: uid(), type: 'goalie',   label: 'G',   x: 100,  y: 300 },
  { id: uid(), type: 'defense',  label: 'D',   x: 290,  y: 170 },
  { id: uid(), type: 'defense',  label: 'D',   x: 290,  y: 300 },
  { id: uid(), type: 'defense',  label: 'D',   x: 290,  y: 430 },
  { id: uid(), type: 'midfield', label: 'M',   x: 490,  y: 200 },
  { id: uid(), type: 'midfield', label: 'M',   x: 490,  y: 300 },
  { id: uid(), type: 'midfield', label: 'M',   x: 490,  y: 400 },
  { id: uid(), type: 'attack',   label: 'A',   x: 760,  y: 200 },
  { id: uid(), type: 'attack',   label: 'A',   x: 820,  y: 300 },
  { id: uid(), type: 'attack',   label: 'A',   x: 760,  y: 400 },
]

export default function App() {
  const [tokens, setTokens] = useState<Token[]>(DEFAULT_TOKENS)
  const [arrows, setArrows] = useState<ArrowPath[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('select')
  const [arrowColor, setArrowColor] = useState('#e63946')
  const [arrowInProgress, setArrowInProgress] = useState<[number, number][]>([])
  const [colorMenu, setColorMenu] = useState<{ tokenId: string; x: number; y: number } | null>(null)

  // Track arrowInProgress in a ref so keyboard handler always has current value
  const arrowInProgressRef = useRef(arrowInProgress)
  arrowInProgressRef.current = arrowInProgress

  const addToken = useCallback((type: TokenType, label: string) => {
    setTokens(prev => [...prev, { id: uid(), type, label, x: 550, y: 300 }])
  }, [])

  const moveToken = useCallback((id: string, x: number, y: number) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t))
  }, [])

  const deleteSelected = useCallback(() => {
    if (!selectedId) return
    setTokens(prev => prev.filter(t => t.id !== selectedId))
    setSelectedId(null)
  }, [selectedId])

  const finishArrow = useCallback(() => {
    const pts = arrowInProgressRef.current
    if (pts.length >= 2) {
      setArrows(prev => [...prev, {
        id: uid(),
        points: pts,
        color: arrowColor,
        dashed: false,
      }])
    }
    setArrowInProgress([])
  }, [arrowColor])

  const clearArrows = useCallback(() => setArrows([]), [])

  const clearAll = useCallback(() => {
    setTokens(DEFAULT_TOKENS.map(t => ({ ...t, id: uid() })))
    setArrows([])
    setSelectedId(null)
    setArrowInProgress([])
  }, [])

  const handleModeChange = useCallback((m: Mode) => {
    setMode(m)
    setArrowInProgress([])
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected()
      }
      if (e.key === 's' || e.key === 'S') {
        setMode('select')
        setArrowInProgress([])
      }
      if (e.key === 'a' || e.key === 'A') {
        setMode('arrow')
      }
      if (e.key === 'Escape') {
        setArrowInProgress([])
        setMode('select')
      }
      if (e.key === 'Enter') {
        finishArrow()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [deleteSelected, finishArrow])

  const handleTokenContextMenu = useCallback((id: string, x: number, y: number) => {
    setColorMenu({ tokenId: id, x, y })
  }, [])

  const handleColorChange = useCallback((color: string) => {
    if (!colorMenu) return
    setTokens(prev => prev.map(t => t.id === colorMenu.tokenId ? { ...t, customColor: color } : t))
  }, [colorMenu])

  const handleAddArrow = useCallback((points: [number, number][]) => {
    setArrows(prev => [...prev, {
      id: uid(),
      points,
      color: arrowColor,
      dashed: false,
    }])
    setArrowInProgress([])
  }, [arrowColor])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <span className="title-wax">Whitman LAX</span>
          <span className="title-sep">—</span>
          <span className="title-sub">Playbook</span>
        </div>
        <Toolbar
          mode={mode}
          arrowColor={arrowColor}
          onModeChange={handleModeChange}
          onArrowColorChange={setArrowColor}
          onAddToken={addToken}
          onDeleteSelected={deleteSelected}
          onClearArrows={clearArrows}
          onClearAll={clearAll}
          onFinishArrow={finishArrow}
          hasSelected={!!selectedId}
          arrowInProgress={arrowInProgress.length > 0}
        />
        {mode === 'arrow' && (
          <div className="arrow-hint">
            {arrowInProgress.length === 0
              ? 'Click to start arrow'
              : `${arrowInProgress.length} point${arrowInProgress.length > 1 ? 's' : ''} — double-click or Enter to finish, Esc to cancel`}
          </div>
        )}
      </header>
      <main className="app-main">
        <Field
          tokens={tokens}
          arrows={arrows}
          arrowPoints={arrowInProgress}
          selectedId={selectedId}
          mode={mode}
          onMoveToken={moveToken}
          onSelectToken={setSelectedId}
          onArrowPointsChange={setArrowInProgress}
          onAddArrow={handleAddArrow}
          onTokenContextMenu={handleTokenContextMenu}
        />
      </main>

      {colorMenu && (
        <ColorMenu
          x={colorMenu.x}
          y={colorMenu.y}
          current={tokens.find(t => t.id === colorMenu.tokenId)?.customColor}
          onSelect={handleColorChange}
          onClose={() => setColorMenu(null)}
        />
      )}
    </div>
  )
}
