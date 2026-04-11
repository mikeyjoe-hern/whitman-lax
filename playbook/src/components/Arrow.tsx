import type { ArrowPath } from '../types'

interface ArrowProps {
  arrow: ArrowPath
}

export default function Arrow({ arrow }: ArrowProps) {
  if (arrow.points.length < 2) return null

  const pointsStr = arrow.points.map(p => p.join(',')).join(' ')
  const markerId =
    arrow.color === '#03a5e3' ? 'arrowhead-blue'
    : arrow.color === '#2dc653' ? 'arrowhead-green'
    : 'arrowhead'

  return (
    <polyline
      points={pointsStr}
      stroke={arrow.color}
      strokeWidth={2.5}
      strokeDasharray={arrow.dashed ? '8,5' : undefined}
      fill="none"
      markerEnd={`url(#${markerId})`}
      style={{ pointerEvents: 'none' }}
    />
  )
}
