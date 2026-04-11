import type { Token } from '../types'

const DEFAULT_STYLES: Record<Token['type'], { fill: string; stroke: string; text: string }> = {
  attack:   { fill: '#e8f4fd', stroke: '#1a7fc1', text: '#1a7fc1' },
  midfield: { fill: '#e8f4fd', stroke: '#1a7fc1', text: '#1a7fc1' },
  defense:  { fill: '#f0f0f0', stroke: '#444',    text: '#222'    },
  goalie:   { fill: '#fef3c7', stroke: '#b45309', text: '#92400e' },
  lsm:      { fill: '#e8f4fd', stroke: '#1a7fc1', text: '#1a7fc1' },
  ball:     { fill: '#c07a35', stroke: '#7c4a1e', text: ''        },
  cone:     { fill: '#f97316', stroke: '#c2410c', text: ''        },
}

const PLAYER_R = 16   // player token circle radius
const BALL_R   = 9
const CONE_R   = 12   // triangle half-size

interface FieldTokenProps {
  token: Token
  selected: boolean
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent<SVGGElement>) => void
  onContextMenu: (e: React.MouseEvent<SVGGElement>) => void
}

export default function FieldToken({ token, selected, isDragging, onMouseDown, onContextMenu }: FieldTokenProps) {
  const def = DEFAULT_STYLES[token.type]
  const { x, y, customColor } = token

  // When a custom color is set, override stroke + text, keep light fill
  const fill   = customColor ? '#ffffff' : def.fill
  const stroke = customColor ?? def.stroke
  const text   = customColor ?? def.text

  const selStroke = '#e63946'
  const strokeWidth = selected ? 3 : 2
  const opacity = isDragging ? 0.82 : 1

  const handlers = {
    onMouseDown,
    onContextMenu,
    style: { cursor: 'grab', opacity } as React.CSSProperties,
  }

  if (token.type === 'cone') {
    const pts = `${x},${y - CONE_R} ${x + CONE_R * 0.87},${y + CONE_R * 0.5} ${x - CONE_R * 0.87},${y + CONE_R * 0.5}`
    const coneFill   = customColor ?? def.fill
    const coneStroke = customColor ?? def.stroke
    return (
      <g {...handlers} role="img" aria-label="Cone">
        {selected && <circle cx={x} cy={y + 2} r={CONE_R + 5} fill="none" stroke={selStroke} strokeWidth={2} strokeDasharray="4,3" />}
        <polygon points={pts} fill={coneFill} stroke={selected ? selStroke : coneStroke} strokeWidth={strokeWidth} />
      </g>
    )
  }

  if (token.type === 'ball') {
    const ballFill   = customColor ?? def.fill
    const ballStroke = customColor ?? def.stroke
    return (
      <g {...handlers} role="img" aria-label="Ball">
        {selected && <circle cx={x} cy={y} r={BALL_R + 6} fill="none" stroke={selStroke} strokeWidth={2} strokeDasharray="4,3" />}
        <circle cx={x} cy={y} r={BALL_R} fill={ballFill} stroke={selected ? selStroke : ballStroke} strokeWidth={strokeWidth} />
      </g>
    )
  }

  const fontSize = token.label.length > 2 ? 9 : token.label.length > 1 ? 11 : 13

  return (
    <g {...handlers} role="img" aria-label={token.label}>
      {selected && <circle cx={x} cy={y} r={PLAYER_R + 5} fill="none" stroke={selStroke} strokeWidth={2} strokeDasharray="4,3" />}
      <circle cx={x} cy={y} r={PLAYER_R} fill={fill} stroke={selected ? selStroke : stroke} strokeWidth={strokeWidth} />
      <text
        x={x} y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="700"
        fill={selected ? selStroke : text}
        fontFamily="'Oxygen', sans-serif"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {token.label}
      </text>
    </g>
  )
}
