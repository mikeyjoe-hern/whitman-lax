import type { Mode, TokenType } from '../types'
import './Toolbar.css'

interface ToolbarProps {
  mode: Mode
  arrowColor: string
  onModeChange: (m: Mode) => void
  onArrowColorChange: (c: string) => void
  onAddToken: (type: TokenType, label: string) => void
  onDeleteSelected: () => void
  onClearArrows: () => void
  onClearAll: () => void
  onFinishArrow: () => void
  hasSelected: boolean
  arrowInProgress: boolean
}

const PLAYER_TOKENS: { type: TokenType; label: string; title: string }[] = [
  { type: 'attack',   label: 'A',   title: 'Attack' },
  { type: 'midfield', label: 'M',   title: 'Midfield' },
  { type: 'defense',  label: 'D',   title: 'Defense' },
  { type: 'goalie',   label: 'G',   title: 'Goalie' },
  { type: 'lsm',      label: 'LSM', title: 'Long Stick Midfield' },
]

const OBJECT_TOKENS: { type: TokenType; label: string; title: string; symbol: string }[] = [
  { type: 'ball', label: '',     title: 'Ball',  symbol: '●' },
  { type: 'cone', label: 'cone', title: 'Cone',  symbol: '▲' },
]

const ARROW_COLORS = [
  { color: '#e63946', label: 'Red' },
  { color: '#03a5e3', label: 'Blue' },
  { color: '#2dc653', label: 'Green' },
]

export default function Toolbar({
  mode,
  arrowColor,
  onModeChange,
  onArrowColorChange,
  onAddToken,
  onDeleteSelected,
  onClearArrows,
  onClearAll,
  onFinishArrow,
  hasSelected,
  arrowInProgress,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      {/* Mode toggle */}
      <div className="toolbar-group">
        <button
          className={`tb-btn mode-btn ${mode === 'select' ? 'active' : ''}`}
          onClick={() => onModeChange('select')}
          title="Select & drag tokens (S)"
        >
          ↖ Select
        </button>
        <button
          className={`tb-btn mode-btn ${mode === 'arrow' ? 'active' : ''}`}
          onClick={() => onModeChange('arrow')}
          title="Draw arrows (A)"
        >
          → Arrow
        </button>
      </div>

      <div className="toolbar-sep" />

      {/* Add players */}
      <div className="toolbar-group">
        <span className="toolbar-label">Add</span>
        {PLAYER_TOKENS.map(({ type, label, title }) => (
          <button
            key={type}
            className="tb-btn token-btn player"
            onClick={() => onAddToken(type, label)}
            title={`Add ${title}`}
          >
            +{label}
          </button>
        ))}
        {OBJECT_TOKENS.map(({ type, label, title, symbol }) => (
          <button
            key={type}
            className={`tb-btn token-btn obj obj-${type}`}
            onClick={() => onAddToken(type, label)}
            title={`Add ${title}`}
          >
            {symbol}
          </button>
        ))}
      </div>

      <div className="toolbar-sep" />

      {/* Arrow color (only shown in arrow mode) */}
      {mode === 'arrow' && (
        <>
          <div className="toolbar-group">
            <span className="toolbar-label">Color</span>
            {ARROW_COLORS.map(({ color, label }) => (
              <button
                key={color}
                className={`tb-btn color-swatch ${arrowColor === color ? 'active' : ''}`}
                style={{ '--swatch-color': color } as React.CSSProperties}
                onClick={() => onArrowColorChange(color)}
                title={label}
              />
            ))}
          </div>
          {arrowInProgress && (
            <button className="tb-btn finish-btn" onClick={onFinishArrow} title="Finish arrow (Enter)">
              ✓ Finish
            </button>
          )}
          <div className="toolbar-sep" />
        </>
      )}

      {/* Actions */}
      <div className="toolbar-group">
        <button
          className="tb-btn action-btn danger"
          onClick={onDeleteSelected}
          disabled={!hasSelected}
          title="Delete selected token (Delete)"
        >
          ✕ Delete
        </button>
        <button className="tb-btn action-btn" onClick={onClearArrows} title="Clear all arrows">
          Clear Arrows
        </button>
        <button className="tb-btn action-btn danger" onClick={onClearAll} title="Reset field">
          Reset
        </button>
      </div>
    </div>
  )
}
