import { useRef, useState, useEffect, useCallback } from 'react'
import type { Token, ArrowPath, Mode } from '../types'
import FieldToken from './FieldToken'
import Arrow from './Arrow'

// Field constants (10px = 1 yard, 110yd × 60yd)
const VB_W = 1100
const VB_H = 600
const VB_PAD = 60   // blank buffer around field

// Key x positions
const LEFT_GOAL_X  = 150   // 15yd from left end (crease center only — no goal line drawn)
const RIGHT_GOAL_X = 950   // 15yd from right end
const LEFT_ATK_X   = 350   // restraining line, 35yd from left
const RIGHT_ATK_X  = 750   // restraining line, 35yd from right
const CENTER_X     = 550   // midfield

// Key y positions — wing lines at 10yd from each sideline
const TOP_WING_Y   = 100
const BOT_WING_Y   = 500
const CENTER_Y     = 300

const CREASE_R  = 30   // 9ft radius = 3yd = 30px
const GOAL_HALF = 10   // half of 6ft goal width
const GOAL_DEPTH = 20  // 6ft deep

interface FieldProps {
  tokens: Token[]
  arrows: ArrowPath[]
  arrowPoints: [number, number][]
  selectedId: string | null
  mode: Mode
  onMoveToken: (id: string, x: number, y: number) => void
  onSelectToken: (id: string | null) => void
  onArrowPointsChange: (pts: [number, number][]) => void
  onAddArrow: (points: [number, number][]) => void
  onTokenContextMenu: (id: string, clientX: number, clientY: number) => void
}

function FieldLines() {
  const s = '#222'

  return (
    <g fill="none">
      {/* Buffer background (blank space outside field) */}
      <rect
        x={-VB_PAD} y={-VB_PAD}
        width={VB_W + VB_PAD * 2} height={VB_H + VB_PAD * 2}
        fill="#e8e8e0"
      />

      {/* Field surface + yellow bounding box */}
      <rect x={0} y={0} width={VB_W} height={VB_H} fill="#f8f8f0" />
      <rect x={0} y={0} width={VB_W} height={VB_H} stroke="#d4a017" strokeWidth={6} />

      {/* ── Horizontal wing lines — full width, 10yd from each sideline ── */}
      <line x1={0} y1={TOP_WING_Y} x2={VB_W} y2={TOP_WING_Y} stroke={s} strokeWidth={2} />
      <line x1={0} y1={BOT_WING_Y} x2={VB_W} y2={BOT_WING_Y} stroke={s} strokeWidth={2} />

      {/* ── Restraining lines (35yd from each end) ── */}
      <line x1={LEFT_ATK_X}  y1={0} x2={LEFT_ATK_X}  y2={VB_H} stroke={s} strokeWidth={2} />
      <line x1={RIGHT_ATK_X} y1={0} x2={RIGHT_ATK_X} y2={VB_H} stroke={s} strokeWidth={2} />

      {/* ── Midfield line ── */}
      <line x1={CENTER_X} y1={0} x2={CENTER_X} y2={VB_H} stroke={s} strokeWidth={2} />

      {/* ── Creases ── */}
      <circle cx={LEFT_GOAL_X}  cy={CENTER_Y} r={CREASE_R} stroke={s} strokeWidth={2} />
      <circle cx={RIGHT_GOAL_X} cy={CENTER_Y} r={CREASE_R} stroke={s} strokeWidth={2} />

      {/* ── Goal triangles (mouth on goal line, point behind) ── */}
      <polygon
        points={`${LEFT_GOAL_X},${CENTER_Y - GOAL_HALF} ${LEFT_GOAL_X - GOAL_DEPTH},${CENTER_Y} ${LEFT_GOAL_X},${CENTER_Y + GOAL_HALF}`}
        stroke={s} strokeWidth={2.5} fill="none"
      />
      <polygon
        points={`${RIGHT_GOAL_X},${CENTER_Y - GOAL_HALF} ${RIGHT_GOAL_X + GOAL_DEPTH},${CENTER_Y} ${RIGHT_GOAL_X},${CENTER_Y + GOAL_HALF}`}
        stroke={s} strokeWidth={2.5} fill="none"
      />

      {/* ── Center faceoff X ── */}
      <line x1={CENTER_X - 14} y1={CENTER_Y - 14} x2={CENTER_X + 14} y2={CENTER_Y + 14} stroke={s} strokeWidth={2.5} />
      <line x1={CENTER_X + 14} y1={CENTER_Y - 14} x2={CENTER_X - 14} y2={CENTER_Y + 14} stroke={s} strokeWidth={2.5} />
    </g>
  )
}

export default function Field({
  tokens,
  arrows,
  arrowPoints,
  selectedId,
  mode,
  onMoveToken,
  onSelectToken,
  onArrowPointsChange,
  onAddArrow,
  onTokenContextMenu,
}: FieldProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null)
  const [mousePos, setMousePos] = useState<[number, number] | null>(null)

  const svgPoint = useCallback((clientX: number, clientY: number): [number, number] => {
    const svg = svgRef.current
    if (!svg) return [0, 0]
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const t = pt.matrixTransform(svg.getScreenCTM()!.inverse())
    return [t.x, t.y]
  }, [])

  // Global mouse listeners for reliable drag across whole window
  useEffect(() => {
    if (!dragging) return

    const handleMove = (e: MouseEvent) => {
      const [sx, sy] = svgPoint(e.clientX, e.clientY)
      onMoveToken(dragging.id, sx - dragging.ox, sy - dragging.oy)
    }
    const handleUp = () => setDragging(null)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [dragging, svgPoint, onMoveToken])

  const handleTokenMouseDown = (e: React.MouseEvent<SVGGElement>, token: Token) => {
    if (mode !== 'select') return
    e.stopPropagation()
    e.preventDefault()
    onSelectToken(token.id)
    const [sx, sy] = svgPoint(e.clientX, e.clientY)
    setDragging({ id: token.id, ox: sx - token.x, oy: sy - token.y })
  }

  const handleSVGMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode === 'arrow') {
      setMousePos(svgPoint(e.clientX, e.clientY))
    }
  }

  const handleSVGMouseLeave = () => setMousePos(null)

  const handleSVGClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.detail > 1) return // let doubleClick handle this
    const [x, y] = svgPoint(e.clientX, e.clientY)
    if (mode === 'select') {
      onSelectToken(null)
    } else if (mode === 'arrow') {
      onArrowPointsChange([...arrowPoints, [x, y]])
    }
  }

  const handleSVGDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault()
    if (mode !== 'arrow') return
    // arrowPoints already has the last single-click point; finalize as-is
    if (arrowPoints.length >= 2) {
      onAddArrow(arrowPoints)
    }
  }

  const ghostPoints: [number, number][] =
    arrowPoints.length > 0 && mousePos ? [...arrowPoints, mousePos] : arrowPoints

  return (
    <svg
      ref={svgRef}
      viewBox={`${-VB_PAD} ${-VB_PAD} ${VB_W + VB_PAD * 2} ${VB_H + VB_PAD * 2}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        height: '100%',
        cursor: mode === 'arrow' ? 'crosshair' : 'default',
        display: 'block',
      }}
      onMouseMove={handleSVGMouseMove}
      onMouseLeave={handleSVGMouseLeave}
      onClick={handleSVGClick}
      onDoubleClick={handleSVGDoubleClick}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#e63946" />
        </marker>
        <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#03a5e3" />
        </marker>
        <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#2dc653" />
        </marker>
        <marker id="arrowhead-ghost" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
        </marker>
      </defs>

      <FieldLines />

      {arrows.map(a => (
        <Arrow key={a.id} arrow={a} />
      ))}

      {/* Ghost line while drawing */}
      {ghostPoints.length >= 2 && (
        <polyline
          points={ghostPoints.map(p => p.join(',')).join(' ')}
          stroke="#888"
          strokeWidth={2}
          strokeDasharray="6,4"
          fill="none"
          markerEnd="url(#arrowhead-ghost)"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Waypoint indicator dots */}
      {arrowPoints.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={4} fill="#888" style={{ pointerEvents: 'none' }} />
      ))}

      {tokens.map(t => (
        <FieldToken
          key={t.id}
          token={t}
          selected={t.id === selectedId}
          isDragging={dragging?.id === t.id}
          onMouseDown={(e) => handleTokenMouseDown(e, t)}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onTokenContextMenu(t.id, e.clientX, e.clientY)
          }}
        />
      ))}
    </svg>
  )
}
