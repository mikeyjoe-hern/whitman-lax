import { useEffect, useRef } from 'react'
import './ColorMenu.css'

export const TOKEN_COLORS = [
  { color: '#1a7fc1', label: 'Blue'   },
  { color: '#e63946', label: 'Red'    },
  { color: '#2dc653', label: 'Green'  },
  { color: '#f97316', label: 'Orange' },
  { color: '#7c3aed', label: 'Purple' },
  { color: '#222222', label: 'Black'  },
  { color: '#b45309', label: 'Amber'  },
  { color: '#0d9488', label: 'Teal'   },
]

interface ColorMenuProps {
  x: number
  y: number
  current?: string
  onSelect: (color: string) => void
  onClose: () => void
}

export default function ColorMenu({ x, y, current, onSelect, onClose }: ColorMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // defer so the triggering right-click doesn't immediately close it
    const id = setTimeout(() => window.addEventListener('mousedown', handler), 50)
    return () => {
      clearTimeout(id)
      window.removeEventListener('mousedown', handler)
    }
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Keep menu within viewport
  const menuW = 168
  const menuH = 80
  const left = Math.min(x, window.innerWidth  - menuW - 8)
  const top  = Math.min(y, window.innerHeight - menuH - 8)

  return (
    <div
      ref={ref}
      className="color-menu"
      style={{ left, top }}
      onContextMenu={e => e.preventDefault()}
    >
      <div className="color-menu-label">Token color</div>
      <div className="color-menu-swatches">
        {TOKEN_COLORS.map(({ color, label }) => (
          <button
            key={color}
            className={`color-menu-swatch ${current === color ? 'active' : ''}`}
            style={{ background: color }}
            title={label}
            onClick={() => { onSelect(color); onClose() }}
          />
        ))}
      </div>
    </div>
  )
}
